// src/app/api/auth/refresh/route.ts
//
// Оновлення access/refresh токенів. Окрім перевірки підпису, роут дивиться в БД:
//  • акаунт має існувати (видалений адмін не може оновлювати сесію);
//  • токен, виданий до останньої зміни пароля (`passwordChangedAt`), не оновлюється —
//    так зміна пароля вибиває й інші пристрої, а не лише поточний браузер.
import { NextResponse, NextRequest } from 'next/server';
import { verifyToken, signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { getDb } from '@/lib/mongodb';

function clearSessionCookies(response: NextResponse): NextResponse {
  for (const name of ['accessToken', 'refreshToken']) {
    response.cookies.set(name, '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  return response;
}

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }
  try {
    const payload = await verifyToken(refreshToken);
    if (!payload) {
      return clearSessionCookies(NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 }));
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: payload.sub });
    if (!user) {
      return clearSessionCookies(NextResponse.json({ error: 'Account not found' }, { status: 401 }));
    }

    const changedAt = user.passwordChangedAt instanceof Date ? user.passwordChangedAt : null;
    if (changedAt && payload.iat !== undefined && payload.iat * 1000 < changedAt.getTime()) {
      return clearSessionCookies(NextResponse.json({ error: 'Password changed, sign in again' }, { status: 401 }));
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
