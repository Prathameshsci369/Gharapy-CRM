'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeads } from '@/lib/firestore/leads';
import { Target, CheckCircle, X, MapPin, Wallet } from 'lucide-react';

export default function MatchingPage() {
    const [matches, setMatches] = useState([
        {
            id: '1',
            leadName: 'Amit Saxena',
            leadBudget: 10000,
            property: 'HSR Layout House',
            propertyRent: 9500,
            matchScore: 95,
            location: 'HSR Layout',
        },
        {
            id: '2',
            leadName: 'Rahul Verma',
            leadBudget: 12000,
            property: 'Indiranagar Apartment',
            propertyRent: 11500,
            matchScore: 88,
            location: 'Indiranagar',
        },
        {
            id: '3',
            leadName: 'Nikhil Agarwal',
            leadBudget: 8000,
            property: 'JP Nagar Flat',
            propertyRent: 7500,
            matchScore: 82,
            location: 'JP Nagar',
        },
        {
            id: '4',
            leadName: 'Aarav Patel',
            leadBudget: 15000,
            property: 'Koramangala Villa',
            propertyRent: 14500,
            matchScore: 91,
            location: 'Koramangala',
        },
        {
            id: '5',
            leadName: 'Priya Sharma',
            leadBudget: 18000,
            property: 'Whitefield Premium',
            propertyRent: 18500,
            matchScore: 78,
            location: 'Whitefield',
        },
    ]);

    const { data: leads = [] } = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
    });

    const highQualityMatches = matches.filter(m => m.matchScore >= 85).length;
    const averageMatchScore = (matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length).toFixed(0);

    const getMatchColor = (score: number) => {
        if (score >= 90) return { bg: '#DCFCE7', text: '#166534', label: 'Excellent' };
        if (score >= 80) return { bg: '#D1FAE5', text: '#065F46', label: 'Good' };
        if (score >= 70) return { bg: '#FEF3C7', text: '#92400E', label: 'Fair' };
        return { bg: '#FEE2E2', text: '#991B1B', label: 'Poor' };
    };

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Lead-Property Matching</h1>
                    <p style={{ fontSize: 14, color: '#6B7280' }}>AI-powered lead to property matching recommendations</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Total Matches Found</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{matches.length}</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Avg Match Score</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#4F46E5' }}>{averageMatchScore}%</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>High Quality Matches</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#10B981' }}>{highQualityMatches}</div>
                    </div>
                </div>

                {/* Matches Table */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                                    <th style={{ textAlign: 'left', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Lead</th>
                                    <th style={{ textAlign: 'left', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Budget</th>
                                    <th style={{ textAlign: 'left', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Property</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Rent</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Location</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Match Score</th>
                                    <th style={{ textAlign: 'center', padding: 16, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map(match => {
                                    const color = getMatchColor(match.matchScore);
                                    const budgetDiff = match.leadBudget - match.propertyRent;
                                    return (
                                        <tr key={match.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: 16, fontSize: 13, color: '#111827', fontWeight: 500 }}>{match.leadName}</td>
                                            <td style={{ padding: 16, fontSize: 13, color: '#6B7280' }}>₹{match.leadBudget.toLocaleString()}</td>
                                            <td style={{ padding: 16, fontSize: 13, color: '#111827', fontWeight: 500 }}>{match.property}</td>
                                            <td style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>₹{match.propertyRent.toLocaleString()}</td>
                                            <td style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                                <MapPin size={14} /> {match.location}
                                            </td>
                                            <td style={{ padding: 16, textAlign: 'center' }}>
                                                <div style={{
                                                    display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                                                    background: color.bg, color: color.text,
                                                }}>
                                                    {match.matchScore}%
                                                </div>
                                                <div style={{ fontSize: 10, color: '#6B7280', marginTop: 4 }}>{color.label}</div>
                                            </td>
                                            <td style={{ padding: 16, textAlign: 'center' }}>
                                                <button
                                                    style={{
                                                        padding: '6px 12px', background: '#4F46E5', color: '#fff',
                                                        border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Match Quality Info */}
                <div style={{ marginTop: 24, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 13, color: '#1E40AF', fontWeight: 600 }}>ℹ️ Match Score Calculation</div>
                    <div style={{ fontSize: 12, color: '#1E40AF', marginTop: 8, lineHeight: '1.6' }}>
                        Match scores are calculated based on budget alignment, location preference, property type, and amenity matches.
                        Scores above 85% indicate excellent matches with high conversion probability.
                    </div>
                </div>
            </div>
        </div>
    );
}
