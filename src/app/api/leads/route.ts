import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/services/session-store';
import { getAllLeads, getLeadById } from '@/lib/services/leads-store';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status'); // hot | warm | nurture
  const search = searchParams.get('search');

  if (id) {
    const lead = getLeadById(id);
    return NextResponse.json({ lead: lead ?? null });
  }

  let leads = getAllLeads();

  // Filter by tier/status
  if (status && status !== 'all') {
    leads = leads.filter(l => l.opportunityScore?.tier === status);
  }

  // Search by name or email
  if (search) {
    const q = search.toLowerCase();
    leads = leads.filter(l =>
      l.firstName.toLowerCase().includes(q) ||
      l.lastName.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q)
    );
  }

  // Sort: newest first
  leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    leads,
    total: leads.length,
    hotCount: getAllLeads().filter(l => l.opportunityScore?.tier === 'hot').length,
    warmCount: getAllLeads().filter(l => l.opportunityScore?.tier === 'warm').length,
    nurtureCount: getAllLeads().filter(l => l.opportunityScore?.tier === 'nurture').length,
  });
}
