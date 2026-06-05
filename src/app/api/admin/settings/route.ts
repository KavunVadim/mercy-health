import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection('settings').findOne({ key: 'main' });
    if (!doc) return NextResponse.json({});
    const { _id, key, ...data } = doc;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    await db.collection('settings').updateOne(
      { key: 'main' },
      { $set: { key: 'main', ...body, updatedAt: new Date() } },
      { upsert: true }
    );
    revalidateTag('dictionary', 'max');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
