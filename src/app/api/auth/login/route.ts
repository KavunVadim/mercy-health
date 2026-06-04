// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD_HASH_B64 = process.env.ADMIN_PASSWORD_HASH_B64;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH_B64) {
      console.error('Admin credentials not set in environment variables');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const ADMIN_PASSWORD_HASH = Buffer.from(ADMIN_PASSWORD_HASH_B64, 'base64').toString('utf-8');

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (username !== ADMIN_USERNAME) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const payload = { sub: ADMIN_USERNAME, role: 'admin' };
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
      maxAge: 15 * 60, // 15 minutes
    });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
