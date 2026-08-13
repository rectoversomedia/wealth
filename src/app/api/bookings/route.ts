import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';
import { getSession } from '@/lib/services/session-store';
import { getAdvisorBookingUrl } from '@/lib/services/advisor-store';
import { addLeadActivity } from '@/lib/services/leads-store';

export interface Booking {
  id: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  callType: 'video' | 'phone';
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const _bookings = new Map<string, Booking>();

export async function POST(req: NextRequest) {
  // Booking can be made by public (lead) or authenticated (advisor)
  const session = await getSession();
  const advisorEmail = session?.email ?? 'advisor@wealthleadengine.com';

  try {
    const body = await req.json();
    const { leadName, leadEmail, leadPhone, callType, preferredDate, preferredTime, notes } = body;

    if (!leadName || !leadEmail || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: 'leadName, leadEmail, preferredDate, and preferredTime are required' },
        { status: 400 }
      );
    }

    const booking: Booking = {
      id: generateId(),
      leadName,
      leadEmail,
      leadPhone: leadPhone || '',
      callType: callType || 'video',
      preferredDate,
      preferredTime,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    _bookings.set(booking.id, booking);

    // Notify advisor
    const bookingUrl = getAdvisorBookingUrl(advisorEmail);
    console.log(`[BOOKING NOTIFICATION]
    Advisor: ${advisorEmail}
    Lead: ${leadName} (${leadEmail})
    Date: ${preferredDate} at ${preferredTime}
    Type: ${callType}
    Cal.com link: ${bookingUrl}
    Booking ID: ${booking.id}`);

    return NextResponse.json({
      success: true,
      booking,
      confirmationMessage: `Your booking request for ${preferredDate} at ${preferredTime} has been received. Check your email for confirmation.`,
    }, { status: 201 });
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const booking = _bookings.get(id);
    return NextResponse.json({ booking: booking ?? null });
  }

  const all = Array.from(_bookings.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json({ bookings: all });
}
