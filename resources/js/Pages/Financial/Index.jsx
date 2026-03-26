import { useState } from 'react'
import AppLayout from '../../Layouts/AppLayout'
import { Head, router, useForm } from '@inertiajs/react'

export default function FinancialIndex({ transactions, summary, filters }) {
    const { data, setData, post, reset, processing } = useForm({
        type: 'expense', category: '', description: '', amount: '', due_date: '', status: 'paid'
    })

    const submit = (e) => {
        e.preventDefault()
        post('/financial', { onSuccess: () => reset() })
    }

    const markAsPaid = (id) => {
        router.patch(`/financial/${id}/pay`)
    }

    return (
        <AppLayout title="Caixa (Financeiro)">
            <Head title="Caixa" />

            {/* Cards de Resumo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Saldo do Mês</div>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: summary.balance >= 0 ? '#16a34a' : '#dc2626' }}>
                        R$ {Number(summary.balance).toFixed(2)}
                    </div>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Receitas (Pagas)</div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#16a34a' }}>R$ {Number(summary.totalIncome).toFixed(2)}</div>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Despesas (Pagas)</div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#dc2626' }}>R$ {Number(summary.totalExpense).toFixed(2)}</div>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>A Receber (Pendentes)</div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#ca8a04' }}>R$ {Number(summary.pendingIncome).toFixed(2)}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px' }}>
                {/* Form de Nova Transação */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Nova Movimentação</h3>
                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <select className="form-input" value={data.type} onChange={e => setData('type', e.target.value)}>
                            <option value="expense">Saída (Despesa)</option>
                            <option value="income">Entrada (Receita)</option>
                        </select>
                        <input className="form-input" type="text" placeholder="Descrição (ex: Luz)" value={data.description} onChange={e => setData('description', e.target.value)} required />
                        <input className="form-input" type="text" placeholder="Categoria (ex: utilidades)" value={data.category} onChange={e => setData('category', e.target.value)} required />
                        <input className="form-input" type="number" step="0.01" placeholder="Valor (R$)" value={data.amount} onChange={e => setData('amount', e.target.value)} required />
                        <input className="form-input" type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} required />
                        <select className="form-input" value={data.status} onChange={e => setData('status', e.target.value)}>
                            <option value="paid">Já está Pago</option>
                            <option value="pending">Pendente (A pagar/receber)</option>
                        </select>
                        <button type="submit" className="btn btn-primary" disabled={processing}>Adicionar</button>
                    </form>
                </div>

                {/* Tabela de Transações */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>
                            <tr>
                                <th style={{ padding: '12px 20px' }}>Data</th>
                                <th style={{ padding: '12px 20px' }}>Descrição</th>
                                <th style={{ padding: '12px 20px' }}>Pessoa/Origem</th>
                                <th style={{ padding: '12px 20px' }}>Valor</th>
                                <th style={{ padding: '12px 20px' }}>Status</th>
                                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? transactions.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}>
                                    <td style={{ padding: '12px 20px' }}>{t.due_date}</td>
                                    <td style={{ padding: '12px 20px', fontWeight: 500 }}>{t.description}</td>
                                    <td style={{ padding: '12px 20px', color: '#6b7280' }}>{t.person || '-'}</td>
                                    <td style={{ padding: '12px 20px', fontWeight: 600, color: t.type === 'income' ? '#16a34a' : '#dc2626' }}>
                                        {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '12px', fontSize: '11px',
                                            background: t.status === 'paid' ? '#dcfce7' : '#fef08a',
                                            color: t.status === 'paid' ? '#166534' : '#854d0e'
                                        }}>
                                            {t.status === 'paid' ? 'Pago' : 'Pendente'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                        {t.status === 'pending' && (
                                            <button onClick={() => markAsPaid(t.id)} className="btn" style={{ fontSize: '11px', padding: '4px 8px' }}>Baixar</button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Nenhuma transação neste mês.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    )
}