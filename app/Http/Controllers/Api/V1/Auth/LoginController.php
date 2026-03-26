<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function __invoke(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais informadas estão incorretas.'],
            ]);
        }

        if (! $user->active) {
            throw ValidationException::withMessages([
                'email' => ['Usuário inativo. Entre em contato com a clínica.'],
            ]);
        }

        // Remove tokens antigos do mesmo device (evita acúmulo)
        $user->tokens()->where('name', $request->device_name ?? 'web')->delete();

        $token = $user->createToken(
            $request->device_name ?? 'web',
            $this->abilitiesFor($user->role)
        );

        return response()->json([
            'token' => $token->plainTextToken,
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ]);
    }

    // Define as habilidades do token por role
    // Útil para limitar o que cada token pode fazer na API
    private function abilitiesFor(string $role): array
    {
        return match ($role) {
            'gestor'         => ['*'],  // acesso total
            'recepcionista'  => ['students:read', 'students:write', 'enrollments:write', 'schedule:read'],
            'instrutor'      => ['schedule:read', 'enrollments:read', 'evolutions:write'],
            'aluno'          => ['schedule:read', 'evolutions:read'],
            default          => [],
        };
    }
}
