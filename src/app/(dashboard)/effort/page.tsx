'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAgents } from '@/lib/firestore/agents';
import { BarChart3, Clock, Zap, TrendingUp, Target } from 'lucide-react';

export default function EffortPage() {
    const [effortData] = useState([
        {
            id: '1',
            agentName: 'Priya Sharma',
            leadsAssigned: 45,
            leadsConverted: 12,
            activeFollowups: 8,
            daysActive: 25,
            avgCallDuration: 8.5,
            effortScore: 92,
            status: 'High Performer',
        },
        {
            id: '2',
            agentName: 'Rajesh Kumar',
            leadsAssigned: 38,
            leadsConverted: 9,
            activeFollowups: 6,
            daysActive: 22,
            avgCallDuration: 7.2,
            effortScore: 78,
            status: 'Good Performer',
        },
        {
            id: '3',
            agentName: 'Ananya Singh',
            leadsAssigned: 42,
            leadsConverted: 14,
            activeFollowups: 10,
            daysActive: 25,
            avgCallDuration: 9.1,
            effortScore: 88,
            status: 'High Performer',
        },
        {
            id: '4',
            agentName: 'Vikram Patel',
            leadsAssigned: 28,
            leadsConverted: 5,
            activeFollowups: 4,
            daysActive: 18,
            avgCallDuration: 6.2,
            effortScore: 62,
            status: 'Needs Improvement',
        },
        {
            id: '5',
            agentName: 'Neha Gupta',
            leadsAssigned: 51,
            leadsConverted: 16,
            activeFollowups: 12,
            daysActive: 25,
            avgCallDuration: 9.8,
            effortScore: 95,
            status: 'Top Performer',
        },
    ]);

    const { data: agents = [] } = useQuery({
        queryKey: ['agents'],
        queryFn: () => getAgents(),
    });

    const totalLeads = effortData.reduce((sum, e) => sum + e.leadsAssigned, 0);
    const totalConverted = effortData.reduce((sum, e) => sum + e.leadsConverted, 0);
    const avgEffortScore = (effortData.reduce((sum, e) => sum + e.effortScore, 0) / effortData.length).toFixed(0);
    const conversionRate = ((totalConverted / totalLeads) * 100).toFixed(1);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Top Performer':
                return { bg: '#DCFCE7', text: '#166534' };
            case 'High Performer':
                return { bg: '#D1FAE5', text: '#065F46' };
            case 'Good Performer':
                return { bg: '#D1E7F6', text: '#1E3A8A' };
            default:
                return { bg: '#FEE2E2', text: '#991B1B' };
        }
    };

    const getEffortColor = (score: number) => {
        if (score >= 90) return '#10B981';
        if (score >= 80) return '#4F46E5';
        if (score >= 70) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Agent Effort Dashboard</h1>
                    <p style={{ fontSize: 14, color: '#6B7280' }}>Track agent workload, performance metrics, and effort scores</p>
                </div>

                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Total Leads Assigned</div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{totalLeads}</div>
                            </div>
                            <Target size={24} style={{ color: '#4F46E5' }} />
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Conversion Rate</div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: '#10B981' }}>{conversionRate}%</div>
                                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>{totalConverted} conversions</div>
                            </div>
                            <TrendingUp size={24} style={{ color: '#10B981' }} />
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Avg Effort Score</div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: '#4F46E5' }}>{avgEffortScore}/100</div>
                            </div>
                            <Zap size={24} style={{ color: '#4F46E5' }} />
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Active Agents</div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{effortData.length}</div>
                            </div>
                            <BarChart3 size={24} style={{ color: '#F59E0B' }} />
                        </div>
                    </div>
                </div>

                {/* Agent Effort Table */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                                    <th style={{ textAlign: 'left', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Agent Name</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Leads Assigned</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Converted</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Conv. Rate</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Followups</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Avg Call Mins</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Effort Score</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {effortData
                                    .sort((a, b) => b.effortScore - a.effortScore)
                                    .map(effort => {
                                        const convRate = ((effort.leadsConverted / effort.leadsAssigned) * 100).toFixed(0);
                                        const statusColor = getStatusColor(effort.status);
                                        return (
                                            <tr key={effort.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                                <td style={{ padding: 16, fontSize: 13, color: '#111827', fontWeight: 500 }}>{effort.agentName}</td>
                                                <td style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>{effort.leadsAssigned}</td>
                                                <td style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#10B981', fontWeight: 600 }}>{effort.leadsConverted}</td>
                                                <td style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>{convRate}%</td>
                                                <td style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                                        <Clock size={14} style={{ color: '#F59E0B' }} />
                                                        {effort.activeFollowups}
                                                    </div>
                                                </td>
                                                <td style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>{effort.avgCallDuration}</td>
                                                <td style={{ padding: 16, textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                                        <div style={{
                                                            width: 32, height: 32, borderRadius: '50%',
                                                            background: getEffortColor(effort.effortScore),
                                                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: 11, fontWeight: 700,
                                                        }}>
                                                            {effort.effortScore}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: 16, textAlign: 'center' }}>
                                                    <div style={{
                                                        display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                                        background: statusColor.bg, color: statusColor.text,
                                                    }}>
                                                        {effort.status}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Effort Score Legend */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
                    <div style={{ background: '#DCFCE7', borderRadius: 12, padding: 16, border: '1px solid #BBEF63' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 4 }}>Excellent</div>
                        <div style={{ fontSize: 11, color: '#166534' }}>90-100 score</div>
                    </div>
                    <div style={{ background: '#D1FAE5', borderRadius: 12, padding: 16, border: '1px solid #6EE7B7' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Good</div>
                        <div style={{ fontSize: 11, color: '#065F46' }}>80-89 score</div>
                    </div>
                    <div style={{ background: '#FEF3C7', borderRadius: 12, padding: 16, border: '1px solid #FCD34D' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Fair</div>
                        <div style={{ fontSize: 11, color: '#92400E' }}>70-79 score</div>
                    </div>
                    <div style={{ background: '#FEE2E2', borderRadius: 12, padding: 16, border: '1px solid #FECACA' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', marginBottom: 4 }}>Needs Improvement</div>
                        <div style={{ fontSize: 11, color: '#991B1B' }}>Below 70 score</div>
                    </div>
                </div>

                {/* Info Box */}
                <div style={{ marginTop: 24, background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 13, color: '#0369A1', fontWeight: 600 }}>📊 Effort Score Metrics</div>
                    <div style={{ fontSize: 12, color: '#0369A1', marginTop: 8, lineHeight: '1.6' }}>
                        The effort score is calculated based on: leads assigned, conversion rate (30%), active followups (25%), call duration (20%), and days active (25%).
                        Higher scores indicate more productive and engaged agents.
                    </div>
                </div>
            </div>
        </div>
    );
}
