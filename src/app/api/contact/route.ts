import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { rateLimit } from '@/lib/rate-limit';
import { sanitizeHtml } from '@/lib/sanitize';
import { captureError } from '@/lib/error-monitoring';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = rateLimit({ interval: 60_000, max: 5, key: `contact:${ip}` });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.resetInMs / 1000)) },
      });
    }

    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (name.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: 'Name or message too long' }, { status: 400 });
    }

    const db = await getDb();
    await db.collection('contacts').insertOne({
      name: sanitizeHtml(name).slice(0, 200),
      email,
      message: sanitizeHtml(message).slice(0, 5000),
      createdAt: new Date(),
      read: false,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    await captureError(e, { route: '/api/contact' });
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
  }
}
