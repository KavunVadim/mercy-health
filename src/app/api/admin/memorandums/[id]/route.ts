import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDb();
    const value = await db.collection('memorandums').findOneAndUpdate(
      { id },
      { $set: { ...body, id, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!value) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePath('/uk');
    revalidatePath('/en');
    revalidatePath('/uk/about', 'page');
    revalidatePath('/en/about', 'page');
    return NextResponse.json(value);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update memorandum' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const result = await db.collection('memorandums').deleteOne({ id });
    if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePath('/uk');
    revalidatePath('/en');
    revalidatePath('/uk/about', 'page');
    revalidatePath('/en/about', 'page');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete memorandum' }, { status: 500 });
  }
}
