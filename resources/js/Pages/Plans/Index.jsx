import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, router } from '@inertiajs/react'

const MODALITY_CONFIG = {
    pilates:      { label: 'Pilates',       color: '#6366f1', bg: '#EEEDFE', text: '#534AB7' },
    fisioterapia: { label: 'Fisioterapia',  color: '#1D9E75', bg: '#E1F5EE', text: '#085041' },
    quiropraxia:  { label: 'Quiropraxia',   color: '#D85A30', bg: '#FAECE7', text: '#712B13' },
    combo:        { label: 'Combo',         color: '#BA7517', bg: '#FAEEDA', text: '#633806' },
}

const SESSION_LABEL = {
    individual: 'Individual',
    dupla:      'Dupla',
    trio:       'Trio',
    grupo:      'Grupo',
}

function ModalityBadge({ modality }) {
    const cfg = MODALITY_CONFIG[modality] ?? { label: modality, bg: '#F1EFE8', text: '#5F5E5A' }
    return (
        <span style={{
            fontSize: '11px', fontWeight: 500, padding: '2px 8px',
            borderRadius: '20px', background: cfg.bg, color: cfg.text,
        }}>
            {cfg.label}
        </span>
    )
}

function PlanCard({ plan }) {
    const cfg = MODALITY_CONFIG[plan.modality] ?? {}

    function handleDelete() {
        if (!confirm(`Remover o plano "${plan.name}"?`)) return
        router.delete(`/plans/${plan.id}`)
    }

    return (
        <div style={{
            background: '#fff',
            border: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
            opacity: plan.active ? 1 : 0.6,
        }}>
            {/* Topo colorido */}
            <div style={{ height: '4px', background: cfg.color ?? '#888' }} />

            <div style={{ padding: '16px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '4px' }}>
                            {plan.name}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            <ModalityBadge modality={plan.modality} />
                            <span className="badge badge-gray">{SESSION_LABEL[plan.session_type]}</span>
                            {!plan.active && <span className="badge badge-red">Inativo</span>}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
                            R$ {Number(plan.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>por mês</div>
                    </div>
                </div>

                {/* Detalhes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px 10px' }}>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>Aulas/semana</div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{plan.sessions_per_week}x</div>
                    </div>
                    <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px 10px' }}>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>Vigência</div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{plan.duration_days} dias</div>
                    </div>
                </div>

                {plan.description && (
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.5' }}>
                        {plan.description}
                    </p>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                        {plan.active_students} aluno{plan.active_students !== 1 ? 's' : ''} ativo{plan.active_students !== 1 ? 's' : ''}
                    </span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link href={`/plans/${plan.id}/edit`} style={{ fontSize: '12px', color: '#6366f1' }}>
                            Editar
                        </Link>
                        <button
                            onClick={handleDelete}
                            style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            Remover
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Index({ plans }) {
    // Agrupa por modalidade
    const grouped = plans.reduce((acc, p) => {
        const key = p.modality
        if (!acc[key]) acc[key] = []
        acc[key].push(p)
        return acc
    }, {})

    const modalityOrder = ['pilates', 'fisioterapia', 'quiropraxia', 'combo']

    return (
        <AppLayout
            title="Planos"
            actions={
                <Link href="/plans/create" className="btn btn-primary">
                    + Novo plano
                </Link>
            }
        >
            <Head title="Planos" />

            {plans.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>◈</div>
                    <div style={{ fontSize: '14px' }}>Nenhum plano cadastrado.</div>
                    <Link href="/plans/create" className="btn btn-primary" style={{ marginTop: '16px' }}>
                        Criar primeiro plano
                    </Link>
                </div>
            )}

            {modalityOrder.filter(m => grouped[m]).map(modality => (
                <div key={modality} style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: MODALITY_CONFIG[modality]?.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                            {MODALITY_CONFIG[modality]?.label}
                        </span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                            {grouped[modality].length} plano{grouped[modality].length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                        {grouped[modality].map(plan => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                </div>
            ))}
        </AppLayout>
    )
}