import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, useForm } from '@inertiajs/react'

const Section = ({ title, children }) => (
    <div style={{
        background: '#fff',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
    }}>
        <div style={{
            padding: '14px 20px',
            borderBottom: '0.5px solid rgba(0,0,0,0.06)',
            background: '#fafafa',
        }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>{title}</span>
        </div>
        <div style={{ padding: '20px' }}>
            {children}
        </div>
    </div>
)

const Field = ({ label, error, children, span = 1 }) => (
    <div style={{ gridColumn: `span ${span}` }}>
        <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '6px',
        }}>
            {label}
        </label>
        {children}
        {error && (
            <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{error}</p>
        )}
    </div>
)

const inputStyle = {
    width: '100%',
    height: '36px',
    padding: '0 12px',
    border: '0.5px solid rgba(0,0,0,0.15)',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#1a1a1a',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
}

const textareaStyle = {
    ...inputStyle,
    height: 'auto',
    padding: '10px 12px',
    resize: 'vertical',
    lineHeight: '1.5',
}

const Grid = ({ cols = 2, children }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: '16px',
    }}>
        {children}
    </div>
)

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone: '', phone_secondary: '',
        cpf: '', rg: '', birth_date: '', gender: '',
        zip_code: '', address: '', address_number: '', address_complement: '',
        neighborhood: '', city: '', state: '',
        emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relation: '',
        health_notes: '', injury_history: '', physical_restrictions: '',
        medications: '', doctor_name: '', doctor_phone: '',
        status: 'lead', how_found_us: '', notes: '',
    })

    const submit = (e) => {
        e.preventDefault()
        post('/students')
    }

    return (
        <AppLayout
            title="Novo aluno"
            actions={
                <Link href="/students" className="btn">
                    Voltar
                </Link>
            }
        >
            <Head title="Novo aluno" />

            <form onSubmit={submit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>

                    {/* ── Dados pessoais ── */}
                    <Section title="Dados pessoais e contato">
                        <Grid cols={3}>
                            <Field label="Nome completo *" error={errors.name} span={2}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Nome completo"
                                    autoFocus
                                />
                            </Field>

                            <Field label="Gênero" error={errors.gender}>
                                <select
                                    style={inputStyle}
                                    value={data.gender}
                                    onChange={e => setData('gender', e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    <option value="F">Feminino</option>
                                    <option value="M">Masculino</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </Field>

                            <Field label="E-mail *" error={errors.email} span={2}>
                                <input
                                    style={inputStyle}
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="email@exemplo.com"
                                />
                            </Field>

                            <Field label="Data de nascimento" error={errors.birth_date}>
                                <input
                                    style={inputStyle}
                                    type="date"
                                    value={data.birth_date}
                                    onChange={e => setData('birth_date', e.target.value)}
                                />
                            </Field>

                            <Field label="CPF" error={errors.cpf}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.cpf}
                                    onChange={e => setData('cpf', e.target.value)}
                                    placeholder="000.000.000-00"
                                />
                            </Field>

                            <Field label="RG" error={errors.rg}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.rg}
                                    onChange={e => setData('rg', e.target.value)}
                                />
                            </Field>

                            <Field label="Telefone principal *" error={errors.phone}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="(35) 99999-0000"
                                />
                            </Field>

                            <Field label="Telefone secundário" error={errors.phone_secondary}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.phone_secondary}
                                    onChange={e => setData('phone_secondary', e.target.value)}
                                    placeholder="(35) 99999-0000"
                                />
                            </Field>
                        </Grid>
                    </Section>

                    {/* ── Endereço ── */}
                    <Section title="Endereço">
                        <Grid cols={6}>
                            <Field label="CEP" error={errors.zip_code} span={1}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.zip_code}
                                    onChange={e => setData('zip_code', e.target.value)}
                                    placeholder="00000-000"
                                />
                            </Field>

                            <Field label="Logradouro" error={errors.address} span={4}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    placeholder="Rua, Avenida..."
                                />
                            </Field>

                            <Field label="Número" error={errors.address_number} span={1}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.address_number}
                                    onChange={e => setData('address_number', e.target.value)}
                                />
                            </Field>

                            <Field label="Complemento" error={errors.address_complement} span={2}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.address_complement}
                                    onChange={e => setData('address_complement', e.target.value)}
                                    placeholder="Apto, Bloco..."
                                />
                            </Field>

                            <Field label="Bairro" error={errors.neighborhood} span={2}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.neighborhood}
                                    onChange={e => setData('neighborhood', e.target.value)}
                                />
                            </Field>

                            <Field label="Cidade" error={errors.city} span={2}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.city}
                                    onChange={e => setData('city', e.target.value)}
                                />
                            </Field>

                            <Field label="UF" error={errors.state} span={1}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.state}
                                    onChange={e => setData('state', e.target.value.toUpperCase())}
                                    placeholder="MG"
                                    maxLength={2}
                                />
                            </Field>
                        </Grid>
                    </Section>

                    {/* ── Emergência ── */}
                    <Section title="Contato de emergência">
                        <Grid cols={3}>
                            <Field label="Nome" error={errors.emergency_contact_name}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.emergency_contact_name}
                                    onChange={e => setData('emergency_contact_name', e.target.value)}
                                />
                            </Field>

                            <Field label="Parentesco" error={errors.emergency_contact_relation}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.emergency_contact_relation}
                                    onChange={e => setData('emergency_contact_relation', e.target.value)}
                                    placeholder="Mãe, cônjuge..."
                                />
                            </Field>

                            <Field label="Telefone" error={errors.emergency_contact_phone}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.emergency_contact_phone}
                                    onChange={e => setData('emergency_contact_phone', e.target.value)}
                                    placeholder="(35) 99999-0000"
                                />
                            </Field>
                        </Grid>
                    </Section>

                    {/* ── Saúde ── */}
                    <Section title="Informações de saúde">
                        <Grid cols={2}>
                            <Field label="Histórico geral de saúde" error={errors.health_notes} span={2}>
                                <textarea
                                    style={textareaStyle}
                                    rows={2}
                                    value={data.health_notes}
                                    onChange={e => setData('health_notes', e.target.value)}
                                    placeholder="Doenças, cirurgias, condições relevantes..."
                                />
                            </Field>

                            <Field label="Histórico de lesões" error={errors.injury_history}>
                                <textarea
                                    style={textareaStyle}
                                    rows={2}
                                    value={data.injury_history}
                                    onChange={e => setData('injury_history', e.target.value)}
                                />
                            </Field>

                            <Field label="Restrições físicas" error={errors.physical_restrictions}>
                                <textarea
                                    style={textareaStyle}
                                    rows={2}
                                    value={data.physical_restrictions}
                                    onChange={e => setData('physical_restrictions', e.target.value)}
                                />
                            </Field>

                            <Field label="Medicamentos em uso" error={errors.medications} span={2}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.medications}
                                    onChange={e => setData('medications', e.target.value)}
                                />
                            </Field>

                            <Field label="Médico responsável" error={errors.doctor_name}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.doctor_name}
                                    onChange={e => setData('doctor_name', e.target.value)}
                                />
                            </Field>

                            <Field label="Telefone do médico" error={errors.doctor_phone}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.doctor_phone}
                                    onChange={e => setData('doctor_phone', e.target.value)}
                                />
                            </Field>
                        </Grid>
                    </Section>

                    {/* ── Administrativo ── */}
                    <Section title="Dados administrativos">
                        <Grid cols={3}>
                            <Field label="Status" error={errors.status}>
                                <select
                                    style={inputStyle}
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="lead">Lead</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="suspenso">Suspenso</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </Field>

                            <Field label="Como conheceu a clínica?" error={errors.how_found_us} span={2}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.how_found_us}
                                    onChange={e => setData('how_found_us', e.target.value)}
                                    placeholder="Instagram, indicação, Google..."
                                />
                            </Field>

                            <Field label="Observações internas" error={errors.notes} span={3}>
                                <textarea
                                    style={textareaStyle}
                                    rows={2}
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Visível apenas para recepção e gestão..."
                                />
                            </Field>
                        </Grid>
                    </Section>

                    {/* ── Ações ── */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
                        <Link href="/students" className="btn">
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={processing}
                            style={{ minWidth: '140px', justifyContent: 'center' }}
                        >
                            {processing ? 'Salvando…' : 'Salvar aluno'}
                        </button>
                    </div>

                </div>
            </form>
        </AppLayout>
    )
}