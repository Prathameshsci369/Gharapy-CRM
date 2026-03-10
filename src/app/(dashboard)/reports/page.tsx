'use client';
import { useQuery } from '@tanstack/react-query';
import { getLeads } from '@/lib/firestore/leads';
import { Lead, STAGE_COLORS } from '@/types';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';

const DEMO_LEADS: Lead[] = [
    { id: '1', name: 'Priya Sharma', phone: '9876543210', source: 'Website', stage: 'New Lead', assignedAgentId: 'a1', assignedAgentName: 'Ravi Kumar', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Arjun Mehta', phone: '9123456780', source: 'WhatsApp', stage: 'Contacted', assignedAgentId: 'a1', assignedAgentName: 'Ravi Kumar', createdAt: new Date(Date.now() - 86400000 * 3), updatedAt: new Date() },
    { id: '3', name: 'Sneha Rajan', phone: '8234567890', source: 'Tally Webhook', stage: 'Booked', assignedAgentId: 'a2', assignedAgentName: 'Anita Desai', createdAt: new Date(Date.now() - 86400000 * 5), updatedAt: new Date() },
    { id: '4', name: 'Karan Verma', phone: '7345678901', source: 'Phone Call', stage: 'Booked', assignedAgentId: 'a2', assignedAgentName: 'Anita Desai', createdAt: new Date(Date.now() - 86400000 * 8), updatedAt: new Date() },
    { id: '5', name: 'Meena Pillai', phone: '9456789012', source: 'Social Media', stage: 'Lost', assignedAgentId: 'a3', assignedAgentName: 'Deepak Singh', createdAt: new Date(Date.now() - 86400000 * 10), updatedAt: new Date() },
    { id: '6', name: 'Rahul Nair', phone: '8567890123', source: 'WhatsApp', stage: 'Booked', assignedAgentId: 'a3', assignedAgentName: 'Deepak Singh', createdAt: new Date(Date.now() - 86400000 * 12), updatedAt: new Date() },
    { id: '7', name: 'Pooja Iyer', phone: '7678901234', source: 'Website', stage: 'Visit Scheduled', assignedAgentId: 'a1', assignedAgentName: 'Ravi Kumar', createdAt: new Date(Date.now() - 86400000 * 15), updatedAt: new Date() },
    { id: '8', name: 'Vijay Reddy', phone: '9789012345', source: 'Referral', stage: 'Lost', assignedAgentId: 'a2', assignedAgentName: 'Anita Desai', createdAt: new Date(Date.now() - 86400000 * 18), updatedAt: new Date() },
];

const SOURCE_COLORS = ['#2563EB', '#6366F1', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'];

const WEEKLY_DATA = [
    { week: 'Wk 1', leads: 8, booked: 2, lost: 1 },
    { week: 'Wk 2', leads: 12, booked: 3, lost: 2 },
    { week: 'Wk 3', leads: 9, booked: 4, lost: 1 },
    { week: 'Wk 4', leads: 15, booked: 5, lost: 2 },
    { week: 'Wk 5', leads: 11, booked: 3, lost: 3 },
    { week: 'Wk 6', leads: 18, booked: 7, lost: 2 },
];

const AGENT_PERF = [
    { name: 'Ravi Kumar', leads: 14, booked: 5, cvr: 36 },
    { name: 'Anita Desai', leads: 12, booked: 4, cvr: 33 },
    { name: 'Deepak Singh', leads: 10, booked: 6, cvr: 60 },
    { name: 'Kavya Nair', leads: 6, booked: 2, cvr: 33 },
];

export default function ReportsPage() {
    const { data: leads = DEMO_LEADS } = useQuery({ queryKey: ['leads'], queryFn: () => getLeads() });

    const sourceMap: Record<string, number> = {};
    leads.forEach(l => { sourceMap[l.source] = (sourceMap[l.source] || 0) + 1; });
    const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

    const booked = leads.filter(l => l.stage === 'Booked').length;
    const lost = leads.filter(l => l.stage === 'Lost').length;
    const cvr = leads.length > 0 ? ((booked / leads.length) * 100).toFixed(1) : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Summary KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {[
                    { label: 'Total Leads', value: leads.length, color: '#2563EB', bg: '#EFF6FF' },
                    { label: 'Total Booked', value: booked, color: '#16A34A', bg: '#F0FDF4' },
                    { label: 'Total Lost', value: lost, color: '#DC2626', bg: '#FEF2F2' },
                    { label: 'Conversion Rate', value: `${cvr}%`, color: '#6366F1', bg: '#EEF2FF' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#fff', borderRadius: 14, padding: '20px 22px',
                        border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Weekly trend */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 24,
                border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Weekly Lead Trend</h2>
                <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 20 }}>Leads, bookings, and lost — last 6 weeks</p>
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={WEEKLY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                        <Line type="monotone" dataKey="leads" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} name="Total Leads" />
                        <Line type="monotone" dataKey="booked" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 4 }} name="Booked" />
                        <Line type="monotone" dataKey="lost" stroke="#DC2626" strokeWidth={2.5} dot={{ r: 4 }} name="Lost" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Agent performance + Source pie */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Agent Performance</h2>
                    <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 20 }}>Bookings and conversion rate by agent</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={AGENT_PERF} barSize={28}>
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                            <Bar dataKey="leads" fill="#BFDBFE" radius={[4, 4, 0, 0]} name="Total Leads" />
                            <Bar dataKey="booked" fill="#2563EB" radius={[4, 4, 0, 0]} name="Booked" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Lead Sources</h2>
                    <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>Distribution by source</p>
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
                </div>
            </div>
        </div>
    );
}
