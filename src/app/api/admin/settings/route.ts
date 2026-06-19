import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

const ALLOWED_SETTINGS = ['siteName', 'siteDescription', 'logo', 'favicon', 'socialLinks', 'contactEmail', 'contactPhone', 'address'];

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const allowed: Record<string, unknown> = {};
    for (const key of ALLOWED_SETTINGS) {
      if (key in body) allowed[key] = body[key];
    }
    await db.collection('settings').updateOne(
      { key: 'main' },
      { $set: { ...allowed, updatedAt: new Date() } },
      { upsert: true }
    );
    revalidatePath('/uk');
    revalidatePath('/en');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
