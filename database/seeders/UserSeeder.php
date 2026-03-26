<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Gestor ────────────────────────────────────────────
        User::create([
            'name'     => 'Admin Gestor',
            'email'    => 'gestor@clinica.local',
            'password' => Hash::make('password'),
            'role'     => 'gestor',
            'active'   => true,
        ]);

        // ── Recepcionistas ────────────────────────────────────
        User::create([
            'name'     => 'Ana Recepção',
            'email'    => 'ana@clinica.local',
            'password' => Hash::make('password'),
            'role'     => 'recepcionista',
            'active'   => true,
        ]);

        User::create([
            'name'     => 'Carla Recepção',
            'email'    => 'carla@clinica.local',
            'password' => Hash::make('password'),
            'role'     => 'recepcionista',
            'active'   => true,
        ]);

        // ── Instrutores ───────────────────────────────────────
        // Os perfis completos são criados no InstructorSeeder
        User::create([
            'name'     => 'Fernanda Silva',
            'email'    => 'fernanda@clinica.local',
            'password' => Hash::make('password'),
            'role'     => 'instrutor',
            'active'   => true,
        ]);

        User::create([
            'name'     => 'Ricardo Souza',
            'email'    => 'ricardo@clinica.local',
            'password' => Hash::make('password'),
            'role'     => 'instrutor',
            'active'   => true,
        ]);

        User::create([
            'name'     => 'Beatriz Costa',
            'email'    => 'beatriz@clinica.local',
            'password' => Hash::make('password'),
            'role'     => 'instrutor',
            'active'   => true,
        ]);

        // ── Alunos (usuários base — perfil completo no StudentSeeder) ──
        $alunos = [
            ['name' => 'Juliana Martins',  'email' => 'juliana@exemplo.com'],
            ['name' => 'Carlos Oliveira',  'email' => 'carlos@exemplo.com'],
            ['name' => 'Patrícia Rocha',   'email' => 'patricia@exemplo.com'],
            ['name' => 'Marcos Ferreira',  'email' => 'marcos@exemplo.com'],
            ['name' => 'Luciana Alves',    'email' => 'luciana@exemplo.com'],
            ['name' => 'Roberto Lima',     'email' => 'roberto@exemplo.com'],
            ['name' => 'Sandra Pereira',   'email' => 'sandra@exemplo.com'],
            ['name' => 'Felipe Gomes',     'email' => 'felipe@exemplo.com'],
        ];

        foreach ($alunos as $aluno) {
            User::create([
                'name'     => $aluno['name'],
                'email'    => $aluno['email'],
                'password' => Hash::make('password'),
                'role'     => 'aluno',
                'active'   => true,
            ]);
        }
    }
}
