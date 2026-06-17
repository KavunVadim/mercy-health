// src/lib/auth/jwt.ts
// JWT helper for the admin panel (access token 1 h, refresh token 7 days)
// Uses jose (works in both Node.js and Edge runtime)

import { SignJWT, jwtVerify } from 'jose';

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60; // 1 hour in seconds
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60; // 7 days in seconds

export interface JwtPayload {
  sub: string;
  role: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRES_IN)
    .sign(getSecretKey());
}

export async function signRefreshToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRES_IN)
    .sign(getSecretKey());
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return { sub: payload.sub as string, role: payload.role as string };
  } catch {
    return null;
  }
}
