// middleware.ts (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { middleware as adminMiddleware } from './src/lib/auth/middleware';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass middleware for all login pages and API auth routes
  if (
    pathname === '/admin/login' ||
    pathname.endsWith('/admin/login') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  return adminMiddleware(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/:lang/admin/:path*',
  ],
};
