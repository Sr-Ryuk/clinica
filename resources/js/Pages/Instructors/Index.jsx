import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'

const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

const CONTRACT_LABEL = {
    clt:      { label: 'CLT',      cls: 'badge-blue'   },
    pj:       { label: 'PJ',       cls: 'badge-purple' },
    autonomo: { label: 'Autônomo', cls: 'badge-amber'  },
}

function Initials({ name }) {
    const letters = name?.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase() ?? '?'
    return (
        <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: '#EEEDFE', color: '#534AB7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 600, flexShrink: 0,
        }}>
            {letters}
        </div>
    )
}

export default function Index({ instructors, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '')

    function handleSearch(e) {
        const val = e.target.value
        setSearch(val)
        router.get('/instructors', { search: val }, { preserveState: true, replace: true })
    }

    return (
        <AppLayout
            title="Instrutores"
            actions={
                <Link href="/instructors/create" className="btn btn-primary">
                    + Novo instrutor
                </Link>
            }
        >
            <Head title="Instrutores" />

            {/* Barra de busca */}
            <div style={{ marginBottom: '16px' }}>
                <input
                    className="input"
                    style={{ maxWidth: '320px' }}
                    type="text"
                    placeholder="Buscar por nome..."
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            {/* Tabela */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: '#fafafa' }}>
                            {['Instrutor', 'Contato', 'Registro', 'Contrato', 'Especialidades', 'Disponibilidade', ''].map(h => (
                                <th key={h} style={{ padding: '10px 16px', fontSize: '11px', fontWeight: 500, color: '#6b7280', textAlign: 'left', whiteSpace: 'nowrap' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {instructors.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                                    Nenhum instrutor encontrado.
                                </td>
                            </tr>
                        )}
                        {instructors.map(i => (
                            <tr key={i.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>

                                {/* Nome */}
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Initials name={i.name} />
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 500 }}>{i.name}</div>
                                            <div style={{ fontSize: '11px', color: '#6b7280' }}>{i.email}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Contato */}
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ fontSize: '12px', color: '#374151' }}>{i.phone ?? '—'}</div>
                                </td>

                                {/* Registro */}
                                <td style={{ padding: '12px 16px' }}>
                                    {i.council_type ? (
                                        <div style={{ fontSize: '12px' }}>
                                            <span style={{ color: '#6b7280' }}>{i.council_type}</span>
                                            <span style={{ color: '#374151', marginLeft: '4px' }}>{i.professional_id}</span>
                                        </div>
                                    ) : <span style={{ color: '#d1d5db' }}>—</span>}
                                </td>

                                {/* Contrato */}
                                <td style={{ padding: '12px 16px' }}>
                                    {i.contract_type ? (
                                        <span className={`badge ${CONTRACT_LABEL[i.contract_type]?.cls ?? 'badge-gray'}`}>
                                            {CONTRACT_LABEL[i.contract_type]?.label ?? i.contract_type}
                                        </span>
                                    ) : <span style={{ color: '#d1d5db' }}>—</span>}
                                </td>

                                {/* Especialidades */}
                                <td style={{ padding: '12px 16px', maxWidth: '200px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {i.specialties?.length > 0
                                            ? i.specialties.map(s => (
                                                <span key={s} className="badge badge-gray">{s}</span>
                                            ))
                                            : <span style={{ color: '#d1d5db', fontSize: '12px' }}>—</span>
                                        }
                                    </div>
                                </td>

                                {/* Disponibilidade */}
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        {i.availability?.length > 0
                                            ? i.availability.map((a, idx) => (
                                                <span key={idx} className="badge badge-green" style={{ fontSize: '10px' }}>
                                                    {a.weekday_name?.slice(0,3)} {a.start_time}–{a.end_time}
                                                </span>
                                            ))
                                            : <span style={{ color: '#d1d5db', fontSize: '12px' }}>—</span>
                                        }
                                    </div>
                                </td>

                                {/* Ações */}
                                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                                    <Link
                                        href={`/instructors/${i.id}/edit`}
                                        style={{ fontSize: '12px', color: '#6366f1', marginRight: '12px' }}
                                    >
                                        Editar
                                    </Link>
                                    <Link
                                        href={`/instructors/${i.id}`}
                                        method="delete"
                                        as="button"
                                        style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                        onClick={e => { if (!confirm(`Remover ${i.name}?`)) e.preventDefault() }}
                                    >
                                        Remover
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Contador */}
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#9ca3af' }}>
                {instructors.length} instrutor{instructors.length !== 1 ? 'es' : ''} encontrado{instructors.length !== 1 ? 's' : ''}
            </div>
        </AppLayout>
    )
}