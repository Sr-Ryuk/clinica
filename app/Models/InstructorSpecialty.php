<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstructorSpecialty extends Model
{
    use HasFactory;

    protected $table = 'instructor_specialties';

    protected $fillable = [
        'instructor_id',
        'specialty',
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(Instructor::class);
    }
}
