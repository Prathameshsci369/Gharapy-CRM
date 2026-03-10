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
    await db.collection('reminders').doc(id).update(data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PATCH /api/reminders/[id] error', err);
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 503 });
    }
    await db.collection('reminders').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/reminders/[id] error', err);
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 });
  }
}
