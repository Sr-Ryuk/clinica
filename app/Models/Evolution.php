<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evolution extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'instructor_id',
        'enrollment_id',
        'record_date',
        'weight_kg',
        'height_cm',
        'measurements',
        'observations',
        'goals',
        'pain_level',
    ];

    protected function casts(): array
    {
        return [
            'record_date'  => 'date',
            'measurements' => 'array',   // JSON → array automaticamente
            'weight_kg'    => 'decimal:2',
            'height_cm'    => 'decimal:1',
        ];
    }

    // ── Relacionamentos ───────────────────────────────────────

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(Instructor::class);
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    // ── Helpers ───────────────────────────────────────────────

    // Exemplo de measurements por modalidade:
    // Pilates:     ['flexibilidade_cm' => 42, 'amplitude_ombro' => 160]
    // Fisioterapia:['forca_quadriceps' => 8, 'amplitude_joelho' => 120]
    // Quiropraxia: ['postura_score' => 7, 'dor_lombar' => 3]
    public function getMeasurement(string $key): mixed
    {
        return $this->measurements[$key] ?? null;
    }
}
