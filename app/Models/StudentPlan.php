<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'plan_id',
        'starts_at',
        'ends_at',
        'payment_method',
        'payment_day',
        'price_override',
        'status',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'starts_at'      => 'date',
            'ends_at'        => 'date',
            'price_override' => 'decimal:2',
        ];
    }

    // ── Relacionamentos ───────────────────────────────────────

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    // ── Helpers ───────────────────────────────────────────────

    // Valor real cobrado (override ou preço padrão do plano)
    public function getEffectivePriceAttribute(): float
    {
        return $this->price_override ?? $this->plan->price;
    }

    public function isActive(): bool
    {
        return $this->status === 'ativo';
    }

    public function isExpiringSoon(int $days = 7): bool
    {
        return $this->ends_at->diffInDays(now()) <= $days && $this->ends_at->isFuture();
    }

    public function scopeAtivo($query)
    {
        return $query->where('status', 'ativo');
    }

    public function scopeVencendo($query, int $days = 7)
    {
        return $query->where('status', 'ativo')
                     ->whereBetween('ends_at', [now(), now()->addDays($days)]);
    }
}
