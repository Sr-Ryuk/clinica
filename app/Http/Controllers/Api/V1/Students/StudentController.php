<?php

namespace App\Http\Controllers\Api\V1\Students;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    // GET /api/v1/students
    public function index(Request $request): AnonymousResourceCollection
    {
        $students = Student::with(['user', 'activePlan.plan'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('user', fn($u) => $u->where('name', 'like', "%{$request->search}%"))
                  ->orWhere('cpf', 'like', "%{$request->search}%")
                  ->orWhere('phone', 'like', "%{$request->search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return StudentResource::collection($students);
    }

    // GET /api/v1/students/{student}
    public function show(Student $student): StudentResource
    {
        $student->load(['user', 'activePlan.plan', 'evolutions' => fn($q) => $q->limit(5)]);

        return new StudentResource($student);
    }

    // POST /api/v1/students
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $student = DB::transaction(function () use ($request) {

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password ?? str()->random(12)),
                'role'     => 'aluno',
                'active'   => true,
            ]);

            return Student::create(array_merge(
                $request->except(['name', 'email', 'password']),
                [
                    'user_id'   => $user->id,
                    'status'    => $request->status ?? 'lead',
                    'joined_at' => $request->joined_at ?? now()->toDateString(),
                ]
            ));
        });

        $student->load(['user', 'activePlan.plan']);

        return (new StudentResource($student))
            ->response()
            ->setStatusCode(201);
    }

    // PUT/PATCH /api/v1/students/{student}
    public function update(UpdateStudentRequest $request, Student $student): StudentResource
    {
        DB::transaction(function () use ($request, $student) {

            // Atualiza dados do usuário (name/email) se enviados
            if ($request->hasAny(['name', 'email'])) {
                $student->user->update($request->only(['name', 'email']));
            }

            $student->update($request->except(['name', 'email', 'password']));
        });

        $student->load(['user', 'activePlan.plan']);

        return new StudentResource($student);
    }

    // DELETE /api/v1/students/{student}
    public function destroy(Student $student): JsonResponse
    {
        // Soft delete — mantém histórico
        $student->user->delete();
        $student->delete();

        return response()->json(['message' => 'Aluno removido com sucesso.']);
    }
}
