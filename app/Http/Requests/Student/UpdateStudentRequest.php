<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('student')->id;
        $userId    = $this->route('student')->user_id;

        return [
            'name'  => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($userId)],

            'cpf'             => ['sometimes', 'nullable', 'string', 'size:14', Rule::unique('students', 'cpf')->ignore($studentId)],
            'rg'              => ['sometimes', 'nullable', 'string', 'max:20'],
            'phone'           => ['sometimes', 'string', 'max:20'],
            'phone_secondary' => ['sometimes', 'nullable', 'string', 'max:20'],
            'birth_date'      => ['sometimes', 'nullable', 'date', 'before:today'],
            'gender'          => ['sometimes', 'nullable', Rule::in(['M', 'F', 'outro'])],

            'zip_code'           => ['sometimes', 'nullable', 'string', 'max:10'],
            'address'            => ['sometimes', 'nullable', 'string', 'max:255'],
            'address_number'     => ['sometimes', 'nullable', 'string', 'max:10'],
            'address_complement' => ['sometimes', 'nullable', 'string', 'max:255'],
            'neighborhood'       => ['sometimes', 'nullable', 'string', 'max:255'],
            'city'               => ['sometimes', 'nullable', 'string', 'max:255'],
            'state'              => ['sometimes', 'nullable', 'string', 'size:2'],

            'emergency_contact_name'     => ['sometimes', 'nullable', 'string', 'max:255'],
            'emergency_contact_phone'    => ['sometimes', 'nullable', 'string', 'max:20'],
            'emergency_contact_relation' => ['sometimes', 'nullable', 'string', 'max:255'],

            'health_notes'          => ['sometimes', 'nullable', 'string'],
            'injury_history'        => ['sometimes', 'nullable', 'string'],
            'physical_restrictions' => ['sometimes', 'nullable', 'string'],
            'medications'           => ['sometimes', 'nullable', 'string'],
            'doctor_name'           => ['sometimes', 'nullable', 'string', 'max:255'],
            'doctor_phone'          => ['sometimes', 'nullable', 'string', 'max:20'],

            'status'       => ['sometimes', Rule::in(['ativo', 'suspenso', 'inativo', 'lead'])],
            'joined_at'    => ['sometimes', 'nullable', 'date'],
            'how_found_us' => ['sometimes', 'nullable', 'string', 'max:255'],
            'notes'        => ['sometimes', 'nullable', 'string'],
        ];
    }
}
