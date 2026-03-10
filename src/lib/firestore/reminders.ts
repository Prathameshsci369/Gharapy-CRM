import { Reminder } from '@/types';

function docToReminder(id: string, data: Record<string, unknown>): Reminder {
    return {
        id,
        leadId: (data.leadId as string) || '',
        leadName: (data.leadName as string) || '',
        agentId: (data.agentId as string) || '',
        message: (data.message as string) || '',
        dueDate: data.dueDate instanceof Date ? data.dueDate : new Date(data.dueDate as string),
        status: (data.status as any) || 'pending',
    };
}

export async function getReminders(agentId?: string): Promise<Reminder[]> {
    try {
        let url = '/api/reminders';
        if (agentId) url += `?agentId=${agentId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch reminders');
        const data = await res.json();
        return (data as any[]).map(d => docToReminder(d.id, d));
    } catch (err) {
        console.error('getReminders error', err);
        return [];
    }
}

export async function getPendingReminders(agentId?: string): Promise<Reminder[]> {
    const reminders = await getReminders(agentId);
    return reminders.filter(r => r.status === 'pending');
}

export async function createReminder(data: Omit<Reminder, 'id'>): Promise<string> {
    try {
        const res = await fetch('/api/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create reminder');
        const json = await res.json();
        return json.id as string;
    } catch (err) {
        console.error('createReminder error', err);
        throw err;
    }
}

export async function updateReminder(id: string, data: Partial<Reminder>): Promise<void> {
    try {
        const res = await fetch(`/api/reminders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update reminder');
    } catch (err) {
        console.error('updateReminder error', err);
        throw err;
    }
}

export async function deleteReminder(id: string): Promise<void> {
    try {
        const res = await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete reminder');
    } catch (err) {
        console.error('deleteReminder error', err);
        throw err;
    }
}
