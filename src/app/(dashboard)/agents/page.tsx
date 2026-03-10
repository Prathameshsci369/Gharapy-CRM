'use client';
import { useQuery } from '@tanstack/react-query';
import { getAgents } from '@/lib/firestore/agents';
import { getLeads } from '@/lib/firestore/leads';
import { Agent } from '@/types';
import { format } from 'date-fns';
import { Phone, Mail, Calendar, MoreHorizontal, Plus } from 'lucide-react';

const DEMO_AGENTS: Agent[] = [
    { id: 'a1', name: 'Ravi Kumar', email: 'ravi@gharpayy.com', phone: '9876543210', role: 'agent', isActive: true, createdAt: new Date(Date.now() - 86400000 * 90) },
    { id: 'a2', name: 'Anita Desai', email: 'anita@gharpayy.com', phone: '8765432109', role: 'agent', isActive: true, createdAt: new Date(Date.now() - 86400000 * 60) },
    { id: 'a3', name: 'Deepak Singh', email: 'deepak@gharpayy.com', phone: '7654321098', role: 'admin', isActive: true, createdAt: new Date(Date.now() - 86400000 * 120) },
    { id: 'a4', name: 'Kavya Nair', email: 'kavya@gharpayy.com', phone: '6543210987', role: 'agent', isActive: false, createdAt: new Date(Date.now() - 86400000 * 30) },
];

export default function AgentsPage() {
    const { data: agents = DEMO_AGENTS } = useQuery({ queryKey: ['agents'], queryFn: () => getAgents() });
    const { data: leads = [] } = useQuery({ queryKey: ['leads'], queryFn: () => getLeads() });

    function getAgentStats(agentId: string) {
        const agentLeads = leads.filter(l => l.assignedAgentId === agentId);
        const booked = agentLeads.filter(l => l.stage === 'Booked').length;
        const cvr = agentLeads.length > 0 ? Math.round((booked / agentLeads.length) * 100) : 0;
        return { total: agentLeads.length, booked, cvr };
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{
                    height: 40, padding: '0 18px', borderRadius: 10, border: 'none',
                    background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: 13,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                }}>
                    <Plus size={15} /> Add Agent
                </button>
            </div>

            {/* Agents grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {agents.map(agent => {
                    const stats = getAgentStats(agent.id);
                    return (
                        <div key={agent.id} style={{
                            background: '#fff', borderRadius: 16, padding: 24,
                            border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            transition: 'box-shadow 0.2s, transform 0.2s',
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                        >
                            {/* Agent header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{
                                        width: 52, height: 52, borderRadius: 16,
                                        background: agent.isActive ? 'linear-gradient(135deg, #2563EB, #6366F1)' : '#E5E7EB',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: agent.isActive ? '#fff' : '#9CA3AF', fontSize: 20, fontWeight: 800,
                                    }}>
                                        {agent.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{agent.name}</div>
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                                            <span style={{
                                                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                                                background: agent.role === 'admin' ? '#EEF2FF' : '#EFF6FF',
                                                color: agent.role === 'admin' ? '#6366F1' : '#2563EB',
                                                textTransform: 'capitalize',
                                            }}>{agent.role}</span>
                                            <span style={{
                                                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                                                background: agent.isActive ? '#F0FDF4' : '#F9FAFB',
                                                color: agent.isActive ? '#16A34A' : '#9CA3AF',
                                            }}>{agent.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4 }}>
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>

                            {/* Contact */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#6B7280' }}>
                                    <Mail size={13} color="#9CA3AF" />{agent.email}
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#6B7280' }}>
                                    <Phone size={13} color="#9CA3AF" />{agent.phone}
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#6B7280' }}>
                                    <Calendar size={13} color="#9CA3AF" />Joined {format(agent.createdAt, 'MMM yyyy')}
                                </div>
                            </div>

                            {/* Stats */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
                                background: '#F3F4F6', borderRadius: 12, overflow: 'hidden',
                            }}>
                                {[
                                    { label: 'Leads', value: stats.total, color: '#2563EB' },
                                    { label: 'Closed', value: stats.booked, color: '#16A34A' },
                                    { label: 'CVR', value: `${stats.cvr}%`, color: '#6366F1' },
                                ].map(s => (
                                    <div key={s.label} style={{
                                        background: '#fff', padding: '12px 8px', textAlign: 'center',
                                    }}>
                                        <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Table view */}
            <div style={{
                background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden',
            }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #E5E7EB' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Agent Performance Table</h2>
                </div>
                <div style={{
                    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
                    padding: '12px 24px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB',
                    fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                    <span>Agent</span><span>Email</span><span>Role</span>
                    <span>Total Leads</span><span>Bookings</span><span>CVR</span>
                </div>
                {agents.map((agent, idx) => {
                    const stats = getAgentStats(agent.id);
                    return (
                        <div key={agent.id} style={{
                            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
                            padding: '16px 24px', alignItems: 'center',
                            borderBottom: idx < agents.length - 1 ? '1px solid #F3F4F6' : 'none',
                            background: !agent.isActive ? '#FAFAFA' : '#fff',
                        }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: agent.isActive ? 'linear-gradient(135deg, #2563EB, #6366F1)' : '#E5E7EB',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: agent.isActive ? '#fff' : '#9CA3AF', fontSize: 14, fontWeight: 700,
                                }}>{agent.name.charAt(0)}</div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{agent.name}</div>
                                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{agent.isActive ? 'Active' : 'Inactive'}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: 13, color: '#6B7280' }}>{agent.email}</div>
                            <div>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999,
                                    background: agent.role === 'admin' ? '#EEF2FF' : '#EFF6FF',
                                    color: agent.role === 'admin' ? '#6366F1' : '#2563EB',
                                    textTransform: 'capitalize',
                                }}>{agent.role}</span>
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{stats.total}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#16A34A' }}>{stats.booked}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#6366F1' }}>{stats.cvr}%</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
