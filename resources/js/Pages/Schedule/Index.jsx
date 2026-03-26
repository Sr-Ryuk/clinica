import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'

const MODALITY_COLOR = {
    pilates:      '#6366f1',
    fisioterapia: '#1D9E75',
    quiropraxia:  '#D85A30',
    avaliacao:    '#BA7517',
}

const STATUS_BADGE = {
    agendada:            { label: 'agendado',   cls: 'badge-blue'   },
    confirmada:          { label: 'confirmado', cls: 'badge-green'  },
    realizada:           { label: 'realizado',  cls: 'badge-gray'   },
    cancelada_aviso:     { label: 'cancelado',  cls: 'badge-red'    },
    cancelada_sem_aviso: { label: 'faltou',     cls: 'badge-red'    },
    reposicao_pendente:  { label: 'reposição',  cls: 'badge-amber'  },
}

function Initials({ name, size = 24 }) {
    const letters = name?.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() ?? '?'
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: '#EEEDFE', color: '#534AB7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
        }}>{letters}</div>
    )
}

// ── Modal base ────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: '16px',
        }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{
                background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px',
                border: '0.5px solid rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{title}</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>✕</button>
                </div>
                <div style={{ padding: '20px' }}>{children}</div>
            </div>
        </div>
    )
}

const inputStyle = { width: '100%', height: '36px', padding: '0 12px', border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: '8px', fontSize: '13px', color: '#1a1a1a', background: '#fff', outline: 'none', boxSizing: 'border-box' }
const fieldStyle = { marginBottom: '14px' }
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }

