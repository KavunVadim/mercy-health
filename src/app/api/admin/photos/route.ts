import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const galleryFilter = searchParams.get('gallery');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '200', 10) || 200));
    const skip = (page - 1) * limit;

    const db = await getDb();
    const filter = galleryFilter === 'true' ? { inGallery: true } : {};
    const [photos, total] = await Promise.all([
      db.collection('photos').find(filter).sort({ order: -1, createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection('photos').countDocuments(filter),
    ]);

    return NextResponse.json(photos, {
      headers: {
        'X-Total-Count': String(total),
        'X-Total-Pages': String(Math.ceil(total / limit)),
        'X-Page': String(page),
        'X-Limit': String(limit),
      },
    });
  } catch (e) {
    console.error('Failed to fetch photos:', e);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const doc = {
      ...body,
      order: Date.now(),
      visible: true,
      inGallery: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('photos').insertOne(doc);
    revalidatePath('/uk/news');
    revalidatePath('/en/news');
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (e) {
    console.error('Failed to create photo:', e);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}
