import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
    QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Visit } from '@/types';

function convertTimestamp(ts: unknown): Date {
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts instanceof Date) return ts;
    return new Date();
}

function docToVisit(id: string, data: Record<string, unknown>): Visit {
    return {
        id,
        leadId: (data.leadId as string) || '',
        leadName: (data.leadName as string) || '',
        propertyId: (data.propertyId as string) || '',
        propertyName: (data.propertyName as string) || '',
        agentId: (data.agentId as string) || '',
        agentName: (data.agentName as string) || '',
        visitDate: convertTimestamp(data.visitDate),
        status: (data.status as 'scheduled' | 'completed' | 'cancelled') || 'scheduled',
        notes: (data.notes as string) || '',
        createdAt: convertTimestamp(data.createdAt),
    };
}

export async function getVisits(filters?: { agentId?: string; status?: string }): Promise<Visit[]> {
    const constraints: QueryConstraint[] = [orderBy('visitDate', 'asc')];
    if (filters?.agentId) constraints.push(where('agentId', '==', filters.agentId));
    if (filters?.status) constraints.push(where('status', '==', filters.status));

    const q = query(collection(db, 'visits'), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => docToVisit(d.id, d.data() as Record<string, unknown>));
}

export async function createVisit(data: Omit<Visit, 'id' | 'createdAt'>): Promise<string> {
    const ref = await addDoc(collection(db, 'visits'), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

export async function updateVisit(id: string, data: Partial<Visit>): Promise<void> {
    await updateDoc(doc(db, 'visits', id), data);
}
