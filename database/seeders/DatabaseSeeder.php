<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,       // 1. usuários base (gestor, recepção, instrutores, alunos)
            InstructorSeeder::class, // 2. perfis de instrutor (depende de users)
            PlanSeeder::class,       // 3. planos da clínica
            RoomSeeder::class,       // 4. salas e aparelhos
            StudentSeeder::class,    // 5. alunos com planos (depende de plans)
        ]);
    }
}
