import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
    QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Lead, LeadStage, LeadSource } from '@/types';

function convertTimestamp(ts: unknown): Date {
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts instanceof Date) return ts;
    return new Date();
}

function docToLead(id: string, data: Record<string, unknown>): Lead {
    return {
        id,
        name: (data.name as string) || '',
        phone: (data.phone as string) || '',
        email: (data.email as string) || '',
        source: (data.source as LeadSource) || 'Website',
        stage: (data.stage as LeadStage) || 'New Lead',
        assignedAgentId: (data.assignedAgentId as string) || '',
        assignedAgentName: (data.assignedAgentName as string) || '',
        notes: (data.notes as string) || '',
        budget: (data.budget as number) || 0,
        preferredLocation: (data.preferredLocation as string) || '',
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
    };
}

export async function getLeads(filters?: { stage?: LeadStage; source?: LeadSource; agentId?: string }): Promise<Lead[]> {
    // fetch via server API to avoid relying on client SDK configuration
    let url = '/api/leads';
    if (filters) {
        const params = new URLSearchParams();
        if (filters.stage) params.append('stage', filters.stage);
        if (filters.source) params.append('source', filters.source);
        if (filters.agentId) params.append('agentId', filters.agentId);
        url += `?${params.toString()}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to load leads');
    }
    const data = await res.json();
    return (data as any[]).map(d => docToLead(d.id, d));
}

export async function getLead(id: string): Promise<Lead | null> {
    const snap = await getDoc(doc(db, 'leads', id));
    if (!snap.exists()) return null;
    return docToLead(snap.id, snap.data() as Record<string, unknown>);
}

export async function createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create lead');
    const json = await res.json();
    return json.id as string;
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<void> {
    const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update lead');
}

export async function deleteLead(id: string): Promise<void> {
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete lead');
}
