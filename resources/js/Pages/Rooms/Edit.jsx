import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import RoomForm from './RoomForm'

export default function Edit({ room }) {
    const { data, setData, put, processing, errors } = useForm({
        name:        room.name        ?? '',
        capacity:    room.capacity    ?? 1,
        description: room.description ?? '',
        active:      room.active      ?? true,
        equipment:   room.equipment   ?? [],
    })

    function submit(e) {
        e.preventDefault()
        put(`/rooms/${room.id}`)
    }

    return (
        <AppLayout
            title="Editar sala"
            actions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{room.name}</span>
                    <Link href="/rooms" className="btn">Voltar</Link>
                </div>
            }
        >
            <Head title={`Editar ${room.name}`} />
            <RoomForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={submit}
                submitLabel="Salvar alterações"
                isEdit
            />
        </AppLayout>
    )
}