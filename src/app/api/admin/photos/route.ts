import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const galleryFilter = searchParams.get('gallery');

    const db = await getDb();
    const filter = galleryFilter === 'true' ? { inGallery: true } : {};
    const photos = await db.collection('photos').find(filter).sort({ order: 1, createdAt: -1 }).toArray();
    return NextResponse.json(photos);
  } catch (e) {
    console.error('Failed to fetch photos:', e);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const maxOrder = await db.collection('photos').findOne({}, { sort: { order: -1 }, projection: { order: 1 } });
    const order = (maxOrder?.order ?? -1) + 1;
    const doc = {
      ...body,
      order,
      visible: true,
      inGallery: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('photos').insertOne(doc);
    revalidateTag('dictionary', 'max');
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (e) {
    console.error('Failed to create photo:', e);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}
