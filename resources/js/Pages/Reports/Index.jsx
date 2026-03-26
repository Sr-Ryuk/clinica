import AppLayout from '../../Layouts/AppLayout'
import { Head, router } from '@inertiajs/react'

export default function ReportsIndex({ dre, stats, year }) {
    const changeYear = (e) => {
        router.get('/reports', { year: e.target.value })
    }

    return (
        <AppLayout title="Relatórios e DRE">
            <Head title="Relatórios" />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>DRE - {year}</h2>
                <input type="number" value={year} onChange={changeYear} className="form-input" style={{ width: '100px' }} />
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '24px' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>
                        <tr>
                            <th style={{ padding: '12px 20px' }}>Mês</th>
                            <th style={{ padding: '12px 20px', color: '#16a34a' }}>Receitas</th>
                            <th style={{ padding: '12px 20px', color: '#dc2626' }}>Despesas</th>
                            <th style={{ padding: '12px 20px' }}>Lucro Líquido</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dre.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}>
                                <td style={{ padding: '12px 20px', fontWeight: 500, textTransform: 'capitalize' }}>{row.month}</td>
                                <td style={{ padding: '12px 20px' }}>R$ {Number(row.income).toFixed(2)}</td>
                                <td style={{ padding: '12px 20px' }}>R$ {Number(row.expense).toFixed(2)}</td>
                                <td style={{ padding: '12px 20px', fontWeight: 600, color: row.profit >= 0 ? '#16a34a' : '#dc2626' }}>
                                    R$ {Number(row.profit).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', width: '300px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Indicadores do Ano</h3>
                <div style={{ marginBottom: '8px', fontSize: '13px' }}>Aulas Realizadas: <strong>{stats.classesGiven}</strong></div>
                <div style={{ fontSize: '13px' }}>Lucro Anual: <strong style={{ color: stats.totalAnnualProfit >= 0 ? '#16a34a' : '#dc2626' }}>R$ {Number(stats.totalAnnualProfit).toFixed(2)}</strong></div>
            </div>
        </AppLayout>
    )
}