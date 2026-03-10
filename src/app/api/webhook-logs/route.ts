import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/admin';
import admin from 'firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 503 });
    }
    const { searchParams } = new URL(req.url);
    const source = searchParams.get('source');
    const status = searchParams.get('status');

    let query: any = db.collection('webhook_logs');
    if (source) {
      query = query.where('source', '==', source);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    query = query.orderBy('createdAt', 'desc').limit(100);

    const snapshot = await query.get();
    const logs = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(logs);
  } catch (err) {
    console.error('GET /api/webhook-logs error', err);
    return NextResponse.json({ error: 'Failed to fetch webhook logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 503 });
    }
    const data = await req.json();
    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = await db.collection('webhook_logs').add({ ...data, createdAt: now });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/webhook-logs error', err);
    return NextResponse.json({ error: 'Failed to create webhook log' }, { status: 500 });
  }
}
