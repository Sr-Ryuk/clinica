<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        // ── Sala Reformer ─────────────────────────────────────
        $salaReformer = Room::create([
            'name'        => 'Sala Reformer',
            'capacity'    => 4,
            'description' => 'Sala principal com aparelhos Reformer.',
            'active'      => true,
        ]);

        Equipment::insert([
            [
                'room_id'   => $salaReformer->id,
                'name'      => 'Reformer',
                'type'      => 'aparelho',
                'quantity'  => 4,
                'brand'     => 'Balanced Body',
                'active'    => true,
                'created_at'=> now(), 'updated_at' => now(),
            ],
            [
                'room_id'   => $salaReformer->id,
                'name'      => 'Box',
                'type'      => 'acessório',
                'quantity'  => 4,
                'brand'     => null,
                'active'    => true,
                'created_at'=> now(), 'updated_at' => now(),
            ],
        ]);

        // ── Sala Solo ─────────────────────────────────────────
        $salaSolo = Room::create([
            'name'        => 'Sala Solo',
            'capacity'    => 6,
            'description' => 'Sala de Pilates Solo com colchonetes e acessórios.',
            'active'      => true,
        ]);

        Equipment::insert([
            [
                'room_id'   => $salaSolo->id,
                'name'      => 'Colchonete',
                'type'      => 'acessório',
                'quantity'  => 8,
                'brand'     => null,
                'active'    => true,
                'created_at'=> now(), 'updated_at' => now(),
            ],
            [
                'room_id'   => $salaSolo->id,
                'name'      => 'Barrel',
                'type'      => 'aparelho',
                'quantity'  => 2,
                'brand'     => 'Balanced Body',
                'active'    => true,
                'created_at'=> now(), 'updated_at' => now(),
            ],
            [
                'room_id'   => $salaSolo->id,
                'name'      => 'Magic Circle',
                'type'      => 'acessório',
                'quantity'  => 6,
                'brand'     => null,
                'active'    => true,
                'created_at'=> now(), 'updated_at' => now(),
            ],
        ]);

        // ── Sala Cadillac / Fisioterapia ──────────────────────
        $salaFisio = Room::create([
            'name'        => 'Sala Cadillac',
            'capacity'    => 2,
            'description' => 'Sala com Cadillac e aparelhos de fisioterapia.',
            'active'      => true,
        ]);

        Equipment::insert([
            [
                'room_id'   => $salaFisio->id,
                'name'      => 'Cadillac',
                'type'      => 'aparelho',
                'quantity'  => 1,
                'brand'     => 'Gratz',
                'active'    => true,
                'created_at'=> now(), 'updated_at' => now(),
            ],
            [
                'room_id'   => $salaFisio->id,
                'name'      => 'Chair',
                'type'      => 'aparelho',
                'quantity'  => 1,
                'brand'     => 'Balanced Body',
                'active'    => true,
                'created_at'=> now(), 'updated_at' => now(),
            ],
            [
                'room_id'   => $salaFisio->id,
                'name'      => 'Maca de Fisioterapia',
                'type'      => 'equipamento',
                'quantity'  => 1,
                'brand'     => null,
                'active'    => true,
                'created_at'=> now(), 'updated_at' => now(),
            ],
        ]);
    }
}
