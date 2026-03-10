import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/admin';
import admin from 'firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ 
        error: 'Firebase not initialized' 
      }, { status: 503 });
    }
    const snapshot = await db.collection('agents').orderBy('name').get();
    const agents = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(agents);
  } catch (err) {
    console.error('GET /api/agents error', err);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ 
        error: 'Firebase not initialized' 
      }, { status: 503 });
    }
    const data = await req.json();
    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = await db.collection('agents').add({ ...data, createdAt: now });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/agents error', err);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
