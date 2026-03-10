'use client';
import { useState } from 'react';
import { Calendar, Clock, MapPin, Bed, Wallet } from 'lucide-react';

export default function AvailabilityPage() {
    const [availability, setAvailability] = useState([
        { id: '1', location: 'HSR Layout', property: 'House #42', bhk: '2BHK', rent: 18000, availableFrom: '2026-03-15', occupant: 'Vacant', moveInReady: true },
        { id: '2', location: 'Indiranagar', property: 'Apartment 5C', bhk: '3BHK', rent: 28000, availableFrom: '2026-04-01', occupant: 'Notice Given', moveInReady: false },
        { id: '3', location: 'Whitefield', property: 'Flat 203', bhk: '1BHK', rent: 12000, availableFrom: '2026-03-20', occupant: 'Vacant', moveInReady: true },
        { id: '4', location: 'Koramangala', property: 'Villa B3', bhk: '2BHK', rent: 22000, availableFrom: '2026-05-01', occupant: 'Notice Period', moveInReady: false },
        { id: '5', location: 'JP Nagar', property: 'Apartment 12A', bhk: '1BHK', rent: 14000, availableFrom: '2026-03-10', occupant: 'Vacant', moveInReady: true },
    ]);

    const immediatlyAvailable = availability.filter(a => a.moveInReady).length;
    const upcomingAvailable = availability.filter(a => !a.moveInReady).length;

    const getAvailabilityStatus = (availableFrom: string) => {
        const diff = new Date(availableFrom).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days <= 0) return { text: 'Available Now', color: '#10B981' };
        if (days <= 7) return { text: `Available in ${days} days`, color: '#F59E0B' };
        return { text: `Available in ${Math.ceil(days / 7)} weeks`, color: '#6B7280' };
    };

    const PropertyCard = ({ property }: any) => {
        const status = getAvailabilityStatus(property.availableFrom);
        return (
            <div style={{
                background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
                padding: 20, display: 'flex', flexDirection: 'column', gap: 16,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{property.property}</div>
                        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                            <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
                            {property.location}
                        </div>
                    </div>
                    <span style={{
                        display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                        background: property.moveInReady ? '#DCFCE7' : '#FEF3C7',
                        color: property.moveInReady ? '#166534' : '#92400E',
                    }}>
                        {property.occupant}
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>Type</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginTop: 4 }}>{property.bhk}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>Rent</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginTop: 4 }}>₹{property.rent.toLocaleString()}</div>
                    </div>
                </div>

                <div style={{
                    padding: 12, background: status.color + '20', borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: 8, color: status.color,
                }}>
                    <Calendar size={16} />
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 600 }}>{status.text}</div>
                        <div style={{ fontSize: 10, marginTop: 2 }}>From {new Date(property.availableFrom).toLocaleDateString()}</div>
                    </div>
                </div>

                <button
                    style={{
                        padding: '8px 16px', background: '#4F46E5', color: '#fff',
                        border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', width: '100%',
                    }}
                >
                    View Details
                </button>
            </div>
        );
    };

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Property Availability</h1>
                    <p style={{ fontSize: 14, color: '#6B7280' }}>Track upcoming and immediate property availability</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Immediately Available</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#10B981' }}>{immediatlyAvailable}</div>
                        <div style={{ fontSize: 12, color: '#10B981', marginTop: 8 }}>Move-in ready</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Upcoming (Next 60 days)</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#F59E0B' }}>{upcomingAvailable}</div>
                        <div style={{ fontSize: 12, color: '#F59E0B', marginTop: 8 }}>In notice period</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Total Available</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{availability.length}</div>
                        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>Properties listed</div>
                    </div>
                </div>

                {/* Availability Status Filters */}
                <div style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
                    <button
                        style={{
                            padding: '8px 16px', background: '#4F46E5', color: '#fff',
                            border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        All Properties
                    </button>
                    <button
                        style={{
                            padding: '8px 16px', background: '#fff', color: '#6B7280',
                            border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Move-in Ready
                    </button>
                    <button
                        style={{
                            padding: '8px 16px', background: '#fff', color: '#6B7280',
                            border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Notice Period
                    </button>
                </div>

                {/* Properties Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {availability.map(prop => (
                        <PropertyCard key={prop.id} property={prop} />
                    ))}
                </div>
            </div>
        </div>
    );
}
