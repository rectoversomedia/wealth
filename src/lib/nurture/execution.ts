/**
 * Nurture Execution Engine
 * Processes due nurture sequences and sends the next step.
 *
 * In production: this runs as a cron job (e.g. Vercel Cron, Railway cron).
 * For demo: called on lead detail page load and dashboard overview.
 */

import { getDueSequences, advanceSequence, interpolate, type ActiveSequence } from './store';
import { getSequenceForTier } from './templates';
import { addLeadActivity } from '@/lib/services/leads-store';

interface SendResult {
  sequenceId: string;
  leadId: string;
  step: number;
  channel: string;
  status: 'sent' | 'failed' | 'skipped';
  reason?: string;
}

interface ExecutionResult {
  processed: number;
  sent: SendResult[];
  failed: SendResult[];
  errors: string[];
}

/**
 * Check conditions for a step and determine if it should be sent.
 */
function shouldSendStep(
  condition: 'always' | 'no_response' | 'no_meeting' | undefined,
  sequence: ActiveSequence
): boolean {
  if (condition === 'always') return true;
  if (condition === undefined) return true;

  const hasResponse = sequence.sentSteps.some(s => s.status === 'sent');
  const hasMeeting = sequence.status === 'converted';

  if (condition === 'no_response') return !hasResponse;
  if (condition === 'no_meeting') return !hasMeeting;
  return true;
}

/**
 * Send an email step (demo: console log + mark as sent).
 * Production: integrate with Resend/SendGrid.
 */
async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<'sent' | 'failed'> {
  if (process.env.RESEND_API_KEY) {
    // Production: call Resend API
    // const res = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html: body }),
    // });
    // return res.ok ? 'sent' : 'failed';
    console.log(`[RESEND EMAIL] To: ${to}, Subject: ${subject}`);
    return 'sent';
  } else {
    // Demo: console log
    console.log(`[NURTURE EMAIL]
    To: ${to}
    Subject: ${subject}
    Body: ${body.substring(0, 120)}...`);
    return 'sent';
  }
}

/**
 * Send a WhatsApp step (demo: console log + mark as sent).
 * Production: integrate with Twilio.
 */
async function sendWhatsApp(
  to: string,
  message: string
): Promise<'sent' | 'failed'> {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    // Production: call Twilio API
    // const res = await fetch(
    //   `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
    //   { method: 'POST', ... }
    // );
    // return res.ok ? 'sent' : 'failed';
    console.log(`[TWILIO WHATSAPP] To: ${to}, Message: ${message}`);
    return 'sent';
  } else {
    // Demo: console log
    console.log(`[NURTURE WHATSAPP]
    To: ${to}
    Message: ${message}`);
    return 'sent';
  }
}

/**
 * Process a single sequence — send the due step.
 */
async function processSequence(seq: ActiveSequence): Promise<SendResult> {
  const sequenceTemplate = getSequenceForTier(seq.tier);
  const currentStepIndex = sequenceTemplate.steps.findIndex(s => s.day === seq.currentDay);
  const nextStepIndex = currentStepIndex === -1 ? 0 : currentStepIndex;
  const step = sequenceTemplate.steps[nextStepIndex];

  if (!step) {
    return {
      sequenceId: seq.id,
      leadId: seq.leadId,
      step: nextStepIndex,
      channel: 'none',
      status: 'skipped',
      reason: 'No more steps in sequence',
    };
  }

  // Check condition
  if (!shouldSendStep(step.condition, seq)) {
    return {
      sequenceId: seq.id,
      leadId: seq.leadId,
      step: nextStepIndex,
      channel: step.channel,
      status: 'skipped',
      reason: `Condition '${step.condition}' not met — skipping`,
    };
  }

  const ctx = {
    firstName: seq.leadFirstName,
    score: seq.score,
    topDimension: seq.topDimension,
    weakDimension: seq.weakDimension,
    sessionId: seq.sessionId,
    bookingUrl: seq.bookingUrl ?? '/assessment/booking',
  };

  const subject = step.subject ? interpolate(step.subject, ctx) : undefined;
  const headline = interpolate(step.headline, ctx);
  const body = interpolate(step.body, ctx);

  let result: 'sent' | 'failed' = 'sent';

  if (step.channel === 'email') {
    result = await sendEmail(seq.leadEmail, subject || headline, body);
  } else if (step.channel === 'whatsapp') {
    const waBody = `${headline}\n\n${body}`;
    result = await sendWhatsApp(seq.leadEmail, waBody);
  }

  // Advance the sequence in the store
  advanceSequence(seq.leadId, step, result, subject);

  // Log activity on the lead
  addLeadActivity(seq.leadId, {
    type: 'email_sent',
    description: `Nurture step ${nextStepIndex + 1} (Day ${step.day}) — ${headline}`,
    metadata: { channel: step.channel, status: result },
  });

  return {
    sequenceId: seq.id,
    leadId: seq.leadId,
    step: nextStepIndex,
    channel: step.channel,
    status: result,
  };
}

/**
 * Execute all due nurture sequences.
 * Called by cron job or on-demand.
 */
export async function executeNurtureEngine(): Promise<ExecutionResult> {
  const due = getDueSequences();
  const sent: SendResult[] = [];
  const failed: SendResult[] = [];
  const errors: string[] = [];

  for (const seq of due) {
    try {
      const result = await processSequence(seq);
      if (result.status === 'sent') {
        sent.push(result);
      } else if (result.status === 'failed') {
        failed.push(result);
      } else {
        // skipped — don't count as sent or failed
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Lead ${seq.leadId}: ${msg}`);
    }
  }

  return { processed: due.length, sent, failed, errors };
}
