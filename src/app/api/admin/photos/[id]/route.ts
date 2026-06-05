import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { deleteFromS3, extractKeyFromUrl } from '@/lib/s3';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const doc = await db.collection('photos').findOne({ _id: new ObjectId(id) });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    console.error('Failed to fetch photo:', e);
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDb();
    const result = await db.collection('photos').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidateTag('dictionary', 'max');
    return NextResponse.json(result);
  } catch (e) {
    console.error('Failed to update photo:', e);
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const db = await getDb();

    const existing = await db.collection('photos').findOne({ _id: new ObjectId(id) });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const s3Key = existing.s3Key || (body.url ? extractKeyFromUrl(body.url) : null);
    if (s3Key) await deleteFromS3(s3Key);

    await db.collection('photos').deleteOne({ _id: new ObjectId(id) });
    revalidateTag('dictionary', 'max');
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Failed to delete photo:', e);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
