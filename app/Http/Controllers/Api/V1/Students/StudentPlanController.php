<?php

namespace App\Http\Controllers\Api\V1\Students;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentPlanController extends Controller
{
    // GET /api/v1/students/{student}/plans
    public function index(Student $student): JsonResponse
    {
        $plans = $student->plans()
            ->with('plan')
            ->orderByDesc('starts_at')
            ->get()
            ->map(fn($sp) => [
                'id'              => $sp->id,
                'plan_name'       => $sp->plan->name,
                'modality'        => $sp->plan->modality,
                'session_type'    => $sp->plan->session_type,
                'status'          => $sp->status,
                'starts_at'       => $sp->starts_at->format('Y-m-d'),
                'ends_at'         => $sp->ends_at->format('Y-m-d'),
                'effective_price' => $sp->effective_price,
                'payment_method'  => $sp->payment_method,
                'payment_day'     => $sp->payment_day,
                'notes'           => $sp->notes,
            ]);

        return response()->json($plans);
    }

    // POST /api/v1/students/{student}/plans
    // Ativa um novo plano para o aluno
    public function store(Request $request, Student $student): JsonResponse
    {
        $data = $request->validate([
            'plan_id'        => ['required', 'exists:plans,id'],
            'starts_at'      => ['required', 'date'],
            'payment_method' => ['required', Rule::in(['pix','dinheiro','cartao_credito','cartao_debito','boleto','transferencia'])],
            'payment_day'    => ['required', 'integer', 'min:1', 'max:31'],
            'price_override' => ['nullable', 'numeric', 'min:0'],
            'notes'          => ['nullable', 'string'],
        ]);

        // Encerra plano ativo anterior
        $student->plans()
            ->where('status', 'ativo')
            ->update(['status' => 'encerrado']);

        $plan = \App\Models\Plan::findOrFail($data['plan_id']);

        $studentPlan = StudentPlan::create([
            'student_id'     => $student->id,
            'plan_id'        => $data['plan_id'],
            'starts_at'      => $data['starts_at'],
            'ends_at'        => \Carbon\Carbon::parse($data['starts_at'])->addDays($plan->duration_days),
            'payment_method' => $data['payment_method'],
            'payment_day'    => $data['payment_day'],
            'price_override' => $data['price_override'] ?? null,
            'notes'          => $data['notes'] ?? null,
            'status'         => 'ativo',
            'created_by'     => $request->user()->id,
        ]);

        // Atualiza status do aluno para ativo se estava como lead
        if ($student->status === 'lead') {
            $student->update(['status' => 'ativo']);
        }

        return response()->json([
            'message'      => 'Plano ativado com sucesso.',
            'student_plan' => $studentPlan->load('plan'),
        ], 201);
    }

    // PATCH /api/v1/students/{student}/plans/{plan}
    // Atualiza status ou dados do plano (ex: suspender por inadimplência)
    public function update(Request $request, Student $student, StudentPlan $plan): JsonResponse
    {
        $data = $request->validate([
            'status'         => ['sometimes', Rule::in(['ativo','suspenso','cancelado','encerrado'])],
            'payment_method' => ['sometimes', Rule::in(['pix','dinheiro','cartao_credito','cartao_debito','boleto','transferencia'])],
            'payment_day'    => ['sometimes', 'integer', 'min:1', 'max:31'],
            'price_override' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'notes'          => ['sometimes', 'nullable', 'string'],
        ]);

        $plan->update($data);

        return response()->json([
            'message' => 'Plano atualizado com sucesso.',
            'plan'    => $plan->load('plan'),
        ]);
    }
}
