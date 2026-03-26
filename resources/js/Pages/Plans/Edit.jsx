import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import PlanForm from './PlanForm'

export default function Edit({ plan }) {
    const { data, setData, put, processing, errors } = useForm({
        name:               plan.name               ?? '',
        modality:           plan.modality           ?? '',
        session_type:       plan.session_type       ?? '',
        sessions_per_week:  plan.sessions_per_week  ?? 2,
        price:              plan.price              ?? '',
        duration_days:      plan.duration_days      ?? 30,
        description:        plan.description        ?? '',
        active:             plan.active             ?? true,
    })

    function submit(e) {
        e.preventDefault()
        put(`/plans/${plan.id}`)
    }

    return (
        <AppLayout
            title="Editar plano"
            actions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{plan.name}</span>
                    <Link href="/plans" className="btn">Voltar</Link>
                </div>
            }
        >
            <Head title={`Editar ${plan.name}`} />
            <PlanForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={submit}
                submitLabel="Salvar alterações"
                isEdit
            />
        </AppLayout>
    )
}