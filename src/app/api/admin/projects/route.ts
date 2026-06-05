import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection('projects').find({}).sort({ order: 1, createdAt: -1 }).toArray();
    return NextResponse.json(docs);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const maxOrder = await db.collection('projects').findOne({}, { sort: { order: -1 }, projection: { order: 1 } });
    const order = (maxOrder?.order ?? -1) + 1;
    const doc = { ...body, order, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection('projects').insertOne(doc);
    revalidateTag('dictionary', 'max');
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
