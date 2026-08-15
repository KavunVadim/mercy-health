import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '200', 10) || 200));
    const skip = (page - 1) * limit;

    const db = await getDb();
    const [docs, total] = await Promise.all([
      db.collection('news').find({}).sort({ order: -1, createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection('news').countDocuments({}),
    ]);

    return NextResponse.json(docs, {
      headers: {
        'X-Total-Count': String(total),
        'X-Total-Pages': String(Math.ceil(total / limit)),
        'X-Page': String(page),
        'X-Limit': String(limit),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const doc = { ...body, order: Date.now(), createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection('news').insertOne(doc);
    revalidatePath('/uk/news', 'page');
    revalidatePath('/en/news', 'page');
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
