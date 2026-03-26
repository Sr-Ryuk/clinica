import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import PlanForm from './PlanForm'

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name:               '',
        modality:           '',
        session_type:       '',
        sessions_per_week:  2,
        price:              '',
        duration_days:      30,
        description:        '',
    })

    function submit(e) {
        e.preventDefault()
        post('/plans')
    }

    return (
        <AppLayout
            title="Novo plano"
            actions={<Link href="/plans" className="btn">Voltar</Link>}
        >
            <Head title="Novo plano" />
            <PlanForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={submit}
                submitLabel="Criar plano"
            />
        </AppLayout>
    )
}