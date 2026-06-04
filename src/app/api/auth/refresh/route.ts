// src/app/api/auth/refresh/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { verifyToken, signAccessToken, signRefreshToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }
  try {
    const payload = await verifyToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }
    const [newAccess, newRefresh] = await Promise.all([
      signAccessToken({ sub: payload.sub, role: payload.role }),
      signRefreshToken({ sub: payload.sub, role: payload.role }),
    ]);
    const response = NextResponse.json({ success: true });
    response.cookies.set('accessToken', newAccess, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60,
    });
    response.cookies.set('refreshToken', newRefresh, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
