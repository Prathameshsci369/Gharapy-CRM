import { WebhookLog } from '@/types';

function docToWebhookLog(id: string, data: Record<string, unknown>): WebhookLog {
    return {
        id,
        source: (data.source as string) || '',
        payload: (data.payload as Record<string, unknown>) || {},
        status: (data.status as any) || 'failed',
        createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt as string),
    };
}

export async function getWebhookLogs(source?: string): Promise<WebhookLog[]> {
    try {
        let url = '/api/webhook-logs';
        if (source) url += `?source=${source}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch webhook logs');
        const data = await res.json();
        return (data as any[]).map(d => docToWebhookLog(d.id, d));
    } catch (err) {
        console.error('getWebhookLogs error', err);
        return [];
    }
}

export async function createWebhookLog(data: Omit<WebhookLog, 'id' | 'createdAt'>): Promise<string> {
    try {
        const res = await fetch('/api/webhook-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create webhook log');
        const json = await res.json();
        return json.id as string;
    } catch (err) {
        console.error('createWebhookLog error', err);
        throw err;
    }
}

export async function deleteWebhookLog(id: string): Promise<void> {
    try {
        const res = await fetch(`/api/webhook-logs/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete webhook log');
    } catch (err) {
        console.error('deleteWebhookLog error', err);
        throw err;
    }
}
