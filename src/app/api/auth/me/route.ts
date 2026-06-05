import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET() {
  const { cookies } = await import('next/headers');
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, email: payload.sub });
}
