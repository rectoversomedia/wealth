/**
 * Nurture Sequence Store
 * Tracks active nurture sequences for each lead.
 * Replaces with Supabase in production.
 */

import { generateId } from '@/lib/utils';
import { getSequenceForTier, type NurtureStep, type NurtureChannel } from './templates';

export interface ActiveSequence {
  id: string;
  leadId: string;
  sequenceId: string;
  sequenceName: string;
  tier: 'hot' | 'warm' | 'nurture';
  status: 'active' | 'completed' | 'paused' | 'converted';
  currentDay: number;
  startedAt: string;
  completedAt?: string;
  nextStepAt?: string; // ISO date string — when to send next step
  sentSteps: SentStep[];
  leadEmail: string;
  leadFirstName: string;
  sessionId: string;
  score: number;
  topDimension: string;
  weakDimension: string;
  bookingUrl?: string;
}

export interface SentStep {
  stepIndex: number;
  day: number;
  channel: NurtureChannel;
  sentAt: string;
  status: 'sent' | 'failed';
  subject?: string; // For email
  headline: string;
}

const activeSequences = new Map<string, ActiveSequence>();

export interface LeadContext {
  leadId: string;
  email: string;
  firstName: string;
  sessionId: string;
  score: number;
  tier: 'hot' | 'warm' | 'nurture';
  topDimension: string;
  weakDimension: string;
  bookingUrl?: string;
}

/**
 * Start a nurture sequence for a lead when they are captured.
 */
export function startNurtureSequence(context: LeadContext): ActiveSequence | null {
  // Check if lead already has an active sequence
  const existing = getActiveSequenceForLead(context.leadId);
  if (existing) return existing;

  const sequence = getSequenceForTier(context.tier);
  if (!sequence) return null;

  const firstStep = sequence.steps[0];
  const now = new Date();

  const active: ActiveSequence = {
    id: generateId(),
    leadId: context.leadId,
    sequenceId: sequence.id,
    sequenceName: sequence.name,
    tier: context.tier,
    status: 'active',
    currentDay: 0,
    startedAt: now.toISOString(),
    nextStepAt: new Date(now.getTime() + firstStep.day * 24 * 60 * 60 * 1000).toISOString(),
    sentSteps: [],
    leadEmail: context.email,
    leadFirstName: context.firstName,
    sessionId: context.sessionId,
    score: context.score,
    topDimension: context.topDimension,
    weakDimension: context.weakDimension,
    bookingUrl: context.bookingUrl ?? '/assessment/booking',
  };

  activeSequences.set(context.leadId, active);
  return active;
}

export function getActiveSequenceForLead(leadId: string): ActiveSequence | null {
  return activeSequences.get(leadId) ?? null;
}

export function getAllActiveSequences(): ActiveSequence[] {
  return Array.from(activeSequences.values()).filter(s => s.status === 'active');
}

/**
 * Get all sequences that are due for their next step.
 */
export function getDueSequences(): ActiveSequence[] {
  const now = new Date();
  return getAllActiveSequences().filter(seq => {
    if (!seq.nextStepAt) return false;
    return new Date(seq.nextStepAt) <= now;
  });
}

/**
 * Send the next step for a sequence and advance to the following step.
 * Returns the step that was sent (for logging/debugging).
 */
export function advanceSequence(
  leadId: string,
  step: NurtureStep,
  result: 'sent' | 'failed',
  subject?: string
): ActiveSequence | null {
  const seq = activeSequences.get(leadId);
  if (!seq) return null;

  // Mark step as sent
  seq.sentSteps.push({
    stepIndex: seq.sentSteps.length,
    day: step.day,
    channel: step.channel,
    sentAt: new Date().toISOString(),
    status: result,
    subject,
    headline: step.headline,
  });

  seq.currentDay = step.day;

  // Find the next step in the sequence
  const sequence = getSequenceForTier(seq.tier);
  const nextStepIndex = sequence.steps.findIndex(s => s.day > step.day);
  if (nextStepIndex === -1) {
    // No more steps — sequence complete
    seq.status = 'completed';
    seq.completedAt = new Date().toISOString();
    seq.nextStepAt = undefined;
  } else {
    const nextStep = sequence.steps[nextStepIndex];
    const now = new Date();
    seq.nextStepAt = new Date(now.getTime() + nextStep.day * 24 * 60 * 60 * 1000).toISOString();
  }

  activeSequences.set(leadId, seq);
  return seq;
}

export function pauseSequence(leadId: string): boolean {
  const seq = activeSequences.get(leadId);
  if (!seq) return false;
  seq.status = 'paused';
  activeSequences.set(leadId, seq);
  return true;
}

export function resumeSequence(leadId: string): boolean {
  const seq = activeSequences.get(leadId);
  if (!seq || seq.status !== 'paused') return false;
  seq.status = 'active';
  activeSequences.set(leadId, seq);
  return true;
}

export function markConverted(leadId: string): boolean {
  const seq = activeSequences.get(leadId);
  if (!seq) return false;
  seq.status = 'converted';
  seq.completedAt = new Date().toISOString();
  activeSequences.set(leadId, seq);
  return true;
}

/**
 * Interpolate template variables in a string.
 * Variables: {{firstName}}, {{score}}, {{topDimension}}, {{weakDimension}}, {{sessionId}}, {{bookingUrl}}
 */
export function interpolate(
  text: string,
  context: { firstName: string; score: number; topDimension: string; weakDimension: string; sessionId: string; bookingUrl?: string }
): string {
  return text
    .replace(/\{\{firstName\}\}/g, context.firstName || 'there')
    .replace(/\{\{score\}\}/g, String(context.score))
    .replace(/\{\{topDimension\}\}/g, context.topDimension || 'your financial position')
    .replace(/\{\{weakDimension\}\}/g, context.weakDimension || 'financial planning')
    .replace(/\{\{sessionId\}\}/g, context.sessionId)
    .replace(/\{\{bookingUrl\}\}/g, context.bookingUrl || '/assessment/booking');
}
