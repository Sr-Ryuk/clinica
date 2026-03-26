<?php

namespace Database\Seeders;

use App\Models\Instructor;
use App\Models\InstructorAvailability;
use App\Models\InstructorSpecialty;
use App\Models\User;
use Illuminate\Database\Seeder;

class InstructorSeeder extends Seeder
{
    public function run(): void
    {
        // ── Fernanda Silva — Pilates ──────────────────────────
        $fernanda = User::where('email', 'fernanda@clinica.local')->first();

        $instFernanda = Instructor::create([
            'user_id'         => $fernanda->id,
            'cpf'             => '111.222.333-44',
            'phone'           => '(35) 99101-0001',
            'birth_date'      => '1988-04-15',
            'council_type'    => 'CREFITO',
            'professional_id' => 'CREFITO-4/12345-F',
            'contract_type'   => 'clt',
            'salary'          => 3500.00,
            'hired_at'        => '2022-03-01',
            'bio'             => 'Especialista em Pilates Solo e Reformer com 8 anos de experiência.',
        ]);

        InstructorSpecialty::insert([
            ['instructor_id' => $instFernanda->id, 'specialty' => 'Pilates Solo', 'created_at' => now(), 'updated_at' => now()],
            ['instructor_id' => $instFernanda->id, 'specialty' => 'Pilates Reformer', 'created_at' => now(), 'updated_at' => now()],
            ['instructor_id' => $instFernanda->id, 'specialty' => 'Pilates Cadillac', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Disponibilidade: Seg a Sex das 07h às 13h
        foreach ([1, 2, 3, 4, 5] as $dia) {
            InstructorAvailability::create([
                'instructor_id' => $instFernanda->id,
                'weekday'       => $dia,
                'start_time'    => '07:00',
                'end_time'      => '13:00',
            ]);
        }

        // ── Ricardo Souza — Fisioterapia ──────────────────────
        $ricardo = User::where('email', 'ricardo@clinica.local')->first();

        $instRicardo = Instructor::create([
            'user_id'         => $ricardo->id,
            'cpf'             => '222.333.444-55',
            'phone'           => '(35) 99101-0002',
            'birth_date'      => '1985-09-22',
            'council_type'    => 'CREFITO',
            'professional_id' => 'CREFITO-4/67890-F',
            'contract_type'   => 'clt',
            'salary'          => 4200.00,
            'hired_at'        => '2021-06-15',
            'bio'             => 'Fisioterapeuta com pós-graduação em RPG e Pilates Clínico.',
        ]);

        InstructorSpecialty::insert([
            ['instructor_id' => $instRicardo->id, 'specialty' => 'Fisioterapia Ortopédica', 'created_at' => now(), 'updated_at' => now()],
            ['instructor_id' => $instRicardo->id, 'specialty' => 'Pilates Clínico', 'created_at' => now(), 'updated_at' => now()],
            ['instructor_id' => $instRicardo->id, 'specialty' => 'RPG', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Disponibilidade: Seg a Sex das 13h às 20h + Sáb das 08h às 12h
        foreach ([1, 2, 3, 4, 5] as $dia) {
            InstructorAvailability::create([
                'instructor_id' => $instRicardo->id,
                'weekday'       => $dia,
                'start_time'    => '13:00',
                'end_time'      => '20:00',
            ]);
        }
        InstructorAvailability::create([
            'instructor_id' => $instRicardo->id,
            'weekday'       => 6, // Sábado
            'start_time'    => '08:00',
            'end_time'      => '12:00',
        ]);

        // ── Beatriz Costa — Pilates + Quiropraxia ────────────
        $beatriz = User::where('email', 'beatriz@clinica.local')->first();

        $instBeatriz = Instructor::create([
            'user_id'         => $beatriz->id,
            'cpf'             => '333.444.555-66',
            'phone'           => '(35) 99101-0003',
            'birth_date'      => '1992-01-30',
            'council_type'    => 'CREFITO',
            'professional_id' => 'CREFITO-4/11111-F',
            'contract_type'   => 'pj',
            'salary'          => 3800.00,
            'hired_at'        => '2023-01-10',
            'bio'             => 'Instrutora de Pilates e técnicas de Quiropraxia postural.',
        ]);

        InstructorSpecialty::insert([
            ['instructor_id' => $instBeatriz->id, 'specialty' => 'Pilates Reformer', 'created_at' => now(), 'updated_at' => now()],
            ['instructor_id' => $instBeatriz->id, 'specialty' => 'Pilates Chair', 'created_at' => now(), 'updated_at' => now()],
            ['instructor_id' => $instBeatriz->id, 'specialty' => 'Quiropraxia Postural', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Disponibilidade: Ter, Qui, Sáb das 08h às 18h
        foreach ([2, 4, 6] as $dia) {
            InstructorAvailability::create([
                'instructor_id' => $instBeatriz->id,
                'weekday'       => $dia,
                'start_time'    => '08:00',
                'end_time'      => '18:00',
            ]);
        }
    }
}
