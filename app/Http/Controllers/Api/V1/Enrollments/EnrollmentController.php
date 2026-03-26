<?php

namespace App\Http\Controllers\Api\V1\Enrollments;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use App\Models\Enrollment;
use App\Models\StudentPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $enrollments = Enrollment::with(['student.user', 'classModel.instructor.user', 'classModel.room'])
            ->when($request->date, fn($q) => $q->where('scheduled_date', $request->date))
            ->when($request->student_id, fn($q) => $q->where('student_id', $request->student_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderBy('scheduled_date')
            ->paginate($request->per_page ?? 20);

        return response()->json($enrollments);
    }

    public function show(Enrollment $enrollment): JsonResponse
    {
        $enrollment->load(['student.user', 'classModel.instructor.user', 'classModel.room', 'evolution']);

        return response()->json($this->format($enrollment));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'class_id'       => ['required', 'exists:classes,id'],
            'student_id'     => ['required', 'exists:students,id'],
            'scheduled_date' => ['required', 'date', 'after_or_equal:today'],
        ]);

        $class = ClassModel::with(['enrollments', 'equipment'])->findOrFail($data['class_id']);

        // Verifica vagas disponíveis
        $spots = $class->availableSpotsOn($data['scheduled_date']);
        if ($spots <= 0) {
            return response()->json(['message' => 'Sem vagas disponíveis neste horário.'], 422);
        }

        // Verifica se aluno já está agendado nessa aula nessa data
        $exists = Enrollment::where('class_id', $data['class_id'])
            ->where('student_id', $data['student_id'])
            ->where('scheduled_date', $data['scheduled_date'])
            ->whereNotIn('status', ['cancelada_aviso', 'cancelada_sem_aviso'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Aluno já está agendado neste horário.'], 422);
        }

        // Busca plano ativo do aluno
        $studentPlan = StudentPlan::where('student_id', $data['student_id'])
            ->where('status', 'ativo')
            ->latest('starts_at')
            ->first();

        if (! $studentPlan) {
            return response()->json(['message' => 'Aluno não possui plano ativo.'], 422);
        }

        $enrollment = Enrollment::create([
            'class_id'       => $data['class_id'],
            'student_id'     => $data['student_id'],
            'student_plan_id'=> $studentPlan->id,
            'scheduled_date' => $data['scheduled_date'],
            'status'         => 'agendada',
            'is_makeup'      => false,
            'created_by'     => $request->user()->id,
        ]);

        $enrollment->load(['student.user', 'classModel.room']);

        return response()->json($this->format($enrollment), 201);
    }

    public function destroy(Enrollment $enrollment): JsonResponse
    {
        if (in_array($enrollment->status, ['realizada'])) {
            return response()->json(['message' => 'Não é possível remover uma aula já realizada.'], 422);
        }

        $enrollment->delete();

        return response()->json(['message' => 'Agendamento removido.']);
    }

    public function format(Enrollment $e): array
    {
        return [
            'id'             => $e->id,
            'scheduled_date' => $e->scheduled_date->format('Y-m-d'),
            'status'         => $e->status,
            'is_makeup'      => $e->is_makeup,
            'makeup_expires_at' => $e->makeup_expires_at?->format('Y-m-d'),
            'confirmed_at'   => $e->confirmed_at?->format('Y-m-d H:i'),
            'canceled_at'    => $e->canceled_at?->format('Y-m-d H:i'),
            'canceled_by'    => $e->canceled_by,
            'student'        => [
                'id'   => $e->student->id,
                'name' => $e->student->user->name,
            ],
            'class' => $e->classModel ? [
                'id'         => $e->classModel->id,
                'modality'   => $e->classModel->modality,
                'start_time' => $e->classModel->start_time,
                'end_time'   => $e->classModel->end_time,
                'room'       => $e->classModel->room?->name,
                'instructor' => $e->classModel->instructor?->user?->name,
            ] : null,
            'notes' => $e->notes,
        ];
    }
}
