import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' });

    if (adminCount > 0) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 409 });
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.collection('users').insertOne({
      email,
      passwordHash,
      role: 'admin',
      createdAt: new Date(),
    });

    const payload = { sub: email, role: 'admin' };
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(payload),
      signRefreshToken(payload),
    ]);

    const response = NextResponse.json({ success: true });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60,
    });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (e) {
    console.error('Register error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
