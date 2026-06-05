import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(request: Request) {
  try {
    const { collection, ids } = await request.json();

    if (!collection || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'collection and ids[] required' }, { status: 400 });
    }

    const allowed = ['news', 'projects', 'partners', 'reports', 'photos'];
    if (!allowed.includes(collection)) {
      return NextResponse.json({ error: `Invalid collection: ${collection}` }, { status: 400 });
    }

    const invalid = ids.filter((id: string) => !ObjectId.isValid(id));
    if (invalid.length > 0) {
      return NextResponse.json({ error: 'Invalid id list for reorder', invalid }, { status: 400 });
    }

    const db = await getDb();
    const total = ids.length;
    const ops = ids.map((id: string, index: number) => {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid id in ids[]: ${id}`);
      }
      return {
        updateOne: {
          filter: { _id: new ObjectId(id) },
          update: { $set: { order: total - 1 - index, updatedAt: new Date() } },
        },
      };
    });

    await db.collection(collection).bulkWrite(ops);
    revalidateTag('dictionary', { expire: 0 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Reorder failed:', e);
    return NextResponse.json({ error: 'Reorder failed' }, { status: 500 });
  }
}
