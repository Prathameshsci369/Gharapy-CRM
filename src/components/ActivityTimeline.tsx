'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getLeads } from '@/lib/firestore/leads';
import { Clock, User, FileText, Phone, MapPin, CheckCircle } from 'lucide-react';

interface TimelineEvent {
    id: string;
    type: 'created' | 'stage_changed' | 'note_added' | 'visit_scheduled' | 'reminder_set' | 'contacted';
    description: string;
    timestamp: Date;
    user?: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

const eventTypeConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
    created: {
        icon: <CheckCircle size={16} />,
        color: '#10B981',
        bgColor: '#DCFCE7',
        label: 'Lead Created',
    },
    stage_changed: {
        icon: <FileText size={16} />,
        color: '#4F46E5',
        bgColor: '#EEF2FF',
        label: 'Stage Changed',
    },
    note_added: {
        icon: <FileText size={16} />,
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        label: 'Note Added',
    },
    visit_scheduled: {
        icon: <MapPin size={16} />,
        color: '#8B5CF6',
        bgColor: '#F3E8FF',
        label: 'Visit Scheduled',
    },
    reminder_set: {
        icon: <Clock size={16} />,
        color: '#EC4899',
        bgColor: '#FCE7F3',
        label: 'Reminder Set',
    },
    contacted: {
        icon: <Phone size={16} />,
        color: '#06B6D4',
        bgColor: '#ECFDFD',
        label: 'Contacted',
    },
};

export default function ActivityTimelineComponent() {
    const { data: leads = [] } = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
    });

    // Mock timeline data - in production, this would come from events collection
    const mockTimeline: TimelineEvent[] = [
        {
            id: '1',
            type: 'created',
            description: 'Lead created in the system',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            user: 'System',
            icon: eventTypeConfig.created.icon,
            color: eventTypeConfig.created.color,
            bgColor: eventTypeConfig.created.bgColor,
        },
        {
            id: '2',
            type: 'contacted',
            description: 'Initial contact made via WhatsApp',
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
            user: 'Priya Sharma',
            icon: eventTypeConfig.contacted.icon,
            color: eventTypeConfig.contacted.color,
            bgColor: eventTypeConfig.contacted.bgColor,
        },
        {
            id: '3',
            type: 'note_added',
            description: 'Added note: Customer interested in 3BHK properties in Indiranagar',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            user: 'Priya Sharma',
            icon: eventTypeConfig.note_added.icon,
            color: eventTypeConfig.note_added.color,
            bgColor: eventTypeConfig.note_added.bgColor,
        },
        {
            id: '4',
            type: 'stage_changed',
            description: 'Lead stage updated: New Lead → Requirement Collected',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            user: 'Priya Sharma',
            icon: eventTypeConfig.stage_changed.icon,
            color: eventTypeConfig.stage_changed.color,
            bgColor: eventTypeConfig.stage_changed.bgColor,
        },
        {
            id: '5',
            type: 'visit_scheduled',
            description: 'Property visit scheduled for Indiranagar apartment',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            user: 'System',
            icon: eventTypeConfig.visit_scheduled.icon,
            color: eventTypeConfig.visit_scheduled.color,
            bgColor: eventTypeConfig.visit_scheduled.bgColor,
        },
        {
            id: '6',
            type: 'reminder_set',
            description: 'Follow-up reminder set for tomorrow',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            user: 'Rajesh Kumar',
            icon: eventTypeConfig.reminder_set.icon,
            color: eventTypeConfig.reminder_set.color,
            bgColor: eventTypeConfig.reminder_set.bgColor,
        },
    ];

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getConfig = (type: string) => eventTypeConfig[type] || eventTypeConfig.created;

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        Activity Timeline
                    </h1>
                    <p style={{ fontSize: 14, color: '#6B7280' }}>
                        Complete history of lead interactions and updates
                    </p>
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative' }}>
                    {/* Vertical line */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 15,
                            top: 0,
                            bottom: 0,
                            width: 2,
                            background: '#E5E7EB',
                        }}
                    />

                    {/* Timeline events */}
                    {mockTimeline.map((event, index) => {
                        const config = getConfig(event.type);
                        return (
                            <div key={event.id} style={{ marginBottom: 24, position: 'relative', paddingLeft: 48 }}>
                                {/* Timeline dot */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        background: '#fff',
                                        border: `3px solid ${config.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: config.color,
                                    }}
                                >
                                    {config.icon}
                                </div>

                                {/* Event card */}
                                <div
                                    style={{
                                        background: '#fff',
                                        borderRadius: 12,
                                        border: '1px solid #E5E7EB',
                                        padding: 16,
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                                                {getConfig(event.type).label}
                                            </div>
                                            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                                                {event.description}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: 6,
                                                background: config.bgColor,
                                                color: config.color,
                                                fontSize: 11,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {event.type.replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#6B7280', marginTop: 12 }}>
                                        {event.user && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <User size={14} />
                                                {event.user}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={14} />
                                            {formatDate(event.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info box */}
                <div
                    style={{
                        marginTop: 32,
                        background: '#F0F9FF',
                        border: '1px solid #BAE6FD',
                        borderRadius: 12,
                        padding: 16,
                    }}
                >
                    <div style={{ fontSize: 13, color: '#0369A1', fontWeight: 600 }}>
                        📅 Timeline Information
                    </div>
                    <div style={{ fontSize: 12, color: '#0369A1', marginTop: 8, lineHeight: '1.6' }}>
                        This timeline shows all activities related to this lead, including creation, stage changes, notes,
                        visits, and reminders. Use this to track the complete customer journey and ensure no follow-ups are
                        missed.
                    </div>
                </div>
            </div>
        </div>
    );
}
