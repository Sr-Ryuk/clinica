<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'type', 'category', 'description', 'amount', 
        'due_date', 'paid_at', 'status', 'student_id', 'instructor_id'
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_at' => 'date',
        'amount' => 'decimal:2',
    ];

    // Escopos para facilitar os relatórios
    public function scopeIncome($query) { return $query->where('type', 'income'); }
    public function scopeExpense($query) { return $query->where('type', 'expense'); }
    public function scopePaid($query) { return $query->where('status', 'paid'); }

    public function student() { return $this->belongsTo(Student::class); }
    public function instructor() { return $this->belongsTo(Instructor::class); }
}