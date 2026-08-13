import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/services/session-store';

export async function POST() {
  await destroySession();
  const response = NextResponse.json({ success: true });
  response.cookies.set('wle_session', '', { path: '/', maxAge: 0 });
  return response;
}
