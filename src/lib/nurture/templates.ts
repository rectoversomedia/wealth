/**
 * Nurture Sequence Templates
 * Value-first follow-up sequences per opportunity tier.
 * Each step is triggered N days after the lead was captured.
 */

export type NurtureChannel = 'email' | 'whatsapp';
export type NurtureStatus = 'active' | 'completed' | 'paused' | 'converted';

export interface NurtureStep {
  day: number; // Days after lead captured
  channel: NurtureChannel;
  subject?: string; // For email
  headline: string;
  body: string;
  cta?: string;
  ctaLink?: string;
  condition?: 'always' | 'no_response' | 'no_meeting'; // When to send
}

export interface NurtureSequence {
  id: string;
  name: string;
  tier: 'hot' | 'warm' | 'nurture';
  description: string;
  steps: NurtureStep[];
}

// ─── Hot Leads: Urgent, short sequence ────────────────────────────────────────

const HOT_SEQUENCE: NurtureSequence = {
  id: 'hot_default',
  name: 'Hot Lead — Priority Outreach',
  tier: 'hot',
  description: 'For leads scoring 81+. Short, high-value sequence.',
  steps: [
    {
      day: 0,
      channel: 'email',
      subject: 'Your Wealth Readiness Report is ready',
      headline: 'Your results are in',
      body: 'Hi {{firstName}}, you just completed your Wealth Readiness Assessment. Your personalized report is ready — click below to view your score and AI-generated insights.',
      cta: 'View Your Report',
      ctaLink: '/results/{{sessionId}}',
      condition: 'always',
    },
    {
      day: 1,
      channel: 'email',
      subject: 'Let me share something specific to your situation',
      headline: 'Quick note on your profile',
      body: 'Hi {{firstName}}, based on your assessment results, there are 2–3 areas that stood out. I wanted to reach out directly — would you be open to a 15-minute call this week to walk through them? No obligation.',
      cta: 'Book a 15-min call',
      ctaLink: '{{bookingUrl}}',
      condition: 'no_response',
    },
    {
      day: 3,
      channel: 'whatsapp',
      headline: 'Following up — {{score}}/100 score',
      body: 'Hi {{firstName}}, I noticed you viewed your Wealth Readiness Report. With a score of {{score}}/100, there are some specific opportunities worth discussing. Happy to chat whenever you have 15 minutes free.',
      condition: 'no_response',
    },
    {
      day: 5,
      channel: 'email',
      subject: 'One insight from your assessment',
      headline: 'One thing worth knowing',
      body: 'Hi {{firstName}}, I\'ll keep this short. Based on your assessment, your {{topDimension}} is one area that\'s worth reviewing. If you ever want to explore what that means for you specifically, my calendar is here.',
      cta: 'See available times',
      ctaLink: '{{bookingUrl}}',
      condition: 'no_response',
    },
    {
      day: 10,
      channel: 'email',
      subject: 'Re: Your Wealth Readiness Assessment',
      headline: 'Still here if you want to chat',
      body: 'Hi {{firstName}}, I just wanted to check in one more time. Your assessment showed strong potential in your financial foundation. If you have any questions — about the report, about next steps, or just about your situation — I\'m happy to help. No strings attached.',
      condition: 'no_response',
    },
  ],
};

// ─── Warm Leads: Medium sequence ───────────────────────────────────────────────

const WARM_SEQUENCE: NurtureSequence = {
  id: 'warm_default',
  name: 'Warm Lead — Value Nurture',
  tier: 'warm',
  description: 'For leads scoring 51–80. Value-first educational sequence.',
  steps: [
    {
      day: 0,
      channel: 'email',
      subject: 'Your Wealth Readiness Report — what it means',
      headline: 'Your results are ready',
      body: 'Hi {{firstName}}, thank you for completing the assessment. Your Wealth Readiness Score is {{score}}/100. Your personalized report is ready — here\'s what it covers and why it matters for your situation.',
      cta: 'View Your Report',
      ctaLink: '/results/{{sessionId}}',
      condition: 'always',
    },
    {
      day: 3,
      channel: 'email',
      subject: 'The #1 mistake people make at your income level',
      headline: 'One pattern I see often',
      body: 'Hi {{firstName}}, at your income and asset level, one of the most common gaps I see is in {{weakDimension}}. It\'s rarely about not having enough — it\'s usually about how it\'s structured. Here\'s a quick breakdown of what that typically looks like.',
      condition: 'always',
    },
    {
      day: 7,
      channel: 'whatsapp',
      headline: 'Quick check-in',
      body: 'Hi {{firstName}}, hope the report was useful! If you have any questions about your results, or want to understand the next steps, feel free to reply here. Happy to help anytime.',
      condition: 'no_response',
    },
    {
      day: 12,
      channel: 'email',
      subject: '3 signs your financial plan might have a gap',
      headline: 'A quick checklist for you',
      body: 'Hi {{firstName}}, I put together 3 quick signs that often indicate a gap in financial planning — particularly relevant for people at your stage. You can use this as a personal review checklist.',
      condition: 'always',
    },
    {
      day: 18,
      channel: 'email',
      subject: 'Is now the right time to review your plan?',
      headline: 'Worth 5 minutes of your time',
      body: 'Hi {{firstName}}, I\'ll be direct — if you\'re thinking about your financial future at all, now is usually the best time to do a review. Things change, and strategies that worked last year might not be optimal now. Happy to do a quick scan if you\'d like.',
      cta: 'Book a free review',
      ctaLink: '{{bookingUrl}}',
      condition: 'no_meeting',
    },
    {
      day: 25,
      channel: 'email',
      subject: 'One action you can take this week',
      headline: 'Something practical',
      body: 'Hi {{firstName}}, here\'s one specific action you can take this week that would meaningfully move the needle on your {{topDimension}}: [specific action]. Most people don\'t do it — but it\'s simpler than it sounds.',
      condition: 'always',
    },
    {
      day: 35,
      channel: 'email',
      subject: 'Your assessment — still available',
      headline: 'Still happy to help',
      body: 'Hi {{firstName}}, just circling back. Your report is still available if you\'d like to revisit it. If you have any questions about your results, or want to explore what a financial review might look like for you, my calendar is open.',
      cta: 'See available times',
      ctaLink: '{{bookingUrl}}',
      condition: 'no_meeting',
    },
  ],
};

