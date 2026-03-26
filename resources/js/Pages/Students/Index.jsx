import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'

const statusBadge = {
    ativo:    { bg: '#EAF3DE', color: '#3B6D11' },
    lead:     { bg: '#FAEEDA', color: '#854F0B' },
    suspenso: { bg: '#FCEBEB', color: '#A32D2D' },
    inativo:  { bg: '#F1EFE8', color: '#5F5E5A' },
}

const inputStyle = {
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

function Initials({ name }) {
    const letters = name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() ?? '??'
    return (
        <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#EEEDFE', color: '#534AB7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 600, flexShrink: 0,
        }}>
            {letters}
        </div>
    )
}

export default function Index({ students, filters }) {
    const [search, setSearch] = useState(filters?.search || '')
    const [status, setStatus] = useState(filters?.status || '')

    const handleFilter = (e) => {
        e.preventDefault()
        router.get('/students', { search, status }, { preserveState: true, replace: true })
    }

    const handleDelete = (student) => {
        if (confirm(`Remover o aluno "${student.name}"? Esta ação não pode ser desfeita.`)) {
            router.delete(`/students/${student.id}`)
        }
    }

    return (
        <AppLayout
            title="Alunos"
            actions={
                <Link href="/students/create" className="btn btn-primary">
                    + Novo aluno
                </Link>
            }
        >
            <Head title="Alunos" />

            {/* ── Filtros ── */}
            <div style={{
                background: '#fff',
                border: '0.5px solid rgba(0,0,0,0.08)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '16px',
            }}>
                <form onSubmit={handleFilter} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '5px' }}>
                            Buscar
                        </label>
                        <input
                            style={{ ...inputStyle, width: '100%' }}
                            type="text"
                            placeholder="Nome, CPF ou telefone..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ width: '160px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '5px' }}>
                            Status
                        </label>
                        <select
                            style={{ ...inputStyle, width: '100%' }}
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="ativo">Ativo</option>
                            <option value="lead">Lead</option>
                            <option value="suspenso">Suspenso</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    <button type="submit" className="btn" style={{ flexShrink: 0 }}>
                        Filtrar
                    </button>
                </form>
            </div>

            {/* ── Tabela ── */}
            <div style={{
                background: '#fff',
                border: '0.5px solid rgba(0,0,0,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                            <th style={{ padding: '11px 20px', fontWeight: 500, color: '#6b7280', textAlign: 'left' }}>Aluno</th>
                            <th style={{ padding: '11px 16px', fontWeight: 500, color: '#6b7280', textAlign: 'left' }}>Contato</th>
                            <th style={{ padding: '11px 16px', fontWeight: 500, color: '#6b7280', textAlign: 'left' }}>Plano</th>
                            <th style={{ padding: '11px 16px', fontWeight: 500, color: '#6b7280', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '11px 20px', fontWeight: 500, color: '#6b7280', textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.data.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                                    Nenhum aluno encontrado.
                                </td>
                            </tr>
                        )}
                        {students.data.map((student, i) => {
                            const badge = statusBadge[student.status] ?? statusBadge.inativo
                            const isLast = i === students.data.length - 1
                            return (
                                <tr
                                    key={student.id}
                                    style={{ borderBottom: isLast ? 'none' : '0.5px solid rgba(0,0,0,0.06)' }}
                                >
                                    <td style={{ padding: '12px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Initials name={student.name} />
                                            <div>
                                                <div style={{ fontWeight: 500, color: '#1a1a1a' }}>{student.name}</div>
                                                <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                                                    {student.cpf || 'CPF não informado'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ color: '#374151' }}>{student.phone}</div>
                                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>{student.email}</div>
                                    </td>

                                    <td style={{ padding: '12px 16px', color: '#374151' }}>
                                        {student.active_plan?.plan_name ?? (
                                            <span style={{ color: '#9ca3af' }}>Sem plano</span>
                                        )}
                                    </td>

                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            fontSize: '11px', fontWeight: 500,
                                            padding: '3px 10px', borderRadius: '20px',
                                            background: badge.bg, color: badge.color,
                                        }}>
                                            {student.status}
                                        </span>
                                    </td>

                                    <td style={{ padding: '12px 20px' }}>
                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                            <Link
                                                href={`/students/${student.id}`}
                                                className="btn"
                                                style={{ height: '30px', padding: '0 12px', fontSize: '12px' }}
                                            >
                                                Ver perfil
                                            </Link>
                                            <Link
                                                href={`/students/${student.id}/edit`}
                                                className="btn"
                                                style={{ height: '30px', padding: '0 12px', fontSize: '12px' }}
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(student)}
                                                className="btn"
                                                style={{ height: '30px', padding: '0 12px', fontSize: '12px', color: '#ef4444' }}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {/* ── Paginação ── */}
                {students.links && students.last_page > 1 && (
                    <div style={{
                        padding: '12px 20px',
                        borderTop: '0.5px solid rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: '#6b7280',
                    }}>
                        <span>
                            {students.from}–{students.to} de {students.total} alunos
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {students.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    style={{
                                        height: '28px',
                                        minWidth: '28px',
                                        padding: '0 8px',
                                        border: '0.5px solid rgba(0,0,0,0.12)',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        background: link.active ? '#6366f1' : '#fff',
                                        color: link.active ? '#fff' : link.url ? '#374151' : '#d1d5db',
                                        cursor: link.url ? 'pointer' : 'default',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}