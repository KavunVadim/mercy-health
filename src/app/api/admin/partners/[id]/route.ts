import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDb();
    const value = await db.collection('partners').findOneAndUpdate(
      { id },
      { $set: { ...body, id, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!value) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidateTag('dictionary', { expire: 0 });
    revalidatePath('/uk/about', 'page');
    revalidatePath('/en/about', 'page');
    return NextResponse.json(value);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const result = await db.collection('partners').deleteOne({ id });
    if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidateTag('dictionary', { expire: 0 });
    revalidatePath('/uk/about', 'page');
    revalidatePath('/en/about', 'page');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
