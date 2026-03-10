'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeads } from '@/lib/firestore/leads';
import { Calendar, MapPin, User, Phone, DollarSign, Search } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: leads = [], isLoading, error } = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
    });

    // Filter only booked leads
    const bookedLeads = leads.filter(l => l.stage === 'Booked');

    // Filter by search term
    const filtered = bookedLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
    );

    if (error) return <div style={{ padding: 20, color: '#EF4444' }}>❌ Error loading bookings</div>;

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Bookings</h1>
                    <p style={{ fontSize: 14, color: '#6B7280' }}>Confirmed property bookings and move-in details</p>
                </div>

                {/* Search & Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                    <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Total Bookings</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{bookedLeads.length}</div>
                    </div>
                    <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Conversion Rate</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#10B981' }}>
                            {leads.length > 0 ? Math.round((bookedLeads.length / leads.length) * 100) : 0}%
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{
                    background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB',
                    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
                }}>
                    <Search size={18} color="#9CA3AF" />
                    <input
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            flex: 1, border: 'none', outline: 'none', fontSize: 14,
                            background: 'transparent', color: '#111827',
                        }}
                    />
                </div>

                {/* Bookings List */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Loading bookings...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                        {bookedLeads.length === 0 ? 'No bookings yet' : 'No bookings match your search'}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 16 }}>
                        {filtered.map(lead => (
                            <Link key={lead.id} href={`/leads/${lead.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
                                    padding: 20, display: 'grid', gridTemplateColumns: '1fr auto',
                                    gap: 20, transition: 'all 0.2s', cursor: 'pointer',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = '#2563EB';
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(37,99,235,0.1)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = '#E5E7EB';
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                                }}
                                >
                                    <div>
                                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{lead.name}</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
                                                <Phone size={14} color="#9CA3AF" /> {lead.phone}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
                                                <MapPin size={14} color="#9CA3AF" /> {lead.preferredLocation || 'Not specified'}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
                                                <DollarSign size={14} color="#9CA3AF" /> ₹{lead.budget ? lead.budget.toLocaleString() : 'Not specified'}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
                                                <User size={14} color="#9CA3AF" /> {lead.assignedAgentName || 'Unassigned'}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
                                        <div style={{
                                            fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                                            background: '#D1FAE5', color: '#065F46',
                                        }}>Booked</div>
                                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                                            {lead.createdAt && new Date(lead.createdAt).toLocaleDateString('en-IN')}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
