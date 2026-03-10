import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Agent } from '@/types';

function convertTimestamp(ts: unknown): Date {
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts instanceof Date) return ts;
    return new Date();
}

function docToAgent(id: string, data: Record<string, unknown>): Agent {
    return {
        id,
        name: (data.name as string) || '',
        email: (data.email as string) || '',
        phone: (data.phone as string) || '',
        role: (data.role as 'agent' | 'admin') || 'agent',
        isActive: (data.isActive as boolean) ?? true,
        createdAt: convertTimestamp(data.createdAt),
        lastAssignedLead: data.lastAssignedLead ? convertTimestamp(data.lastAssignedLead) : undefined,
    };
}

export async function getAgents(): Promise<Agent[]> {
    const res = await fetch('/api/agents');
    if (!res.ok) throw new Error('Failed to load agents');
    const data = await res.json();
    return (data as any[]).map(d => docToAgent(d.id, d));
}

export async function getAgent(id: string): Promise<Agent | null> {
    const snap = await getDoc(doc(db, 'agents', id));
    if (!snap.exists()) return null;
    return docToAgent(snap.id, snap.data() as Record<string, unknown>);
}

export async function createAgent(data: Omit<Agent, 'id' | 'createdAt'>): Promise<string> {
    const ref = await addDoc(collection(db, 'agents'), {
        ...data,
        createdAt: new Date(),
    });
    return ref.id;
}

export async function updateAgent(id: string, data: Partial<Agent>): Promise<void> {
    await updateDoc(doc(db, 'agents', id), data);
}
