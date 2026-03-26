<?php

namespace App\Http\Controllers\Api\V1\Enrollments;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ─────────────────────────────────────────────────────────────
// PATCH /api/v1/enrollments/{enrollment}/cancel
// Body: { "canceled_by": "aluno|instrutor|recepcao", "with_notice": true }
// ─────────────────────────────────────────────────────────────
class CancelEnrollmentController extends Controller
{
    public function __invoke(Request $request, Enrollment $enrollment): JsonResponse
    {
        $data = $request->validate([
            'canceled_by' => ['required', 'in:aluno,instrutor,recepcao'],
            'with_notice' => ['required', 'boolean'],
        ]);

        if (in_array($enrollment->status, ['realizada', 'cancelada_aviso', 'cancelada_sem_aviso'])) {
            return response()->json([
                'message' => "Não é possível cancelar uma aula com status '{$enrollment->status}'.",
            ], 422);
        }

        $enrollment->cancel($data['canceled_by'], $data['with_notice']);

        $message = $data['with_notice']
            ? 'Aula cancelada. Reposição disponível por 30 dias.'
            : 'Aula cancelada sem aviso. Sem direito a reposição.';

        return response()->json([
            'message'           => $message,
            'status'            => $enrollment->fresh()->status,
            'makeup_expires_at' => $enrollment->fresh()->makeup_expires_at?->format('Y-m-d'),
        ]);
    }
}
