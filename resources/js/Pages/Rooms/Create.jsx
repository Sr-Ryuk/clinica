import AppLayout from '../../Layouts/AppLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import RoomForm from './RoomForm'

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name:        '',
        capacity:    1,
        description: '',
        equipment:   [],
    })

    function submit(e) {
        e.preventDefault()
        post('/rooms')
    }

    return (
        <AppLayout
            title="Nova sala"
            actions={<Link href="/rooms" className="btn">Voltar</Link>}
        >
            <Head title="Nova sala" />
            <RoomForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={submit}
                submitLabel="Criar sala"
            />
        </AppLayout>
    )
}