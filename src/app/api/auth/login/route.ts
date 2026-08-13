import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/lib/services/advisor-store';
import { createSession, getSessionCookieOptions } from '@/lib/services/session-store';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const advisor = await validateCredentials(email, password);
    if (!advisor) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await createSession({
      email: advisor.email,
      name: advisor.name,
      company: advisor.company,
      loginAt: new Date().toISOString(),
    });

    const response = NextResponse.json({
      success: true,
      advisor: { name: advisor.name, email: advisor.email, company: advisor.company },
    });

    const cookieOpts = getSessionCookieOptions(token);
    response.cookies.set(cookieOpts);

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
