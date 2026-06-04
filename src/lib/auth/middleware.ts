// src/lib/auth/middleware.ts
// Protects /admin routes with JWT access token stored in an httpOnly cookie
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './jwt';

const ACCESS_COOKIE = 'accessToken';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the API auth routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Always allow login pages
  if (pathname === '/admin/login' || pathname.endsWith('/admin/login')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_COOKIE)?.value;

  // Protect /admin UI routes
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

  // Protect /api/admin routes
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
