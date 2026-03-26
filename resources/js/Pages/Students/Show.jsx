import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'

const STATUS_BADGE = {
    ativo:    { bg: '#EAF3DE', color: '#3B6D11' },
    lead:     { bg: '#FAEEDA', color: '#854F0B' },
    suspenso: { bg: '#FCEBEB', color: '#A32D2D' },
    inativo:  { bg: '#F1EFE8', color: '#5F5E5A' },
}

const PAYMENT_LABEL = {
    pix:            'PIX',
    dinheiro:       'Dinheiro',
    cartao_credito: 'Cartão de crédito',
    cartao_debito:  'Cartão de débito',
    boleto:         'Boleto',
    transferencia:  'Transferência',
}

const PLAN_STATUS = {
    ativo:     { label: 'Ativo',     cls: 'badge-green' },
    suspenso:  { label: 'Suspenso',  cls: 'badge-amber' },
    cancelado: { label: 'Cancelado', cls: 'badge-red'   },
    encerrado: { label: 'Encerrado', cls: 'badge-gray'  },
}

const inputStyle = {
    width: '100%', height: '36px', padding: '0 12px',
    border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: '8px',
    fontSize: '13px', color: '#1a1a1a', background: '#fff',
    outline: 'none', boxSizing: 'border-box',
}

function Section({ title, children, action }) {
    return (
        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>{title}</span>
                {action}
            </div>
            <div style={{ padding: '20px' }}>{children}</div>
        </div>
    )
}

function InfoRow({ label, value }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: '13px', color: value ? '#1a1a1a' : '#d1d5db' }}>{value || '—'}</span>
        </div>
    )
}

function Initials({ name, size = 48 }) {
    const letters = name?.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase() ?? '??'
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: '#EEEDFE', color: '#534AB7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.33, fontWeight: 600, flexShrink: 0,
        }}>{letters}</div>
    )
}

