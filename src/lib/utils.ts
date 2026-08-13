import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function formatCurrency(amount: string, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(0);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function scoreToLabel(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Strong';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Developing';
  if (score >= 50) return 'Foundation Building';
  return 'Getting Started';
}

export function scoreToColor(score: number): string {
  if (score >= 80) return '#16a34a'; // green
  if (score >= 65) return '#d97706'; // amber
  if (score >= 50) return '#ea580c'; // orange
  return '#dc2626'; // red
}

export function tierToColor(tier: 'hot' | 'warm' | 'nurture'): string {
  switch (tier) {
    case 'hot': return '#dc2626';
    case 'warm': return '#d97706';
    case 'nurture': return '#6b7280';
  }
}

export function tierToBgColor(tier: 'hot' | 'warm' | 'nurture'): string {
  switch (tier) {
    case 'hot': return '#fef2f2';
    case 'warm': return '#fffbeb';
    case 'nurture': return '#f9fafb';
  }
}

export function getCountryByCode(code: string) {
  const { COUNTRIES } = require('@/types');
  return COUNTRIES.find((c: any) => c.code === code);
}

import type { CrmStage } from '@/types';

export const CRM_STAGE_LABELS: Record<CrmStage, string> = {
  new: 'New',
  assessment_completed: 'Assessment Completed',
  qualified: 'Qualified',
  contacted: 'Contacted',
  meeting_booked: 'Meeting Booked',
  meeting_completed: 'Meeting Completed',
  follow_up: 'Follow-Up',
  client: 'Client',
  not_qualified: 'Not Qualified',
  lost: 'Lost',
};

export const CRM_STAGE_ORDER: CrmStage[] = [
  'new',
  'assessment_completed',
  'qualified',
  'contacted',
  'meeting_booked',
  'meeting_completed',
  'follow_up',
  'client',
  'not_qualified',
  'lost',
];

export function parseCountryCode(path: string): string | null {
  const codes = ['sg', 'uae', 'id', 'my', 'za', 'uk'];
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && codes.includes(segments[0])) {
    return segments[0];
  }
  return null;
}

export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
