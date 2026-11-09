import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

/** Локаль із шляху — потрібна нижче за течією, у тому числі в not-found. */
function localeFromPath(pathname: string): 'uk' | 'en' {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'uk';
}

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

  // Переносимо локаль у заголовок запиту: `[lang]/not-found.tsx` не отримує
  // params, а клієнтські хуки в цій межі ламають 404 (Next відкочується на
  // кореневий not-found), тому читаємо локаль із серверного контексту.
  const headers = new Headers(request.headers);
  headers.set('x-mh-locale', localeFromPath(pathname));

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    // Усі сторінки (не статика, не файли): потрібно, щоб заголовок локалі
    // доїхав і до кореневого not-found.
    '/((?!_next/static|_next/image|api|.*\\..*).*)',
  ],
};
