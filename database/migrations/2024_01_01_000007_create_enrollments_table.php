<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Agendamentos (ocorrências de aula por aluno) ──────────
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained();
            $table->foreignId('student_id')->constrained();
            $table->foreignId('student_plan_id')->constrained();

            // Data real desta ocorrência
            $table->date('scheduled_date');

            $table->enum('status', [
                'agendada',
                'confirmada',        // aluno confirmou presença
                'realizada',         // aula aconteceu
                'cancelada_aviso',   // cancelou com antecedência → gera reposição
                'cancelada_sem_aviso', // faltou sem avisar → sem reposição
                'reposicao_pendente', // cancelou com aviso, reposição ainda não agendada
            ])->default('agendada');

            // Reposição
            $table->boolean('is_makeup')->default(false);
            // Se é reposição, aponta para o enrollment original que gerou a falta
            $table->foreignId('makeup_origin_id')
                  ->nullable()
                  ->constrained('enrollments')
                  ->nullOnDelete();
            $table->date('makeup_expires_at')->nullable(); // prazo para usar a reposição

            // Timestamps de ação
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('canceled_at')->nullable();
            $table->string('canceled_by')->nullable(); // "aluno", "instrutor", "recepcao"

            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['student_id', 'scheduled_date']);
            $table->index(['class_id', 'scheduled_date']);
            $table->index('status');
            $table->index('makeup_expires_at');

            // Garante que o mesmo aluno não pode ter dois agendamentos
            // na mesma aula no mesmo dia
            $table->unique(['class_id', 'student_id', 'scheduled_date']);
        });

        // ── Evoluções dos alunos ─────────────────────────────────
        Schema::create('evolutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained();
            $table->foreignId('instructor_id')->constrained();
            $table->foreignId('enrollment_id')->nullable()->constrained()->nullOnDelete();

            $table->date('record_date');

            // Dados físicos (opcionais — variam por modalidade)
            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->decimal('height_cm', 5, 1)->nullable();

            // Medidas e indicadores em JSON (flexível por modalidade)
            // Pilates: flexibilidade, amplitude de movimento
            // Fisio: força muscular, amplitude articular
            // Quiro: postura, dor (escala 0-10)
            $table->json('measurements')->nullable();

            $table->text('observations');   // relato do instrutor
            $table->text('goals')->nullable(); // metas definidas nesta sessão
            $table->tinyInteger('pain_level')->nullable(); // 0-10

            $table->timestamps();
            $table->softDeletes();

            $table->index(['student_id', 'record_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evolutions');
        Schema::dropIfExists('enrollments');
    }
};
