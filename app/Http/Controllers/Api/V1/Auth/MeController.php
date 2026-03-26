<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user()->load([
            'student',
            'instructor.specialties',
        ]);

        return response()->json([
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role'       => $user->role,
            'student'    => $user->student?->only(['id', 'status', 'phone']),
            'instructor' => $user->instructor ? [
                'id'          => $user->instructor->id,
                'specialties' => $user->instructor->specialties->pluck('specialty'),
            ] : null,
        ]);
    }
}
