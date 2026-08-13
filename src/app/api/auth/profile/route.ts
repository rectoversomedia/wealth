import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/services/session-store';
import { getAdvisorByEmail, updateAdvisorProfile, updatePassword } from '@/lib/services/advisor-store';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const advisor = getAdvisorByEmail(session.email);
  if (!advisor) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ advisor });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, phone, whatsapp, company, bio, bookingUrl, disclaimer, privacyUrl, termsUrl, countries } = body;

    const updated = updateAdvisorProfile(session.email, {
      name, phone, whatsapp, company, bio, bookingUrl, disclaimer, privacyUrl, termsUrl, countries,
    });

    if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

    return NextResponse.json({ success: true, advisor: updated });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'currentPassword and newPassword required' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const ok = await updatePassword(session.email, newPassword);
    return NextResponse.json({ success: ok });
  } catch (err) {
    return NextResponse.json({ error: 'Password update failed' }, { status: 500 });
  }
}
