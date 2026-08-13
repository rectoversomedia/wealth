import { NextRequest, NextResponse } from 'next/server';
import { getActiveSequenceForLead, getAllActiveSequences, pauseSequence, resumeSequence, markConverted } from '@/lib/nurture/store';
import { executeNurtureEngine } from '@/lib/nurture/execution';

/**
 * GET /api/nurture?leadId=xxx
 * Get active nurture sequence for a specific lead.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get('leadId');

  if (leadId) {
    const seq = getActiveSequenceForLead(leadId);
    return NextResponse.json({ sequence: seq ?? null });
  }

  // Return all active sequences (for dashboard)
  const all = getAllActiveSequences();
  return NextResponse.json({
    sequences: all,
    count: all.length,
  });
}

/**
 * POST /api/nurture
 * Body: { action: 'process' | 'pause' | 'resume' | 'convert', leadId?: string }
 *
 * process: runs the nurture engine for all due sequences
 * pause/resume/convert: updates a specific lead's sequence
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, leadId } = body;

    if (action === 'process') {
      // Run the nurture engine
      const result = await executeNurtureEngine();
      return NextResponse.json({
        success: true,
        ...result,
      });
    }

    if (!leadId) {
      return NextResponse.json({ error: 'leadId required' }, { status: 400 });
    }

    if (action === 'pause') {
      const ok = pauseSequence(leadId);
      return NextResponse.json({ success: ok });
    }

    if (action === 'resume') {
      const ok = resumeSequence(leadId);
      return NextResponse.json({ success: ok });
    }

    if (action === 'convert') {
      const ok = markConverted(leadId);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
