<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\V1\Dashboard\DashboardController as ApiDashboard;
use App\Models\ClassModel;
use App\Models\Student;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();

        // Reutiliza a lógica do DashboardController da API
        $stats = (new ApiDashboard)->__invoke(request())->getData(true);

        // Alunos recentes (últimos 5)
        $recentStudents = Student::with(['user', 'activePlan.plan'])
            ->where('status', 'ativo')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($s) => [
                'id'          => $s->id,
                'name'        => $s->user->name,
                'status'      => $s->status,
                'active_plan' => $s->activePlan ? [
                    'plan_name' => $s->activePlan->plan->name,
                ] : null,
            ]);

        // Aulas de hoje
        $weekday = $today->dayOfWeek;

        $todayClasses = ClassModel::with(['instructor.user', 'room', 'enrollments' => fn($q) =>
                $q->where('scheduled_date', $today->toDateString())
                  ->whereNotIn('status', ['cancelada_aviso', 'cancelada_sem_aviso'])
            ])
            ->where('active', true)
            ->where(fn($q) =>
                $q->where(fn($r) =>
                    $r->where('is_recurring', true)->where('weekday', $weekday)
                )->orWhere(fn($r) =>
                    $r->where('is_recurring', false)->where('specific_date', $today->toDateString())
                )
            )
            ->orderBy('start_time')
            ->limit(6)
            ->get()
            ->map(fn($c) => [
                'id'           => $c->id,
                'modality'     => $c->modality,
                'session_type' => $c->session_type,
                'start_time'   => $c->start_time,
                'instructor'   => $c->instructor?->user?->name,
                'room'         => $c->room?->name,
                'max_students' => $c->max_students,
                'enrolled'     => $c->enrollments->count(),
            ]);

        return Inertia::render('Dashboard', [
            'stats'          => $stats,
            'recentStudents' => $recentStudents,
            'todayClasses'   => $todayClasses,
        ]);
    }
}