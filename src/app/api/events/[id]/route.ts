import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/admin';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 503 });
    }
    await db.collection('events').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/events/[id] error', err);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
