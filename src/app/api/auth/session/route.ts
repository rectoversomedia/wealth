import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/session-store';
import { getAdvisorBookingUrl } from '@/lib/services/advisor-store';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });

  return NextResponse.json({
    authenticated: true,
    session,
    bookingUrl: getAdvisorBookingUrl(session.email),
  });
}
