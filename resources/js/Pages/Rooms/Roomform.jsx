import { Link } from '@inertiajs/react'

const inputStyle = {
    width: '100%', height: '36px', padding: '0 12px',
    border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: '8px',
    fontSize: '13px', color: '#1a1a1a', background: '#fff',
    outline: 'none', boxSizing: 'border-box',
}

const Section = ({ title, subtitle, children }) => (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: '#fafafa' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{subtitle}</div>}
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

const EMPTY_EQUIPMENT = { name: '', type: 'aparelho', quantity: 1, brand: '', active: true }

export default function RoomForm({ data, setData, errors, processing, onSubmit, submitLabel = 'Salvar', isEdit = false }) {

    function addEquipment() {
        setData('equipment', [...(data.equipment ?? []), { ...EMPTY_EQUIPMENT }])
    }

    function updateEquipment(idx, field, val) {
        const list = [...(data.equipment ?? [])]
        list[idx] = { ...list[idx], [field]: field === 'quantity' ? Number(val) : val }
        setData('equipment', list)
    }

    function removeEquipment(idx) {
        setData('equipment', (data.equipment ?? []).filter((_, i) => i !== idx))
    }

    function toggleEquipmentActive(idx) {
        const list = [...(data.equipment ?? [])]
        list[idx] = { ...list[idx], active: !list[idx].active }
        setData('equipment', list)
    }

    return (
        <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>

                {/* ── Dados da sala ── */}
                <Section title="Dados da sala">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '16px' }}>

                        <Field label="Nome da sala *" error={errors.name} span={2}>
                            <input style={inputStyle} type="text" autoFocus
                                value={data.name} onChange={e => setData('name', e.target.value)}
                                placeholder="Ex: Sala Reformer, Sala Solo..." />
                        </Field>

                        <Field label="Capacidade (pessoas) *" error={errors.capacity}>
                            <input style={inputStyle} type="number" min="1"
                                value={data.capacity} onChange={e => setData('capacity', Number(e.target.value))}
                                placeholder="1" />
                        </Field>

                        <Field label="Descrição" error={errors.description} span={3}>
                            <textarea
                                style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: '1.5' }}
                                rows={2}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Informações adicionais sobre a sala..."
                            />
                        </Field>
                    </div>
                </Section>

                {/* ── Aparelhos e equipamentos ── */}
                <Section
                    title="Aparelhos e equipamentos"
                    subtitle="Cadastre os aparelhos disponíveis nesta sala. A quantidade é usada na validação de agendamentos."
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                        {/* Cabeçalho das colunas */}
                        {(data.equipment ?? []).length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 140px 36px', gap: '8px', padding: '0 2px' }}>
                                {['Nome *', 'Tipo', 'Qtd *', 'Marca', ''].map(h => (
                                    <span key={h} style={{ fontSize: '11px', color: '#9ca3af' }}>{h}</span>
                                ))}
                            </div>
                        )}

                        {(data.equipment ?? []).map((eq, idx) => (
                            <div key={idx} style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 80px 140px 36px',
                                gap: '8px',
                                alignItems: 'center',
                                opacity: eq.active ? 1 : 0.5,
                            }}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={eq.name}
                                    onChange={e => updateEquipment(idx, 'name', e.target.value)}
                                    placeholder="Ex: Reformer, Colchonete..."
                                />

                                <select
                                    style={inputStyle}
                                    value={eq.type}
                                    onChange={e => updateEquipment(idx, 'type', e.target.value)}
                                >
                                    <option value="aparelho">Aparelho</option>
                                    <option value="acessório">Acessório</option>
                                    <option value="equipamento">Equipamento</option>
                                </select>

                                <input
                                    style={inputStyle}
                                    type="number"
                                    min="1"
                                    value={eq.quantity}
                                    onChange={e => updateEquipment(idx, 'quantity', e.target.value)}
                                />

                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={eq.brand ?? ''}
                                    onChange={e => updateEquipment(idx, 'brand', e.target.value)}
                                    placeholder="Marca (opcional)"
                                />

                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {/* Botão ativar/desativar — só no edit (equipamento tem id) */}
                                    {isEdit && eq.id && (
                                        <button
                                            type="button"
                                            title={eq.active ? 'Desativar' : 'Ativar'}
                                            onClick={() => toggleEquipmentActive(idx)}
                                            style={{
                                                ...inputStyle,
                                                width: '36px', padding: 0, flexShrink: 0,
                                                color: eq.active ? '#f59e0b' : '#22c55e',
                                                cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}
                                        >
                                            {eq.active ? '⏸' : '▶'}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        title="Remover"
                                        onClick={() => removeEquipment(idx)}
                                        style={{
                                            ...inputStyle,
                                            width: '36px', padding: 0, flexShrink: 0,
                                            color: '#ef4444', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}

                        {(data.equipment ?? []).length === 0 && (
                            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>
                                Nenhum equipamento adicionado.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={addEquipment}
                            className="btn"
                            style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                        >
                            + Adicionar equipamento
                        </button>
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
                                <div style={{ fontSize: '13px', fontWeight: 500 }}>Sala ativa</div>
                                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                    Salas inativas não aparecem para agendamento
                                </div>
                            </div>
                        </label>
                    </Section>
                )}

                {/* ── Ações ── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
                    <Link href="/rooms" className="btn">Cancelar</Link>
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