import { Link } from '@inertiajs/react'

const WEEKDAYS = [
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' },
]

const Section = ({ title, children }) => (
    <div style={{
        background: '#fff',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
    }}>
        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: '#fafafa' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>{title}</span>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
    </div>
)

const Field = ({ label, error, children, span = 1 }) => (
    <div style={{ gridColumn: `span ${span}` }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
            {label}
        </label>
        {children}
        {error && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{error}</p>}
    </div>
)

const Grid = ({ cols = 2, children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: '16px' }}>
        {children}
    </div>
)

const inputStyle = {
    width: '100%', height: '36px', padding: '0 12px',
    border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: '8px',
    fontSize: '13px', color: '#1a1a1a', background: '#fff',
    outline: 'none', boxSizing: 'border-box',
}

export default function InstructorForm({ data, setData, errors, processing, onSubmit, submitLabel = 'Salvar' }) {

    // ── Especialidades ────────────────────────────────────────
    function addSpecialty() {
        setData('specialties', [...(data.specialties ?? []), ''])
    }

    function updateSpecialty(idx, val) {
        const list = [...(data.specialties ?? [])]
        list[idx] = val
        setData('specialties', list)
    }

    function removeSpecialty(idx) {
        setData('specialties', (data.specialties ?? []).filter((_, i) => i !== idx))
    }

    // ── Disponibilidade ───────────────────────────────────────
    function addSlot() {
        setData('availability', [...(data.availability ?? []), { weekday: 1, start_time: '07:00', end_time: '12:00' }])
    }

    function updateSlot(idx, field, val) {
        const list = [...(data.availability ?? [])]
        list[idx] = { ...list[idx], [field]: field === 'weekday' ? Number(val) : val }
        setData('availability', list)
    }

    function removeSlot(idx) {
        setData('availability', (data.availability ?? []).filter((_, i) => i !== idx))
    }

    return (
        <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>

                {/* ── Dados pessoais ── */}
                <Section title="Dados pessoais e contato">
                    <Grid cols={3}>
                        <Field label="Nome completo *" error={errors.name} span={2}>
                            <input style={inputStyle} type="text" autoFocus
                                value={data.name} onChange={e => setData('name', e.target.value)}
                                placeholder="Nome completo" />
                        </Field>

                        <Field label="Data de nascimento" error={errors.birth_date}>
                            <input style={inputStyle} type="date"
                                value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} />
                        </Field>

                        <Field label="E-mail *" error={errors.email} span={2}>
                            <input style={inputStyle} type="email"
                                value={data.email} onChange={e => setData('email', e.target.value)}
                                placeholder="instrutor@exemplo.com" />
                        </Field>

                        <Field label="Telefone" error={errors.phone}>
                            <input style={inputStyle} type="text"
                                value={data.phone} onChange={e => setData('phone', e.target.value)}
                                placeholder="(35) 99999-0000" />
                        </Field>

                        <Field label="CPF" error={errors.cpf}>
                            <input style={inputStyle} type="text"
                                value={data.cpf} onChange={e => setData('cpf', e.target.value)}
                                placeholder="000.000.000-00" />
                        </Field>

                        {/* Senha apenas no Create — no Edit fica vazio = não altera */}
                        <Field label="Senha de acesso" error={errors.password} span={2}>
                            <input style={inputStyle} type="password"
                                value={data.password ?? ''} onChange={e => setData('password', e.target.value)}
                                placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
                        </Field>
                    </Grid>
                </Section>

                {/* ── Registro profissional ── */}
                <Section title="Registro profissional">
                    <Grid cols={3}>
                        <Field label="Conselho (CREFITO, CRM...)" error={errors.council_type}>
                            <input style={inputStyle} type="text"
                                value={data.council_type} onChange={e => setData('council_type', e.target.value)}
                                placeholder="CREFITO" />
                        </Field>

                        <Field label="Número do registro" error={errors.professional_id} span={2}>
                            <input style={inputStyle} type="text"
                                value={data.professional_id} onChange={e => setData('professional_id', e.target.value)}
                                placeholder="CREFITO-4/12345-F" />
                        </Field>
                    </Grid>
                </Section>

                {/* ── Contrato ── */}
                <Section title="Contrato e remuneração">
                    <Grid cols={3}>
                        <Field label="Tipo de contrato" error={errors.contract_type}>
                            <select style={inputStyle} value={data.contract_type} onChange={e => setData('contract_type', e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="clt">CLT</option>
                                <option value="pj">PJ</option>
                                <option value="autonomo">Autônomo</option>
                            </select>
                        </Field>

                        <Field label="Salário / Cachê (R$)" error={errors.salary}>
                            <input style={inputStyle} type="number" step="0.01" min="0"
                                value={data.salary} onChange={e => setData('salary', e.target.value)}
                                placeholder="0,00" />
                        </Field>

                        <Field label="Data de admissão" error={errors.hired_at}>
                            <input style={inputStyle} type="date"
                                value={data.hired_at} onChange={e => setData('hired_at', e.target.value)} />
                        </Field>
                    </Grid>
                </Section>

                {/* ── Especialidades ── */}
                <Section title="Especialidades">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(data.specialties ?? []).length === 0 && (
                            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>
                                Nenhuma especialidade adicionada.
                            </p>
                        )}
                        {(data.specialties ?? []).map((s, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    style={{ ...inputStyle, flex: 1 }}
                                    type="text"
                                    value={s}
                                    onChange={e => updateSpecialty(idx, e.target.value)}
                                    placeholder="Ex: Pilates Reformer, Fisioterapia Ortopédica..."
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSpecialty(idx)}
                                    style={{ ...inputStyle, width: '36px', padding: 0, color: '#ef4444', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSpecialty}
                            className="btn"
                            style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                        >
                            + Adicionar especialidade
                        </button>
                    </div>
                </Section>

                {/* ── Disponibilidade ── */}
                <Section title="Disponibilidade semanal">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(data.availability ?? []).length === 0 && (
                            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>
                                Nenhum horário adicionado.
                            </p>
                        )}
                        {(data.availability ?? []).map((slot, idx) => (
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 36px', gap: '8px', alignItems: 'center' }}>
                                <select
                                    style={inputStyle}
                                    value={slot.weekday}
                                    onChange={e => updateSlot(idx, 'weekday', e.target.value)}
                                >
                                    {WEEKDAYS.map(d => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>

                                <input
                                    style={inputStyle}
                                    type="time"
                                    value={slot.start_time}
                                    onChange={e => updateSlot(idx, 'start_time', e.target.value)}
                                />

                                <input
                                    style={inputStyle}
                                    type="time"
                                    value={slot.end_time}
                                    onChange={e => updateSlot(idx, 'end_time', e.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={() => removeSlot(idx)}
                                    style={{ ...inputStyle, width: '36px', padding: 0, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {/* Legenda das colunas */}
                        {(data.availability ?? []).length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 36px', gap: '8px', paddingLeft: '2px' }}>
                                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Dia da semana</span>
                                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Início</span>
                                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Fim</span>
                                <span />
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={addSlot}
                            className="btn"
                            style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                        >
                            + Adicionar horário
                        </button>
                    </div>
                </Section>

                {/* ── Bio e notas ── */}
                <Section title="Informações adicionais">
                    <Grid cols={1}>
                        <Field label="Bio (visível para alunos no futuro)" error={errors.bio}>
                            <textarea
                                style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: '1.5' }}
                                rows={2}
                                value={data.bio}
                                onChange={e => setData('bio', e.target.value)}
                                placeholder="Apresentação breve do instrutor..."
                            />
                        </Field>

                        <Field label="Observações internas" error={errors.notes}>
                            <textarea
                                style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: '1.5' }}
                                rows={2}
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                placeholder="Visível apenas para gestão..."
                            />
                        </Field>
                    </Grid>
                </Section>

                {/* ── Ações ── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
                    <Link href="/instructors" className="btn">Cancelar</Link>
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