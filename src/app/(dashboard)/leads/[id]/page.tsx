'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLead, updateLead } from '@/lib/firestore/leads';
import { Lead, STAGE_COLORS, PIPELINE_STAGES, LeadStage } from '@/types';
import { Phone, Mail, User, MapPin, ArrowLeft, Calendar, MessageSquare, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

const DEMO_LEADS: Record<string, Lead> = {
    '1': { id: '1', name: 'Priya Sharma', phone: '9876543210', email: 'priya@email.com', source: 'Website', stage: 'New Lead', assignedAgentId: 'a1', assignedAgentName: 'Ravi Kumar', notes: 'Looking for a 2-sharing PG near HSR Layout. Budget around ₹12,000/month.', budget: 12000, preferredLocation: 'HSR Layout', createdAt: new Date(Date.now() - 86400000 * 2), updatedAt: new Date() },
};

const DEMO_EVENTS = [
    { id: 'e1', type: 'created', description: 'Lead created from Website form', createdByName: 'System', createdAt: new Date(Date.now() - 86400000 * 2) },
    { id: 'e2', type: 'contacted', description: 'Agent called lead. Discussed requirements.', createdByName: 'Ravi Kumar', createdAt: new Date(Date.now() - 86400000) },
    { id: 'e3', type: 'stage_changed', description: 'Stage changed: New Lead → Contacted', createdByName: 'Ravi Kumar', createdAt: new Date(Date.now() - 3600000 * 12) },
];

const EVENT_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
    created: { icon: <User size={12} />, color: '#2563EB' },
    contacted: { icon: <Phone size={12} />, color: '#6366F1' },
    stage_changed: { icon: <ChevronRight size={12} />, color: '#F59E0B' },
    note_added: { icon: <MessageSquare size={12} />, color: '#10B981' },
    visit_scheduled: { icon: <Calendar size={12} />, color: '#8B5CF6' },
};

