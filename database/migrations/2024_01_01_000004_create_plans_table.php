<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Planos da clínica ────────────────────────────────────
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');                           // ex: "Pilates Dupla 2x/semana"

            $table->enum('modality', [
                'pilates',
                'fisioterapia',
                'quiropraxia',
                'combo',           // mais de uma modalidade
            ]);

            $table->enum('session_type', [
                'individual',
                'dupla',
                'trio',
                'grupo',
            ])->default('individual');

            $table->tinyInteger('sessions_per_week')->default(2);  // aulas por semana
            $table->decimal('price', 10, 2);                       // valor padrão do plano
            $table->integer('duration_days')->default(30);         // vigência em dias

            $table->text('description')->nullable();
            $table->boolean('active')->default(true);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['modality', 'active']);
        });

        // ── Planos contratados por aluno ─────────────────────────
        Schema::create('student_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained();

            $table->date('starts_at');
            $table->date('ends_at');

            // Forma de pagamento preferida deste aluno neste plano
            $table->enum('payment_method', [
                'pix',
                'dinheiro',
                'cartao_credito',
                'cartao_debito',
                'boleto',
                'transferencia',
            ])->default('pix');

            $table->tinyInteger('payment_day')->default(10); // dia do vencimento (1-31)

            // Valor real cobrado (pode ser diferente do plano padrão — negociação)
            $table->decimal('price_override', 10, 2)->nullable();

            $table->enum('status', [
                'ativo',
                'suspenso',     // inadimplente mas não cancelado
                'cancelado',
                'encerrado',    // vigência expirada normalmente
            ])->default('ativo');

            $table->text('notes')->nullable(); // ex: "desconto familiar"
            $table->foreignId('created_by')->constrained('users'); // quem cadastrou

            $table->timestamps();
            $table->softDeletes();

            $table->index(['student_id', 'status']);
            $table->index('ends_at'); // útil para alertas de vencimento
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_plans');
        Schema::dropIfExists('plans');
    }
};
