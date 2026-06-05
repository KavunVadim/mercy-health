import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('accessToken')?.value;
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/admin/:path*',
  ],
};
