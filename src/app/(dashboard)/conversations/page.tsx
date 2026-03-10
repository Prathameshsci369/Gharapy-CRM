'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeads } from '@/lib/firestore/leads';
import { MessageCircle, Search, Clock, User } from 'lucide-react';

export default function ConversationsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLead, setSelectedLead] = useState<string | null>(null);
    const { data: leads = [], isLoading, error } = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
    });

    const filtered = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
    );

    if (error) return <div style={{ padding: 20, color: '#EF4444' }}>❌ Error loading conversations</div>;

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
            {/* Conversations List */}
            <div style={{
                width: 320, borderRight: '1px solid #E5E7EB',
                display: 'flex', flexDirection: 'column', background: '#FAFAFA',
            }}>
                {/* Header & Search */}
                <div style={{ padding: 16, borderBottom: '1px solid #E5E7EB' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Messages</h2>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
                        padding: '6px 10px',
                    }}>
                        <Search size={14} color="#9CA3AF" />
                        <input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{
                                flex: 1, border: 'none', outline: 'none', fontSize: 13,
                                background: 'transparent', color: '#111827',
                            }}
                        />
                    </div>
                </div>

                {/* Conversations */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {isLoading ? (
                        <div style={{ padding: 16, textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>Loading...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 16, textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>No conversations</div>
                    ) : (
                        filtered.map(lead => (
                            <div
                                key={lead.id}
                                onClick={() => setSelectedLead(lead.id)}
                                style={{
                                    padding: 12, borderBottom: '1px solid #E5E7EB',
                                    background: selectedLead === lead.id ? '#E0E7FF' : 'transparent',
                                    cursor: 'pointer', transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => {
                                    if (selectedLead !== lead.id) (e.currentTarget as HTMLDivElement).style.background = '#F3F4F6';
                                }}
                                onMouseLeave={e => {
                                    if (selectedLead !== lead.id) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: '#E0E7FF', color: '#4F46E5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 14, fontWeight: 700,
                                    }}>
                                        {lead.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                                            {lead.name}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {lead.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
                {selectedLead ? (
                    <>
                        {/* Chat Header */}
                        <div style={{
                            padding: 16, borderBottom: '1px solid #E5E7EB',
                            display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: '#E0E7FF', color: '#4F46E5',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14, fontWeight: 700,
                            }}>
                                {leads.find(l => l.id === selectedLead)?.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                                    {leads.find(l => l.id === selectedLead)?.name}
                                </div>
                                <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                                    {leads.find(l => l.id === selectedLead)?.phone}
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1, padding: 20, overflowY: 'auto',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        }}>
                            <MessageCircle size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
                            <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                                No messages yet. Start a conversation!
                            </div>
                        </div>

                        {/* Input Area */}
                        <div style={{
                            padding: 16, borderTop: '1px solid #E5E7EB',
                            display: 'flex', gap: 12,
                        }}>
                            <input
                                placeholder="Type a message..."
                                style={{
                                    flex: 1, border: '1px solid #E5E7EB', borderRadius: 8,
                                    padding: '10px 12px', fontSize: 14, outline: 'none',
                                    background: '#FAFAFA',
                                }}
                                onFocus={e => (e.target.style.borderColor = '#2563EB')}
                                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                            />
                            <button style={{
                                padding: '10px 16px', background: '#2563EB', color: '#fff',
                                border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                                fontSize: 14,
                            }}>Send</button>
                        </div>
                    </>
                ) : (
                    <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center', color: '#9CA3AF',
                    }}>
                        <MessageCircle size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
                        <div>Select a conversation to start messaging</div>
                    </div>
                )}
            </div>
        </div>
    );
}
