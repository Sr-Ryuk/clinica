<?php

namespace App\Http\Controllers\Api\V1\Plans;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PlanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $plans = Plan::query()
            ->when($request->modality, fn($q) => $q->where('modality', $request->modality))
            ->when($request->active !== null, fn($q) => $q->where('active', $request->boolean('active')))
            ->when(! $request->has('active'), fn($q) => $q->where('active', true))
            ->orderBy('modality')
            ->orderBy('session_type')
            ->orderBy('sessions_per_week')
            ->get()
            ->map(fn($p) => $this->format($p));

        return response()->json($plans);
    }

    public function show(Plan $plan): JsonResponse
    {
        return response()->json($this->format($plan));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'modality'          => ['required', Rule::in(['pilates', 'fisioterapia', 'quiropraxia', 'combo'])],
            'session_type'      => ['required', Rule::in(['individual', 'dupla', 'trio', 'grupo'])],
            'sessions_per_week' => ['required', 'integer', 'min:1', 'max:7'],
            'price'             => ['required', 'numeric', 'min:0'],
            'duration_days'     => ['required', 'integer', 'min:1'],
            'description'       => ['nullable', 'string'],
        ]);

        $plan = Plan::create(array_merge($data, ['active' => true]));

        return response()->json($this->format($plan), 201);
    }

    public function update(Request $request, Plan $plan): JsonResponse
    {
        $data = $request->validate([
            'name'              => ['sometimes', 'string', 'max:255'],
            'modality'          => ['sometimes', Rule::in(['pilates', 'fisioterapia', 'quiropraxia', 'combo'])],
            'session_type'      => ['sometimes', Rule::in(['individual', 'dupla', 'trio', 'grupo'])],
            'sessions_per_week' => ['sometimes', 'integer', 'min:1', 'max:7'],
            'price'             => ['sometimes', 'numeric', 'min:0'],
            'duration_days'     => ['sometimes', 'integer', 'min:1'],
            'description'       => ['sometimes', 'nullable', 'string'],
            'active'            => ['sometimes', 'boolean'],
        ]);

        $plan->update($data);

        return response()->json($this->format($plan));
    }

    public function destroy(Plan $plan): JsonResponse
    {
        // Verifica se há alunos com esse plano ativo antes de remover
        $activeCount = $plan->studentPlans()->where('status', 'ativo')->count();

        if ($activeCount > 0) {
            return response()->json([
                'message' => "Não é possível remover: {$activeCount} aluno(s) com este plano ativo.",
            ], 422);
        }

        $plan->delete();

        return response()->json(['message' => 'Plano removido com sucesso.']);
    }

    private function format(Plan $plan): array
    {
        return [
            'id'                => $plan->id,
            'name'              => $plan->name,
            'modality'          => $plan->modality,
            'session_type'      => $plan->session_type,
            'sessions_per_week' => $plan->sessions_per_week,
            'price'             => $plan->price,
            'duration_days'     => $plan->duration_days,
            'description'       => $plan->description,
            'active'            => $plan->active,
        ];
    }
}
