/**
 * Session Store — self-contained cookie sessions
 *
 * Session data is encoded directly in a signed cookie (HMAC-SHA256).
 * No server-side storage needed — the cookie IS the session.
 *
 * In production with multiple servers, use iron-session or JWT.
 */

import { cookies } from 'next/headers';
import { createHmac, randomBytes } from 'crypto';

const SESSION_COOKIE = 'wle_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionData {
  email: string;
  name: string;
  company: string;
  loginAt: string;
}

function sign(value: string): string {
  return createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

function encode(data: SessionData, expiresAt: number): string {
  const payload = JSON.stringify({ data, exp: expiresAt });
  const encoded = Buffer.from(payload).toString('base64url');
  const sig = sign(encoded);
  return `${encoded}.${sig}`;
}

function decode(token: string): SessionData | null {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return null;
  const encoded = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);

  if (sign(encoded) !== sig) return null;

  try {
    const payload = Buffer.from(encoded, 'base64url').toString('utf-8');
    const { data, exp } = JSON.parse(payload);
    if (Date.now() > exp) return null;
    return data as SessionData;
  } catch {
    return null;
  }
}

export async function createSession(data: SessionData): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return encode(data, expiresAt);
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  return decode(raw);
}

export async function destroySession(): Promise<void> {
  // No-op for stateless cookie sessions — just clear the cookie client-side
}

export function getSessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  };
}
