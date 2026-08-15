import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';

const ALLOWED_COLLECTIONS = ['news', 'projects', 'partners', 'memorandums', 'reports', 'photos'];

function revalidatePublicPages() {
  revalidatePath('/uk');
  revalidatePath('/en');
  revalidatePath('/uk/about', 'page');
  revalidatePath('/en/about', 'page');
  revalidatePath('/uk/projects', 'page');
  revalidatePath('/en/projects', 'page');
  revalidatePath('/uk/news', 'page');
  revalidatePath('/en/news', 'page');
}

function isObjectId(value: string) {
  return ObjectId.isValid(value) && new ObjectId(value).toString() === value;
}

async function reorderByMongoIds(collection: string, ids: string[]) {
  const db = await getDb();
  const bulkOps = ids.map((id, index) => ({
    updateOne: {
      filter: { _id: isObjectId(id) ? new ObjectId(id) : (id as unknown as ObjectId) },
      update: { $set: { order: ids.length - index, updatedAt: new Date() } },
    },
  }));

  if (bulkOps.length > 0) await db.collection(collection).bulkWrite(bulkOps);
}

async function reorderByPublicIds(collection: string, order: string[]) {
  const db = await getDb();
  const bulkOps = order.map((id, index) => ({
    updateOne: {
      filter: { id },
      update: { $set: { order: order.length - index, updatedAt: new Date() } },
    },
  }));

  if (bulkOps.length > 0) await db.collection(collection).bulkWrite(bulkOps);
}

async function handleReorder(request: Request) {
  try {
    const { collection, ids, order } = await request.json();

    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }

    if (Array.isArray(ids)) {
      await reorderByMongoIds(collection, ids);
    } else if (Array.isArray(order)) {
      await reorderByPublicIds(collection, order);
    } else {
      return NextResponse.json({ error: 'Missing ids/order array' }, { status: 400 });
    }

    revalidatePublicPages();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  return handleReorder(request);
}

export async function POST(request: Request) {
  return handleReorder(request);
}
