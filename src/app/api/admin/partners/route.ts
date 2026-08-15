import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { slugify } from '@/lib/data-utils';

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection('partners').find({}).sort({ order: -1, createdAt: -1 }).toArray();
    return NextResponse.json(docs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const doc = {
      ...body,
      id: body.id || slugify(body.name?.uk || body.name || 'partner'),
      order: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('partners').insertOne(doc);
    revalidatePath('/uk');
    revalidatePath('/en');
    revalidatePath('/uk/about', 'page');
    revalidatePath('/en/about', 'page');
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}
