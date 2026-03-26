<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Instructor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'cpf',
        'phone',
        'birth_date',
        'council_type',
        'professional_id',
        'contract_type',
        'salary',
        'hired_at',
        'photo_path',
        'bio',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'hired_at'   => 'date',
            'salary'     => 'decimal:2',
        ];
    }

    // ── Relacionamentos ───────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function specialties(): HasMany
    {
        return $this->hasMany(InstructorSpecialty::class);
    }

    public function availability(): HasMany
    {
        return $this->hasMany(InstructorAvailability::class)->orderBy('weekday')->orderBy('start_time');
    }

    public function classes(): HasMany
    {
        return $this->hasMany(ClassModel::class);
    }

    public function evolutions(): HasMany
    {
        return $this->hasMany(Evolution::class);
    }

    // ── Scopes ────────────────────────────────────────────────

    public function scopeAvailableOn($query, int $weekday, string $time)
    {
        return $query->whereHas('availability', function ($q) use ($weekday, $time) {
            $q->where('weekday', $weekday)
              ->where('start_time', '<=', $time)
              ->where('end_time', '>=', $time);
        });
    }

    // ── Helpers ───────────────────────────────────────────────

    public function getNameAttribute(): string
    {
        return $this->user->name ?? '';
    }
}
