<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enrollment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'class_id',
        'student_id',
        'student_plan_id',
        'scheduled_date',
        'status',
        'is_makeup',
        'makeup_origin_id',
        'makeup_expires_at',
        'confirmed_at',
        'canceled_at',
        'canceled_by',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_date'   => 'date',
            'makeup_expires_at'=> 'date',
            'confirmed_at'     => 'datetime',
            'canceled_at'      => 'datetime',
            'is_makeup'        => 'boolean',
        ];
    }

    // ── Relacionamentos ───────────────────────────────────────

    public function classModel(): BelongsTo
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function studentPlan(): BelongsTo
    {
        return $this->belongsTo(StudentPlan::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Enrollment original que gerou esta reposição
    public function makeupOrigin(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class, 'makeup_origin_id');
    }

    // Reposição gerada a partir deste enrollment
    public function makeup(): HasOne
    {
        return $this->hasOne(Enrollment::class, 'makeup_origin_id');
    }

    public function evolution(): HasOne
    {
        return $this->hasOne(Evolution::class);
    }

    // ── Scopes ────────────────────────────────────────────────

    public function scopeAgendadas($query)
    {
        return $query->whereIn('status', ['agendada', 'confirmada']);
    }

    public function scopeRealizadas($query)
    {
        return $query->where('status', 'realizada');
    }

    public function scopeReposicoesPendentes($query)
    {
        return $query->where('status', 'reposicao_pendente')
                     ->where('makeup_expires_at', '>=', now());
    }

    public function scopeNaData($query, string $date)
    {
        return $query->where('scheduled_date', $date);
    }

    // ── Helpers / Actions ─────────────────────────────────────

    public function confirm(): void
    {
        $this->update([
            'status'       => 'confirmada',
            'confirmed_at' => now(),
        ]);
    }

    public function markAsCompleted(): void
    {
        $this->update(['status' => 'realizada']);
    }

    public function cancel(string $canceledBy, bool $withNotice = true): void
    {
        $status = $withNotice ? 'cancelada_aviso' : 'cancelada_sem_aviso';

        $this->update([
            'status'      => $status,
            'canceled_at' => now(),
            'canceled_by' => $canceledBy,
        ]);

        // Se cancelou com aviso, marca como reposição pendente
        if ($withNotice) {
            $this->update([
                'status'            => 'reposicao_pendente',
                'makeup_expires_at' => now()->addDays(30),
            ]);
        }
    }

    public function hasMakeupAvailable(): bool
    {
        return $this->status === 'reposicao_pendente'
            && $this->makeup_expires_at?->isFuture()
            && ! $this->makeup()->exists();
    }
}
