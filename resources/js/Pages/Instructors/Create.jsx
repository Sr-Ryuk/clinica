import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import InstructorForm from './InstructorForm'

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '',
        cpf: '', phone: '', birth_date: '',
        council_type: '', professional_id: '',
        contract_type: '', salary: '', hired_at: '',
        bio: '', notes: '',
        specialties: [],
        availability: [],
    })

    function submit(e) {
        e.preventDefault()
        post('/instructors')
    }

    return (
        <AppLayout
            title="Novo instrutor"
            actions={<Link href="/instructors" className="btn">Voltar</Link>}
        >
            <Head title="Novo instrutor" />
            <InstructorForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={submit}
                submitLabel="Salvar instrutor"
            />
        </AppLayout>
    )
}