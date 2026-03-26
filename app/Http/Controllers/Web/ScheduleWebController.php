<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use App\Models\Enrollment;
use App\Models\Instructor;
use App\Models\Room;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleWebController extends Controller
{
    // GET /schedule?date=2026-03-18
    public function index(Request $request): Response
    {
        $date    = $request->date ? Carbon::parse($request->date) : Carbon::today();
        $weekday = $date->dayOfWeek;

        // Monta a semana (seg a sab)
        $weekStart = $date->copy()->startOfWeek(Carbon::MONDAY);
        $week = collect(range(0, 5))->map(fn($i) => $weekStart->copy()->addDays($i));

        // Aulas do dia selecionado
        $classes = ClassModel::with([
                'instructor.user',
                'room',
                'enrollments' => fn($q) => $q
                    ->where('scheduled_date', $date->toDateString())
                    ->whereNotIn('status', ['cancelada_aviso', 'cancelada_sem_aviso'])
                    ->with('student.user'),
            ])
            ->where('active', true)
            ->where(fn($q) =>
                $q->where(fn($r) =>
                    $r->where('is_recurring', true)
                      ->where('weekday', $weekday)
                      ->where(fn($v) => $v->whereNull('valid_from')->orWhere('valid_from', '<=', $date))
                      ->where(fn($v) => $v->whereNull('valid_until')->orWhere('valid_until', '>=', $date))
                )->orWhere(fn($r) =>
                    $r->where('is_recurring', false)
                      ->where('specific_date', $date->toDateString())
                )
            )
            ->orderBy('start_time')
            ->get()
            ->map(fn($c) => [
                'id'             => $c->id,
                'modality'       => $c->modality,
                'session_type'   => $c->session_type,
                'start_time'     => substr($c->start_time, 0, 5),
                'end_time'       => substr($c->end_time, 0, 5),
                'max_students'   => $c->max_students,
                'is_recurring'   => $c->is_recurring,
                'room'           => $c->room?->name,
                'instructor'     => $c->instructor?->user?->name,
                'instructor_id'  => $c->instructor_id,
                'available_spots'=> $c->availableSpotsOn($date->toDateString()),
                'enrollments'    => $c->enrollments->map(fn($e) => [
                    'id'         => $e->id,
                    'student_id' => $e->student_id,
                    'name'       => $e->student->user->name,
                    'status'     => $e->status,
                    'is_makeup'  => $e->is_makeup,
                ]),
            ]);

        // Dias da semana com aulas (para os dots)
        $daysWithClasses = ClassModel::where('active', true)
            ->where('is_recurring', true)
            ->whereBetween('weekday', [1, 6])
            ->pluck('weekday')
            ->unique()
            ->values();

        // Dados para os modais
        $instructors = Instructor::with('user')
            ->get()
            ->map(fn($i) => ['id' => $i->id, 'name' => $i->user->name]);

        $rooms = Room::where('active', true)
            ->with('equipment')
            ->get()
            ->map(fn($r) => [
                'id'       => $r->id,
                'name'     => $r->name,
                'capacity' => $r->capacity,
            ]);

        $students = Student::with(['user', 'activePlan'])
            ->where('status', 'ativo')
            ->get()
            ->map(fn($s) => [
                'id'   => $s->id,
                'name' => $s->user->name,
                'plan' => $s->activePlan?->status === 'ativo',
            ]);

        return Inertia::render('Schedule/Index', [
            'date'            => $date->toDateString(),
            'week'            => $week->map(fn($d) => [
                'date'        => $d->toDateString(),
                'day_name'    => $d->isoFormat('ddd'),
                'day_number'  => $d->day,
                'is_today'    => $d->isToday(),
                'is_selected' => $d->toDateString() === $date->toDateString(),
                'has_classes' => $daysWithClasses->contains($d->dayOfWeek),
            ]),
            'classes'     => $classes,
            'instructors' => $instructors,
            'rooms'       => $rooms,
            'students'    => $students,
        ]);
    }

    // POST /schedule/classes — cria aula recorrente ou avulsa
    public function storeClass(Request $request)
    {
        $data = $request->validate([
            'instructor_id'   => ['required', 'exists:instructors,id'],
            'room_id'         => ['required', 'exists:rooms,id'],
            'modality'        => ['required', Rule::in(['pilates','fisioterapia','quiropraxia','avaliacao'])],
            'session_type'    => ['required', Rule::in(['individual','dupla','trio','grupo'])],
            'max_students'    => ['required', 'integer', 'min:1', 'max:10'],
            'is_recurring'    => ['required', 'boolean'],
            'weekday'         => ['required_if:is_recurring,true', 'integer', 'min:0', 'max:6'],
            'specific_date'   => ['required_if:is_recurring,false', 'date'],
            'start_time'      => ['required', 'date_format:H:i'],
            'end_time'        => ['required', 'date_format:H:i', 'after:start_time'],
            'valid_from'      => ['nullable', 'date'],
            'valid_until'     => ['nullable', 'date', 'after_or_equal:valid_from'],
        ]);

        // Verifica conflito de instrutor no mesmo horário
        $conflict = ClassModel::where('instructor_id', $data['instructor_id'])
            ->where('active', true)
            ->where('start_time', '<', $data['end_time'])
            ->where('end_time', '>', $data['start_time'])
            ->where(fn($q) =>
                $data['is_recurring']
                    ? $q->where('weekday', $data['weekday'])->where('is_recurring', true)
                    : $q->where('specific_date', $data['specific_date'])->where('is_recurring', false)
            )
            ->exists();

        if ($conflict) {
            return back()->withErrors(['start_time' => 'O instrutor já possui uma aula neste horário.']);
        }

        ClassModel::create(array_merge($data, ['active' => true]));

        return redirect()->route('schedule.index', ['date' => $data['specific_date'] ?? now()->toDateString()])
            ->with('success', 'Aula criada com sucesso.');
    }

    // POST /schedule/enroll — agenda aluno numa aula
    public function enroll(Request $request)
    {
        $data = $request->validate([
            'class_id'       => ['required', 'exists:classes,id'],
            'student_id'     => ['required', 'exists:students,id'],
            'scheduled_date' => ['required', 'date'],
        ]);

        $class = ClassModel::findOrFail($data['class_id']);

        if ($class->availableSpotsOn($data['scheduled_date']) <= 0) {
            return back()->withErrors(['student_id' => 'Sem vagas disponíveis neste horário.']);
        }

        $alreadyEnrolled = Enrollment::where('class_id', $data['class_id'])
            ->where('student_id', $data['student_id'])
            ->where('scheduled_date', $data['scheduled_date'])
            ->whereNotIn('status', ['cancelada_aviso', 'cancelada_sem_aviso'])
            ->exists();

        if ($alreadyEnrolled) {
            return back()->withErrors(['student_id' => 'Aluno já agendado nesta aula.']);
        }

        $studentPlan = \App\Models\StudentPlan::where('student_id', $data['student_id'])
            ->where('status', 'ativo')
            ->latest('starts_at')
            ->first();

        if (!$studentPlan) {
            return back()->withErrors(['student_id' => 'Aluno não possui plano ativo.']);
        }

        Enrollment::create([
            'class_id'        => $data['class_id'],
            'student_id'      => $data['student_id'],
            'student_plan_id' => $studentPlan->id,
            'scheduled_date'  => $data['scheduled_date'],
            'status'          => 'agendada',
            'created_by'      => $request->user()->id,
        ]);

        return back()->with('success', 'Aluno agendado com sucesso.');
    }

    // PATCH /schedule/enrollments/{enrollment}/confirm
    public function confirmEnrollment(Enrollment $enrollment)
    {
        if ($enrollment->status !== 'agendada') {
            return back()->withErrors(['status' => "Não é possível confirmar com status '{$enrollment->status}'."]);
        }

        $enrollment->confirm();

        return back()->with('success', 'Presença confirmada.');
    }

    // PATCH /schedule/enrollments/{enrollment}/cancel
    public function cancelEnrollment(Request $request, Enrollment $enrollment)
    {
        $data = $request->validate([
            'with_notice' => ['required', 'boolean'],
        ]);

        if (in_array($enrollment->status, ['realizada', 'cancelada_aviso', 'cancelada_sem_aviso'])) {
            return back()->withErrors(['status' => 'Este agendamento não pode ser cancelado.']);
        }

        $enrollment->cancel(
            canceledBy: 'recepcao',
            withNotice: $data['with_notice']
        );

        return back()->with('success', 'Agendamento cancelado.');
    }
}