'use client';
import { useQuery } from '@tanstack/react-query';
import { getAgents } from '@/lib/firestore/agents';
import { Trophy, TrendingUp, Target, Award } from 'lucide-react';

export default function AgentLeaderboard() {
    const { data: agents = [] } = useQuery({
        queryKey: ['agents'],
        queryFn: () => getAgents(),
    });

    // Mock leaderboard data with performance metrics
    const leaderboardData = [
        {
            rank: 1,
            agentName: 'Neha Gupta',
            leadsConverted: 16,
            conversionRate: 31.4,
            avgDealValue: 2850,
            totalRevenue: 45600,
            streak: 5,
            tier: 'Platinum',
        },
        {
            rank: 2,
            agentName: 'Priya Sharma',
            leadsConverted: 12,
            conversionRate: 26.7,
            avgDealValue: 2750,
            totalRevenue: 33000,
            streak: 3,
            tier: 'Gold',
        },
        {
            rank: 3,
            agentName: 'Ananya Singh',
            leadsConverted: 14,
            conversionRate: 33.3,
            avgDealValue: 2600,
            totalRevenue: 36400,
            streak: 4,
            tier: 'Gold',
        },
        {
            rank: 4,
            agentName: 'Rajesh Kumar',
            leadsConverted: 9,
            conversionRate: 23.7,
            avgDealValue: 2500,
            totalRevenue: 22500,
            streak: 2,
            tier: 'Silver',
        },
        {
            rank: 5,
            agentName: 'Vikram Patel',
            leadsConverted: 5,
            conversionRate: 17.9,
            avgDealValue: 2300,
            totalRevenue: 11500,
            streak: 0,
            tier: 'Bronze',
        },
    ];

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Platinum':
                return { bg: '#E0E7FF', text: '#4F46E5', badge: '⭐⭐⭐' };
            case 'Gold':
                return { bg: '#FEF3C7', text: '#D97706', badge: '⭐⭐' };
            case 'Silver':
                return { bg: '#E5E7EB', text: '#6B7280', badge: '⭐' };
            case 'Bronze':
                return { bg: '#FEE2E2', text: '#DC2626', badge: '★' };
            default:
                return { bg: '#F3F4F6', text: '#6B7280', badge: '' };
        }
    };

    const getMedalEmoji = (rank: number) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return `${rank}`;
        }
    };

    const topPerformer = leaderboardData[0];

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        Agent Performance Leaderboard
                    </h1>
                    <p style={{ fontSize: 14, color: '#6B7280' }}>
                        Top performing agents based on conversions, revenue, and engagement
                    </p>
                </div>

                {/* Top Performer Highlight */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        borderRadius: 16,
                        padding: 24,
                        color: '#fff',
                        marginBottom: 32,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 24,
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>🏆 Top Performer This Month</div>
                        <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{topPerformer.agentName}</div>
                        <div style={{ fontSize: 14, opacity: 0.9 }}>
                            {topPerformer.leadsConverted} conversions • ₹{topPerformer.totalRevenue.toLocaleString()} revenue
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 16,
                        }}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16 }}>
                            <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>Conversion Rate</div>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>{topPerformer.conversionRate}%</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16 }}>
                            <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>Avg Deal Value</div>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>₹{topPerformer.avgDealValue}K</div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>
                                        Rank
                                    </th>
                                    <th style={{ textAlign: 'left', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>
                                        Agent
                                    </th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>
                                        Conversions
                                    </th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>
                                        Conv. Rate
                                    </th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>
                                        Avg Deal
                                    </th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>
                                        Revenue
                                    </th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>
                                        Tier
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map(agent => {
                                    const tierColor = getTierColor(agent.tier);
                                    return (
                                        <tr
                                            key={agent.rank}
                                            style={{
                                                borderBottom: '1px solid #E5E7EB',
                                                background: agent.rank === 1 ? '#F0F9FF' : '#fff',
                                            }}
                                        >
                                            <td style={{ textAlign: 'center', padding: 16, fontSize: 18, fontWeight: 700 }}>
                                                {getMedalEmoji(agent.rank)}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'left',
                                                    padding: 16,
                                                    fontSize: 13,
                                                    color: '#111827',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {agent.agentName}
                                            </td>
                                            <td style={{ textAlign: 'center', padding: 16, fontSize: 13, color: '#6B7280', fontWeight: 600 }}>
                                                {agent.leadsConverted}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    padding: 16,
                                                    fontSize: 13,
                                                    color: '#10B981',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {agent.conversionRate}%
                                            </td>
                                            <td style={{ textAlign: 'center', padding: 16, fontSize: 13, color: '#6B7280' }}>
                                                ₹{agent.avgDealValue}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    padding: 16,
                                                    fontSize: 13,
                                                    color: '#111827',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                ₹{agent.totalRevenue.toLocaleString()}
                                            </td>
                                            <td style={{ textAlign: 'center', padding: 16 }}>
                                                <div
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '6px 12px',
                                                        borderRadius: 8,
                                                        background: tierColor.bg,
                                                        color: tierColor.text,
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {tierColor.badge} {agent.tier}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stats Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 16,
                        marginTop: 32,
                    }}
                >
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Target size={14} /> Total Conversions
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>
                            {leaderboardData.reduce((sum, a) => sum + a.leadsConverted, 0)}
                        </div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <TrendingUp size={14} /> Avg Conversion
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>
                            {(
                                leaderboardData.reduce((sum, a) => sum + a.conversionRate, 0) / leaderboardData.length
                            ).toFixed(1)}
                            %
                        </div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Award size={14} /> Total Revenue
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>
                            ₹{leaderboardData.reduce((sum, a) => sum + a.totalRevenue, 0).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div
                    style={{
                        marginTop: 32,
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: 12,
                        padding: 16,
                    }}
                >
                    <div style={{ fontSize: 13, color: '#1E40AF', fontWeight: 600, marginBottom: 8 }}>
                        🏅 Performance Tiers
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                        {['Platinum', 'Gold', 'Silver', 'Bronze'].map(tier => {
                            const color = getTierColor(tier);
                            return (
                                <div key={tier} style={{ fontSize: 12, color: color.text }}>
                                    {color.badge} <strong>{tier}</strong> - Top performers in their category
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
