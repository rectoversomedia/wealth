/**
 * Advisor Auth Store
 * In-memory credential store with bcrypt password hashing.
 * In production, swap for a database (Postgres/MongoDB).
 */

import bcrypt from 'bcryptjs';

export interface AdvisorProfile {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  company: string;
  bio: string;
  bookingUrl: string;
  disclaimer: string;
  privacyUrl: string;
  termsUrl: string;
  countries: string[];
  createdAt: string;
}

export interface Advisor extends AdvisorProfile {
  passwordHash: string;
}

// Pre-populated demo advisor (password: "demo123")
// Hash generated: bcrypt.hashSync('demo123', 10)
const DEMO_ADVISOR: Advisor = {
  name: 'Sarah Mitchell',
  email: 'demo@wealthleadengine.com',
  // Password "demo123"
  passwordHash: '$2b$10$nyg9MPaFxyTYuieoxPvDwefd91SF/nG/kBXmS3XeAghN1QEvmS2NK',
  phone: '+65 9123 4567',
  whatsapp: '+65 9123 4567',
  company: 'Mitchell Wealth Advisory',
  bio: 'Senior wealth advisor specialising in cross-border financial planning for expat professionals and business owners across Southeast Asia and the Middle East.',
  bookingUrl: 'https://cal.com/sarah-mitchell',
  disclaimer: 'This assessment is provided for general educational and informational purposes only. It does not constitute financial, investment, legal, tax, or other professional advice.',
  privacyUrl: '',
  termsUrl: '',
  countries: ['sg', 'ae', 'my', 'id', 'za', 'gb'],
  createdAt: new Date().toISOString(),
};

// In-memory store
const _advisors = new Map<string, Advisor>([[DEMO_ADVISOR.email, DEMO_ADVISOR]]);

export async function validateCredentials(
  email: string,
  password: string
): Promise<Omit<Advisor, 'passwordHash'> | null> {
  const advisor = _advisors.get(email.toLowerCase().trim());
  if (!advisor) return null;

  const valid = await bcrypt.compare(password, advisor.passwordHash);
  if (!valid) return null;

  const { passwordHash: _, ...safe } = advisor;
  return safe;
}

export function getAdvisorByEmail(
  email: string
): Omit<Advisor, 'passwordHash'> | null {
  const advisor = _advisors.get(email.toLowerCase().trim());
  if (!advisor) return null;
  const { passwordHash: _, ...safe } = advisor;
  return safe;
}

export function updateAdvisorProfile(
  email: string,
  updates: Partial<AdvisorProfile>
): Omit<Advisor, 'passwordHash'> | null {
  const advisor = _advisors.get(email.toLowerCase().trim());
  if (!advisor) return null;

  const updated = { ...advisor, ...updates };
  _advisors.set(email.toLowerCase().trim(), updated);
  const { passwordHash: _, ...safe } = updated;
  return safe;
}

export async function updatePassword(
  email: string,
  newPassword: string
): Promise<boolean> {
  const advisor = _advisors.get(email.toLowerCase().trim());
  if (!advisor) return false;

  const hash = await bcrypt.hash(newPassword, 10);
  _advisors.set(email.toLowerCase().trim(), { ...advisor, passwordHash: hash });
  return true;
}

export function getAdvisorBookingUrl(email: string): string {
  const advisor = _advisors.get(email.toLowerCase().trim());
  return advisor?.bookingUrl ?? '';
}
