import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const doc = await db.collection('news').findOne(
      ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id }
    );
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDb();
    const value = await db.collection('news').findOneAndUpdate(
      ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!value) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const slug = body.slug || body.id || id;
    revalidatePath(`/uk/news/${slug}`, 'page');
    revalidatePath(`/en/news/${slug}`, 'page');
    return NextResponse.json(value);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const result = await db.collection('news').deleteOne(
      ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id }
    );
    if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePath('/uk/news', 'page');
    revalidatePath('/en/news', 'page');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
