import { Link, usePage, router } from '@inertiajs/react'

const NAV = [
    {
        section: 'Principal',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: '▦' },
            { label: 'Agenda',    href: '/schedule',  icon: '◷' },
        ],
    },
    {
        section: 'Cadastros',
        items: [
            { label: 'Alunos',      href: '/students',    icon: '◉' },
            { label: 'Instrutores', href: '/instructors', icon: '◎' },
            { label: 'Planos',      href: '/plans',       icon: '◈' },
            { label: 'Salas',       href: '/rooms',       icon: '▣' },
        ],
    },
    {
        section: 'Financeiro',
        items: [
            { label: 'Caixa',      href: '/finance',  icon: '◆' },
            { label: 'Relatórios', href: '/reports',  icon: '◇' },
        ],
    },
]

function NavItem({ item, active }) {
    return (
        <Link
            href={item.href}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 18px',
                fontSize: '13px',
                color: active ? '#fff' : '#999',
                background: active ? '#252525' : 'transparent',
                transition: 'background 0.15s, color 0.15s',
                borderLeft: active ? '2px solid #6366f1' : '2px solid transparent',
            }}
        >
            <span style={{ fontSize: '11px', opacity: 0.6 }}>{item.icon}</span>
            {item.label}
        </Link>
    )
}

export default function AppLayout({ children, title, actions }) {
    const page = usePage()
    const auth = page.props.auth
    const user = auth?.user
    const url = page.url ?? ''

    const initials = user?.name
        ?.split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase() ?? '??'

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: '220px',
                background: '#1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                overflowY: 'auto',
            }}>
                {/* Logo */}
                <div style={{ padding: '20px 18px 16px', borderBottom: '0.5px solid #2a2a2a' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '0.3px' }}>
                        Studio Pilates
                    </div>
                    <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                        Gestão interna
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, paddingTop: '8px' }}>
                    {NAV.map(group => (
                        <div key={group.section}>
                            <div style={{
                                fontSize: '10px',
                                color: '#555',
                                padding: '12px 18px 4px',
                                letterSpacing: '0.8px',
                                textTransform: 'uppercase',
                            }}>
                                {group.section}
                            </div>
                            {group.items.map(item => (
                                <NavItem
                                    key={item.href}
                                    item={item}
                                    active={url.startsWith(item.href)}
                                />
                            ))}
                        </div>
                    ))}
                </nav>

                {/* User footer */}
                <div style={{
                    padding: '14px 18px',
                    borderTop: '0.5px solid #2a2a2a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <div style={{
                        width: '28px', height: '28px',
                        borderRadius: '50%',
                        background: '#6366f1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 600, color: '#fff',
                        flexShrink: 0,
                    }}>
                        {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name ?? 'Usuário'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#555', textTransform: 'capitalize' }}>
                            {user?.role ?? ''}
                        </div>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        style={{ background: 'none', border: 'none', color: '#555', fontSize: '12px', cursor: 'pointer' }}
                        title="Sair"
                    >
                        ⏻
                    </Link>
                </div>
            </aside>

            {/* ── Conteúdo principal ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Topbar */}
                <header style={{
                    height: '52px',
                    borderBottom: '0.5px solid rgba(0,0,0,0.08)',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    gap: '12px',
                    flexShrink: 0,
                }}>
                    <h1 style={{ fontSize: '15px', fontWeight: 500, flex: 1, color: '#1a1a1a' }}>
                        {title}
                    </h1>
                    {actions}
                </header>

                {/* Page content */}
                <main style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px',
                    background: '#f5f5f4',
                }}>
                    {children}
                </main>
            </div>
        </div>
    )
}