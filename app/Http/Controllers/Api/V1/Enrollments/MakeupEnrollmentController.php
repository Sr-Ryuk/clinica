<?php

namespace App\Http\Controllers\Api\V1\Enrollments;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ─────────────────────────────────────────────────────────────
// POST /api/v1/enrollments/{enrollment}/makeup
// Agenda uma reposição a partir de uma falta com aviso
// ─────────────────────────────────────────────────────────────
class MakeupEnrollmentController extends Controller
{
    public function __invoke(Request $request, Enrollment $origin): JsonResponse
    {
        if (! $origin->hasMakeupAvailable()) {
            return response()->json([
                'message' => 'Este agendamento não possui reposição disponível ou o prazo expirou.',
            ], 422);
        }

        $data = $request->validate([
            'class_id'       => ['required', 'exists:classes,id'],
            'scheduled_date' => ['required', 'date', 'after_or_equal:today'],
        ]);

        $class = ClassModel::findOrFail($data['class_id']);

        if ($class->availableSpotsOn($data['scheduled_date']) <= 0) {
            return response()->json(['message' => 'Sem vagas disponíveis neste horário.'], 422);
        }

        $makeup = Enrollment::create([
            'class_id'        => $data['class_id'],
            'student_id'      => $origin->student_id,
            'student_plan_id' => $origin->student_plan_id,
            'scheduled_date'  => $data['scheduled_date'],
            'status'          => 'agendada',
            'is_makeup'       => true,
            'makeup_origin_id'=> $origin->id,
            'created_by'      => $request->user()->id,
        ]);

        // Marca a origem como reposição agendada (não pendente mais)
        $origin->update(['status' => 'cancelada_aviso']);

        $makeup->load(['classModel.room', 'classModel.instructor.user']);

        return response()->json([
            'message' => 'Reposição agendada com sucesso.',
            'makeup'  => [
                'id'             => $makeup->id,
                'scheduled_date' => $makeup->scheduled_date->format('Y-m-d'),
                'class'          => [
                    'start_time' => $makeup->classModel->start_time,
                    'end_time'   => $makeup->classModel->end_time,
                    'room'       => $makeup->classModel->room?->name,
                    'instructor' => $makeup->classModel->instructor?->user?->name,
                ],
            ],
        ], 201);
    }
}
