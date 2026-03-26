<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'active'            => 'boolean',
        ];
    }

    // ── Relacionamentos ───────────────────────────────────────

    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    public function instructor(): HasOne
    {
        return $this->hasOne(Instructor::class);
    }

    // ── Helpers de role ───────────────────────────────────────

    public function isGestor(): bool
    {
        return $this->role === 'gestor';
    }

    public function isInstrutor(): bool
    {
        return $this->role === 'instrutor';
    }

    public function isRecepcionista(): bool
    {
        return $this->role === 'recepcionista';
    }

    public function isAluno(): bool
    {
        return $this->role === 'aluno';
    }
}
