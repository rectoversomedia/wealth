/**
 * Campaign Store
 * In-memory store for marketing campaigns.
 * In production: swap for Postgres/MongoDB.
 */

import { generateId } from '@/lib/utils';

export interface Campaign {
  id: string;
  name: string;
  country: string;
  audience: string;
  coreConcern: string;
  landingUrl: string;
  channels: string[];
  status: 'active' | 'paused' | 'draft';
  // Metrics
  leads: number;
  qualified: number;
  meetings: number;
  clients: number;
  spend: number;
  createdAt: string;
  updatedAt: string;
}

const _campaigns = new Map<string, Campaign>();

// Seed with demo data
function seed() {
  const demos: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'SG Expats — Retirement Readiness Q3',
      country: 'sg',
      audience: 'Expat professionals, 35–55',
      coreConcern: 'Retirement readiness for expats in Singapore',
      landingUrl: '/sg',
      channels: ['Facebook', 'LinkedIn'],
      status: 'active',
      leads: 147, qualified: 38, meetings: 12, clients: 4, spend: 2800,
    },
    {
      name: 'UAE High-Net-Worth Campaign',
      country: 'ae',
      audience: 'High-net-worth individuals, 40–60',
      coreConcern: 'Cross-border estate and investment planning',
      landingUrl: '/ae',
      channels: ['Instagram', 'WhatsApp'],
      status: 'active',
      leads: 89, qualified: 24, meetings: 7, clients: 2, spend: 4200,
    },
    {
      name: 'MY Young Professionals — Wealth 101',
      country: 'my',
      audience: 'Young professionals, 25–35',
      coreConcern: 'First-time investing and emergency fund building',
      landingUrl: '/my',
      channels: ['TikTok', 'Instagram'],
      status: 'paused',
      leads: 63, qualified: 11, meetings: 3, clients: 1, spend: 950,
    },
    {
      name: 'ZA Female Entrepreneurs',
      country: 'za',
      audience: 'Female business owners, 30–50',
      coreConcern: 'Business succession and personal wealth separation',
      landingUrl: '/za',
      channels: ['Facebook', 'LinkedIn'],
      status: 'draft',
      leads: 0, qualified: 0, meetings: 0, clients: 0, spend: 0,
    },
  ];

  demos.forEach(c => {
    const id = generateId();
    const now = new Date().toISOString();
    _campaigns.set(id, { ...c, id, createdAt: now, updatedAt: now });
  });
}

seed();

export function getAllCampaigns(): Campaign[] {
  return Array.from(_campaigns.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getCampaignById(id: string): Campaign | null {
  return _campaigns.get(id) ?? null;
}

export function createCampaign(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign {
  const id = generateId();
  const now = new Date().toISOString();
  const campaign: Campaign = { ...data, id, createdAt: now, updatedAt: now };
  _campaigns.set(id, campaign);
  return campaign;
}

export function updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
  const existing = _campaigns.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates, id, updatedAt: new Date().toISOString() };
  _campaigns.set(id, updated);
  return updated;
}

export function deleteCampaign(id: string): boolean {
  return _campaigns.delete(id);
}

export function incrementCampaignMetric(id: string, field: 'leads' | 'qualified' | 'meetings' | 'clients'): boolean {
  const c = _campaigns.get(id);
  if (!c) return false;
  _campaigns.set(id, { ...c, [field]: c[field] + 1, updatedAt: new Date().toISOString() });
  return true;
}
