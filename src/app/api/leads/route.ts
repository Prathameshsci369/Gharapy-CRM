import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/admin';
import admin from 'firebase-admin';

// Server-side API for leads using Firebase Admin SDK
export async function GET(req: NextRequest) {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ 
        error: 'Firebase not initialized. Please ensure service-account.json exists or use SDK authentication.' 
      }, { status: 503 });
    }
    const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
    const leads = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(leads);
  } catch (err) {
    console.error('GET /api/leads error', err);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
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
    const ref = await db.collection('leads').add({ ...data, createdAt: now, updatedAt: now });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/leads error', err);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
