<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'     => $this->id,
            'name'   => $this->user->name,
            'email'  => $this->user->email,
            'status' => $this->status,
            'phone'  => $this->phone,

            // Dados pessoais (somente quando carregados explicitamente)
            'cpf'        => $this->cpf,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'gender'     => $this->gender,
            'photo_path' => $this->photo_path,

            // Endereço
            'address' => $this->when($request->routeIs('students.show'), [
                'zip_code'           => $this->zip_code,
                'street'             => $this->address,
                'number'             => $this->address_number,
                'complement'         => $this->address_complement,
                'neighborhood'       => $this->neighborhood,
                'city'               => $this->city,
                'state'              => $this->state,
                'full'               => $this->full_address,
            ]),

            // Contato de emergência (só no show)
            'emergency_contact' => $this->when($request->routeIs('students.show'), [
                'name'     => $this->emergency_contact_name,
                'phone'    => $this->emergency_contact_phone,
                'relation' => $this->emergency_contact_relation,
            ]),

            // Saúde (só no show — informação sensível)
            'health' => $this->when($request->routeIs('students.show'), [
                'notes'               => $this->health_notes,
                'injury_history'      => $this->injury_history,
                'physical_restrictions' => $this->physical_restrictions,
                'medications'         => $this->medications,
                'doctor_name'         => $this->doctor_name,
                'doctor_phone'        => $this->doctor_phone,
            ]),

            // Plano ativo (carregado com ->load('activePlan.plan'))
            'active_plan' => $this->whenLoaded('activePlan', fn() => [
                'id'             => $this->activePlan->id,
                'plan_name'      => $this->activePlan->plan->name,
                'modality'       => $this->activePlan->plan->modality,
                'session_type'   => $this->activePlan->plan->session_type,
                'status'         => $this->activePlan->status,
                'ends_at'        => $this->activePlan->ends_at->format('Y-m-d'),
                'effective_price'=> $this->activePlan->effective_price,
                'payment_method' => $this->activePlan->payment_method,
                'payment_day'    => $this->activePlan->payment_day,
            ]),

            'joined_at'  => $this->joined_at?->format('Y-m-d'),
            'notes'      => $this->when($request->routeIs('students.show'), $this->notes),
            'created_at' => $this->created_at->format('Y-m-d H:i'),
        ];
    }
}
