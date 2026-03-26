import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import InstructorForm from './InstructorForm'

export default function Edit({ instructor }) {
    const { data, setData, put, processing, errors } = useForm({
        name:            instructor.name            ?? '',
        email:           instructor.email           ?? '',
        password:        '',
        cpf:             instructor.cpf             ?? '',
        phone:           instructor.phone           ?? '',
        birth_date:      instructor.birth_date      ?? '',
        council_type:    instructor.council_type    ?? '',
        professional_id: instructor.professional_id ?? '',
        contract_type:   instructor.contract_type   ?? '',
        salary:          instructor.salary          ?? '',
        hired_at:        instructor.hired_at        ?? '',
        bio:             instructor.bio             ?? '',
        notes:           instructor.notes           ?? '',
        specialties:     instructor.specialties     ?? [],
        availability:    instructor.availability    ?? [],
    })

    function submit(e) {
        e.preventDefault()
        put(`/instructors/${instructor.id}`)
    }

    return (
        <AppLayout
            title="Editar instrutor"
            actions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{instructor.name}</span>
                    <Link href="/instructors" className="btn">Voltar</Link>
                </div>
            }
        >
            <Head title={`Editar ${instructor.name}`} />
            <InstructorForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={submit}
                submitLabel="Salvar alterações"
            />
        </AppLayout>
    )
}