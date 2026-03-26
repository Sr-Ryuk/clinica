<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'modality',
        'session_type',
        'sessions_per_week',
        'price',
        'duration_days',
        'description',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'price'  => 'decimal:2',
            'active' => 'boolean',
        ];
    }

    public function studentPlans(): HasMany
    {
        return $this->hasMany(StudentPlan::class);
    }

    public function scopeAtivo($query)
    {
        return $query->where('active', true);
    }
}
