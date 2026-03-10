'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeads } from '@/lib/firestore/leads';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

export default function HistoricalPage() {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    
    const { data: leads = [] } = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
    });

    // Filter leads by selected month
    const monthLeads = leads.filter(lead => {
        const leadMonth = new Date(lead.createdAt as any).toISOString().slice(0, 7);
        return leadMonth === selectedMonth;
    });

    // Calculate historical metrics
    const metrics = {
        newLeads: monthLeads.length,
        bookedLeads: monthLeads.filter(l => l.stage === 'Booked').length,
        lostLeads: monthLeads.filter(l => l.stage === 'Lost').length,
        avgConversionRate: monthLeads.length > 0 
            ? ((monthLeads.filter(l => l.stage === 'Booked').length / monthLeads.length) * 100).toFixed(1)
            : 0,
    };

    const StatCard = ({ label, value, icon: Icon, trend, color }: any) => (
        <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
            padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16,
        }}>
            <div style={{
                width: 48, height: 48, borderRadius: 12, background: `${color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color, flexShrink: 0,
            }}>
                <Icon size={24} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{value}</div>
                {trend && (
                    <div style={{ 
                        fontSize: 11, 
                        color: trend.includes('+') ? '#10B981' : '#EF4444', 
                        marginTop: 4 
                    }}>
                        {trend}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Historical Data</h1>
                        <p style={{ fontSize: 14, color: '#6B7280' }}>View past performance and trends</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <Calendar size={20} color="#6B7280" />
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            style={{
                                padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB',
                                background: '#fff', fontSize: 13, color: '#111827',
                            }}
                        />
                    </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
                    <StatCard label="New Leads" value={metrics.newLeads} icon={TrendingUp} color="#3B82F6" />
                    <StatCard label="Booked" value={metrics.bookedLeads} icon={TrendingUp} color="#10B981" trend={`+${metrics.bookedLeads}`} />
                    <StatCard label="Lost Leads" value={metrics.lostLeads} icon={TrendingDown} color="#EF4444" />
                    <StatCard label="Conversion Rate" value={`${metrics.avgConversionRate}%`} icon={TrendingUp} color="#8B5CF6" />
                </div>

                {/* Lead Details Table */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Leads in {selectedMonth}</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Name</th>
                                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Source</th>
                                    <th style={{ textAlign: 'center', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Stage</th>
                                    <th style={{ textAlign: 'center', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Agent</th>
                                    <th style={{ textAlign: 'center', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#6B7280' }}>
                                            No leads found for {selectedMonth}
                                        </td>
                                    </tr>
                                ) : (
                                    monthLeads.map(lead => (
                                        <tr key={lead.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: 12, fontSize: 13, color: '#111827', fontWeight: 500 }}>{lead.name}</td>
                                            <td style={{ padding: 12, fontSize: 13, color: '#6B7280' }}>{lead.source}</td>
                                            <td style={{ padding: 12, textAlign: 'center', fontSize: 12, fontWeight: 600 }}>
                                                <span style={{
                                                    display: 'inline-block', padding: '4px 12px', borderRadius: 12,
                                                    background: '#E0E7FF', color: '#4F46E5',
                                                }}>
                                                    {lead.stage}
                                                </span>
                                            </td>
                                            <td style={{ padding: 12, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>{lead.assignedAgentName || 'Unassigned'}</td>
                                            <td style={{ padding: 12, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>
                                                {new Date(lead.createdAt as any).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
