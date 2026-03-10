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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LeadEvent } from '@/types';

function convertTimestamp(ts: unknown): Date {
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts instanceof Date) return ts;
    return new Date();
}

function docToLeadEvent(id: string, data: Record<string, unknown>): LeadEvent {
    return {
        id,
        leadId: (data.leadId as string) || '',
        type: (data.type as any) || 'created',
        description: (data.description as string) || '',
        createdBy: (data.createdBy as string) || '',
        createdByName: (data.createdByName as string) || '',
        createdAt: convertTimestamp(data.createdAt),
    };
}

export async function getLeadEvents(leadId: string): Promise<LeadEvent[]> {
    try {
        const res = await fetch(`/api/events?leadId=${leadId}`);
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        return (data as any[]).map(d => docToLeadEvent(d.id, d));
    } catch (err) {
        console.error('getLeadEvents error', err);
        return [];
    }
}

export async function createLeadEvent(data: Omit<LeadEvent, 'id' | 'createdAt'>): Promise<string> {
    try {
        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create event');
        const json = await res.json();
        return json.id as string;
    } catch (err) {
        console.error('createLeadEvent error', err);
        throw err;
    }
}

export async function deleteLeadEvent(id: string): Promise<void> {
    try {
        const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete event');
    } catch (err) {
        console.error('deleteLeadEvent error', err);
        throw err;
    }
}
