import { useForm } from '@inertiajs/react'

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    })

    function submit(e) {
        e.preventDefault()
        post('/login')
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f4',
        }}>
            <div style={{ width: '100%', maxWidth: '360px', padding: '0 16px' }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '44px', height: '44px',
                        background: '#6366f1',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 12px',
                        fontSize: '20px',
                    }}>
                        ✦
                    </div>
                    <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
                        Studio Pilates
                    </h1>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                        Acesse sua conta
                    </p>
                </div>

                {/* Card do formulário */}
                <div style={{
                    background: '#fff',
                    border: '0.5px solid rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    padding: '28px 24px',
                }}>
                    <form onSubmit={submit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                                E-mail
                            </label>
                            <input
                                className="input"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="seu@email.com"
                                autoFocus
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                                Senha
                            </label>
                            <input
                                className="input"
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={processing}
                            style={{ width: '100%', justifyContent: 'center', height: '40px' }}
                        >
                            {processing ? 'Entrando…' : 'Entrar'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>
                    Acesso restrito a colaboradores da clínica.
                </p>
            </div>
        </div>
    )
}