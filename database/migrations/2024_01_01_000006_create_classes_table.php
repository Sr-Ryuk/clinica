<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Aulas (template) ─────────────────────────────────────
        // Representa o "slot" de aula, não a ocorrência individual.
        // Aulas recorrentes: is_recurring=true, weekday preenchido.
        // Aulas avulsas: is_recurring=false, specific_date preenchido.
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained();
            $table->foreignId('room_id')->constrained();

            $table->enum('modality', [
                'pilates',
                'fisioterapia',
                'quiropraxia',
                'avaliacao',    // sessão de avaliação inicial
            ]);

            $table->enum('session_type', [
                'individual',
                'dupla',
                'trio',
                'grupo',
            ])->default('individual');

            $table->tinyInteger('max_students')->default(1);

            // Recorrência
            $table->boolean('is_recurring')->default(true);
            $table->tinyInteger('weekday')->nullable(); // 0=Dom...6=Sáb (se recorrente)
            $table->time('start_time');
            $table->time('end_time');

            // Data específica (se avulsa ou exceção de recorrente)
            $table->date('specific_date')->nullable();

            // Período de vigência da aula recorrente
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();

            $table->boolean('active')->default(true);
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['instructor_id', 'weekday']);
            $table->index(['room_id', 'weekday']);
            $table->index('specific_date');
        });

        // ── Equipamentos necessários por aula ────────────────────
        Schema::create('class_equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('equipment_id')->constrained();
            $table->tinyInteger('quantity_needed')->default(1);
            $table->timestamps();

            $table->unique(['class_id', 'equipment_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_equipment');
        Schema::dropIfExists('classes');
    }
};
