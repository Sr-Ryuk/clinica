<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Salas ────────────────────────────────────────────────
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');                    // ex: "Sala Reformer 1", "Sala Solo"
            $table->integer('capacity')->default(1);   // quantas pessoas cabem
            $table->text('description')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // ── Aparelhos / Equipamentos ─────────────────────────────
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained();

            $table->string('name');                    // ex: "Reformer", "Cadillac", "Barrel"
            $table->string('type')->nullable();        // categoria livre: "aparelho", "acessório"
            $table->integer('quantity')->default(1);   // quantas unidades existem nessa sala
            $table->string('brand')->nullable();
            $table->string('serial_number')->nullable();
            $table->date('purchase_date')->nullable();
            $table->date('last_maintenance_at')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('active')->default(true);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['room_id', 'active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment');
        Schema::dropIfExists('rooms');
    }
};
