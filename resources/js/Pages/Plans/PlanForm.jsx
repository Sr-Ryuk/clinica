import { Link } from '@inertiajs/react'

const inputStyle = {
    width: '100%', height: '36px', padding: '0 12px',
    border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: '8px',
    fontSize: '13px', color: '#1a1a1a', background: '#fff',
    outline: 'none', boxSizing: 'border-box',
}

const Field = ({ label, hint, error, children, span = 1 }) => (
    <div style={{ gridColumn: `span ${span}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>{label}</label>
            {hint && <span style={{ fontSize: '11px', color: '#9ca3af' }}>{hint}</span>}
        </div>
        {children}
        {error && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{error}</p>}
    </div>
)

const Section = ({ title, children }) => (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: '#fafafa' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>{title}</span>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
    </div>
)

const MODALITY_COLORS = {
    pilates:      '#6366f1',
    fisioterapia: '#1D9E75',
    quiropraxia:  '#D85A30',
    combo:        '#BA7517',
}

export default function PlanForm({ data, setData, errors, processing, onSubmit, submitLabel = 'Salvar', isEdit = false }) {
    const set = field => e => setData(field, e.target.value)

    // Preview do preço por sessão
    const sessionsPerMonth = data.sessions_per_week * 4
    const pricePerSession = sessionsPerMonth > 0 && data.price > 0
        ? (Number(data.price) / sessionsPerMonth).toFixed(2)
        : null

    return (
        <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>

                {/* ── Identificação ── */}
                <Section title="Identificação do plano">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '16px' }}>

                        <Field label="Nome do plano *" error={errors.name} span={3}>
                            <input style={inputStyle} type="text" autoFocus
                                value={data.name} onChange={set('name')}
                                placeholder="Ex: Pilates Dupla 2x/semana" />
                        </Field>

                        <Field label="Modalidade *" error={errors.modality}>
                            <select style={{
                                ...inputStyle,
                                borderLeftWidth: '3px',
                                borderLeftColor: MODALITY_COLORS[data.modality] ?? 'rgba(0,0,0,0.15)',
                            }} value={data.modality} onChange={set('modality')}>
                                <option value="">Selecione</option>
                                <option value="pilates">Pilates</option>
                                <option value="fisioterapia">Fisioterapia</option>
                                <option value="quiropraxia">Quiropraxia</option>
                                <option value="combo">Combo (mais de uma modalidade)</option>
                            </select>
                        </Field>

                        <Field label="Formato da sessão *" error={errors.session_type}>
                            <select style={inputStyle} value={data.session_type} onChange={set('session_type')}>
                                <option value="">Selecione</option>
                                <option value="individual">Individual (1 aluno)</option>
                                <option value="dupla">Dupla (2 alunos)</option>
                                <option value="trio">Trio (3 alunos)</option>
                                <option value="grupo">Grupo (4+ alunos)</option>
                            </select>
                        </Field>

                        <Field label="Aulas por semana *" error={errors.sessions_per_week}>
                            <select style={inputStyle} value={data.sessions_per_week} onChange={set('sessions_per_week')}>
                                {[1,2,3,4,5].map(n => (
                                    <option key={n} value={n}>{n}x por semana</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Descrição" hint="(opcional)" error={errors.description} span={3}>
                            <textarea
                                style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: '1.5' }}
                                rows={2}
                                value={data.description}
                                onChange={set('description')}
                                placeholder="Detalhes do plano para uso interno..."
                            />
                        </Field>
                    </div>
                </Section>

                {/* ── Valor e vigência ── */}
                <Section title="Valor e vigência">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '16px' }}>

                        <Field label="Valor mensal (R$) *" error={errors.price}>
                            <input style={inputStyle} type="number" step="0.01" min="0"
                                value={data.price} onChange={set('price')}
                                placeholder="0,00" />
                        </Field>

                        <Field label="Vigência (dias) *" hint="geralmente 30" error={errors.duration_days}>
                            <input style={inputStyle} type="number" min="1"
                                value={data.duration_days} onChange={set('duration_days')}
                                placeholder="30" />
                        </Field>

                        {/* Preview por sessão */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                            {pricePerSession && (
                                <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px 14px' }}>
                                    <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Valor por sessão (estimado)</div>
                                    <div style={{ fontSize: '16px', fontWeight: 500, color: '#374151' }}>
                                        R$ {Number(pricePerSession).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                                        {data.sessions_per_week}x/sem × 4 semanas = {sessionsPerMonth} sessões
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Section>

                {/* ── Status (só no edit) ── */}
                {isEdit && (
                    <Section title="Status">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={!!data.active}
                                onChange={e => setData('active', e.target.checked)}
                                style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                            />
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 500 }}>Plano ativo</div>
                                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                    Planos inativos não aparecem para seleção em novos cadastros
                                </div>
                            </div>
                        </label>
                    </Section>
                )}

                {/* ── Ações ── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
                    <Link href="/plans" className="btn">Cancelar</Link>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={processing}
                        style={{ minWidth: '140px', justifyContent: 'center' }}
                    >
                        {processing ? 'Salvando…' : submitLabel}
                    </button>
                </div>

            </div>
        </form>
    )
}