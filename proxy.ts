// proxy.ts (project root) — Next.js 16 replaces middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { middleware as adminMiddleware } from './src/lib/auth/middleware';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass middleware for all login/register pages and API auth routes
  if (
    pathname === '/admin/login' ||
    pathname === '/admin/register' ||
    pathname.endsWith('/admin/login') ||
    pathname.endsWith('/admin/register') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  return await adminMiddleware(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/:lang/admin/:path*',
  ],
};
