<?php

namespace App\Http\Controllers\Api\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\StudentPlan;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $today    = Carbon::today();
        $monthStart = $today->copy()->startOfMonth();
        $monthEnd   = $today->copy()->endOfMonth();

        return response()->json([

            // ── Alunos ─────────────────────────────────────────
            'students' => [
                'total_active'   => Student::where('status', 'ativo')->count(),
                'total_leads'    => Student::where('status', 'lead')->count(),
                'new_this_month' => Student::whereBetween('joined_at', [$monthStart, $monthEnd])->count(),
                'expiring_plans' => StudentPlan::where('status', 'ativo')
                    ->whereBetween('ends_at', [$today, $today->copy()->addDays(7)])
                    ->count(),
                'suspended_plans'=> StudentPlan::where('status', 'suspenso')->count(),
            ],

            // ── Agenda hoje ────────────────────────────────────
            'today_schedule' => [
                'total_classes'  => Enrollment::where('scheduled_date', $today)
                    ->whereNotIn('status', ['cancelada_aviso', 'cancelada_sem_aviso'])
                    ->distinct('class_id')
                    ->count('class_id'),
                'total_students' => Enrollment::where('scheduled_date', $today)
                    ->whereNotIn('status', ['cancelada_aviso', 'cancelada_sem_aviso'])
                    ->count(),
                'confirmed'      => Enrollment::where('scheduled_date', $today)
                    ->where('status', 'confirmada')
                    ->count(),
                'pending'        => Enrollment::where('scheduled_date', $today)
                    ->where('status', 'agendada')
                    ->count(),
            ],

            // ── Mês atual ──────────────────────────────────────
            'this_month' => [
                'classes_done'   => Enrollment::where('status', 'realizada')
                    ->whereBetween('scheduled_date', [$monthStart, $monthEnd])
                    ->count(),
                'absences_with_notice' => Enrollment::where('status', 'cancelada_aviso')
                    ->whereBetween('scheduled_date', [$monthStart, $monthEnd])
                    ->count(),
                'absences_no_notice'   => Enrollment::where('status', 'cancelada_sem_aviso')
                    ->whereBetween('scheduled_date', [$monthStart, $monthEnd])
                    ->count(),
                'makeups_pending'      => Enrollment::where('status', 'reposicao_pendente')
                    ->where('makeup_expires_at', '>=', $today)
                    ->count(),
            ],

            // ── Planos por modalidade ──────────────────────────
            'plans_by_modality' => StudentPlan::where('status', 'ativo')
                ->join('plans', 'student_plans.plan_id', '=', 'plans.id')
                ->selectRaw('plans.modality, count(*) as total')
                ->groupBy('plans.modality')
                ->pluck('total', 'modality'),

        ]);
    }
}
