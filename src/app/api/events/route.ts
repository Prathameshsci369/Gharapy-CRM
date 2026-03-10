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
    const leadId = searchParams.get('leadId');

    let query: any = db.collection('events');
    if (leadId) {
      query = query.where('leadId', '==', leadId);
    }
    query = query.orderBy('createdAt', 'desc');

    const snapshot = await query.get();
    const events = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(events);
  } catch (err) {
    console.error('GET /api/events error', err);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
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
    const ref = await db.collection('events').add({ ...data, createdAt: now });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/events error', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