export default function LeadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const qc = useQueryClient();
    const id = params.id as string;
    const [note, setNote] = useState('');

    const { data: lead, isLoading } = useQuery({
        queryKey: ['lead', id],
        queryFn: () => getLead(id),
    });

    const displayLead: Lead | undefined = lead || DEMO_LEADS[id];

    const stageMutation = useMutation({
        mutationFn: (stage: LeadStage) => updateLead(id, { stage }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['lead', id] }); qc.invalidateQueries({ queryKey: ['leads'] }); },
    });

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#2563EB' }} />
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!displayLead) {
        return (
            <div style={{ textAlign: 'center', padding: 80 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Lead not found</h2>
                <button onClick={() => router.push('/leads')} style={{ marginTop: 16, padding: '10px 20px', background: '#2563EB', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    Back to Leads
                </button>
            </div>
        );
    }

    const sc = STAGE_COLORS[displayLead.stage];
    const stageIdx = PIPELINE_STAGES.indexOf(displayLead.stage);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Back */}
            <Link href="/leads" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}>
                <ArrowLeft size={14} /> Back to Leads
            </Link>

            {/* Lead header */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 28,
                border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20,
            }}>
                <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 20,
                        background: 'linear-gradient(135deg, #2563EB, #6366F1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 26, fontWeight: 800, flexShrink: 0,
                    }}>{displayLead.name.charAt(0)}</div>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>{displayLead.name}</h1>
                        <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 13, color: '#6B7280' }}>
                                <Phone size={13} color="#2563EB" /> {displayLead.phone}
                            </span>
                            {displayLead.email && (
                                <span style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 13, color: '#6B7280' }}>
                                    <Mail size={13} color="#2563EB" /> {displayLead.email}
                                </span>
                            )}
                            {displayLead.assignedAgentName && (
                                <span style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 13, color: '#6B7280' }}>
                                    <User size={13} color="#2563EB" /> {displayLead.assignedAgentName}
                                </span>
                            )}
                            {displayLead.preferredLocation && (
                                <span style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 13, color: '#6B7280' }}>
                                    <MapPin size={13} color="#2563EB" /> {displayLead.preferredLocation}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                            <span style={{
                                fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 999,
                                background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                            }}>{displayLead.stage}</span>
                            <span style={{
                                fontSize: 12, padding: '4px 12px', borderRadius: 999,
                                background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB',
                            }}>{displayLead.source}</span>
                            {displayLead.budget && (
                                <span style={{
                                    fontSize: 12, padding: '4px 12px', borderRadius: 999,
                                    background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0',
                                }}>₹{displayLead.budget.toLocaleString()}/mo</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                    <a href={`tel:${displayLead.phone}`} style={{
                        height: 40, padding: '0 16px', borderRadius: 10, border: '1px solid #E5E7EB',
                        background: '#fff', color: '#374151', fontWeight: 600, fontSize: 13,
                        display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
                    }}>
                        <Phone size={14} /> Call
                    </a>
                    <Link href="/visits" style={{
                        height: 40, padding: '0 18px', borderRadius: 10, border: 'none',
                        background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: 13,
                        display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
                    }}>
                        <Calendar size={14} /> Schedule Visit
                    </Link>
                </div>
            </div>

            {/* Stage progress stepper */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 24,
                border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Pipeline Stage</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
                    {PIPELINE_STAGES.map((s, idx) => {
                        const isCurrent = idx === stageIdx;
                        const isPast = idx < stageIdx;
                        const sc2 = STAGE_COLORS[s];
                        return (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                <button
                                    onClick={() => stageMutation.mutate(s)}
                                    title={`Move to ${s}`}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                        background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px',
                                    }}
                                >
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: isCurrent ? sc2.text : isPast ? '#D1FAE5' : '#F3F4F6',
                                        border: isCurrent ? `2px solid ${sc2.text}` : isPast ? '2px solid #34D399' : '2px solid #E5E7EB',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, color: isCurrent ? '#fff' : isPast ? '#059669' : '#9CA3AF',
                                        fontWeight: 700,
                                        transition: 'all 0.2s',
                                    }}>
                                        {isPast ? '✓' : idx + 1}
                                    </div>
                                    <span style={{
                                        fontSize: 9, fontWeight: isCurrent ? 700 : 400,
                                        color: isCurrent ? sc2.text : isPast ? '#059669' : '#9CA3AF',
                                        maxWidth: 60, textAlign: 'center', lineHeight: 1.2,
                                    }}>{s}</span>
                                </button>
                                {idx < PIPELINE_STAGES.length - 1 && (
                                    <div style={{
                                        width: 24, height: 2, background: idx < stageIdx ? '#34D399' : '#E5E7EB',
                                        marginBottom: 20, flexShrink: 0, transition: 'background 0.2s',
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
                {/* Timeline / Notes */}
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 24,
                    border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Activity Timeline</h3>

                    {/* Add note */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Add a note..."
                            rows={2}
                            style={{
                                flex: 1, borderRadius: 10, border: '1.5px solid #E5E7EB',
                                padding: '10px 14px', fontSize: 13, resize: 'vertical', outline: 'none',
                            }}
                            onFocus={e => (e.target.style.borderColor = '#2563EB')}
                            onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                        />
                        <button
                            onClick={() => setNote('')}
                            disabled={!note.trim()}
                            style={{
                                alignSelf: 'flex-start', height: 40, padding: '0 16px',
                                borderRadius: 10, border: 'none', background: '#2563EB', color: '#fff',
                                fontWeight: 600, fontSize: 13, cursor: note.trim() ? 'pointer' : 'not-allowed',
                                opacity: note.trim() ? 1 : 0.5,
                            }}
                        >Save</button>
                    </div>

                    {/* Events */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {DEMO_EVENTS.map((ev, idx) => {
                            const iconInfo = EVENT_ICONS[ev.type] || { icon: <Clock size={12} />, color: '#9CA3AF' };
                            return (
                                <div key={ev.id} style={{ display: 'flex', gap: 14, paddingBottom: 20, position: 'relative' }}>
                                    {idx < DEMO_EVENTS.length - 1 && (
                                        <div style={{
                                            position: 'absolute', left: 15, top: 28, width: 1,
                                            height: 'calc(100% - 12px)', background: '#E5E7EB',
                                        }} />
                                    )}
                                    <div style={{
                                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                                        background: `${iconInfo.color}15`, border: `1.5px solid ${iconInfo.color}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconInfo.color,
                                    }}>
                                        {iconInfo.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{ev.description}</div>
                                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>
                                            {ev.createdByName} · {format(ev.createdAt, 'dd MMM yyyy, hh:mm a')}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Lead Details</h3>
                        {[
                            { label: 'Name', value: displayLead.name },
                            { label: 'Phone', value: displayLead.phone },
                            { label: 'Email', value: displayLead.email || '—' },
                            { label: 'Source', value: displayLead.source },
                            { label: 'Preferred Area', value: displayLead.preferredLocation || '—' },
                            { label: 'Budget', value: displayLead.budget ? `₹${displayLead.budget.toLocaleString()}/mo` : '—' },
                            { label: 'Agent', value: displayLead.assignedAgentName || 'Unassigned' },
                            { label: 'Created', value: format(displayLead.createdAt, 'dd MMM yyyy') },
                            { label: 'Last Updated', value: format(displayLead.updatedAt, 'dd MMM yyyy') },
                        ].map(({ label, value }) => (
                            <div key={label} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                padding: '8px 0', borderBottom: '1px solid #F3F4F6',
                            }}>
                                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>{label}</span>
                                <span style={{ fontSize: 13, color: '#111827', fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {displayLead.notes && (
                        <div style={{
                            background: '#FFFBEB', borderRadius: 16, padding: 20,
                            border: '1px solid #FDE68A',
                        }}>
                            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#92400E', marginBottom: 8 }}>Notes</h3>
                            <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.6 }}>{displayLead.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
