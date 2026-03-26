<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PlanWebController extends Controller
{
    public function index(): Response
    {
        $plans = Plan::withCount(['studentPlans as active_students' => fn($q) =>
                $q->where('status', 'ativo')
            ])
            ->orderBy('modality')
            ->orderBy('session_type')
            ->orderBy('sessions_per_week')
            ->get()
            ->map(fn($p) => [
                'id'                => $p->id,
                'name'              => $p->name,
                'modality'          => $p->modality,
                'session_type'      => $p->session_type,
                'sessions_per_week' => $p->sessions_per_week,
                'price'             => $p->price,
                'duration_days'     => $p->duration_days,
                'description'       => $p->description,
                'active'            => $p->active,
                'active_students'   => $p->active_students,
            ]);

        return Inertia::render('Plans/Index', ['plans' => $plans]);
    }

    public function create(): Response
    {
        return Inertia::render('Plans/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'modality'          => ['required', Rule::in(['pilates','fisioterapia','quiropraxia','combo'])],
            'session_type'      => ['required', Rule::in(['individual','dupla','trio','grupo'])],
            'sessions_per_week' => ['required', 'integer', 'min:1', 'max:7'],
            'price'             => ['required', 'numeric', 'min:0'],
            'duration_days'     => ['required', 'integer', 'min:1'],
            'description'       => ['nullable', 'string'],
        ]);

        Plan::create(array_merge($data, ['active' => true]));

        return redirect()->route('plans.index')
            ->with('success', 'Plano criado com sucesso.');
    }

    public function edit(Plan $plan): Response
    {
        return Inertia::render('Plans/Edit', [
            'plan' => [
                'id'                => $plan->id,
                'name'              => $plan->name,
                'modality'          => $plan->modality,
                'session_type'      => $plan->session_type,
                'sessions_per_week' => $plan->sessions_per_week,
                'price'             => $plan->price,
                'duration_days'     => $plan->duration_days,
                'description'       => $plan->description,
                'active'            => $plan->active,
            ],
        ]);
    }

    public function update(Request $request, Plan $plan)
    {
        $data = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'modality'          => ['required', Rule::in(['pilates','fisioterapia','quiropraxia','combo'])],
            'session_type'      => ['required', Rule::in(['individual','dupla','trio','grupo'])],
            'sessions_per_week' => ['required', 'integer', 'min:1', 'max:7'],
            'price'             => ['required', 'numeric', 'min:0'],
            'duration_days'     => ['required', 'integer', 'min:1'],
            'description'       => ['nullable', 'string'],
            'active'            => ['boolean'],
        ]);

        $plan->update($data);

        return redirect()->route('plans.index')
            ->with('success', 'Plano atualizado com sucesso.');
    }

    public function destroy(Plan $plan)
    {
        $active = $plan->studentPlans()->where('status', 'ativo')->count();

        if ($active > 0) {
            return redirect()->route('plans.index')
                ->with('error', "Não é possível remover: {$active} aluno(s) com este plano ativo.");
        }

        $plan->delete();

        return redirect()->route('plans.index')
            ->with('success', 'Plano removido.');
    }
}