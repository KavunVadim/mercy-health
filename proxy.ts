import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

const ACCESS_COOKIE = 'accessToken';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === '/admin/login' ||
    pathname === '/admin/register' ||
    pathname.endsWith('/admin/login') ||
    pathname.endsWith('/admin/register') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_COOKIE)?.value;

  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.next();
    response.headers.set('x-admin-id', payload.sub);
    return response;
  }

  if (pathname.startsWith('/api/admin')) {
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
    '/admin/:path*',
    '/api/admin/:path*',
    '/:lang/admin/:path*',
  ],
};
