import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDb();
    const value = await db.collection('reports').findOneAndUpdate(
      { id },
      { $set: { ...body, id, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!value) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePath('/uk/reports');
    revalidatePath('/en/reports');
    return NextResponse.json(value);
  } catch {
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const result = await db.collection('reports').deleteOne({ id });
    if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePath('/uk/reports');
    revalidatePath('/en/reports');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
