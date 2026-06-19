import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';
import { log } from '@/lib/logger';
import { captureError } from '@/lib/error-monitoring';

function getIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export async function POST(request: Request) {
  try {
    const ip = getIp(request);
    const rl = rateLimit({ interval: 60_000, max: 10, key: `login:${ip}` });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.resetInMs / 1000)) },
      });
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: username });

    if (!user) {
      log('warn', 'Login failed: user not found', { ip, username });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      log('warn', 'Login failed: wrong password', { ip, username });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    log('info', 'Login success', { ip, username: user.email });

    const payload = { sub: user.email, role: user.role };
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
    await captureError(e, { route: '/api/auth/login' });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
