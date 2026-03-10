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
    const agentId = searchParams.get('agentId');
    const status = searchParams.get('status');

    let query: any = db.collection('reminders');
    if (agentId) {
      query = query.where('agentId', '==', agentId);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    query = query.orderBy('dueDate', 'asc');

    const snapshot = await query.get();
    const reminders = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(reminders);
  } catch (err) {
    console.error('GET /api/reminders error', err);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 503 });
    }
    const data = await req.json();
    const ref = await db.collection('reminders').add({ ...data });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/reminders error', err);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}