// ── Modal: vincular plano ─────────────────────────────────────
function AttachPlanModal({ student, plans, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        plan_id:        '',
        starts_at:      new Date().toISOString().split('T')[0],
        payment_method: 'pix',
        payment_day:    10,
        price_override: '',
        notes:          '',
    })

    const selected = plans.find(p => String(p.id) === String(data.plan_id))

    function submit(e) {
        e.preventDefault()
        post(`/students/${student.id}/plans`, { onSuccess: onClose })
    }

    return (
        <div
            onClick={e => e.target === e.currentTarget && onClose()}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}
        >
            <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', border: '0.5px solid rgba(0,0,0,0.1)' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Vincular plano — {student.name}</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>✕</button>
                </div>

                <div style={{ padding: '20px' }}>
                    {student.active_plan && (
                        <div style={{ background: '#FAEEDA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#854F0B' }}>
                            O plano atual "{student.active_plan.plan_name}" será encerrado ao salvar.
                        </div>
                    )}

                    <form onSubmit={submit}>

                        {/* Seleção do plano */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Plano *</label>
                            <select style={inputStyle} value={data.plan_id} onChange={e => setData('plan_id', e.target.value)}>
                                <option value="">Selecione um plano</option>
                                {['pilates','fisioterapia','quiropraxia','combo'].map(mod => {
                                    const group = plans.filter(p => p.modality === mod)
                                    if (!group.length) return null
                                    return (
                                        <optgroup key={mod} label={mod.charAt(0).toUpperCase() + mod.slice(1)}>
                                            {group.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} — R$ {Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )
                                })}
                            </select>
                            {errors.plan_id && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{errors.plan_id}</p>}
                        </div>

                        {/* Preview */}
                        {selected && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', background: '#f9f9f9', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
                                {[
                                    ['Sessões/sem', `${selected.sessions_per_week}x`],
                                    ['Formato',     selected.session_type],
                                    ['Vigência',    `${selected.duration_days} dias`],
                                    ['Valor',       `R$ ${Number(selected.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
                                ].map(([l, v]) => (
                                    <div key={l}>
                                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>{l}</div>
                                        <div style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>{v}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Datas */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Data de início *</label>
                                <input style={inputStyle} type="date" value={data.starts_at} onChange={e => setData('starts_at', e.target.value)} />
                                {errors.starts_at && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{errors.starts_at}</p>}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Dia de vencimento *</label>
                                <input style={inputStyle} type="number" min="1" max="31" value={data.payment_day} onChange={e => setData('payment_day', Number(e.target.value))} />
                                {errors.payment_day && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{errors.payment_day}</p>}
                            </div>
                        </div>

                        {/* Pagamento */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Forma de pagamento *</label>
                            <select style={inputStyle} value={data.payment_method} onChange={e => setData('payment_method', e.target.value)}>
                                {Object.entries(PAYMENT_LABEL).map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                ))}
                            </select>
                        </div>

                        {/* Valor negociado */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                                Valor negociado (R$)
                                <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 400, marginLeft: '6px' }}>deixe em branco para usar o padrão</span>
                            </label>
                            <input
                                style={inputStyle} type="number" step="0.01" min="0"
                                value={data.price_override}
                                onChange={e => setData('price_override', e.target.value)}
                                placeholder={selected ? Number(selected.price).toFixed(2) : '0,00'}
                            />
                        </div>

                        {/* Notas */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Observações</label>
                            <textarea
                                style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: '1.5' }}
                                rows={2}
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                placeholder="Ex: desconto familiar, plano experimental..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={onClose} className="btn">Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={processing || !data.plan_id} style={{ minWidth: '130px', justifyContent: 'center' }}>
                                {processing ? 'Salvando…' : 'Vincular plano'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

// ── Página principal ──────────────────────────────────────────
export default function Show({ student, available_plans }) {
    const [showPlanModal, setShowPlanModal] = useState(false)
    const { props } = usePage()
    const badge = STATUS_BADGE[student.status] ?? STATUS_BADGE.inativo

    return (
        <AppLayout
            title="Perfil do aluno"
            actions={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href="/students" className="btn">Voltar</Link>
                    <Link href={`/students/${student.id}/edit`} className="btn">Editar dados</Link>
                    <Link href="/schedule" className="btn btn-primary">+ Agendar aula</Link>
                </div>
            }
        >
            <Head title={student.name} />

            {props.flash?.success && (
                <div style={{ background: '#EAF3DE', color: '#3B6D11', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                    {props.flash.success}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', alignItems: 'start' }}>

                {/* ── Esquerda ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Header */}
                    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Initials name={student.name} />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a' }}>{student.name}</h2>
                                <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 10px', borderRadius: '20px', background: badge.bg, color: badge.color }}>{student.status}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#6b7280' }}>{student.email} · {student.phone}</div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'right' }}>
                            <div>Aluno desde</div>
                            <div style={{ color: '#374151', fontWeight: 500 }}>{student.joined_at ?? '—'}</div>
                        </div>
                    </div>

                    <Section title="Informações pessoais">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '16px' }}>
                            <InfoRow label="CPF" value={student.cpf} />
                            <InfoRow label="Nascimento" value={student.birth_date} />
                            <InfoRow label="Gênero" value={student.gender} />
                            <InfoRow label="Telefone" value={student.phone} />
                            <InfoRow label="Telefone 2" value={student.phone_secondary} />
                            <InfoRow label="Como conheceu" value={student.how_found_us} />
                        </div>
                    </Section>

                    <Section title="Endereço">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '16px' }}>
                            <InfoRow label="Logradouro" value={[student.address?.street, student.address?.number].filter(Boolean).join(', ')} />
                            <InfoRow label="Bairro" value={student.address?.neighborhood} />
                            <InfoRow label="Cidade / UF" value={[student.address?.city, student.address?.state].filter(Boolean).join(' / ')} />
                        </div>
                    </Section>

                    <Section title="Contato de emergência">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '16px' }}>
                            <InfoRow label="Nome" value={student.emergency_contact?.name} />
                            <InfoRow label="Parentesco" value={student.emergency_contact?.relation} />
                            <InfoRow label="Telefone" value={student.emergency_contact?.phone} />
                        </div>
                    </Section>

                    <Section title="Informações de saúde">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                ['Histórico geral',    student.health?.notes],
                                ['Lesões',             student.health?.injury_history],
                                ['Restrições físicas', student.health?.physical_restrictions],
                                ['Medicamentos',       student.health?.medications],
                            ].filter(([, v]) => v).map(([label, value]) => (
                                <div key={label}>
                                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500, marginBottom: '2px' }}>{label}</div>
                                    <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>{value}</div>
                                </div>
                            ))}
                            {!student.health?.notes && !student.health?.injury_history && !student.health?.physical_restrictions && (
                                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Nenhuma informação de saúde registrada.</span>
                            )}
                        </div>
                    </Section>

                    <Section title="Evoluções recentes">
                        {student.evolutions?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {student.evolutions.map(evo => (
                                    <div key={evo.id} style={{ padding: '12px', border: '0.5px solid rgba(0,0,0,0.06)', borderRadius: '8px', background: '#fafafa' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 500 }}>{evo.record_date}</span>
                                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>{evo.instructor}</span>
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5', margin: 0 }}>{evo.observations}</p>
                                        {evo.pain_level != null && (
                                            <div style={{ marginTop: '6px', fontSize: '11px', color: '#9ca3af' }}>
                                                Dor: <strong style={{ color: '#374151' }}>{evo.pain_level}/10</strong>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span style={{ fontSize: '13px', color: '#9ca3af' }}>Nenhuma evolução registrada.</span>
                        )}
                    </Section>

                    {student.plan_history?.length > 0 && (
                        <Section title="Histórico de planos">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {student.plan_history.map(sp => {
                                    const s = PLAN_STATUS[sp.status] ?? { label: sp.status, cls: 'badge-gray' }
                                    return (
                                        <div key={sp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 500 }}>{sp.plan_name}</div>
                                                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{sp.starts_at} → {sp.ends_at}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 500 }}>
                                                    R$ {Number(sp.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </span>
                                                <span className={`badge ${s.cls}`}>{s.label}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Section>
                    )}
                </div>

                {/* ── Direita ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Plano ativo */}
                    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 500 }}>Plano ativo</span>
                            <button
                                onClick={() => setShowPlanModal(true)}
                                style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                {student.active_plan ? 'trocar plano' : '+ vincular plano'}
                            </button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            {student.active_plan ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#6366f1' }}>{student.active_plan.plan_name}</div>
                                    {[
                                        ['Modalidade',   student.active_plan.modality],
                                        ['Formato',      student.active_plan.session_type],
                                        ['Aulas/semana', `${student.active_plan.sessions_per_week}x`],
                                        ['Pagamento',    PAYMENT_LABEL[student.active_plan.payment_method] ?? student.active_plan.payment_method],
                                        ['Vence em',     student.active_plan.ends_at],
                                    ].map(([l, v]) => (
                                        <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                            <span style={{ color: '#9ca3af' }}>{l}</span>
                                            <span style={{ textTransform: 'capitalize' }}>{v}</span>
                                        </div>
                                    ))}
                                    <div style={{ paddingTop: '10px', borderTop: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>Valor mensal</span>
                                        <span style={{ fontSize: '15px', fontWeight: 600 }}>
                                            R$ {Number(student.active_plan.effective_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                                    <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>Nenhum plano ativo.</div>
                                    <button onClick={() => setShowPlanModal(true)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        + Vincular plano
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {student.notes && (
                        <div style={{ background: '#FAEEDA', border: '0.5px solid #FAC775', borderRadius: '12px', padding: '14px 16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 500, color: '#854F0B', marginBottom: '6px' }}>Observações internas</div>
                            <p style={{ fontSize: '13px', color: '#633806', lineHeight: '1.5', margin: 0 }}>{student.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {showPlanModal && (
                <AttachPlanModal
                    student={student}
                    plans={available_plans}
                    onClose={() => setShowPlanModal(false)}
                />
            )}
        </AppLayout>
    )
}