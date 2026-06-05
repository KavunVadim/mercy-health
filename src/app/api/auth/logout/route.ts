// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url));
  // Clear auth cookies
  response.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
  response.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
  return response;
}
