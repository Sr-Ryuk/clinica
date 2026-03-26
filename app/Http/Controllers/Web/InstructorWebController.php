<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InstructorWebController extends Controller
{
    public function index(Request $request): Response
    {
        $instructors = Instructor::with(['user', 'specialties', 'availability'])
            ->when($request->search, fn($q) =>
                $q->whereHas('user', fn($u) =>
                    $u->where('name', 'like', "%{$request->search}%")
                )
            )
            ->get()
            ->map(fn($i) => [
                'id'              => $i->id,
                'name'            => $i->user->name,
                'email'           => $i->user->email,
                'phone'           => $i->phone,
                'council_type'    => $i->council_type,
                'professional_id' => $i->professional_id,
                'contract_type'   => $i->contract_type,
                'specialties'     => $i->specialties->pluck('specialty'),
                'availability'    => $i->availability->map(fn($a) => [
                    'weekday_name' => $a->weekday_name,
                    'start_time'   => substr($a->start_time, 0, 5),
                    'end_time'     => substr($a->end_time, 0, 5),
                ]),
            ]);

        return Inertia::render('Instructors/Index', [
            'instructors' => $instructors,
            'filters'     => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Instructors/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => ['required', 'string', 'max:255'],
            'email'           => ['required', 'email', 'unique:users,email'],
            'password'        => ['nullable', 'string', 'min:8'],
            'cpf'             => ['nullable', 'string', 'max:14', 'unique:instructors,cpf'],
            'phone'           => ['nullable', 'string', 'max:20'],
            'birth_date'      => ['nullable', 'date'],
            'council_type'    => ['nullable', 'string', 'max:20'],
            'professional_id' => ['nullable', 'string', 'max:30'],
            'contract_type'   => ['nullable', Rule::in(['clt', 'pj', 'autonomo'])],
            'salary'          => ['nullable', 'numeric', 'min:0'],
            'hired_at'        => ['nullable', 'date'],
            'bio'             => ['nullable', 'string'],
            'notes'           => ['nullable', 'string'],
            'specialties'     => ['nullable', 'array'],
            'specialties.*'   => ['string', 'max:100'],
            'availability'              => ['nullable', 'array'],
            'availability.*.weekday'    => ['required', 'integer', 'min:0', 'max:6'],
            'availability.*.start_time' => ['required', 'date_format:H:i'],
            'availability.*.end_time'   => ['required', 'date_format:H:i'],
        ]);

        DB::transaction(function () use ($data) {
            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password'] ?? str()->random(12)),
                'role'     => 'instrutor',
                'active'   => true,
            ]);

            $instructor = Instructor::create(array_merge(
                collect($data)->except(['name','email','password','specialties','availability'])->toArray(),
                ['user_id' => $user->id]
            ));

            foreach ($data['specialties'] ?? [] as $s) {
                $instructor->specialties()->create(['specialty' => $s]);
            }
            foreach ($data['availability'] ?? [] as $slot) {
                $instructor->availability()->create($slot);
            }
        });

        return redirect()->route('instructors.index')
            ->with('success', 'Instrutor cadastrado com sucesso.');
    }

    public function edit(Instructor $instructor): Response
    {
        $instructor->load(['user', 'specialties', 'availability']);

        return Inertia::render('Instructors/Edit', [
            'instructor' => [
                'id'              => $instructor->id,
                'name'            => $instructor->user->name,
                'email'           => $instructor->user->email,
                'cpf'             => $instructor->cpf,
                'phone'           => $instructor->phone,
                'birth_date'      => $instructor->birth_date?->format('Y-m-d'),
                'council_type'    => $instructor->council_type,
                'professional_id' => $instructor->professional_id,
                'contract_type'   => $instructor->contract_type,
                'salary'          => $instructor->salary,
                'hired_at'        => $instructor->hired_at?->format('Y-m-d'),
                'bio'             => $instructor->bio,
                'notes'           => $instructor->notes,
                'specialties'     => $instructor->specialties->pluck('specialty')->toArray(),
                'availability'    => $instructor->availability->map(fn($a) => [
                    'weekday'    => $a->weekday,
                    'start_time' => substr($a->start_time, 0, 5),
                    'end_time'   => substr($a->end_time, 0, 5),
                ])->toArray(),
            ],
        ]);
    }

    public function update(Request $request, Instructor $instructor)
    {
        $data = $request->validate([
            'name'            => ['required', 'string', 'max:255'],
            'email'           => ['required', 'email', Rule::unique('users','email')->ignore($instructor->user_id)],
            'cpf'             => ['nullable', 'string', 'max:14', Rule::unique('instructors','cpf')->ignore($instructor->id)],
            'phone'           => ['nullable', 'string', 'max:20'],
            'birth_date'      => ['nullable', 'date'],
            'council_type'    => ['nullable', 'string', 'max:20'],
            'professional_id' => ['nullable', 'string', 'max:30'],
            'contract_type'   => ['nullable', Rule::in(['clt', 'pj', 'autonomo'])],
            'salary'          => ['nullable', 'numeric', 'min:0'],
            'hired_at'        => ['nullable', 'date'],
            'bio'             => ['nullable', 'string'],
            'notes'           => ['nullable', 'string'],
            'specialties'     => ['nullable', 'array'],
            'specialties.*'   => ['string', 'max:100'],
            'availability'              => ['nullable', 'array'],
            'availability.*.weekday'    => ['required', 'integer', 'min:0', 'max:6'],
            'availability.*.start_time' => ['required', 'date_format:H:i'],
            'availability.*.end_time'   => ['required', 'date_format:H:i'],
        ]);

        DB::transaction(function () use ($data, $instructor) {
            $instructor->user->update(['name' => $data['name'], 'email' => $data['email']]);
            $instructor->update(
                collect($data)->except(['name','email','specialties','availability'])->toArray()
            );
            $instructor->specialties()->delete();
            foreach ($data['specialties'] ?? [] as $s) {
                $instructor->specialties()->create(['specialty' => $s]);
            }
            $instructor->availability()->delete();
            foreach ($data['availability'] ?? [] as $slot) {
                $instructor->availability()->create($slot);
            }
        });

        return redirect()->route('instructors.index')
            ->with('success', 'Instrutor atualizado com sucesso.');
    }

    public function destroy(Instructor $instructor)
    {
        $instructor->user->delete();
        $instructor->delete();
        return redirect()->route('instructors.index')->with('success', 'Instrutor removido.');
    }
}