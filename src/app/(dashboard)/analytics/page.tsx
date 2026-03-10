'use client';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeads } from '@/lib/firestore/leads';
import { getAgents } from '@/lib/firestore/agents';
import { TrendingUp, Users, Target, CheckCircle, Clock } from 'lucide-react';
import { PIPELINE_STAGES, LEAD_SOURCES } from '@/types';

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'
    
    const { data: leads = [] } = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
    });

    const { data: agents = [] } = useQuery({
        queryKey: ['agents'],
        queryFn: () => getAgents(),
    });

    // Calculate metrics
    const metrics = useMemo(() => {
        const total = leads.length;
        const booked = leads.filter(l => l.stage === 'Booked').length;
        const conversion = total > 0 ? ((booked / total) * 100).toFixed(1) : 0;
        
        // Stage distribution
        const stageDistribution = PIPELINE_STAGES.map(stage => ({
            stage,
            count: leads.filter(l => l.stage === stage).length,
        }));

        // Lead source distribution
        const sourceDistribution = LEAD_SOURCES.map(source => ({
            source,
            count: leads.filter(l => l.source === source).length,
        })).filter(s => s.count > 0);

        // Agent performance
        const agentPerformance = agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            totalLeads: leads.filter(l => l.assignedAgentId === agent.id).length,
            bookedLeads: leads.filter(l => l.assignedAgentId === agent.id && l.stage === 'Booked').length,
        })).sort((a, b) => b.bookedLeads - a.bookedLeads);

        return {
            total,
            booked,
            conversion,
            stageDistribution,
            sourceDistribution,
            agentPerformance,
        };
    }, [leads, agents]);

    const KpiCard = ({ label, value, icon: Icon, trend }: any) => (
        <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
            padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16,
        }}>
            <div style={{
                width: 48, height: 48, borderRadius: 12, background: '#E0E7FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#4F46E5', flexShrink: 0,
            }}>
                <Icon size={24} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{value}</div>
                {trend && <div style={{ fontSize: 11, color: trend.includes('+') ? '#10B981' : '#6B7280', marginTop: 4 }}>{trend}</div>}
            </div>
        </div>
    );

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Analytics</h1>
                        <p style={{ fontSize: 14, color: '#6B7280' }}>Performance metrics and insights</p>
                    </div>
                    <select
                        value={dateRange}
                        onChange={e => setDateRange(e.target.value)}
                        style={{
                            padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB',
                            background: '#fff', fontSize: 13, color: '#111827',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
                    <KpiCard label="Total Leads" value={metrics.total} icon={Users} />
                    <KpiCard label="Bookings" value={metrics.booked} icon={CheckCircle} />
                    <KpiCard label="Conversion Rate" value={`${metrics.conversion}%`} icon={TrendingUp} />
                    <KpiCard label="Active Agents" value={agents.length} icon={Users} />
                </div>

                {/* Charts & Tables */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 16 }}>
                    {/* Pipeline Distribution */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Pipeline Distribution</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {metrics.stageDistribution.map(({ stage, count }) => (
                                <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ flex: 1, fontSize: 13, color: '#6B7280' }}>{stage}</div>
                                    <div style={{
                                        width: Math.max(20, (count / Math.max(...metrics.stageDistribution.map(s => s.count), 1)) * 200),
                                        height: 24, background: '#E0E7FF', borderRadius: 4,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#4F46E5', fontSize: 11, fontWeight: 700,
                                    }}>
                                        {count > 0 && count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lead Sources */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Lead Sources</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {metrics.sourceDistribution.map(({ source, count }) => (
                                <div key={source} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ flex: 1, fontSize: 13, color: '#6B7280' }}>{source}</div>
                                    <div style={{
                                        width: Math.max(20, (count / Math.max(...metrics.sourceDistribution.map(s => s.count), 1)) * 200),
                                        height: 24, background: '#FEE2E2', borderRadius: 4,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#991B1B', fontSize: 11, fontWeight: 700,
                                    }}>
                                        {count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Agent Performance */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20, marginTop: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Agent Performance</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Agent</th>
                                    <th style={{ textAlign: 'center', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Total Leads</th>
                                    <th style={{ textAlign: 'center', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Bookings</th>
                                    <th style={{ textAlign: 'center', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Conversion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.agentPerformance.map(agent => (
                                    <tr key={agent.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: 12, fontSize: 13, color: '#111827', fontWeight: 500 }}>{agent.name}</td>
                                        <td style={{ textAlign: 'center', padding: 12, fontSize: 13, color: '#6B7280' }}>{agent.totalLeads}</td>
                                        <td style={{ textAlign: 'center', padding: 12, fontSize: 13, color: '#111827', fontWeight: 600 }}>{agent.bookedLeads}</td>
                                        <td style={{ textAlign: 'center', padding: 12, fontSize: 13, color: '#10B981', fontWeight: 600 }}>
                                            {agent.totalLeads > 0 ? ((agent.bookedLeads / agent.totalLeads) * 100).toFixed(0) : 0}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