// ── Modal: Nova aula ──────────────────────────────────────────
function NewClassModal({ onClose, instructors, rooms, date }) {
    const { data, setData, post, processing, errors } = useForm({
        instructor_id: '',
        room_id: '',
        modality: 'pilates',
        session_type: 'dupla',
        max_students: 2,
        is_recurring: true,
        weekday: new Date(date).getDay(),
        specific_date: date,
        start_time: '07:00',
        end_time: '08:00',
        valid_from: date,
        valid_until: '',
    })

    function submit(e) {
        e.preventDefault()
        post('/schedule/classes', { onSuccess: onClose })
    }

    return (
        <Modal title="Nova aula" onClose={onClose}>
            <form onSubmit={submit}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Tipo</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[['true','Recorrente'],['false','Avulsa']].map(([val, lbl]) => (
                            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                                <input type="radio" checked={String(data.is_recurring) === val} onChange={() => setData('is_recurring', val === 'true')} />
                                {lbl}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Modalidade *</label>
                        <select style={inputStyle} value={data.modality} onChange={e => setData('modality', e.target.value)}>
                            <option value="pilates">Pilates</option>
                            <option value="fisioterapia">Fisioterapia</option>
                            <option value="quiropraxia">Quiropraxia</option>
                            <option value="avaliacao">Avaliação</option>
                        </select>
                    </div>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Formato *</label>
                        <select style={inputStyle} value={data.session_type} onChange={e => { setData('session_type', e.target.value); setData('max_students', { individual:1,dupla:2,trio:3,grupo:5 }[e.target.value] ?? 1) }}>
                            <option value="individual">Individual</option>
                            <option value="dupla">Dupla</option>
                            <option value="trio">Trio</option>
                            <option value="grupo">Grupo</option>
                        </select>
                    </div>
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Instrutor *</label>
                    <select style={inputStyle} value={data.instructor_id} onChange={e => setData('instructor_id', e.target.value)}>
                        <option value="">Selecione</option>
                        {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                    {errors.instructor_id && <p style={{ fontSize:'11px',color:'#ef4444',marginTop:'4px' }}>{errors.instructor_id}</p>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Sala *</label>
                    <select style={inputStyle} value={data.room_id} onChange={e => setData('room_id', e.target.value)}>
                        <option value="">Selecione</option>
                        {rooms.map(r => <option key={r.id} value={r.id}>{r.name} (cap. {r.capacity})</option>)}
                    </select>
                </div>

                {data.is_recurring ? (
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Dia da semana *</label>
                        <select style={inputStyle} value={data.weekday} onChange={e => setData('weekday', Number(e.target.value))}>
                            {[['1','Segunda'],['2','Terça'],['3','Quarta'],['4','Quinta'],['5','Sexta'],['6','Sábado'],['0','Domingo']].map(([v,l]) => (
                                <option key={v} value={v}>{l}</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Data *</label>
                        <input style={inputStyle} type="date" value={data.specific_date} onChange={e => setData('specific_date', e.target.value)} />
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Início *</label>
                        <input style={inputStyle} type="time" value={data.start_time} onChange={e => setData('start_time', e.target.value)} />
                        {errors.start_time && <p style={{ fontSize:'11px',color:'#ef4444',marginTop:'4px' }}>{errors.start_time}</p>}
                    </div>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Fim *</label>
                        <input style={inputStyle} type="time" value={data.end_time} onChange={e => setData('end_time', e.target.value)} />
                    </div>
                </div>

                {data.is_recurring && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Válido a partir de</label>
                            <input style={inputStyle} type="date" value={data.valid_from} onChange={e => setData('valid_from', e.target.value)} />
                        </div>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Válido até (opcional)</label>
                            <input style={inputStyle} type="date" value={data.valid_until} onChange={e => setData('valid_until', e.target.value)} />
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button type="button" onClick={onClose} className="btn">Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={processing} style={{ minWidth: '120px', justifyContent: 'center' }}>
                        {processing ? 'Salvando…' : 'Criar aula'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

// ── Modal: Agendar aluno ──────────────────────────────────────
function EnrollModal({ cls, date, students, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        class_id: cls.id,
        student_id: '',
        scheduled_date: date,
    })

    const enrolled = cls.enrollments.map(e => e.student_id)
    const available = students.filter(s => s.plan && !enrolled.includes(s.id))

    function submit(e) {
        e.preventDefault()
        post('/schedule/enroll', { onSuccess: onClose })
    }

    return (
        <Modal title={`Agendar aluno — ${cls.modality} ${cls.start_time}`} onClose={onClose}>
            <form onSubmit={submit}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                    Vagas disponíveis: <strong>{cls.available_spots}</strong>
                </p>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Aluno *</label>
                    <select style={inputStyle} value={data.student_id} onChange={e => setData('student_id', e.target.value)}>
                        <option value="">Selecione um aluno</option>
                        {available.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    {errors.student_id && <p style={{ fontSize:'11px',color:'#ef4444',marginTop:'4px' }}>{errors.student_id}</p>}
                    {available.length === 0 && <p style={{ fontSize:'12px',color:'#9ca3af',marginTop:'4px' }}>Todos os alunos ativos já estão agendados nesta aula.</p>}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onClose} className="btn">Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={processing || !data.student_id} style={{ minWidth: '120px', justifyContent: 'center' }}>
                        {processing ? 'Agendando…' : 'Agendar'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

// ── Painel lateral de detalhes ────────────────────────────────
function SidePanel({ cls, date, students, onEnroll, onClose }) {
    function confirm(enrollmentId) {
        router.patch(`/schedule/enrollments/${enrollmentId}/confirm`, {}, { preserveScroll: true })
    }

    function cancel(enrollmentId, withNotice) {
        if (!confirm(withNotice ? 'Cancelar com aviso (gera reposição)?' : 'Cancelar SEM aviso (sem reposição)?')) return
        router.patch(`/schedule/enrollments/${enrollmentId}/cancel`, { with_notice: withNotice }, { preserveScroll: true })
    }

    const color = MODALITY_COLOR[cls.modality] ?? '#888'

    return (
        <div style={{ borderLeft: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', background: '#fff', minHeight: '100%' }}>
            {/* Header */}
            <div style={{ padding: '16px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: color }} />
                        <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }}>
                            {cls.modality} · {cls.session_type}
                        </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', paddingLeft: '11px' }}>
                        {cls.start_time} – {cls.end_time}
                    </div>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px', lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                {/* Info */}
                <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                    {[['Sala', cls.room ?? '—'], ['Instrutor', cls.instructor ?? '—'], ['Vagas', `${cls.enrollments.length}/${cls.max_students}`]].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{k}</span>
                            <span style={{ fontSize: '12px', fontWeight: 500 }}>{v}</span>
                        </div>
                    ))}
                </div>

                {/* Alunos agendados */}
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Alunos</div>
                    {cls.enrollments.length === 0 && (
                        <p style={{ fontSize: '12px', color: '#d1d5db' }}>Nenhum aluno agendado.</p>
                    )}
                    {cls.enrollments.map(e => {
                        const badge = STATUS_BADGE[e.status] ?? { label: e.status, cls: 'badge-gray' }
                        return (
                            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
                                <Initials name={e.name} size={26} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</div>
                                    {e.is_makeup && <div style={{ fontSize: '10px', color: '#9ca3af' }}>reposição</div>}
                                </div>
                                <span className={`badge ${badge.cls}`}>{badge.label}</span>
                                {/* Ações rápidas */}
                                {e.status === 'agendada' && (
                                    <button
                                        onClick={() => confirm(e.id)}
                                        title="Confirmar presença"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', fontSize: '14px', lineHeight: 1 }}
                                    >✓</button>
                                )}
                                {['agendada', 'confirmada'].includes(e.status) && (
                                    <button
                                        onClick={() => {
                                            const withNotice = window.confirm('Cancelar com aviso (gera reposição)?\nCancelar = Sim, com aviso\nOK = Sem aviso')
                                            cancel(e.id, withNotice)
                                        }}
                                        title="Cancelar"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '14px', lineHeight: 1 }}
                                    >✕</button>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Ação: agendar aluno */}
                {cls.available_spots > 0 && (
                    <button onClick={onEnroll} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        + Agendar aluno
                    </button>
                )}
                {cls.available_spots === 0 && (
                    <div style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', padding: '8px' }}>
                        Aula lotada
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Página principal ──────────────────────────────────────────
export default function Index({ date, week, classes, instructors, rooms, students }) {
    const [selectedClass, setSelectedClass] = useState(null)
    const [showNewClass, setShowNewClass] = useState(false)
    const [showEnroll, setShowEnroll] = useState(false)
    const { props } = usePage()

    function goToDate(d) {
        router.get('/schedule', { date: d }, { preserveState: false })
    }

    const formattedWeekRange = (() => {
        if (!week?.length) return ''
        const first = week[0]
        const last = week[week.length - 1]
        const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
        const d1 = new Date(first.date + 'T12:00:00')
        const d2 = new Date(last.date + 'T12:00:00')
        return `${d1.getDate()} – ${d2.getDate()} ${months[d2.getMonth()]} ${d2.getFullYear()}`
    })()

    return (
        <AppLayout
            title="Agenda"
            actions={
                <button onClick={() => setShowNewClass(true)} className="btn btn-primary">
                    + Nova aula
                </button>
            }
        >
            <Head title="Agenda" />

            {/* Flash */}
            {props.flash?.success && (
                <div style={{ background: '#EAF3DE', color: '#3B6D11', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                    {props.flash.success}
                </div>
            )}

            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: '12px', overflow: 'hidden' }}>

                {/* Navegação semanal */}
                <div style={{ padding: '12px 16px', borderBottom: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button className="btn" style={{ padding: '0 10px', height: '30px', fontSize: '16px' }}
                        onClick={() => { const d = new Date(date+'T12:00:00'); d.setDate(d.getDate()-7); goToDate(d.toISOString().split('T')[0]) }}>
                        ‹
                    </button>
                    <button className="btn" style={{ fontSize: '12px', height: '30px' }}
                        onClick={() => goToDate(new Date().toISOString().split('T')[0])}>
                        Hoje
                    </button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: '13px', fontWeight: 500 }}>{formattedWeekRange}</span>
                    <button className="btn" style={{ padding: '0 10px', height: '30px', fontSize: '16px' }}
                        onClick={() => { const d = new Date(date+'T12:00:00'); d.setDate(d.getDate()+7); goToDate(d.toISOString().split('T')[0]) }}>
                        ›
                    </button>
                </div>

                {/* Dias da semana */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                    {week.map(day => (
                        <button key={day.date} onClick={() => goToDate(day.date)} style={{
                            padding: '10px 8px', textAlign: 'center', background: day.is_selected ? '#EEEDFE' : 'transparent',
                            border: 'none', borderRight: '0.5px solid rgba(0,0,0,0.06)', cursor: 'pointer',
                            borderLeft: day.is_selected ? '2px solid #6366f1' : '2px solid transparent',
                        }}>
                            <div style={{ fontSize: '10px', color: day.is_selected ? '#6366f1' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {day.day_name}
                            </div>
                            <div style={{ fontSize: '17px', fontWeight: 500, color: day.is_selected ? '#6366f1' : day.is_today ? '#1a1a1a' : '#374151', marginTop: '2px' }}>
                                {day.day_number}
                            </div>
                            {day.has_classes && (
                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: day.is_selected ? '#6366f1' : '#d1d5db', margin: '3px auto 0' }} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Corpo: lista + painel */}
                <div style={{ display: 'grid', gridTemplateColumns: selectedClass ? '1fr 300px' : '1fr', minHeight: '400px' }}>

                    {/* Lista do dia */}
                    <div style={{ padding: '16px' }}>
                        {classes.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 16px', color: '#9ca3af' }}>
                                <div style={{ fontSize: '28px', marginBottom: '8px' }}>◷</div>
                                <div style={{ fontSize: '13px' }}>Nenhuma aula neste dia.</div>
                                <button onClick={() => setShowNewClass(true)} style={{ marginTop: '12px', fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    + Criar aula para este dia
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {classes.map(cls => {
                                    const color = MODALITY_COLOR[cls.modality] ?? '#888'
                                    const isSelected = selectedClass?.id === cls.id
                                    const spots = cls.available_spots
                                    return (
                                        <div key={cls.id} onClick={() => setSelectedClass(isSelected ? null : cls)}
                                            style={{
                                                background: '#fff', border: `0.5px solid ${isSelected ? '#6366f1' : 'rgba(0,0,0,0.08)'}`,
                                                borderRadius: '10px', padding: '14px', cursor: 'pointer',
                                                transition: 'border-color 0.15s',
                                            }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                <div style={{ width: '3px', height: '38px', borderRadius: '2px', background: color, flexShrink: 0 }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{cls.start_time} – {cls.end_time}</span>
                                                        <span style={{
                                                            fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 500,
                                                            background: spots === 0 ? '#FCEBEB' : spots <= 1 ? '#FAEEDA' : '#EAF3DE',
                                                            color: spots === 0 ? '#A32D2D' : spots <= 1 ? '#854F0B' : '#3B6D11',
                                                        }}>
                                                            {cls.enrollments.length}/{cls.max_students}{spots > 0 ? ` · ${spots} vaga${spots>1?'s':''}` : ' · lotado'}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>
                                                        {cls.modality} · {cls.session_type}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                                        {cls.instructor ?? '—'} · {cls.room ?? '—'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Pills dos alunos */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '13px' }}>
                                                {cls.enrollments.map(e => (
                                                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f5f5f4', borderRadius: '20px', padding: '3px 8px 3px 3px' }}>
                                                        <Initials name={e.name} size={18} />
                                                        <span style={{ fontSize: '11px', color: '#6b7280' }}>{e.name.split(' ')[0]}</span>
                                                        <span className={`badge ${STATUS_BADGE[e.status]?.cls ?? 'badge-gray'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                                                            {STATUS_BADGE[e.status]?.label ?? e.status}
                                                        </span>
                                                    </div>
                                                ))}
                                                {spots > 0 && (
                                                    <button
                                                        onClick={ev => { ev.stopPropagation(); setSelectedClass(cls); setShowEnroll(true) }}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '0.5px dashed #d1d5db', borderRadius: '20px', padding: '3px 8px', fontSize: '11px', color: '#9ca3af', cursor: 'pointer' }}
                                                    >
                                                        + Agendar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Painel lateral */}
                    {selectedClass && (
                        <SidePanel
                            cls={selectedClass}
                            date={date}
                            students={students}
                            onEnroll={() => setShowEnroll(true)}
                            onClose={() => setSelectedClass(null)}
                        />
                    )}
                </div>
            </div>

            {/* Modais */}
            {showNewClass && (
                <NewClassModal
                    onClose={() => setShowNewClass(false)}
                    instructors={instructors}
                    rooms={rooms}
                    date={date}
                />
            )}

            {showEnroll && selectedClass && (
                <EnrollModal
                    cls={selectedClass}
                    date={date}
                    students={students}
                    onClose={() => setShowEnroll(false)}
                />
            )}
        </AppLayout>
    )
}