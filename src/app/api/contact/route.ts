import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const db = await getDb();
    await db.collection('contacts').insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
      read: false,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Contact form error:', e);
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
  }
}
