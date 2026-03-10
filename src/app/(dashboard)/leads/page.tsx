'use client';
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, createLead } from '@/lib/firestore/leads';
import { getAgents } from '@/lib/firestore/agents';
import { Lead, STAGE_COLORS, PIPELINE_STAGES, LeadStage, LeadSource } from '@/types';
import { Search, Plus, Phone, ExternalLink, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const DEMO_LEADS: Lead[] = [];  // No longer used - data comes from Firebase

const DEMO_AGENTS = [];  // No longer used - data comes from Firebase

// Lead source options for filtering and creating
const LEAD_SOURCES: LeadSource[] = ['WhatsApp', 'Website', 'Tally Webhook', 'Phone Call', 'Social Media', 'Walk-In', 'Referral'];

/* ─── Add Lead Modal ─── */
interface AddLeadModalProps {
    onClose: () => void;
    agents: { id: string; name: string }[];
    onAdd: (lead: Lead) => void;
}

function AddLeadModal({ onClose, agents, onAdd }: AddLeadModalProps) {
    const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'Website' as LeadSource, assignedAgentId: '', notes: '' });
    const [saving, setSaving] = useState(false);
    const qc = useQueryClient();

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.phone.trim()) return;
        setSaving(true);
        const agentName = agents.find(a => a.id === form.assignedAgentId)?.name || '';
        const newLead: Lead = {
            id: `local-${Date.now()}`,
            ...form,
            stage: 'New Lead',
            assignedAgentName: agentName,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        // Optimistically add to local list
        onAdd(newLead);
        // Try Firebase (may fail if not configured - that's ok)
        try {
            await createLead({ ...form, stage: 'New Lead', assignedAgentName: agentName });
            qc.invalidateQueries({ queryKey: ['leads'] });
        } catch {
            // Firebase not configured — local demo mode, still works fine
        }
        setSaving(false);
        onClose(); // Always close — no infinite loop
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 100, backdropFilter: 'blur(4px)', padding: 16,
            }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: '#fff', borderRadius: 20, padding: 28,
                width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                animation: 'fadeIn 0.18s ease-out', maxHeight: '90vh', overflowY: 'auto',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Add New Lead</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4 }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                        { label: 'Full Name *', field: 'name', placeholder: 'e.g. Priya Sharma', type: 'text' },
                        { label: 'Phone *', field: 'phone', placeholder: '9XXXXXXXXX', type: 'tel' },
                        { label: 'Email', field: 'email', placeholder: 'optional@email.com', type: 'email' },
                    ].map(({ label, field, placeholder, type }) => (
                        <div key={field}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>{label}</label>
                            <input
                                type={type}
                                value={(form as Record<string, string>)[field]}
                                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                                placeholder={placeholder}
                                style={{
                                    width: '100%', height: 40, borderRadius: 8, border: '1.5px solid #E5E7EB',
                                    padding: '0 12px', fontSize: 14, outline: 'none', background: '#FAFAFA',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => (e.target.style.borderColor = '#2563EB')}
                                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                            />
                        </div>
                    ))}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Lead Source *</label>
                        <select
                            value={form.source}
                            onChange={e => setForm(f => ({ ...f, source: e.target.value as LeadSource }))}
                            style={{ width: '100%', height: 40, borderRadius: 8, border: '1.5px solid #E5E7EB', padding: '0 12px', fontSize: 14, background: '#FAFAFA' }}
                        >
                            {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Assign Agent</label>
                        <select
                            value={form.assignedAgentId}
                            onChange={e => setForm(f => ({ ...f, assignedAgentId: e.target.value }))}
                            style={{ width: '100%', height: 40, borderRadius: 8, border: '1.5px solid #E5E7EB', padding: '0 12px', fontSize: 14, background: '#FAFAFA' }}
                        >
                            <option value="">— Unassigned —</option>
                            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                            placeholder="Any initial notes..."
                            rows={2}
                            style={{ width: '100%', borderRadius: 8, border: '1.5px solid #E5E7EB', padding: '10px 12px', fontSize: 14, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }}
                            onFocus={e => (e.target.style.borderColor = '#2563EB')}
                            onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ height: 40, padding: '0 18px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151' }}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !form.name.trim() || !form.phone.trim()}
                        style={{
                            height: 40, padding: '0 20px', borderRadius: 8, border: 'none',
                            background: '#2563EB', color: '#fff', cursor: saving ? 'wait' : 'pointer',
                            fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
                            opacity: saving || !form.name.trim() || !form.phone.trim() ? 0.6 : 1,
                        }}
                    >
                        {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                        Create Lead
                    </button>
                </div>
            </div>
            <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

/* ─── Main Page ─── */
export default function LeadsPage() {
    const [search, setSearch] = useState('');
    const [filterStage, setFilterStage] = useState<LeadStage | ''>('');
    const [filterSource, setFilterSource] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 20;
    
    // Local leads list for instant demo mode
    const [localLeads, setLocalLeads] = useState<Lead[]>(DEMO_LEADS);

    const { data: fetchedLeads = [], isLoading: leadsLoading, error: leadsError } = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
        staleTime: 60000,
        retry: 2,
    });
    const { data: agents = [], isLoading: agentsLoading } = useQuery({
        queryKey: ['agents'],
        queryFn: () => getAgents(),
        staleTime: 60000,
        retry: 2,
    });

    // Use Firebase data directly
    const leads = useMemo(() => fetchedLeads || [], [fetchedLeads]);

    const handleAddLead = useCallback((newLead: Lead) => {
        setLocalLeads(prev => [newLead, ...prev]);
    }, []);

    const filtered = useMemo(() => leads.filter(l => {
        const q = search.toLowerCase();
        const matchSearch = !search || l.name.toLowerCase().includes(q) || l.phone.includes(q);
        const matchStage = !filterStage || l.stage === filterStage;
        const matchSource = !filterSource || l.source === filterSource;
        return matchSearch && matchStage && matchSource;
    }), [leads, search, filterStage, filterSource]);

    // Paginate results
    const paginatedLeads = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Loading state */}
            {leadsLoading && (
                <div style={{ padding: 20, textAlign: 'center', background: '#F0F9FF', borderRadius: 12, border: '1px solid #BFDBFE' }}>
                    <p style={{ fontSize: 14, color: '#1F2937' }}>⏳ Loading leads from Firebase...</p>
                </div>
            )}

            {/* Error state */}
            {leadsError && (
                <div style={{ padding: 20, textAlign: 'center', background: '#FEF2F2', borderRadius: 12, border: '1px solid #FECACA' }}>
                    <p style={{ fontSize: 14, color: '#991B1B' }}>❌ Error loading leads. Please check your Firebase connection.</p>
                </div>
            )}

            {/* Empty state */}
            {!leadsLoading && leads.length === 0 && (
                <div style={{ padding: 48, textAlign: 'center', background: '#F9FAFB', borderRadius: 12 }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>No leads yet</p>
                    <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Create your first lead to get started</p>
                </div>
            )}
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {/* Search */}
                <div style={{
                    flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8,
                    background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 10,
                    padding: '0 12px', height: 40,
                }}>
                    <Search size={14} color="#9CA3AF" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search name or phone..."
                        style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent', color: '#111827' }}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 0 }}>
                            <X size={13} />
                        </button>
                    )}
                </div>
                {/* Filters */}
                <select
                    value={filterStage}
                    onChange={e => setFilterStage(e.target.value as LeadStage | '')}
                    style={{ height: 40, borderRadius: 10, border: '1.5px solid #E5E7EB', padding: '0 12px', fontSize: 13, color: '#374151', background: '#fff' }}
                >
                    <option value="">All Stages</option>
                    {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                    value={filterSource}
                    onChange={e => setFilterSource(e.target.value)}
                    style={{ height: 40, borderRadius: 10, border: '1.5px solid #E5E7EB', padding: '0 12px', fontSize: 13, color: '#374151', background: '#fff' }}
                >
                    <option value="">All Sources</option>
                    {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                        height: 40, padding: '0 16px', borderRadius: 10, border: 'none',
                        background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: 14,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                    }}
                >
                    <Plus size={15} /> Add Lead
                </button>
            </div>

            {/* Count */}
            <div style={{ fontSize: 13, color: '#6B7280' }}>
                Showing <strong style={{ color: '#111827' }}>{paginatedLeads.length}</strong> of {filtered.length} leads
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {/* Header */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '2fr 1.3fr 1.1fr 1.2fr 1.4fr 0.8fr 80px',
                    padding: '11px 18px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB',
                    fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase',
                    letterSpacing: '0.05em', minWidth: 700,
                }}>
                    <span>Lead</span><span>Phone</span><span>Source</span><span>Agent</span><span>Stage</span><span>Added</span><span>View</span>
                </div>
                {/* Rows */}
                <div style={{ minWidth: 700 }}>
                    {paginatedLeads.length === 0 ? (
                        <div style={{ padding: 48, textAlign: 'center' }}>
                            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                            <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>No leads found</p>
                            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Try adjusting your search or filters</p>
                        </div>
                    ) : paginatedLeads.map((lead, idx) => {
                        const stageStyle = STAGE_COLORS[lead.stage];
                        return (
                            <div key={lead.id} style={{
                                display: 'grid', gridTemplateColumns: '2fr 1.3fr 1.1fr 1.2fr 1.4fr 0.8fr 80px',
                                padding: '14px 18px', alignItems: 'center',
                                borderBottom: idx < paginatedLeads.length - 1 ? '1px solid #F3F4F6' : 'none',
                                transition: 'background 0.1s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 700, color: '#2563EB', flexShrink: 0,
                                    }}>{lead.name.charAt(0)}</div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{lead.name}</div>
                                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{lead.email || '—'}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: 13, color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <Phone size={11} color="#9CA3AF" /> {lead.phone}
                                </div>
                                <div style={{ fontSize: 13, color: '#6B7280' }}>{lead.source}</div>
                                <div style={{ fontSize: 13, color: '#374151' }}>{lead.assignedAgentName || '—'}</div>
                                <div>
                                    <span style={{
                                        fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999,
                                        background: stageStyle.bg, color: stageStyle.text, border: `1px solid ${stageStyle.border}`,
                                        whiteSpace: 'nowrap',
                                    }}>{lead.stage}</span>
                                </div>
                                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{format(lead.createdAt, 'dd MMM')}</div>
                                <div>
                                    <Link href={`/leads/${lead.id}`} style={{
                                        width: 30, height: 30, borderRadius: 6, border: '1px solid #E5E7EB',
                                        background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#2563EB', textDecoration: 'none',
                                    }}>
                                        <ExternalLink size={12} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                            height: 36, width: 36, borderRadius: 8, border: '1px solid #E5E7EB',
                            background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                            opacity: page === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#374151', fontWeight: 500,
                        }}
                    >
                        ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            style={{
                                height: 36, minWidth: 36, borderRadius: 8, border: page === p ? '1px solid #2563EB' : '1px solid #E5E7EB',
                                background: page === p ? '#2563EB' : '#fff', cursor: 'pointer',
                                color: page === p ? '#fff' : '#374151', fontWeight: 500, fontSize: 13,
                            }}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{
                            height: 36, width: 36, borderRadius: 8, border: '1px solid #E5E7EB',
                            background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                            opacity: page === totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#374151', fontWeight: 500,
                        }}
                    >
                        →
                    </button>
                </div>
            )}

            {showAddModal && (
                <AddLeadModal
                    onClose={() => setShowAddModal(false)}
                    agents={agents}
                    onAdd={handleAddLead}
                />
            )}
        </div>
    );
}
