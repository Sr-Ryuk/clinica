<?php

namespace App\Http\Controllers\Api\V1\Enrollments;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ─────────────────────────────────────────────────────────────
// PATCH /api/v1/enrollments/{enrollment}/confirm
// ─────────────────────────────────────────────────────────────
class ConfirmEnrollmentController extends Controller
{
    public function __invoke(Enrollment $enrollment): JsonResponse
    {
        if ($enrollment->status !== 'agendada') {
            return response()->json([
                'message' => "Não é possível confirmar uma aula com status '{$enrollment->status}'.",
            ], 422);
        }

        $enrollment->confirm();

        return response()->json([
            'message' => 'Presença confirmada.',
            'status'  => $enrollment->status,
        ]);
    }
}
