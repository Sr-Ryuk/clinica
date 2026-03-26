<?php

use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\MeController;
use App\Http\Controllers\Api\V1\Students\StudentController;
use App\Http\Controllers\Api\V1\Students\StudentPlanController;
use App\Http\Controllers\Api\V1\Instructors\InstructorController;
use App\Http\Controllers\Api\V1\Plans\PlanController;
use App\Http\Controllers\Api\V1\Rooms\RoomController;
use App\Http\Controllers\Api\V1\Enrollments\EnrollmentController;
use App\Http\Controllers\Api\V1\Enrollments\ConfirmEnrollmentController;
use App\Http\Controllers\Api\V1\Enrollments\CancelEnrollmentController;
use App\Http\Controllers\Api\V1\Enrollments\MakeupEnrollmentController;
use App\Http\Controllers\Api\V1\Schedule\ScheduleController;
use App\Http\Controllers\Api\V1\Evolutions\EvolutionController;
use App\Http\Controllers\Api\V1\Dashboard\DashboardController;
use Illuminate\Support\Facades\Route;

// ─────────────────────────────────────────────────────────────
// Rotas públicas
// ─────────────────────────────────────────────────────────────
Route::prefix('v1')->group(function () {

    Route::post('auth/login', LoginController::class);

    // ─────────────────────────────────────────────────────────
    // Rotas autenticadas
    // ─────────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('auth/logout', LogoutController::class);
        Route::get('auth/me', MeController::class);

        // ── Alunos ────────────────────────────────────────────
        Route::apiResource('students', StudentController::class);
        Route::apiResource('students.plans', StudentPlanController::class)
             ->only(['index', 'store', 'update']);

        // ── Instrutores ───────────────────────────────────────
        Route::apiResource('instructors', InstructorController::class);

        // ── Planos ────────────────────────────────────────────
        Route::apiResource('plans', PlanController::class);

        // ── Salas e Aparelhos ─────────────────────────────────
        Route::apiResource('rooms', RoomController::class);

        // ── Agendamentos ──────────────────────────────────────
        Route::apiResource('enrollments', EnrollmentController::class)
             ->only(['index', 'show', 'store', 'destroy']);

        // Ações de agendamento (controllers dedicados)
        Route::patch('enrollments/{enrollment}/confirm', ConfirmEnrollmentController::class);
        Route::patch('enrollments/{enrollment}/cancel',  CancelEnrollmentController::class);
        Route::post('enrollments/{enrollment}/makeup',   MakeupEnrollmentController::class);

        // ── Grade / Agenda ────────────────────────────────────
        // GET /schedule?date=2024-03-18         → agenda do dia
        // GET /schedule?from=2024-03-18&to=...  → intervalo
        Route::get('schedule', ScheduleController::class);

        // ── Evoluções ─────────────────────────────────────────
        Route::apiResource('students.evolutions', EvolutionController::class)
             ->only(['index', 'store', 'show', 'update']);

        // ── Dashboard ─────────────────────────────────────────
        Route::get('dashboard', DashboardController::class);
    });
});