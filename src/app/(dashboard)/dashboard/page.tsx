'use client';
import { useQuery } from '@tanstack/react-query';
import { getLeads } from '@/lib/firestore/leads';
import { getAgents } from '@/lib/firestore/agents';
import { getVisits } from '@/lib/firestore/visits';
import { Lead, STAGE_COLORS, LeadStage } from '@/types';
import {
    Users, CalendarCheck, TrendingUp, Home,
    ArrowUpRight, ArrowDownRight, Phone, Clock, Plus, RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Link from 'next/link';
import { format } from 'date-fns';

const SOURCE_COLORS = ['#2563EB', '#6366F1', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'];

// Demo data for when Firebase isn't connected yet
const DEMO_LEADS: Lead[] = [
    { id: '1', name: 'Priya Sharma', phone: '9876543210', source: 'Website', stage: 'New Lead', assignedAgentId: 'a1', assignedAgentName: 'Ravi Kumar', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Arjun Mehta', phone: '9123456780', source: 'WhatsApp', stage: 'Contacted', assignedAgentId: 'a1', assignedAgentName: 'Ravi Kumar', createdAt: new Date(Date.now() - 86400000), updatedAt: new Date() },
    { id: '3', name: 'Sneha Rajan', phone: '8234567890', source: 'Tally Webhook', stage: 'Visit Scheduled', assignedAgentId: 'a2', assignedAgentName: 'Anita Desai', createdAt: new Date(Date.now() - 172800000), updatedAt: new Date() },
    { id: '4', name: 'Karan Verma', phone: '7345678901', source: 'Phone Call', stage: 'Booked', assignedAgentId: 'a2', assignedAgentName: 'Anita Desai', createdAt: new Date(Date.now() - 259200000), updatedAt: new Date() },
    { id: '5', name: 'Meena Pillai', phone: '9456789012', source: 'Social Media', stage: 'Visit Completed', assignedAgentId: 'a3', assignedAgentName: 'Deepak Singh', createdAt: new Date(Date.now() - 345600000), updatedAt: new Date() },
    { id: '6', name: 'Rahul Nair', phone: '8567890123', source: 'WhatsApp', stage: 'Lost', assignedAgentId: 'a3', assignedAgentName: 'Deepak Singh', createdAt: new Date(Date.now() - 432000000), updatedAt: new Date() },
    { id: '7', name: 'Pooja Iyer', phone: '7678901234', source: 'Website', stage: 'Requirement Collected', assignedAgentId: 'a1', assignedAgentName: 'Ravi Kumar', createdAt: new Date(), updatedAt: new Date() },
    { id: '8', name: 'Vijay Reddy', phone: '9789012345', source: 'Referral', stage: 'Property Suggested', assignedAgentId: 'a2', assignedAgentName: 'Anita Desai', createdAt: new Date(Date.now() - 86400000), updatedAt: new Date() },
];

export default function DashboardPage() {
    const { data: leads = DEMO_LEADS, isLoading: leadsLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
    });
    const { data: agents = [] } = useQuery({ queryKey: ['agents'], queryFn: getAgents });
    const { data: visits = [] } = useQuery({ queryKey: ['visits'], queryFn: () => getVisits() });

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const newToday = leads.filter(l => l.createdAt >= todayStart).length;
    const activeLeads = leads.filter(l => l.stage !== 'Booked' && l.stage !== 'Lost').length;
    const bookedLeads = leads.filter(l => l.stage === 'Booked').length;
    const scheduledVisits = visits.filter(v => v.status === 'scheduled').length;
    const conversionRate = leads.length > 0 ? Math.round((bookedLeads / leads.length) * 100) : 0;

    // Source distribution
    const sourceMap: Record<string, number> = {};
    leads.forEach(l => { sourceMap[l.source] = (sourceMap[l.source] || 0) + 1; });
    const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

    // Stage counts
    const stageData: { name: string; count: number }[] = [
        { name: 'New Lead', count: leads.filter(l => l.stage === 'New Lead').length },
        { name: 'Contacted', count: leads.filter(l => l.stage === 'Contacted').length },
        { name: 'Req. Collected', count: leads.filter(l => l.stage === 'Requirement Collected').length },
        { name: 'Visit Sched.', count: leads.filter(l => l.stage === 'Visit Scheduled').length },
        { name: 'Booked', count: leads.filter(l => l.stage === 'Booked').length },
        { name: 'Lost', count: leads.filter(l => l.stage === 'Lost').length },
    ];

    const recentLeads = [...leads].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 6);

    const kpis = [
        {
            label: 'New Leads Today', value: newToday, icon: Users,
            color: '#2563EB', bg: '#EFF6FF', trend: '+12%', up: true,
        },
        {
            label: 'Active Leads', value: activeLeads, icon: TrendingUp,
            color: '#6366F1', bg: '#EEF2FF', trend: '+5%', up: true,
        },
        {
            label: 'Visits Scheduled', value: scheduledVisits, icon: CalendarCheck,
            color: '#F59E0B', bg: '#FFFBEB', trend: '8 today', up: true,
        },
        {
            label: 'Total Bookings', value: bookedLeads, icon: Home,
            color: '#16A34A', bg: '#F0FDF4', trend: `${conversionRate}% CVR`, up: true,
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {kpis.map((kpi) => (
                    <div key={kpi.label} style={{
                        background: '#FFFFFF', borderRadius: 16, padding: 20,
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        transition: 'box-shadow 0.2s, transform 0.2s',
                        cursor: 'default',
                    }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div style={{
                                width: 42, height: 42, borderRadius: 10,
                                background: kpi.bg, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <kpi.icon size={20} color={kpi.color} />
                            </div>
                            <span style={{
                                fontSize: 12, fontWeight: 600,
                                color: kpi.up ? '#16A34A' : '#DC2626',
                                background: kpi.up ? '#F0FDF4' : '#FEF2F2',
                                padding: '3px 8px', borderRadius: 999,
                                display: 'flex', alignItems: 'center', gap: 3,
                            }}>
                                {kpi.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                {kpi.trend}
                            </span>
                        </div>
                        <div style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{kpi.value}</div>
                        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6 }}>{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
                {/* Bar chart - pipeline stages */}
                <div style={{
                    background: '#FFFFFF', borderRadius: 16, padding: 24,
                    border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div>
                            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Pipeline Overview</h2>
                            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Leads across all stages</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={stageData} barSize={32}>
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
                                cursor={{ fill: '#F3F4F6' }}
                            />
                            <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} name="Leads" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart - lead sources */}
                <div style={{
                    background: '#FFFFFF', borderRadius: 16, padding: 24,
                    border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 4 }}>Lead Sources</h2>
                    <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>Where leads come from</p>
                    {sourceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={sourceData} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                                    {sourceData.map((_, idx) => (
                                        <Cell key={idx} fill={SOURCE_COLORS[idx % SOURCE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
                            No source data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Leads */}
            <div style={{
                background: '#FFFFFF', borderRadius: 16, padding: 24,
                border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Recent Leads</h2>
                        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Latest activity in your CRM</p>
                    </div>
                    <Link href="/leads" style={{
                        fontWeight: 600, fontSize: 13, color: '#2563EB',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                        View all <ArrowUpRight size={14} />
                    </Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {/* Table header */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.2fr 1fr 1.2fr',
                        padding: '8px 16px', background: '#F9FAFB', borderRadius: 8,
                        fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                        <span>Lead</span><span>Phone</span><span>Source</span><span>Agent</span><span>Stage</span>
                    </div>
                    {recentLeads.map((lead, idx) => {
                        const stageStyle = STAGE_COLORS[lead.stage];
                        return (
                            <Link
                                key={lead.id}
                                href={`/leads/${lead.id}`}
                                style={{
                                    display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.2fr 1fr 1.2fr',
                                    padding: '14px 16px', textDecoration: 'none',
                                    borderBottom: idx < recentLeads.length - 1 ? '1px solid #F3F4F6' : 'none',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 700, color: '#2563EB', flexShrink: 0,
                                    }}>
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{lead.name}</div>
                                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{format(lead.createdAt, 'dd MMM')}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
                                    <Phone size={12} color="#9CA3AF" />{lead.phone}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#6B7280' }}>{lead.source}</div>
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#374151' }}>
                                    {lead.assignedAgentName || '—'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                                        background: stageStyle.bg, color: stageStyle.text, border: `1px solid ${stageStyle.border}`,
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {lead.stage}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
