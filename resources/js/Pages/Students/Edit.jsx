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

export default function Edit({ student }) {
    const { data, setData, put, processing, errors } = useForm({
        name:                       student.name                       || '',
        email:                      student.email                      || '',
        phone:                      student.phone                      || '',
        phone_secondary:            student.phone_secondary            || '',
        cpf:                        student.cpf                        || '',
        rg:                         student.rg                         || '',
        birth_date:                 student.birth_date                 || '',
        gender:                     student.gender                     || '',
        zip_code:                   student.zip_code                   || '',
        address:                    student.address?.street            || '',
        address_number:             student.address?.number            || '',
        address_complement:         student.address?.complement        || '',
        neighborhood:               student.address?.neighborhood      || '',
        city:                       student.address?.city              || '',
        state:                      student.address?.state             || '',
        emergency_contact_name:     student.emergency_contact?.name     || '',
        emergency_contact_phone:    student.emergency_contact?.phone    || '',
        emergency_contact_relation: student.emergency_contact?.relation || '',
        health_notes:               student.health?.notes              || '',
        injury_history:             student.health?.injury_history     || '',
        physical_restrictions:      student.health?.physical_restrictions || '',
        medications:                student.health?.medications        || '',
        doctor_name:                student.health?.doctor_name        || '',
        doctor_phone:               student.health?.doctor_phone       || '',
        status:                     student.status                     || 'lead',
        how_found_us:               student.how_found_us               || '',
        notes:                      student.notes                      || '',
    })

    const set = (field) => (e) => setData(field, e.target.value)

    const submit = (e) => {
        e.preventDefault()
        put(`/students/${student.id}`)
    }

    return (
        <AppLayout
            title={`Editar aluno`}
            actions={
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{student.name}</span>
                    <Link href="/students" className="btn">Voltar</Link>
                </div>
            }
        >
            <Head title={`Editar ${student.name}`} />

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
                                    onChange={set('name')}
                                    placeholder="Nome completo"
                                    autoFocus
                                />
                            </Field>

                            <Field label="Gênero" error={errors.gender}>
                                <select style={inputStyle} value={data.gender} onChange={set('gender')}>
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
                                    onChange={set('email')}
                                    placeholder="email@exemplo.com"
                                />
                            </Field>

                            <Field label="Data de nascimento" error={errors.birth_date}>
                                <input
                                    style={inputStyle}
                                    type="date"
                                    value={data.birth_date}
                                    onChange={set('birth_date')}
                                />
                            </Field>

                            <Field label="CPF" error={errors.cpf}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.cpf}
                                    onChange={set('cpf')}
                                    placeholder="000.000.000-00"
                                />
                            </Field>

                            <Field label="RG" error={errors.rg}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.rg}
                                    onChange={set('rg')}
                                />
                            </Field>

                            <Field label="Telefone principal *" error={errors.phone}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.phone}
                                    onChange={set('phone')}
                                    placeholder="(35) 99999-0000"
                                />
                            </Field>

                            <Field label="Telefone secundário" error={errors.phone_secondary}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.phone_secondary}
                                    onChange={set('phone_secondary')}
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
                                    onChange={set('zip_code')}
                                    placeholder="00000-000"
                                />
                            </Field>

                            <Field label="Logradouro" error={errors.address} span={4}>
    <input
        style={inputStyle}
        type="text"
        value={data.address}
        onChange={set('address')}
        placeholder="Rua, Avenida..."
    />
</Field>

                            <Field label="Número" error={errors.address_number} span={1}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.address_number}
                                    onChange={set('address_number')}
                                />
                            </Field>

                            <Field label="Complemento" error={errors.address_complement} span={2}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.address_complement}
                                    onChange={set('address_complement')}
                                    placeholder="Apto, Bloco..."
                                />
                            </Field>

                            <Field label="Bairro" error={errors.neighborhood} span={2}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.neighborhood}
                                    onChange={set('neighborhood')}
                                />
                            </Field>

                            <Field label="Cidade" error={errors.city} span={2}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.city}
                                    onChange={set('city')}
                                />
                            </Field>

                            <Field label="UF" error={errors.state} span={1}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.state}
                                    onChange={(e) => setData('state', e.target.value.toUpperCase())}
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
                                    onChange={set('emergency_contact_name')}
                                />
                            </Field>

                            <Field label="Parentesco" error={errors.emergency_contact_relation}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.emergency_contact_relation}
                                    onChange={set('emergency_contact_relation')}
                                    placeholder="Mãe, cônjuge..."
                                />
                            </Field>

                            <Field label="Telefone" error={errors.emergency_contact_phone}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.emergency_contact_phone}
                                    onChange={set('emergency_contact_phone')}
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
                                    onChange={set('health_notes')}
                                    placeholder="Doenças, cirurgias, condições relevantes..."
                                />
                            </Field>

                            <Field label="Histórico de lesões" error={errors.injury_history}>
                                <textarea
                                    style={textareaStyle}
                                    rows={2}
                                    value={data.injury_history}
                                    onChange={set('injury_history')}
                                />
                            </Field>

                            <Field label="Restrições físicas" error={errors.physical_restrictions}>
                                <textarea
                                    style={textareaStyle}
                                    rows={2}
                                    value={data.physical_restrictions}
                                    onChange={set('physical_restrictions')}
                                />
                            </Field>

                            <Field label="Medicamentos em uso" error={errors.medications} span={2}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.medications}
                                    onChange={set('medications')}
                                />
                            </Field>

                            <Field label="Médico responsável" error={errors.doctor_name}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.doctor_name}
                                    onChange={set('doctor_name')}
                                />
                            </Field>

                            <Field label="Telefone do médico" error={errors.doctor_phone}>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={data.doctor_phone}
                                    onChange={set('doctor_phone')}
                                />
                            </Field>
                        </Grid>
                    </Section>

                    {/* ── Administrativo ── */}
                    <Section title="Dados administrativos">
                        <Grid cols={3}>
                            <Field label="Status" error={errors.status}>
                                <select style={inputStyle} value={data.status} onChange={set('status')}>
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
                                    onChange={set('how_found_us')}
                                    placeholder="Instagram, indicação, Google..."
                                />
                            </Field>

                            <Field label="Observações internas" error={errors.notes} span={3}>
                                <textarea
                                    style={textareaStyle}
                                    rows={2}
                                    value={data.notes}
                                    onChange={set('notes')}
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
                            {processing ? 'Salvando…' : 'Salvar alterações'}
                        </button>
                    </div>

                </div>
            </form>
        </AppLayout>
    )
}