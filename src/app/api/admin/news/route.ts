import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection('news').find({}).sort({ order: -1, createdAt: -1 }).toArray();
    return NextResponse.json(docs);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const doc = { ...body, order: Date.now(), createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection('news').insertOne(doc);
    revalidateTag('dictionary', { expire: 0 });
    revalidatePath('/uk/news', 'page');
    revalidatePath('/en/news', 'page');
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
