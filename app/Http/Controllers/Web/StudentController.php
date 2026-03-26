<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Student;
use App\Models\StudentPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $students = Student::with(['user', 'activePlan.plan'])
            ->when($request->search, fn($q) =>
                $q->whereHas('user', fn($u) =>
                    $u->where('name', 'like', "%{$request->search}%")
                )->orWhere('cpf', 'like', "%{$request->search}%")
                 ->orWhere('phone', 'like', "%{$request->search}%")
            )
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Students/Index', [
            'students' => $students->through(fn($s) => [
                'id'          => $s->id,
                'name'        => $s->user->name,
                'email'       => $s->user->email,
                'phone'       => $s->phone,
                'status'      => $s->status,
                'joined_at'   => $s->joined_at?->format('d/m/Y'),
                'active_plan' => $s->activePlan ? [
                    'plan_name'    => $s->activePlan->plan->name,
                    'modality'     => $s->activePlan->plan->modality,
                    'session_type' => $s->activePlan->plan->session_type,
                    'status'       => $s->activePlan->status,
                    'ends_at'      => $s->activePlan->ends_at->format('d/m/Y'),
                ] : null,
            ]),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Students/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:8'],
            'cpf'      => ['nullable', 'string', 'size:14', 'unique:students,cpf'],
            'phone'    => ['required', 'string', 'max:20'],
            'phone_secondary'            => ['nullable', 'string', 'max:20'],
            'rg'                         => ['nullable', 'string', 'max:20'],
            'birth_date'                 => ['nullable', 'date', 'before:today'],
            'gender'                     => ['nullable', Rule::in(['M', 'F', 'outro'])],
            'zip_code'                   => ['nullable', 'string', 'max:10'],
            'address'                    => ['nullable', 'string', 'max:255'],
            'address_number'             => ['nullable', 'string', 'max:10'],
            'address_complement'         => ['nullable', 'string', 'max:255'],
            'neighborhood'               => ['nullable', 'string', 'max:255'],
            'city'                       => ['nullable', 'string', 'max:255'],
            'state'                      => ['nullable', 'string', 'size:2'],
            'emergency_contact_name'     => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone'    => ['nullable', 'string', 'max:20'],
            'emergency_contact_relation' => ['nullable', 'string', 'max:255'],
            'health_notes'               => ['nullable', 'string'],
            'injury_history'             => ['nullable', 'string'],
            'physical_restrictions'      => ['nullable', 'string'],
            'medications'                => ['nullable', 'string'],
            'doctor_name'                => ['nullable', 'string', 'max:255'],
            'doctor_phone'               => ['nullable', 'string', 'max:20'],
            'status'                     => ['nullable', Rule::in(['ativo', 'suspenso', 'inativo', 'lead'])],
            'joined_at'                  => ['nullable', 'date'],
            'how_found_us'               => ['nullable', 'string', 'max:255'],
            'notes'                      => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($data) {
            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password'] ?? str()->random(12)),
                'role'     => 'aluno',
                'active'   => true,
            ]);

            Student::create(array_merge(
                collect($data)->except(['name', 'email', 'password'])->toArray(),
                [
                    'user_id'   => $user->id,
                    'status'    => $data['status'] ?? 'lead',
                    'joined_at' => $data['joined_at'] ?? now()->toDateString(),
                ]
            ));
        });

        return redirect()->route('students.index')
            ->with('success', 'Aluno cadastrado com sucesso.');
    }

    public function show(Student $student): Response
    {
        $student->load([
            'user',
            'plans.plan',
            'activePlan.plan',
            'evolutions' => fn($q) => $q->with('instructor.user')->orderByDesc('record_date')->limit(10),
        ]);

        $availablePlans = Plan::where('active', true)
            ->orderBy('modality')
            ->orderBy('session_type')
            ->get()
            ->map(fn($p) => [
                'id'                => $p->id,
                'name'              => $p->name,
                'modality'          => $p->modality,
                'session_type'      => $p->session_type,
                'sessions_per_week' => $p->sessions_per_week,
                'price'             => $p->price,
                'duration_days'     => $p->duration_days,
            ]);

        return Inertia::render('Students/Show', [
            'student' => [
                'id'          => $student->id,
                'name'        => $student->user->name,
                'email'       => $student->user->email,
                'phone'       => $student->phone,
                'phone_secondary' => $student->phone_secondary,
                'cpf'         => $student->cpf,
                'birth_date'  => $student->birth_date?->format('d/m/Y'),
                'gender'      => $student->gender,
                'status'      => $student->status,
                'joined_at'   => $student->joined_at?->format('d/m/Y'),
                'how_found_us'=> $student->how_found_us,
                'photo_path'  => $student->photo_path,
                'address' => [
                    'zip_code'    => $student->zip_code,
                    'street'      => $student->address,
                    'number'      => $student->address_number,
                    'complement'  => $student->address_complement,
                    'neighborhood'=> $student->neighborhood,
                    'city'        => $student->city,
                    'state'       => $student->state,
                ],
                'emergency_contact' => [
                    'name'     => $student->emergency_contact_name,
                    'phone'    => $student->emergency_contact_phone,
                    'relation' => $student->emergency_contact_relation,
                ],
                'health' => [
                    'notes'               => $student->health_notes,
                    'injury_history'      => $student->injury_history,
                    'physical_restrictions' => $student->physical_restrictions,
                    'medications'         => $student->medications,
                    'doctor_name'         => $student->doctor_name,
                    'doctor_phone'        => $student->doctor_phone,
                ],
                'notes'       => $student->notes,
                'active_plan' => $student->activePlan ? [
                    'id'             => $student->activePlan->id,
                    'plan_name'      => $student->activePlan->plan->name,
                    'modality'       => $student->activePlan->plan->modality,
                    'session_type'   => $student->activePlan->plan->session_type,
                    'sessions_per_week' => $student->activePlan->plan->sessions_per_week,
                    'status'         => $student->activePlan->status,
                    'starts_at'      => $student->activePlan->starts_at->format('d/m/Y'),
                    'ends_at'        => $student->activePlan->ends_at->format('d/m/Y'),
                    'payment_method' => $student->activePlan->payment_method,
                    'payment_day'    => $student->activePlan->payment_day,
                    'effective_price'=> $student->activePlan->effective_price,
                ] : null,
                'plan_history' => $student->plans->map(fn($sp) => [
                    'id'         => $sp->id,
                    'plan_name'  => $sp->plan->name,
                    'status'     => $sp->status,
                    'starts_at'  => $sp->starts_at->format('d/m/Y'),
                    'ends_at'    => $sp->ends_at->format('d/m/Y'),
                    'price'      => $sp->effective_price,
                ]),
                'evolutions' => $student->evolutions->map(fn($e) => [
                    'id'           => $e->id,
                    'record_date'  => $e->record_date->format('d/m/Y'),
                    'instructor'   => $e->instructor?->user?->name,
                    'observations' => $e->observations,
                    'pain_level'   => $e->pain_level,
                ]),
            ],
            'available_plans' => $availablePlans,
        ]);
    }

    public function edit(Student $student): Response
    {
        $student->load('user');

        return Inertia::render('Students/Edit', [
            'student' => [
                'id'          => $student->id,
                'name'        => $student->user->name,
                'email'       => $student->user->email,
                'phone'       => $student->phone,
                'phone_secondary' => $student->phone_secondary,
                'cpf'         => $student->cpf,
                'rg'          => $student->rg,
                'birth_date'  => $student->birth_date?->format('Y-m-d'),
                'gender'      => $student->gender,
                'status'      => $student->status,
                'joined_at'   => $student->joined_at?->format('Y-m-d'),
                'how_found_us'=> $student->how_found_us,
                'notes'       => $student->notes,
                'address' => [
                    'zip_code'    => $student->zip_code,
                    'street'      => $student->address,
                    'number'      => $student->address_number,
                    'complement'  => $student->address_complement,
                    'neighborhood'=> $student->neighborhood,
                    'city'        => $student->city,
                    'state'       => $student->state,
                ],
                'emergency_contact' => [
                    'name'     => $student->emergency_contact_name,
                    'phone'    => $student->emergency_contact_phone,
                    'relation' => $student->emergency_contact_relation,
                ],
                'health' => [
                    'notes'                 => $student->health_notes,
                    'injury_history'        => $student->injury_history,
                    'physical_restrictions' => $student->physical_restrictions,
                    'medications'           => $student->medications,
                    'doctor_name'           => $student->doctor_name,
                    'doctor_phone'          => $student->doctor_phone,
                ],
            ],
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($student->user_id)],
            'cpf'   => ['nullable', 'string', 'size:14', Rule::unique('students', 'cpf')->ignore($student->id)],
            'phone' => ['required', 'string', 'max:20'],
            'phone_secondary'            => ['nullable', 'string', 'max:20'],
            'rg'                         => ['nullable', 'string', 'max:20'],
            'birth_date'                 => ['nullable', 'date', 'before:today'],
            'gender'                     => ['nullable', Rule::in(['M', 'F', 'outro'])],
            'zip_code'                   => ['nullable', 'string', 'max:10'],
            'address'                    => ['nullable', 'string', 'max:255'],
            'address_number'             => ['nullable', 'string', 'max:10'],
            'address_complement'         => ['nullable', 'string', 'max:255'],
            'neighborhood'               => ['nullable', 'string', 'max:255'],
            'city'                       => ['nullable', 'string', 'max:255'],
            'state'                      => ['nullable', 'string', 'size:2'],
            'emergency_contact_name'     => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone'    => ['nullable', 'string', 'max:20'],
            'emergency_contact_relation' => ['nullable', 'string', 'max:255'],
            'health_notes'               => ['nullable', 'string'],
            'injury_history'             => ['nullable', 'string'],
            'physical_restrictions'      => ['nullable', 'string'],
            'medications'                => ['nullable', 'string'],
            'doctor_name'                => ['nullable', 'string', 'max:255'],
            'doctor_phone'               => ['nullable', 'string', 'max:20'],
            'status'                     => ['nullable', Rule::in(['ativo', 'suspenso', 'inativo', 'lead'])],
            'joined_at'                  => ['nullable', 'date'],
            'how_found_us'               => ['nullable', 'string', 'max:255'],
            'notes'                      => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($data, $student) {
            $student->user->update([
                'name'  => $data['name'],
                'email' => $data['email'],
            ]);

            $student->update(collect($data)->except(['name', 'email'])->toArray());
        });

        return redirect()->route('students.show', $student)
            ->with('success', 'Dados atualizados com sucesso.');
    }

    public function destroy(Student $student)
    {
        $student->user->delete();
        $student->delete();

        return redirect()->route('students.index')
            ->with('success', 'Aluno removido.');
    }

    // POST /students/{student}/plans — vincula plano ao aluno
    public function attachPlan(Request $request, Student $student)
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
        $student->plans()->where('status', 'ativo')->update(['status' => 'encerrado']);

        $plan = Plan::findOrFail($data['plan_id']);

        StudentPlan::create([
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

        if ($student->status === 'lead') {
            $student->update(['status' => 'ativo']);
        }

        return redirect()->route('students.show', $student)
            ->with('success', 'Plano vinculado com sucesso.');
    }
}