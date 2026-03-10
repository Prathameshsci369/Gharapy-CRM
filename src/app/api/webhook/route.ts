import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/admin';
import admin from 'firebase-admin';
import crypto from 'crypto';

// Verify webhook signature
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
    const hash = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    return hash === signature;
}

// Auto-assign lead to agent with least workload
async function autoAssignAgent(): Promise<{ id: string; name: string } | null> {
    try {
        const db = getAdminDb();
        if (!db) return null;
        
        const agentsSnapshot = await db.collection('agents').where('isActive', '==', true).get();
        if (agentsSnapshot.empty) return null;

        // Get agent with least assigned leads
        let agentWithLeastWorkload = agentsSnapshot.docs[0];
        let minLeadCount = 0;

        for (const agentDoc of agentsSnapshot.docs) {
            const leadsSnapshot = await db
                .collection('leads')
                .where('assignedAgentId', '==', agentDoc.id)
                .where('stage', 'in', ['New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested', 'Visit Scheduled'])
                .get();

            if (leadsSnapshot.size < minLeadCount || agentWithLeastWorkload === agentDoc) {
                minLeadCount = leadsSnapshot.size;
                agentWithLeastWorkload = agentDoc;
            }
        }

        const agentData = agentWithLeastWorkload.data();
        return {
            id: agentWithLeastWorkload.id,
            name: agentData.name,
        };
    } catch (err) {
        console.error('autoAssignAgent error', err);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const db = getAdminDb();
        if (!db) {
            return NextResponse.json({ error: 'Firebase not initialized' }, { status: 503 });
        }
        
        // Validate webhook secret
        const secret = req.headers.get('x-webhook-secret') || process.env.WEBHOOK_SECRET;
        if (!secret || secret !== process.env.WEBHOOK_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, email, source = 'Tally Webhook', notes } = body;

        if (!name || !phone) {
            return NextResponse.json({ error: 'name and phone are required' }, { status: 400 });
        }

        // Auto-assign agent
        const agent = await autoAssignAgent();

        // Create lead in Firestore
        const now = admin.firestore.FieldValue.serverTimestamp();
        const leadRef = await db.collection('leads').add({
            name,
            phone,
            email: email || '',
            source,
            stage: 'New Lead',
            assignedAgentId: agent?.id || '',
            assignedAgentName: agent?.name || 'Unassigned',
            notes: notes || '',
            budget: 0,
            preferredLocation: '',
            createdAt: now,
            updatedAt: now,
        });

        // Create event log
        await db.collection('events').add({
            leadId: leadRef.id,
            type: 'created',
            description: `Lead created from ${source}`,
            createdBy: 'webhook',
            createdByName: 'System',
            createdAt: now,
        });

        // Log successful webhook
        await db.collection('webhook_logs').add({
            source,
            payload: body,
            status: 'success',
            createdAt: now,
        });

        return NextResponse.json(
            { success: true, leadId: leadRef.id, assignedAgent: agent?.name || 'Unassigned' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Webhook error:', error);

        // Log failure
        try {
            const db = getAdminDb();
            if (db) {
                const now = admin.firestore.FieldValue.serverTimestamp();
                await db.collection('webhook_logs').add({
                    source: 'unknown',
                    payload: {},
                    status: 'failed',
                    error: String(error),
                    createdAt: now,
                });
            }
        } catch { /* ignore logging errors */ }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        endpoint: 'Gharpayy CRM Webhook Handler',
        usage: 'POST /api/webhook with x-webhook-secret header',
        payload: { name: 'string (required)', phone: 'string (required)', email: 'string', source: 'string', notes: 'string' },
    });
}

