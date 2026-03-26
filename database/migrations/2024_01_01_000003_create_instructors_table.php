<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Instrutores ──────────────────────────────────────────
        Schema::create('instructors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('cpf', 14)->unique()->nullable();
            $table->string('phone', 20)->nullable();
            $table->date('birth_date')->nullable();

            // Registro profissional
            $table->string('council_type', 20)->nullable(); // CREFITO, CRM, CRF...
            $table->string('professional_id', 30)->nullable(); // número do registro

            // Contrato / Financeiro
            $table->enum('contract_type', ['clt', 'pj', 'autonomo'])->default('clt');
            $table->decimal('salary', 10, 2)->default(0);
            $table->date('hired_at')->nullable();

            $table->string('photo_path')->nullable();
            $table->text('bio')->nullable(); // bio curta para área do aluno (futuro)
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        // ── Especialidades do instrutor ──────────────────────────
        Schema::create('instructor_specialties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained()->cascadeOnDelete();
            // ex: "Pilates Solo", "Pilates Reformer", "Fisioterapia Neurológica"
            $table->string('specialty');
            $table->timestamps();
        });

        // ── Disponibilidade semanal do instrutor ─────────────────
        Schema::create('instructor_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained()->cascadeOnDelete();

            // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
            $table->tinyInteger('weekday');
            $table->time('start_time');
            $table->time('end_time');

            $table->timestamps();

            $table->index(['instructor_id', 'weekday']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instructor_availability');
        Schema::dropIfExists('instructor_specialties');
        Schema::dropIfExists('instructors');
    }
};