// ─── Nurture Leads: Long educational sequence ───────────────────────────────────

const NURTURE_SEQUENCE: NurtureSequence = {
  id: 'nurture_default',
  name: 'Nurture Lead — Educational Sequence',
  tier: 'nurture',
  description: 'For leads scoring below 51. Long-term education and trust building.',
  steps: [
    {
      day: 0,
      channel: 'email',
      subject: 'Welcome — your report is here',
      headline: 'Welcome, {{firstName}}',
      body: 'Hi {{firstName}}, thanks for taking the time to complete the Wealth Readiness Assessment. Your personalized report is ready. Even if you\'re not ready to take action yet, I hope the insights are useful for you.',
      cta: 'View Your Report',
      ctaLink: '/results/{{sessionId}}',
      condition: 'always',
    },
    {
      day: 5,
      channel: 'email',
      subject: 'The 3 foundations of financial planning',
      headline: 'A quick framework',
      body: 'Hi {{firstName}}, here\'s a simple 3-part framework that most solid financial plans are built on. You don\'t need all three to start — but knowing them helps prioritize.',
      condition: 'always',
    },
    {
      day: 14,
      channel: 'email',
      subject: 'Why most people delay financial planning (and why not to)',
      headline: 'A common pattern',
      body: 'Hi {{firstName}}, one of the most common things I hear is "I\'ll get to it later." Here\'s why that\'s understandable — and why it usually costs more than people realize.',
      condition: 'always',
    },
    {
      day: 22,
      channel: 'email',
      subject: 'Retirement: what most people get wrong',
      headline: 'A common misconception',
      body: 'Hi {{firstName}}, retirement planning is one of the areas where assumptions often don\'t match reality. Here\'s what the data actually shows — and what it means for your timeline.',
      condition: 'always',
    },
    {
      day: 32,
      channel: 'whatsapp',
      headline: 'Checking in',
      body: 'Hi {{firstName}}, just a quick note — your assessment results are still available whenever you want to take another look. If you have any questions as you think about your finances, I\'m happy to help.',
      condition: 'no_response',
    },
    {
      day: 42,
      channel: 'email',
      subject: 'One number that changes how people think about financial planning',
      headline: 'A perspective shift',
      body: 'Hi {{firstName}}, here\'s one number that tends to shift how people think about financial planning. It\'s not complicated — but it changes the conversation entirely.',
      condition: 'always',
    },
    {
      day: 55,
      channel: 'email',
      subject: 'Is it time to take a closer look?',
      headline: 'Thinking about next steps',
      body: 'Hi {{firstName}}, if you\'ve been thinking about your financial plan, it might be worth taking a closer look. I\'d be happy to do a quick, no-obligation review of your situation. No sales pressure — just a practical conversation.',
      cta: 'Book a free call',
      ctaLink: '{{bookingUrl}}',
      condition: 'no_meeting',
    },
    {
      day: 70,
      channel: 'email',
      subject: 'Your report is still available',
      headline: 'Last note from me',
      body: 'Hi {{firstName}}, I\'ll stop reaching out after this — but your Wealth Readiness Report is always available if you want to revisit it. Thanks again for taking the time to assess your situation. Wishing you all the best.',
      condition: 'always',
    },
  ],
};

export const NURTURE_SEQUENCES: Record<string, NurtureSequence> = {
  hot: HOT_SEQUENCE,
  warm: WARM_SEQUENCE,
  nurture: NURTURE_SEQUENCE,
};

export function getSequenceForTier(tier: 'hot' | 'warm' | 'nurture'): NurtureSequence {
  return NURTURE_SEQUENCES[tier];
}

export function getStepForDay(sequence: NurtureSequence, day: number): NurtureStep | null {
  return sequence.steps.find(s => s.day === day) ?? null;
}
