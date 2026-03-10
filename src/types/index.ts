// Firestore data types for the Gharpayy CRM

export type LeadStage =
    | 'New Lead'
    | 'Contacted'
    | 'Requirement Collected'
    | 'Property Suggested'
    | 'Visit Scheduled'
    | 'Visit Completed'
    | 'Booked'
    | 'Lost';

export type LeadSource =
    | 'WhatsApp'
    | 'Website'
    | 'Tally Webhook'
    | 'Phone Call'
    | 'Social Media'
    | 'Walk-In'
    | 'Referral';

export type UserRole = 'agent' | 'admin';

// Constants for analytics and forms
export const PIPELINE_STAGES: LeadStage[] = [
    'New Lead',
    'Contacted',
    'Requirement Collected',
    'Property Suggested',
    'Visit Scheduled',
    'Visit Completed',
    'Booked',
    'Lost',
];

export const LEAD_SOURCES: LeadSource[] = [
    'WhatsApp',
    'Website',
    'Tally Webhook',
    'Phone Call',
    'Social Media',
    'Walk-In',
    'Referral',
];

export interface Agent {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    lastAssignedLead?: Date;
}

export interface Lead {
    id: string;
    name: string;
    phone: string;
    email?: string;
    source: LeadSource;
    stage: LeadStage;
    assignedAgentId: string;
    assignedAgentName?: string;
    notes?: string;
    budget?: number;
    preferredLocation?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Visit {
    id: string;
    leadId: string;
    leadName?: string;
    propertyId: string;
    propertyName?: string;
    agentId: string;
    agentName?: string;
    visitDate: Date;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: Date;
}

export interface Property {
    id: string;
    name: string;
    location: string;
    rent: number;
    bedsAvailable: number;
    amenities: string[];
    imageUrl?: string;
    createdAt: Date;
}

export interface LeadEvent {
    id: string;
    leadId: string;
    type: 'created' | 'stage_changed' | 'note_added' | 'visit_scheduled' | 'reminder_set' | 'contacted';
    description: string;
    createdBy: string;
    createdByName?: string;
    createdAt: Date;
}

export interface Reminder {
    id: string;
    leadId: string;
    leadName?: string;
    agentId: string;
    message: string;
    dueDate: Date;
    status: 'pending' | 'done';
}

export interface WebhookLog {
    id: string;
    source: string;
    payload: Record<string, unknown>;
    status: 'success' | 'failed';
    createdAt: Date;
}

export const STAGE_COLORS: Record<LeadStage, { bg: string; text: string; border: string }> = {
    'New Lead': { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    'Contacted': { bg: '#EEF2FF', text: '#6366F1', border: '#C7D2FE' },
    'Requirement Collected': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
    'Property Suggested': { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' },
    'Visit Scheduled': { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
    'Visit Completed': { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
    'Booked': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    'Lost': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
};
