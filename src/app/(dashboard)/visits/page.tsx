'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVisits } from '@/lib/firestore/visits';
import { Visit } from '@/types';
import { format, isSameDay, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Plus, User, Building2, Clock } from 'lucide-react';

const DEMO_VISITS: Visit[] = [
    { id: 'v1', leadId: '1', leadName: 'Priya Sharma', propertyId: 'p1', propertyName: 'HSR Layout PG', agentId: 'a1', agentName: 'Ravi Kumar', visitDate: new Date(), status: 'scheduled', notes: 'Afternoon visit', createdAt: new Date() },
    { id: 'v2', leadId: '3', leadName: 'Sneha Rajan', propertyId: 'p2', propertyName: 'Koramangala Hostel', agentId: 'a2', agentName: 'Anita Desai', visitDate: addDays(new Date(), 1), status: 'scheduled', notes: '', createdAt: new Date() },
    { id: 'v3', leadId: '5', leadName: 'Meena Pillai', propertyId: 'p1', propertyName: 'HSR Layout PG', agentId: 'a3', agentName: 'Deepak Singh', visitDate: addDays(new Date(), -1), status: 'completed', notes: 'Liked the property', createdAt: new Date() },
    { id: 'v4', leadId: '2', leadName: 'Arjun Mehta', propertyId: 'p3', propertyName: 'BTM Layout PG', agentId: 'a1', agentName: 'Ravi Kumar', visitDate: addDays(new Date(), 2), status: 'scheduled', notes: '', createdAt: new Date() },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    scheduled: { bg: '#FFFBEB', color: '#D97706' },
    completed: { bg: '#F0FDF4', color: '#16A34A' },
    cancelled: { bg: '#FEF2F2', color: '#DC2626' },
};

export default function VisitsPage() {
    const [viewMode, setViewMode] = useState<'week' | 'list'>('list');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { data: visits = DEMO_VISITS } = useQuery({
        queryKey: ['visits'],
        queryFn: () => getVisits(),
    });

    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const upcoming = visits.filter(v => v.status === 'scheduled').length;
    const completed = visits.filter(v => v.status === 'completed').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                    { label: 'Total Visits', value: visits.length, color: '#2563EB', bg: '#EFF6FF' },
                    { label: 'Upcoming', value: upcoming, color: '#D97706', bg: '#FFFBEB' },
                    { label: 'Completed', value: completed, color: '#16A34A', bg: '#F0FDF4' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#fff', borderRadius: 14, padding: '18px 20px',
                        border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar size={20} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 10, padding: 4, gap: 2 }}>
                    {(['list', 'week'] as const).map(mode => (
                        <button key={mode} onClick={() => setViewMode(mode)} style={{
                            padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                            background: viewMode === mode ? '#fff' : 'transparent',
                            color: viewMode === mode ? '#111827' : '#6B7280',
                            boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.15s',
                        }}>
                            {mode === 'list' ? 'List View' : 'Week View'}
                        </button>
                    ))}
                </div>

                {viewMode === 'week' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => setSelectedDate(d => addDays(d, -7))} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronLeft size={16} />
                        </button>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', minWidth: 200, textAlign: 'center' }}>
                            {format(weekStart, 'dd MMM')} – {format(weekEnd, 'dd MMM yyyy')}
                        </span>
                        <button onClick={() => setSelectedDate(d => addDays(d, 7))} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                <button style={{
                    height: 40, padding: '0 18px', borderRadius: 10, border: 'none',
                    background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: 13,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                }}>
                    <Plus size={15} /> Schedule Visit
                </button>
            </div>

            {/* Week View */}
            {viewMode === 'week' && (
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                        {weekDays.map(day => {
                            const dayVisits = visits.filter(v => isSameDay(v.visitDate, day));
                            const isToday = isSameDay(day, new Date());
                            return (
                                <div key={day.toISOString()} style={{ borderRight: '1px solid #F3F4F6' }}>
                                    {/* Day header */}
                                    <div style={{
                                        padding: '14px 12px 10px', borderBottom: '1px solid #F3F4F6',
                                        background: isToday ? '#EFF6FF' : '#F9FAFB',
                                        textAlign: 'center',
                                    }}>
                                        <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>
                                            {format(day, 'EEE')}
                                        </div>
                                        <div style={{
                                            fontSize: 20, fontWeight: 800,
                                            color: isToday ? '#2563EB' : '#111827', marginTop: 2,
                                        }}>{format(day, 'd')}</div>
                                    </div>
                                    {/* Visits */}
                                    <div style={{ padding: 8, minHeight: 160 }}>
                                        {dayVisits.map(v => {
                                            const sc = STATUS_COLORS[v.status] || STATUS_COLORS.scheduled;
                                            return (
                                                <div key={v.id} style={{
                                                    background: sc.bg, borderRadius: 8, padding: '8px 10px',
                                                    marginBottom: 6, border: `1px solid ${sc.color}30`,
                                                }}>
                                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{v.leadName}</div>
                                                    <div style={{ fontSize: 10, color: '#6B7280' }}>{v.propertyName}</div>
                                                    <div style={{ fontSize: 10, color: sc.color, fontWeight: 600, marginTop: 4 }}>{v.status}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.2fr 1fr 100px',
                        padding: '12px 20px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB',
                        fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                        <span>Lead</span><span>Property</span><span>Agent</span><span>Date & Time</span><span>Status</span>
                    </div>
                    {visits.sort((a, b) => a.visitDate.getTime() - b.visitDate.getTime()).map((visit, idx) => {
                        const sc = STATUS_COLORS[visit.status] || STATUS_COLORS.scheduled;
                        const isUpcoming = visit.visitDate >= new Date();
                        return (
                            <div key={visit.id} style={{
                                display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.2fr 1fr 100px',
                                padding: '16px 20px', alignItems: 'center',
                                borderBottom: idx < visits.length - 1 ? '1px solid #F3F4F6' : 'none',
                                background: !isUpcoming && visit.status !== 'cancelled' ? '#FAFAFA' : '#fff',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 700, color: '#2563EB', flexShrink: 0,
                                    }}>{visit.leadName?.charAt(0)}</div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{visit.leadName}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 13, color: '#374151' }}>
                                    <Building2 size={12} color="#9CA3AF" />{visit.propertyName}
                                </div>
                                <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 13, color: '#6B7280' }}>
                                    <User size={12} color="#9CA3AF" />{visit.agentName}
                                </div>
                                <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 13, color: '#374151' }}>
                                    <Clock size={12} color="#9CA3AF" />{format(visit.visitDate, 'dd MMM, hh:mm a')}
                                </div>
                                <div>
                                    <span style={{
                                        fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999,
                                        background: sc.bg, color: sc.color,
                                    }}>{visit.status}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
