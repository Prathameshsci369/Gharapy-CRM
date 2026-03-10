'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Plus, MapPin, Bed, Wallet } from 'lucide-react';

export default function InventoryPage() {
    const [inventory, setInventory] = useState([
        { id: '1', location: 'HSR Layout', bhk: '2BHK', count: 5, avgRent: 18000, occupied: 3, vacant: 2 },
        { id: '2', location: 'Indiranagar', bhk: '3BHK', count: 3, avgRent: 28000, occupied: 2, vacant: 1 },
        { id: '3', location: 'Whitefield', bhk: '1BHK', count: 8, avgRent: 12000, occupied: 5, vacant: 3 },
        { id: '4', location: 'Koramangala', bhk: '2BHK', count: 4, avgRent: 22000, occupied: 2, vacant: 2 },
    ]);

    const totalProperties = inventory.reduce((sum, i) => sum + i.count, 0);
    const totalOccupied = inventory.reduce((sum, i) => sum + i.occupied, 0);
    const totalVacant = inventory.reduce((sum, i) => sum + i.vacant, 0);
    const occupancyRate = totalProperties > 0 ? ((totalOccupied / totalProperties) * 100).toFixed(1) : 0;

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Property Inventory</h1>
                        <p style={{ fontSize: 14, color: '#6B7280' }}>Monitor available properties and occupancy</p>
                    </div>
                    <button
                        style={{
                            padding: '8px 16px', background: '#4F46E5', color: '#fff',
                            border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                        }}
                    >
                        <Plus size={16} /> Add Property
                    </button>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Total Properties</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{totalProperties}</div>
                        <div style={{ fontSize: 12, color: '#10B981' }}>✓ Across 4 locations</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Occupied</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{totalOccupied}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>{occupancyRate}% occupancy</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Available</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{totalVacant}</div>
                        <div style={{ fontSize: 12, color: '#EF4444' }}>Ready for listing</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Avg Rent</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 4 }}>₹18.5K</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>Per property</div>
                    </div>
                </div>

                {/* Inventory by Location */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Inventory by Location</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                                    <th style={{ textAlign: 'left', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Location</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Type</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Total</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Occupied</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Vacant</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Avg Rent</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: 16, fontSize: 13, color: '#111827', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <MapPin size={16} color="#6B7280" /> {item.location}
                                        </td>
                                        <td style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>{item.bhk}</td>
                                        <td style={{ padding: 16, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.count}</td>
                                        <td style={{ padding: 16, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#10B981' }}>{item.occupied}</td>
                                        <td style={{ padding: 16, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#EF4444' }}>{item.vacant}</td>
                                        <td style={{ padding: 16, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#111827' }}>₹{item.avgRent.toLocaleString()}</td>
                                        <td style={{ padding: 16, textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                                background: item.vacant === 0 ? '#FEE2E2' : '#DCFCE7',
                                                color: item.vacant === 0 ? '#991B1B' : '#166534',
                                            }}>
                                                {item.vacant === 0 ? 'Full' : 'Available'}
                                            </span>
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
