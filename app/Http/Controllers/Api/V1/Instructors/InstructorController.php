<?php

namespace App\Http\Controllers\Api\V1\Instructors;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class InstructorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $instructors = Instructor::with(['user', 'specialties', 'availability'])
            ->when($request->search, fn($q) =>
                $q->whereHas('user', fn($u) =>
                    $u->where('name', 'like', "%{$request->search}%")
                )
            )
            ->get()
            ->map(fn($i) => $this->format($i));

        return response()->json($instructors);
    }

    public function show(Instructor $instructor): JsonResponse
    {
        $instructor->load(['user', 'specialties', 'availability']);

        return response()->json($this->format($instructor, full: true));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'            => ['required', 'string', 'max:255'],
            'email'           => ['required', 'email', 'unique:users,email'],
            'password'        => ['nullable', 'string', 'min:8'],
            'cpf'             => ['nullable', 'string', 'size:14', 'unique:instructors,cpf'],
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
            'availability'    => ['nullable', 'array'],
            'availability.*.weekday'    => ['required', 'integer', 'min:0', 'max:6'],
            'availability.*.start_time' => ['required', 'date_format:H:i'],
            'availability.*.end_time'   => ['required', 'date_format:H:i', 'after:availability.*.start_time'],
        ]);

        $instructor = DB::transaction(function () use ($data, $request) {
            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password'] ?? str()->random(12)),
                'role'     => 'instrutor',
                'active'   => true,
            ]);

            $instructor = Instructor::create(array_merge(
                collect($data)->except(['name', 'email', 'password', 'specialties', 'availability'])->toArray(),
                ['user_id' => $user->id]
            ));

            if (! empty($data['specialties'])) {
                foreach ($data['specialties'] as $specialty) {
                    $instructor->specialties()->create(['specialty' => $specialty]);
                }
            }

            if (! empty($data['availability'])) {
                foreach ($data['availability'] as $slot) {
                    $instructor->availability()->create($slot);
                }
            }

            return $instructor;
        });

        $instructor->load(['user', 'specialties', 'availability']);

        return response()->json($this->format($instructor, full: true), 201);
    }

    public function update(Request $request, Instructor $instructor): JsonResponse
    {
        $data = $request->validate([
            'name'            => ['sometimes', 'string', 'max:255'],
            'email'           => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($instructor->user_id)],
            'cpf'             => ['sometimes', 'nullable', 'string', Rule::unique('instructors', 'cpf')->ignore($instructor->id)],
            'phone'           => ['sometimes', 'nullable', 'string', 'max:20'],
            'birth_date'      => ['sometimes', 'nullable', 'date'],
            'council_type'    => ['sometimes', 'nullable', 'string', 'max:20'],
            'professional_id' => ['sometimes', 'nullable', 'string', 'max:30'],
            'contract_type'   => ['sometimes', Rule::in(['clt', 'pj', 'autonomo'])],
            'salary'          => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'hired_at'        => ['sometimes', 'nullable', 'date'],
            'bio'             => ['sometimes', 'nullable', 'string'],
            'notes'           => ['sometimes', 'nullable', 'string'],
            'specialties'     => ['sometimes', 'array'],
            'specialties.*'   => ['string', 'max:100'],
            'availability'    => ['sometimes', 'array'],
            'availability.*.weekday'    => ['required_with:availability', 'integer', 'min:0', 'max:6'],
            'availability.*.start_time' => ['required_with:availability', 'date_format:H:i'],
            'availability.*.end_time'   => ['required_with:availability', 'date_format:H:i'],
        ]);

        DB::transaction(function () use ($data, $instructor) {
            if (isset($data['name']) || isset($data['email'])) {
                $instructor->user->update(collect($data)->only(['name', 'email'])->toArray());
            }

            $instructor->update(
                collect($data)->except(['name', 'email', 'specialties', 'availability'])->toArray()
            );

            if (isset($data['specialties'])) {
                $instructor->specialties()->delete();
                foreach ($data['specialties'] as $specialty) {
                    $instructor->specialties()->create(['specialty' => $specialty]);
                }
            }

            if (isset($data['availability'])) {
                $instructor->availability()->delete();
                foreach ($data['availability'] as $slot) {
                    $instructor->availability()->create($slot);
                }
            }
        });

        $instructor->load(['user', 'specialties', 'availability']);

        return response()->json($this->format($instructor, full: true));
    }

    public function destroy(Instructor $instructor): JsonResponse
    {
        $instructor->user->delete();
        $instructor->delete();

        return response()->json(['message' => 'Instrutor removido com sucesso.']);
    }

    private function format(Instructor $i, bool $full = false): array
    {
        $base = [
            'id'              => $i->id,
            'name'            => $i->user->name,
            'email'           => $i->user->email,
            'phone'           => $i->phone,
            'council_type'    => $i->council_type,
            'professional_id' => $i->professional_id,
            'contract_type'   => $i->contract_type,
            'specialties'     => $i->specialties->pluck('specialty'),
            'availability'    => $i->availability->map(fn($a) => [
                'weekday'    => $a->weekday,
                'weekday_name' => $a->weekday_name,
                'start_time' => $a->start_time,
                'end_time'   => $a->end_time,
            ]),
        ];

        if ($full) {
            $base = array_merge($base, [
                'cpf'        => $i->cpf,
                'birth_date' => $i->birth_date?->format('Y-m-d'),
                'salary'     => $i->salary,
                'hired_at'   => $i->hired_at?->format('Y-m-d'),
                'bio'        => $i->bio,
                'notes'      => $i->notes,
            ]);
        }

        return $base;
    }
}
