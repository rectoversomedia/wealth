import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/services/session-store';
import { getAllCampaigns, getCampaignById, createCampaign, updateCampaign, deleteCampaign } from '@/lib/services/campaign-store';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ campaigns: getAllCampaigns() });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, country, audience, coreConcern, landingUrl, channels, status } = body;

    if (!name || !country) {
      return NextResponse.json({ error: 'name and country are required' }, { status: 400 });
    }

    const campaign = createCampaign({
      name, country, audience: audience || '', coreConcern: coreConcern || '',
      landingUrl: landingUrl || `/${country}`, channels: channels || [],
      status: status || 'draft',
      leads: 0, qualified: 0, meetings: 0, clients: 0, spend: 0,
    });

    return NextResponse.json({ success: true, campaign }, { status: 201 });
  } catch (err) {
    console.error('Create campaign error:', err);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const updated = updateCampaign(id, updates);
    if (!updated) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

    return NextResponse.json({ success: true, campaign: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const ok = deleteCampaign(id);
  return NextResponse.json({ success: ok });
}
