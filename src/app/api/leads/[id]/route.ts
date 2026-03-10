import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/admin';
import admin from 'firebase-admin';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 503 });
    }
    const data = await req.json();
    data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('leads').doc(id).update(data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PATCH /api/leads/[id] error', err);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 503 });
    }
    await db.collection('leads').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/leads/[id] error', err);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
