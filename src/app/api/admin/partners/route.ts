import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { slugify } from '@/lib/data-utils';

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection('partners').find({}).sort({ order: 1, createdAt: -1 }).toArray();
    return NextResponse.json(docs);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const maxOrder = await db.collection('partners').findOne({}, { sort: { order: -1 }, projection: { order: 1 } });
    const order = (maxOrder?.order ?? -1) + 1;
    const doc = {
      ...body,
      id: body.id || slugify(body.name?.uk || body.name || 'partner'),
      order,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('partners').insertOne(doc);
    revalidateTag('dictionary', 'max');
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}
