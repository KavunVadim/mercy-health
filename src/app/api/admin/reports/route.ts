import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { slugify } from '@/lib/data-utils';

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection('reports').find({}).sort({ order: -1, createdAt: -1 }).toArray();
    return NextResponse.json(docs);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const doc = {
      ...body,
      id: body.id || slugify(body.title?.uk || body.title || 'report'),
      order: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('reports').insertOne(doc);
    revalidatePath('/uk/reports');
    revalidatePath('/en/reports');
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
