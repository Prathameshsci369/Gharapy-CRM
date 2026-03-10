'use client';
import { useState } from 'react';
import { Property } from '@/types';
import { Building2, MapPin, BedDouble, Wifi, Zap, Droplets, Plus, MoreHorizontal } from 'lucide-react';

const DEMO_PROPERTIES: Property[] = [
    { id: 'p1', name: 'HSR Layout PG', location: 'HSR Layout, Sector 2, Bangalore', rent: 14000, bedsAvailable: 4, amenities: ['WiFi', 'AC', 'Laundry', 'Meals'], createdAt: new Date() },
    { id: 'p2', name: 'Koramangala Hostel', location: '5th Block, Koramangala, Bangalore', rent: 12000, bedsAvailable: 8, amenities: ['WiFi', 'Meals', 'TV Room'], createdAt: new Date() },
    { id: 'p3', name: 'BTM Layout PG', location: 'BTM Layout Stage 1, Bangalore', rent: 10000, bedsAvailable: 6, amenities: ['WiFi', 'AC'], createdAt: new Date() },
    { id: 'p4', name: 'Indiranagar Studio', location: 'Indiranagar, 100ft Road, Bangalore', rent: 18000, bedsAvailable: 2, amenities: ['WiFi', 'AC', 'Gym', 'Parking'], createdAt: new Date() },
    { id: 'p5', name: 'Whitefield Men\'s PG', location: 'ITPL Main Road, Whitefield, Bangalore', rent: 9500, bedsAvailable: 10, amenities: ['WiFi', 'Meals', 'Laundry'], createdAt: new Date() },
    { id: 'p6', name: 'Electronic City PG', location: 'Electronic City Phase 1, Bangalore', rent: 8500, bedsAvailable: 0, amenities: ['WiFi', 'Meals'], createdAt: new Date() },
];

const AMENITY_ICONS: Record<string, React.ReactNode> = {
    WiFi: <Wifi size={11} />,
    AC: <Zap size={11} />,
    Laundry: <Droplets size={11} />,
};

export default function PropertiesPage() {
    const [search, setSearch] = useState('');

    const filtered = DEMO_PROPERTIES.filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search properties..."
                    style={{
                        flex: 1, height: 40, borderRadius: 10, border: '1.5px solid #E5E7EB',
                        padding: '0 14px', fontSize: 14, outline: 'none', background: '#fff',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#2563EB')}
                    onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                />
                <button style={{
                    height: 40, padding: '0 18px', borderRadius: 10, border: 'none',
                    background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: 13,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                }}>
                    <Plus size={15} /> Add Property
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                    { label: 'Total Properties', value: DEMO_PROPERTIES.length, color: '#2563EB', bg: '#EFF6FF' },
                    { label: 'Available Beds', value: DEMO_PROPERTIES.reduce((s, p) => s + p.bedsAvailable, 0), color: '#16A34A', bg: '#F0FDF4' },
                    { label: 'Fully Occupied', value: DEMO_PROPERTIES.filter(p => p.bedsAvailable === 0).length, color: '#DC2626', bg: '#FEF2F2' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#fff', borderRadius: 14, padding: '18px 20px',
                        border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Building2 size={20} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Property cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {filtered.map(property => {
                    const available = property.bedsAvailable > 0;
                    return (
                        <div key={property.id} style={{
                            background: '#fff', borderRadius: 16, padding: 24,
                            border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            transition: 'box-shadow 0.2s, transform 0.2s', position: 'relative',
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                        >
                            {/* Availability badge */}
                            <div style={{
                                position: 'absolute', top: 16, right: 16,
                                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                                background: available ? '#F0FDF4' : '#FEF2F2',
                                color: available ? '#16A34A' : '#DC2626',
                            }}>
                                {available ? `${property.bedsAvailable} available` : 'No vacancies'}
                            </div>

                            {/* Icon + name */}
                            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16, paddingRight: 80 }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    background: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Building2 size={22} color="#2563EB" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{property.name}</div>
                                    <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                                        <MapPin size={11} /> {property.location}
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: '#2563EB' }}>
                                        ₹{(property.rent / 1000).toFixed(0)}K
                                    </div>
                                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>per month</div>
                                </div>
                                <div style={{ width: 1, background: '#E5E7EB' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: available ? '#16A34A' : '#DC2626', display: 'flex', gap: 5, alignItems: 'center' }}>
                                        <BedDouble size={16} /> {property.bedsAvailable}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>beds free</div>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {property.amenities.map(a => (
                                    <span key={a} style={{
                                        display: 'flex', gap: 4, alignItems: 'center',
                                        fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 999,
                                        background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB',
                                    }}>
                                        {AMENITY_ICONS[a] || null} {a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
