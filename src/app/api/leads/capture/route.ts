import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';
import { addLeadActivity } from '@/lib/services/leads-store';
import { addNotification } from '@/lib/services/notifications-store';
import { startNurtureSequence } from '@/lib/nurture/store';
import { getAdvisorBookingUrl } from '@/lib/services/advisor-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, email, phone, phoneCountryCode,
      preferredContact, consent, sessionId,
      // Nurture context from results page
      opportunityScore, topDimension, weakDimension,
    } = body;

    const leadName = `${firstName || ''} ${lastName || ''}`.trim() || 'New Lead';
    const leadId = generateId();

    // ── Save lead activity ──────────────────────────────────────────────
    addLeadActivity(leadId, {
      type: 'lead_created',
      description: `New lead captured: ${leadName} (${email || 'no email'})`,
    });

    if (consent) {
      addLeadActivity(leadId, {
        type: 'consent_given',
        description: 'Marketing consent granted',
      });
    }

    // ── Email notification to advisor ─────────────────────────────────
    const advisorEmail = process.env.ADVISOR_EMAIL || 'advisor@wealthleadengine.com';
    console.log(`[EMAIL NOTIFICATION]
    To: ${advisorEmail}
    Subject: New Lead: ${leadName}
    Body: A new lead (${email}) just completed the assessment. View their profile in the dashboard.`);

    // ── WhatsApp notification ─────────────────────────────────────────
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
      console.log(`[WHATSAPP NOTIFICATION] Would send to ${process.env.TWILIO_WHATSAPP_FROM}: New lead ${leadName}`);
    }

    // ── In-app notification ──────────────────────────────────────────
    addNotification({
      type: 'new_lead',
      title: 'New Lead Captured',
      message: `${leadName} just submitted their email. View their profile.`,
      leadId,
      leadName,
      opportunityScore,
      opportunityTier: getTier(opportunityScore),
    });

    // ── Start nurture sequence ────────────────────────────────────────
    const score = opportunityScore ?? 0;
    const tier = getTier(score);
    const topDim = topDimension || 'your financial position';
    const weakDim = weakDimension || 'financial planning';
    const bookingUrl = getAdvisorBookingUrl('demo@wealthleadengine.com') || '/assessment/booking';

    const sequence = startNurtureSequence({
      leadId,
      email: email || '',
      firstName: firstName || 'there',
      sessionId: sessionId || '',
      score,
      tier,
      topDimension: topDim,
      weakDimension: weakDim,
      bookingUrl,
    });

    if (sequence) {
      const { getSequenceForTier } = await import('@/lib/nurture/templates');
      const template = getSequenceForTier(tier);
      console.log(`[NURTURE] Started ${tier} sequence for lead ${leadName} (score ${score})`);
      console.log(`[NURTURE] Sequence: ${sequence.sequenceName} (${template.steps.length} steps)`);
      console.log(`[NURTURE] First step scheduled: ${new Date(sequence.nextStepAt!).toLocaleString()}`);
      addLeadActivity(leadId, {
        type: 'lead_created',
        description: `Nurture sequence started: ${sequence.sequenceName}`,
      });
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead captured successfully',
      nurtureStarted: !!sequence,
    });
  } catch (err) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 });
  }
}

function getTier(score: number): 'hot' | 'warm' | 'nurture' {
  if (score >= 81) return 'hot';
  if (score >= 51) return 'warm';
  return 'nurture';
}
