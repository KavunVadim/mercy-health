import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
    return NextResponse.json({ exists: adminCount > 0 });
  } catch {
    return NextResponse.json({ exists: false });
  }
}
