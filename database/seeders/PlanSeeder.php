<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            // ── Pilates Individual ─────────────────────────────
            [
                'name'              => 'Pilates Individual 2x/semana',
                'modality'          => 'pilates',
                'session_type'      => 'individual',
                'sessions_per_week' => 2,
                'price'             => 480.00,
                'duration_days'     => 30,
                'description'       => 'Aulas individuais de Pilates, 2 vezes por semana.',
            ],
            [
                'name'              => 'Pilates Individual 3x/semana',
                'modality'          => 'pilates',
                'session_type'      => 'individual',
                'sessions_per_week' => 3,
                'price'             => 620.00,
                'duration_days'     => 30,
                'description'       => 'Aulas individuais de Pilates, 3 vezes por semana.',
            ],

            // ── Pilates Dupla ──────────────────────────────────
            [
                'name'              => 'Pilates Dupla 2x/semana',
                'modality'          => 'pilates',
                'session_type'      => 'dupla',
                'sessions_per_week' => 2,
                'price'             => 320.00,
                'duration_days'     => 30,
                'description'       => 'Aulas em dupla de Pilates, 2 vezes por semana.',
            ],
            [
                'name'              => 'Pilates Dupla 3x/semana',
                'modality'          => 'pilates',
                'session_type'      => 'dupla',
                'sessions_per_week' => 3,
                'price'             => 420.00,
                'duration_days'     => 30,
                'description'       => 'Aulas em dupla de Pilates, 3 vezes por semana.',
            ],

            // ── Pilates Trio ───────────────────────────────────
            [
                'name'              => 'Pilates Trio 2x/semana',
                'modality'          => 'pilates',
                'session_type'      => 'trio',
                'sessions_per_week' => 2,
                'price'             => 260.00,
                'duration_days'     => 30,
                'description'       => 'Aulas em trio de Pilates, 2 vezes por semana.',
            ],

            // ── Fisioterapia ───────────────────────────────────
            [
                'name'              => 'Fisioterapia Individual 2x/semana',
                'modality'          => 'fisioterapia',
                'session_type'      => 'individual',
                'sessions_per_week' => 2,
                'price'             => 560.00,
                'duration_days'     => 30,
                'description'       => 'Sessões individuais de Fisioterapia, 2 vezes por semana.',
            ],
            [
                'name'              => 'Fisioterapia Individual 3x/semana',
                'modality'          => 'fisioterapia',
                'session_type'      => 'individual',
                'sessions_per_week' => 3,
                'price'             => 720.00,
                'duration_days'     => 30,
                'description'       => 'Sessões individuais de Fisioterapia, 3 vezes por semana.',
            ],

            // ── Quiropraxia ────────────────────────────────────
            [
                'name'              => 'Quiropraxia 1x/semana',
                'modality'          => 'quiropraxia',
                'session_type'      => 'individual',
                'sessions_per_week' => 1,
                'price'             => 280.00,
                'duration_days'     => 30,
                'description'       => 'Sessão individual de Quiropraxia, 1 vez por semana.',
            ],
            [
                'name'              => 'Quiropraxia 2x/semana',
                'modality'          => 'quiropraxia',
                'session_type'      => 'individual',
                'sessions_per_week' => 2,
                'price'             => 480.00,
                'duration_days'     => 30,
                'description'       => 'Sessão individual de Quiropraxia, 2 vezes por semana.',
            ],

            // ── Combo ──────────────────────────────────────────
            [
                'name'              => 'Combo Pilates + Fisioterapia',
                'modality'          => 'combo',
                'session_type'      => 'individual',
                'sessions_per_week' => 3,
                'price'             => 890.00,
                'duration_days'     => 30,
                'description'       => 'Pilates 2x + Fisioterapia 1x por semana.',
            ],
        ];

        foreach ($plans as $plan) {
            Plan::create(array_merge($plan, ['active' => true]));
        }
    }
}
