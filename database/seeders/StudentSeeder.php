<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Student;
use App\Models\StudentPlan;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $gestor = User::where('role', 'gestor')->first();

        $alunos = [
            [
                'email'  => 'juliana@exemplo.com',
                'data'   => [
                    'cpf'                      => '100.200.300-11',
                    'phone'                    => '(35) 99201-0001',
                    'birth_date'               => '1990-06-15',
                    'gender'                   => 'F',
                    'city'                     => 'Três Corações',
                    'state'                    => 'MG',
                    'emergency_contact_name'   => 'Pedro Martins',
                    'emergency_contact_phone'  => '(35) 99201-0010',
                    'emergency_contact_relation'=> 'Esposo',
                    'health_notes'             => 'Sem restrições.',
                    'status'                   => 'ativo',
                    'joined_at'                => '2023-03-01',
                ],
                'plano'  => 'Pilates Dupla 2x/semana',
                'payment_method' => 'pix',
            ],
            [
                'email'  => 'carlos@exemplo.com',
                'data'   => [
                    'cpf'                      => '200.300.400-22',
                    'phone'                    => '(35) 99201-0002',
                    'birth_date'               => '1978-11-20',
                    'gender'                   => 'M',
                    'city'                     => 'Três Corações',
                    'state'                    => 'MG',
                    'emergency_contact_name'   => 'Maria Oliveira',
                    'emergency_contact_phone'  => '(35) 99201-0020',
                    'emergency_contact_relation'=> 'Esposa',
                    'health_notes'             => 'Hérnia de disco L4-L5.',
                    'injury_history'           => 'Cirurgia de coluna em 2019.',
                    'physical_restrictions'    => 'Evitar flexão lombar excessiva.',
                    'status'                   => 'ativo',
                    'joined_at'                => '2023-05-10',
                ],
                'plano'  => 'Fisioterapia Individual 2x/semana',
                'payment_method' => 'cartao_credito',
            ],
            [
                'email'  => 'patricia@exemplo.com',
                'data'   => [
                    'cpf'                      => '300.400.500-33',
                    'phone'                    => '(35) 99201-0003',
                    'birth_date'               => '1985-02-28',
                    'gender'                   => 'F',
                    'city'                     => 'Varginha',
                    'state'                    => 'MG',
                    'emergency_contact_name'   => 'Silvia Rocha',
                    'emergency_contact_phone'  => '(35) 99201-0030',
                    'emergency_contact_relation'=> 'Mãe',
                    'health_notes'             => 'Diabetes tipo 2 controlada.',
                    'status'                   => 'ativo',
                    'joined_at'                => '2024-01-15',
                ],
                'plano'  => 'Pilates Dupla 3x/semana',
                'payment_method' => 'pix',
            ],
            [
                'email'  => 'marcos@exemplo.com',
                'data'   => [
                    'cpf'                      => '400.500.600-44',
                    'phone'                    => '(35) 99201-0004',
                    'birth_date'               => '1995-08-05',
                    'gender'                   => 'M',
                    'city'                     => 'Três Corações',
                    'state'                    => 'MG',
                    'emergency_contact_name'   => 'João Ferreira',
                    'emergency_contact_phone'  => '(35) 99201-0040',
                    'emergency_contact_relation'=> 'Pai',
                    'health_notes'             => 'Sem restrições.',
                    'status'                   => 'ativo',
                    'joined_at'                => '2024-02-01',
                ],
                'plano'  => 'Pilates Trio 2x/semana',
                'payment_method' => 'dinheiro',
            ],
            [
                'email'  => 'luciana@exemplo.com',
                'data'   => [
                    'cpf'                      => '500.600.700-55',
                    'phone'                    => '(35) 99201-0005',
                    'birth_date'               => '1972-12-10',
                    'gender'                   => 'F',
                    'city'                     => 'Três Corações',
                    'state'                    => 'MG',
                    'emergency_contact_name'   => 'Roberto Alves',
                    'emergency_contact_phone'  => '(35) 99201-0050',
                    'emergency_contact_relation'=> 'Esposo',
                    'health_notes'             => 'Hipertensão controlada. Osteoporose leve.',
                    'physical_restrictions'    => 'Evitar impacto.',
                    'status'                   => 'ativo',
                    'joined_at'                => '2022-08-20',
                ],
                'plano'  => 'Quiropraxia 2x/semana',
                'payment_method' => 'cartao_debito',
            ],
            [
                'email'  => 'roberto@exemplo.com',
                'data'   => [
                    'cpf'                      => '600.700.800-66',
                    'phone'                    => '(35) 99201-0006',
                    'birth_date'               => '1968-03-18',
                    'gender'                   => 'M',
                    'city'                     => 'Três Corações',
                    'state'                    => 'MG',
                    'emergency_contact_name'   => 'Ana Lima',
                    'emergency_contact_phone'  => '(35) 99201-0060',
                    'emergency_contact_relation'=> 'Esposa',
                    'health_notes'             => 'Pós-operatório de joelho.',
                    'status'                   => 'ativo',
                    'joined_at'                => '2024-03-05',
                ],
                'plano'  => 'Fisioterapia Individual 3x/semana',
                'payment_method' => 'pix',
            ],
            [
                'email'  => 'sandra@exemplo.com',
                'data'   => [
                    'cpf'                      => '700.800.900-77',
                    'phone'                    => '(35) 99201-0007',
                    'birth_date'               => '1982-07-22',
                    'gender'                   => 'F',
                    'city'                     => 'Varginha',
                    'state'                    => 'MG',
                    'emergency_contact_name'   => 'Luis Pereira',
                    'emergency_contact_phone'  => '(35) 99201-0070',
                    'emergency_contact_relation'=> 'Esposo',
                    'health_notes'             => 'Sem restrições.',
                    'status'                   => 'ativo',
                    'joined_at'                => '2023-11-10',
                ],
                'plano'  => 'Pilates Individual 2x/semana',
                'payment_method' => 'pix',
            ],
            [
                'email'  => 'felipe@exemplo.com',
                'data'   => [
                    'cpf'                      => '800.900.100-88',
                    'phone'                    => '(35) 99201-0008',
                    'birth_date'               => '2000-05-14',
                    'gender'                   => 'M',
                    'city'                     => 'Três Corações',
                    'state'                    => 'MG',
                    'emergency_contact_name'   => 'Marcos Gomes',
                    'emergency_contact_phone'  => '(35) 99201-0080',
                    'emergency_contact_relation'=> 'Pai',
                    'health_notes'             => 'Escoliose leve.',
                    'physical_restrictions'    => 'Atenção à postura lateral.',
                    'status'                   => 'ativo',
                    'joined_at'                => '2024-01-08',
                ],
                'plano'  => 'Pilates Dupla 2x/semana',
                'payment_method' => 'cartao_credito',
            ],
        ];

        foreach ($alunos as $alunoData) {
            $user = User::where('email', $alunoData['email'])->first();

            $student = Student::create(array_merge(
                $alunoData['data'],
                ['user_id' => $user->id]
            ));

            $plan = Plan::where('name', $alunoData['plano'])->first();

            StudentPlan::create([
                'student_id'     => $student->id,
                'plan_id'        => $plan->id,
                'starts_at'      => $alunoData['data']['joined_at'],
                'ends_at'        => now()->addDays(30)->format('Y-m-d'),
                'payment_method' => $alunoData['payment_method'],
                'payment_day'    => 10,
                'status'         => 'ativo',
                'created_by'     => $gestor->id,
            ]);
        }
    }
}
