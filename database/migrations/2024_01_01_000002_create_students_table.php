<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Dados pessoais
            $table->string('cpf', 14)->unique()->nullable();
            $table->string('rg', 20)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('phone_secondary', 20)->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['M', 'F', 'outro'])->nullable();

            // Endereço
            $table->string('zip_code', 10)->nullable();
            $table->string('address')->nullable();
            $table->string('address_number', 10)->nullable();
            $table->string('address_complement')->nullable();
            $table->string('neighborhood')->nullable();
            $table->string('city')->nullable();
            $table->string('state', 2)->nullable();

            // Contato de emergência
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone', 20)->nullable();
            $table->string('emergency_contact_relation')->nullable();

            // Informações de saúde (importantes para pilates/fisio)
            $table->text('health_notes')->nullable();           // histórico de saúde geral
            $table->text('injury_history')->nullable();        // histórico de lesões
            $table->text('physical_restrictions')->nullable(); // restrições físicas
            $table->text('medications')->nullable();           // medicamentos em uso
            $table->string('doctor_name')->nullable();         // médico responsável
            $table->string('doctor_phone', 20)->nullable();

            // Status do aluno na clínica
            $table->enum('status', ['ativo', 'suspenso', 'inativo', 'lead'])
                  ->default('lead');
            $table->date('joined_at')->nullable();
            $table->string('how_found_us')->nullable(); // como conheceu a clínica

            $table->string('photo_path')->nullable();
            $table->text('notes')->nullable(); // observações internas da recepção

            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('cpf');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
