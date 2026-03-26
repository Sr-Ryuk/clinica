<?php

namespace App\Http\Controllers\Api\V1\Evolutions;

use App\Http\Controllers\Controller;
use App\Models\Evolution;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EvolutionController extends Controller
{
    public function index(Student $student): JsonResponse
    {
        $evolutions = $student->evolutions()
            ->with('instructor.user')
            ->get()
            ->map(fn($e) => $this->format($e));

        return response()->json($evolutions);
    }

    public function show(Student $student, Evolution $evolution): JsonResponse
    {
        $evolution->load('instructor.user');

        return response()->json($this->format($evolution));
    }

    public function store(Request $request, Student $student): JsonResponse
    {
        $data = $request->validate([
            'enrollment_id' => ['nullable', 'exists:enrollments,id'],
            'record_date'   => ['required', 'date'],
            'weight_kg'     => ['nullable', 'numeric', 'min:0'],
            'height_cm'     => ['nullable', 'numeric', 'min:0'],
            'measurements'  => ['nullable', 'array'],
            'observations'  => ['required', 'string'],
            'goals'         => ['nullable', 'string'],
            'pain_level'    => ['nullable', 'integer', 'min:0', 'max:10'],
        ]);

        $instructor = $request->user()->instructor;

        if (! $instructor) {
            return response()->json(['message' => 'Apenas instrutores podem registrar evoluções.'], 403);
        }

        $evolution = Evolution::create(array_merge($data, [
            'student_id'    => $student->id,
            'instructor_id' => $instructor->id,
        ]));

        // Marca o enrollment como realizado se informado
        if ($data['enrollment_id'] ?? null) {
            \App\Models\Enrollment::find($data['enrollment_id'])
                ?->markAsCompleted();
        }

        $evolution->load('instructor.user');

        return response()->json($this->format($evolution), 201);
    }

    public function update(Request $request, Student $student, Evolution $evolution): JsonResponse
    {
        $data = $request->validate([
            'weight_kg'    => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'height_cm'    => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'measurements' => ['sometimes', 'nullable', 'array'],
            'observations' => ['sometimes', 'string'],
            'goals'        => ['sometimes', 'nullable', 'string'],
            'pain_level'   => ['sometimes', 'nullable', 'integer', 'min:0', 'max:10'],
        ]);

        $evolution->update($data);
        $evolution->load('instructor.user');

        return response()->json($this->format($evolution));
    }

    private function format(Evolution $e): array
    {
        return [
            'id'            => $e->id,
            'record_date'   => $e->record_date->format('Y-m-d'),
            'instructor'    => $e->instructor?->user?->name,
            'weight_kg'     => $e->weight_kg,
            'height_cm'     => $e->height_cm,
            'measurements'  => $e->measurements,
            'observations'  => $e->observations,
            'goals'         => $e->goals,
            'pain_level'    => $e->pain_level,
            'created_at'    => $e->created_at->format('Y-m-d H:i'),
        ];
    }
}
