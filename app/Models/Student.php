<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'cpf',
        'rg',
        'phone',
        'phone_secondary',
        'birth_date',
        'gender',
        'zip_code',
        'address',
        'address_number',
        'address_complement',
        'neighborhood',
        'city',
        'state',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relation',
        'health_notes',
        'injury_history',
        'physical_restrictions',
        'medications',
        'doctor_name',
        'doctor_phone',
        'status',
        'joined_at',
        'how_found_us',
        'photo_path',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'joined_at'  => 'date',
        ];
    }

    // ── Relacionamentos ───────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plans(): HasMany
    {
        return $this->hasMany(StudentPlan::class);
    }

    public function activePlan(): HasOne
    {
        return $this->hasOne(StudentPlan::class)
                    ->where('status', 'ativo')
                    ->latestOfMany('starts_at');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function evolutions(): HasMany
    {
        return $this->hasMany(Evolution::class)->orderByDesc('record_date');
    }

    // ── Scopes ────────────────────────────────────────────────

    public function scopeAtivo($query)
    {
        return $query->where('status', 'ativo');
    }

    public function scopeInadimplente($query)
    {
        return $query->whereHas('activePlan', fn($q) => $q->where('status', 'suspenso'));
    }

    // ── Helpers ───────────────────────────────────────────────

    public function getFullAddressAttribute(): string
    {
        return collect([
            $this->address,
            $this->address_number,
            $this->address_complement,
            $this->neighborhood,
            $this->city,
            $this->state,
        ])->filter()->implode(', ');
    }
}
