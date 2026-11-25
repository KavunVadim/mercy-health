// src/app/api/auth/change-password/route.ts
// Зміна пароля адміністратора.
//
// Автентифікація: цей шлях (/api/auth/*) свідомо обходить перевірку токена в proxy,
// тому роут перевіряє accessToken сам і бере особу виключно з нього — жодних id/email
// із тіла запиту. Після успішної зміни обидві cookie знищуються: користувач заходить
// заново вже з новим паролем.

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth/jwt';
import { validateNewPassword } from '@/lib/auth/password';
import { rateLimit } from '@/lib/rate-limit';
import { log } from '@/lib/logger';
import { captureError } from '@/lib/error-monitoring';

const BCRYPT_ROUNDS = 12;

function getIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

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

export async function POST(request: Request) {
  const ip = getIp(request);
  try {
    const token = (await cookies()).get('accessToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Потрібна автентифікація' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Сесія недійсна, увійдіть повторно' }, { status: 401 });
    }

    const rl = rateLimit({ interval: 60_000, max: 5, key: `change-password:${ip}:${payload.sub}` });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Забагато спроб. Спробуйте за хвилину.' }, {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.resetInMs / 1000)) },
      });
    }

    const body = await request.json().catch(() => null) as
      | { currentPassword?: unknown; newPassword?: unknown }
      | null;

    const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';

    if (!currentPassword) {
      return NextResponse.json({ error: 'Введіть поточний пароль' }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: payload.sub });
    if (!user || typeof user.passwordHash !== 'string') {
      return NextResponse.json({ error: 'Обліковий запис не знайдено' }, { status: 401 });
    }

    const currentMatches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!currentMatches) {
      log('warn', 'Password change failed: wrong current password', { ip, email: payload.sub });
      return NextResponse.json({ error: 'Поточний пароль неправильний' }, { status: 400 });
    }

    const validation = validateNewPassword(newPassword, { email: user.email });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (await bcrypt.compare(newPassword, user.passwordHash)) {
      return NextResponse.json({ error: 'Новий пароль збігається з поточним' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    const changedAt = new Date();

    const result = await db.collection('users').updateOne(
      { _id: user._id, passwordHash: user.passwordHash },
      {
        $set: { passwordHash, passwordChangedAt: changedAt, updatedAt: changedAt },
        $inc: { passwordVersion: 1 },
      },
    );

    if (result.modifiedCount !== 1) {
      // Хтось змінив пароль паралельно — не перетираємо його хеш.
      return NextResponse.json({ error: 'Пароль щойно змінено в іншій сесії. Увійдіть повторно.' }, { status: 409 });
    }

    log('info', 'Password changed', { ip, email: payload.sub });

    return clearSessionCookies(NextResponse.json({ success: true }));
  } catch (e) {
    await captureError(e, { route: '/api/auth/change-password' });
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
