<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'room_id',
        'name',
        'type',
        'quantity',
        'brand',
        'serial_number',
        'purchase_date',
        'last_maintenance_at',
        'notes',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'purchase_date'       => 'date',
            'last_maintenance_at' => 'date',
            'active'              => 'boolean',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function classEquipment(): HasMany
    {
        return $this->hasMany(ClassEquipment::class);
    }

    public function scopeAtivo($query)
    {
        return $query->where('active', true);
    }
}
