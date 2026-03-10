'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';

// Mock owner data structure - in production this would come from Firestore
interface PropertyOwner {
    id: string;
    name: string;
    email: string;
    phone: string;
    properties: number;
    totalRent: number;
    status: 'active' | 'inactive';
}

export default function OwnersPage() {
    const [owners, setOwners] = useState<PropertyOwner[]>([
        { id: '1', name: 'Raj Kumar', email: 'raj@example.com', phone: '9876543210', properties: 3, totalRent: 75000, status: 'active' },
        { id: '2', name: 'Priya Singh', email: 'priya@example.com', phone: '9123456789', properties: 5, totalRent: 125000, status: 'active' },
        { id: '3', name: 'Amit Patel', email: 'amit@example.com', phone: '8765432109', properties: 2, totalRent: 50000, status: 'inactive' },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setOwners(owners.filter(o => o.id !== id));
    };

    const totalProperties = owners.reduce((sum, o) => sum + o.properties, 0);
    const totalRent = owners.reduce((sum, o) => sum + o.totalRent, 0);

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Property Owners</h1>
                        <p style={{ fontSize: 14, color: '#6B7280' }}>Manage rental property owners and their properties</p>
                    </div>
                    <button
                        onClick={() => { setShowForm(!showForm); setEditingId(null); }}
                        style={{
                            padding: '8px 16px', background: '#4F46E5', color: '#fff',
                            border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                        }}
                    >
                        <Plus size={16} /> Add Owner
                    </button>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Total Owners</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{owners.length}</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Total Properties</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{totalProperties}</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Total Monthly Rent</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>₹{(totalRent / 100000).toFixed(1)}L</div>
                    </div>
                </div>

                {/* Owners Table */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                                    <th style={{ textAlign: 'left', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Name</th>
                                    <th style={{ textAlign: 'left', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Contact</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Properties</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Total Rent</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Status</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {owners.map(owner => (
                                    <tr key={owner.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: 16, fontSize: 13, color: '#111827', fontWeight: 500 }}>{owner.name}</td>
                                        <td style={{ padding: 16 }}>
                                            <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Mail size={14} /> {owner.email}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                                <Phone size={14} /> {owner.phone}
                                            </div>
                                        </td>
                                        <td style={{ padding: 16, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#111827' }}>{owner.properties}</td>
                                        <td style={{ padding: 16, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#111827' }}>₹{owner.totalRent.toLocaleString()}</td>
                                        <td style={{ padding: 16, textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                                background: owner.status === 'active' ? '#DCFCE7' : '#FEE2E2',
                                                color: owner.status === 'active' ? '#166534' : '#991B1B',
                                            }}>
                                                {owner.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: 16, textAlign: 'center', display: 'flex', gap: 8, justifyContent: 'center' }}>
                                            <button
                                                onClick={() => setEditingId(owner.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4F46E5' }}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(owner.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
