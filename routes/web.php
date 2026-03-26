<?php

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\StudentController;
use App\Http\Controllers\Web\InstructorWebController;
use App\Http\Controllers\Web\PlanWebController;
use App\Http\Controllers\Web\RoomWebController;
use App\Http\Controllers\Web\ScheduleWebController;
use App\Http\Controllers\Web\FinancialController;
use App\Http\Controllers\Web\ReportController;
use Illuminate\Support\Facades\Route;

// ── Auth ──────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/logout', [AuthController::class, 'logout'])
     ->middleware('auth')
     ->name('logout');

// ── App interno (autenticado) ─────────────────────────────────
Route::middleware('auth')->group(function () {

    Route::get('/', fn() => redirect('/dashboard'));
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('students',    StudentController::class);
    Route::post('/students/{student}/plans', [StudentController::class, 'attachPlan'])
     ->name('students.plans.attach');
    Route::resource('instructors', InstructorWebController::class)->except(['show']);
    Route::resource('plans',       PlanWebController::class)->except(['show']);
    Route::resource('rooms', RoomWebController::class)->except(['show']);

    Route::get('/schedule', [ScheduleWebController::class, 'index'])->name('schedule.index');
Route::post('/schedule/classes', [ScheduleWebController::class, 'storeClass'])->name('schedule.classes.store');
Route::post('/schedule/enroll', [ScheduleWebController::class, 'enroll'])->name('schedule.enroll');
Route::patch('/schedule/enrollments/{enrollment}/confirm', [ScheduleWebController::class, 'confirmEnrollment'])->name('schedule.confirm');
Route::patch('/schedule/enrollments/{enrollment}/cancel', [ScheduleWebController::class, 'cancelEnrollment'])->name('schedule.cancel');

Route::get('/finance', [FinancialController::class, 'index'])->name('financial.index');
Route::post('/finance', [FinancialController::class, 'store'])->name('financial.store');
Route::patch('/finance/{transaction}/pay', [FinancialController::class, 'markAsPaid'])->name('financial.pay');

Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
});