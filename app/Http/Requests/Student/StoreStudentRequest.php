<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Dados do usuário (login)
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:8'],

            // Dados pessoais
            'cpf'              => ['nullable', 'string', 'size:14', 'unique:students,cpf'],
            'rg'               => ['nullable', 'string', 'max:20'],
            'phone'            => ['required', 'string', 'max:20'],
            'phone_secondary'  => ['nullable', 'string', 'max:20'],
            'birth_date'       => ['nullable', 'date', 'before:today'],
            'gender'           => ['nullable', Rule::in(['M', 'F', 'outro'])],

            // Endereço
            'zip_code'           => ['nullable', 'string', 'max:10'],
            'address'            => ['nullable', 'string', 'max:255'],
            'address_number'     => ['nullable', 'string', 'max:10'],
            'address_complement' => ['nullable', 'string', 'max:255'],
            'neighborhood'       => ['nullable', 'string', 'max:255'],
            'city'               => ['nullable', 'string', 'max:255'],
            'state'              => ['nullable', 'string', 'size:2'],

            // Contato de emergência
            'emergency_contact_name'     => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone'    => ['nullable', 'string', 'max:20'],
            'emergency_contact_relation' => ['nullable', 'string', 'max:255'],

            // Saúde
            'health_notes'          => ['nullable', 'string'],
            'injury_history'        => ['nullable', 'string'],
            'physical_restrictions' => ['nullable', 'string'],
            'medications'           => ['nullable', 'string'],
            'doctor_name'           => ['nullable', 'string', 'max:255'],
            'doctor_phone'          => ['nullable', 'string', 'max:20'],

            // Misc
            'status'       => ['nullable', Rule::in(['ativo', 'suspenso', 'inativo', 'lead'])],
            'joined_at'    => ['nullable', 'date'],
            'how_found_us' => ['nullable', 'string', 'max:255'],
            'notes'        => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'   => 'O nome é obrigatório.',
            'email.required'  => 'O e-mail é obrigatório.',
            'email.unique'    => 'Este e-mail já está cadastrado.',
            'phone.required'  => 'O telefone é obrigatório.',
            'cpf.unique'      => 'Este CPF já está cadastrado.',
            'cpf.size'        => 'Informe o CPF no formato 000.000.000-00.',
            'birth_date.before' => 'A data de nascimento deve ser no passado.',
        ];
    }
}
