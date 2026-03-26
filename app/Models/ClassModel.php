<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

// Usamos ClassModel para evitar conflito com a palavra reservada "Class" do PHP
class ClassModel extends Model
{
    use HasFactory, SoftDeletes;

    // Aponta para a tabela correta no banco
    protected $table = 'classes';

    protected $fillable = [
        'instructor_id',
        'room_id',
        'modality',
        'session_type',
        'max_students',
        'is_recurring',
        'weekday',
        'start_time',
        'end_time',
        'specific_date',
        'valid_from',
        'valid_until',
        'active',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_recurring'  => 'boolean',
            'active'        => 'boolean',
            'specific_date' => 'date',
            'valid_from'    => 'date',
            'valid_until'   => 'date',
        ];
    }

    // ── Relacionamentos ───────────────────────────────────────

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(Instructor::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function classEquipment(): HasMany
    {
        return $this->hasMany(ClassEquipment::class, 'class_id');
    }

    public function equipment(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class, 'class_equipment', 'class_id', 'equipment_id')
                    ->withPivot('quantity_needed')
                    ->withTimestamps();
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'class_id');
    }

    // ── Scopes ────────────────────────────────────────────────

    public function scopeRecorrente($query)
    {
        return $query->where('is_recurring', true)->where('active', true);
    }

    public function scopeAvulsa($query)
    {
        return $query->where('is_recurring', false);
    }

    public function scopeNoDia($query, int $weekday)
    {
        return $query->where('weekday', $weekday)->where('is_recurring', true);
    }

    // ── Helpers ───────────────────────────────────────────────

    public function getWeekdayNameAttribute(): string
    {
        return InstructorAvailability::WEEKDAYS[$this->weekday] ?? '';
    }

    // Quantas vagas ainda disponíveis numa data específica
    public function availableSpotsOn(string $date): int
    {
        $occupied = $this->enrollments()
            ->where('scheduled_date', $date)
            ->whereNotIn('status', ['cancelada_aviso', 'cancelada_sem_aviso'])
            ->count();

        return max(0, $this->max_students - $occupied);
    }
}
