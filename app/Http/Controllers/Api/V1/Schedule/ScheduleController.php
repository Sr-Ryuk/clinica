<?php

namespace App\Http\Controllers\Api\V1\Schedule;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// GET /api/v1/schedule?date=2024-03-18
// GET /api/v1/schedule?from=2024-03-18&to=2024-03-22
class ScheduleController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'date' => ['nullable', 'date'],
            'from' => ['nullable', 'date'],
            'to'   => ['nullable', 'date', 'after_or_equal:from'],
        ]);

        $date = $request->date ? Carbon::parse($request->date) : Carbon::today();
        $from = $request->from ? Carbon::parse($request->from) : $date;
        $to   = $request->to   ? Carbon::parse($request->to)   : $from;

        // Monta lista de datas no intervalo
        $dates = collect();
        $current = $from->copy();
        while ($current->lte($to)) {
            $dates->push($current->copy());
            $current->addDay();
        }

        $schedule = $dates->map(function (Carbon $day) {
            $weekday = $day->dayOfWeek; // 0=Dom...6=Sáb

            // Busca aulas recorrentes do dia da semana
            $classes = ClassModel::with([
                    'instructor.user',
                    'room',
                    'enrollments' => fn($q) => $q
                        ->where('scheduled_date', $day->toDateString())
                        ->whereNotIn('status', ['cancelada_aviso', 'cancelada_sem_aviso'])
                        ->with('student.user'),
                ])
                ->where('active', true)
                ->where(fn($q) =>
                    // Recorrente no dia da semana
                    $q->where(fn($inner) =>
                        $inner->where('is_recurring', true)
                              ->where('weekday', $weekday)
                              ->where(fn($v) =>
                                  $v->whereNull('valid_from')
                                    ->orWhere('valid_from', '<=', $day)
                              )
                              ->where(fn($v) =>
                                  $v->whereNull('valid_until')
                                    ->orWhere('valid_until', '>=', $day)
                              )
                    )
                    // Ou avulsa nesta data específica
                    ->orWhere(fn($inner) =>
                        $inner->where('is_recurring', false)
                              ->where('specific_date', $day->toDateString())
                    )
                )
                ->orderBy('start_time')
                ->get();

            return [
                'date'    => $day->toDateString(),
                'weekday' => $day->isoFormat('dddd'),
                'classes' => $classes->map(fn($c) => [
                    'id'           => $c->id,
                    'modality'     => $c->modality,
                    'session_type' => $c->session_type,
                    'start_time'   => $c->start_time,
                    'end_time'     => $c->end_time,
                    'room'         => $c->room?->name,
                    'instructor'   => $c->instructor?->user?->name,
                    'max_students' => $c->max_students,
                    'enrolled'     => $c->enrollments->count(),
                    'available_spots' => $c->availableSpotsOn($day->toDateString()),
                    'students'     => $c->enrollments->map(fn($e) => [
                        'enrollment_id' => $e->id,
                        'student_id'    => $e->student->id,
                        'name'          => $e->student->user->name,
                        'status'        => $e->status,
                        'is_makeup'     => $e->is_makeup,
                    ]),
                ]),
            ];
        });

        return response()->json($schedule);
    }
}
