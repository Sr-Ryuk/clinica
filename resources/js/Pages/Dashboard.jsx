import AppLayout from '@/Layouts/AppLayout'
import { Link } from '@inertiajs/react'

function KpiCard({ label, value, sub }) {
    return (
        <div className="kpi-card">
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
            {sub && <div className="kpi-sub">{sub}</div>}
        </div>
    )
}

function StatusBadge({ status }) {
    const map = {
        ativo:    'badge-green',
        lead:     'badge-amber',
        suspenso: 'badge-red',
        inativo:  'badge-gray',
    }
    return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>
}

function Initials({ name }) {
    const letters = name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() ?? '??'
    return (
        <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: '#EEEDFE', color: '#534AB7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 600, flexShrink: 0,
        }}>
            {letters}
        </div>
    )
}

const MODALITY_COLORS = {
    pilates:      '#6366f1',
    fisioterapia: '#1D9E75',
    quiropraxia:  '#D85A30',
    combo:        '#BA7517',
}

export default function Dashboard({ stats, recentStudents, todayClasses }) {
    return (
        <AppLayout
            title="Dashboard"
            actions={
                <Link href="/schedule" className="btn btn-primary">
                    + Agendar aula
                </Link>
            }
        >
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '12px', marginBottom: '20px' }}>
                <KpiCard
                    label="Alunos ativos"
                    value={stats.students.total_active}
                    sub={`${stats.students.total_leads} leads`}
                />
                <KpiCard
                    label="Aulas hoje"
                    value={stats.today_schedule.total_students}
                    sub={`${stats.today_schedule.confirmed} confirmadas`}
                />
                <KpiCard
                    label="Planos vencendo"
                    value={stats.students.expiring_plans}
                    sub="próximos 7 dias"
                />
                <KpiCard
                    label="Reposições"
                    value={stats.this_month.makeups_pending}
                    sub="pendentes"
                />
            </div>

            {/* Linha de cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Alunos recentes */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Alunos recentes</span>
                        <Link href="/students" style={{ fontSize: '12px', color: '#6366f1' }}>ver todos</Link>
                    </div>
                    {recentStudents.length === 0 && (
                        <p style={{ fontSize: '13px', color: '#9ca3af', padding: '12px 0' }}>Nenhum aluno cadastrado.</p>
                    )}
                    {recentStudents.map(student => (
                        <div key={student.id} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                        }}>
                            <Initials name={student.name} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {student.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                    {student.active_plan?.plan_name ?? 'Sem plano'}
                                </div>
                            </div>
                            <StatusBadge status={student.status} />
                        </div>
                    ))}
                </div>

                {/* Agenda do dia */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Agenda de hoje</span>
                        <Link href="/schedule" style={{ fontSize: '12px', color: '#6366f1' }}>ver completa</Link>
                    </div>
                    {todayClasses.length === 0 && (
                        <p style={{ fontSize: '13px', color: '#9ca3af', padding: '12px 0' }}>Nenhuma aula hoje.</p>
                    )}
                    {todayClasses.map(cls => (
                        <div key={cls.id} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '7px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                        }}>
                            <span style={{ fontSize: '11px', color: '#9ca3af', minWidth: '42px' }}>
                                {cls.start_time}
                            </span>
                            <div style={{
                                width: '3px', height: '32px', borderRadius: '2px',
                                background: MODALITY_COLORS[cls.modality] ?? '#888',
                                flexShrink: 0,
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '12px', fontWeight: 500, textTransform: 'capitalize' }}>
                                    {cls.modality} · {cls.session_type}
                                </div>
                                <div style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {cls.instructor} · {cls.room}
                                </div>
                            </div>
                            <span style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                                {cls.enrolled}/{cls.max_students}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Planos por modalidade */}
            {Object.keys(stats.plans_by_modality).length > 0 && (
                <div className="card" style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Planos ativos por modalidade</div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        {Object.entries(stats.plans_by_modality).map(([modality, count]) => (
                            <div key={modality} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: MODALITY_COLORS[modality] ?? '#888' }} />
                                <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{modality}</span>
                                <span style={{ fontSize: '13px', fontWeight: 500 }}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    )
}