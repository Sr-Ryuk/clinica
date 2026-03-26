import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, router } from '@inertiajs/react'

const EQUIPMENT_TYPE_COLOR = {
    aparelho:    { bg: '#EEEDFE', text: '#534AB7' },
    acessório:   { bg: '#E1F5EE', text: '#085041' },
    equipamento: { bg: '#FAEEDA', text: '#633806' },
}

function EquipmentTag({ eq }) {
    const colors = EQUIPMENT_TYPE_COLOR[eq.type] ?? { bg: '#F1EFE8', text: '#5F5E5A' }
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 10px',
            background: eq.active ? colors.bg : '#F1EFE8',
            borderRadius: '6px',
            opacity: eq.active ? 1 : 0.5,
        }}>
            <div>
                <span style={{ fontSize: '12px', fontWeight: 500, color: eq.active ? colors.text : '#888' }}>
                    {eq.name}
                </span>
                {eq.brand && (
                    <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '6px' }}>{eq.brand}</span>
                )}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 500, color: eq.active ? colors.text : '#888', marginLeft: '8px', flexShrink: 0 }}>
                ×{eq.quantity}
            </span>
        </div>
    )
}

function RoomCard({ room }) {
    function handleDelete() {
        if (!confirm(`Desativar a sala "${room.name}"?`)) return
        router.delete(`/rooms/${room.id}`)
    }

    return (
        <div style={{
            background: '#fff',
            border: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
            opacity: room.active ? 1 : 0.6,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{ padding: '16px 16px 12px', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
                            {room.name}
                        </div>
                        {room.description && (
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                {room.description}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                        <span className={`badge ${room.active ? 'badge-green' : 'badge-gray'}`}>
                            {room.active ? 'ativa' : 'inativa'}
                        </span>
                    </div>
                </div>

                {/* Capacidade e aulas */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                    <div>
                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>Capacidade</div>
                        <div style={{ fontSize: '15px', fontWeight: 500 }}>
                            {room.capacity} {room.capacity === 1 ? 'pessoa' : 'pessoas'}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>Aulas ativas</div>
                        <div style={{ fontSize: '15px', fontWeight: 500 }}>{room.active_classes}</div>
                    </div>
                </div>
            </div>

            {/* Equipamentos */}
            <div style={{ padding: '12px 16px', flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Aparelhos e equipamentos
                </div>
                {room.equipment.length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#d1d5db' }}>Nenhum equipamento cadastrado.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {room.equipment.map(eq => (
                            <EquipmentTag key={eq.id} eq={eq} />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '10px 16px',
                borderTop: '0.5px solid rgba(0,0,0,0.06)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
            }}>
                <Link href={`/rooms/${room.id}/edit`} style={{ fontSize: '12px', color: '#6366f1' }}>
                    Editar
                </Link>
                <button
                    onClick={handleDelete}
                    style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                    Desativar
                </button>
            </div>
        </div>
    )
}

export default function Index({ rooms }) {
    const active   = rooms.filter(r => r.active)
    const inactive = rooms.filter(r => !r.active)

    return (
        <AppLayout
            title="Salas"
            actions={
                <Link href="/rooms/create" className="btn btn-primary">
                    + Nova sala
                </Link>
            }
        >
            <Head title="Salas" />

            {rooms.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>▣</div>
                    <div style={{ fontSize: '14px' }}>Nenhuma sala cadastrada.</div>
                    <Link href="/rooms/create" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
                        Criar primeira sala
                    </Link>
                </div>
            )}

            {active.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
                        {active.length} sala{active.length !== 1 ? 's' : ''} ativa{active.length !== 1 ? 's' : ''}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                        {active.map(room => <RoomCard key={room.id} room={room} />)}
                    </div>
                </div>
            )}

            {inactive.length > 0 && (
                <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
                        {inactive.length} sala{inactive.length !== 1 ? 's' : ''} inativa{inactive.length !== 1 ? 's' : ''}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                        {inactive.map(room => <RoomCard key={room.id} room={room} />)}
                    </div>
                </div>
            )}
        </AppLayout>
    )
}