'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ChevronRight,
  Flame,
  Sun,
  Cloud,
  ChevronDown,
  ArrowUpDown,
  Target,
  Globe,
} from 'lucide-react';
import type { Lead, CrmStage } from '@/types';
import { cn, formatRelativeTime, tierToColor, tierToBgColor, scoreToColor, CRM_STAGE_LABELS, CRM_STAGE_ORDER } from '@/lib/utils';
import { getAllLeads } from '@/lib/services/leads-store';
import { COUNTRIES } from '@/types';

const COUNTRY_FLAGS: Record<string, string> = {
  sg: '🇸🇬', uae: '🇦🇪', id: '🇮🇩', my: '🇲🇾', za: '🇿🇦', uk: '🇬🇧',
};

function TierBadge({ tier }: { tier: string }) {
  const tierKey = tier as 'hot' | 'warm' | 'nurture';
  const icons = { hot: Flame, warm: Sun, nurture: Cloud };
  const Icon = icons[tierKey];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold"
      style={{ color: tierToColor(tierKey), backgroundColor: tierToBgColor(tierKey) }}>
      <Icon className="w-3 h-3" />{tierKey.charAt(0).toUpperCase() + tierKey.slice(1)}
    </span>
  );
}

function StageSelect({ lead, onChange }: { lead: Lead; onChange: (stage: CrmStage) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--slate-50)] border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--slate-600)] hover:bg-[var(--slate-100)] transition-all"
      >
        {CRM_STAGE_LABELS[lead.crmStage]}
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-[var(--border)] rounded-lg shadow-lg py-1 min-w-[180px]">
            {CRM_STAGE_ORDER.map(stage => (
              <button
                key={stage}
                onClick={() => { onChange(stage); setOpen(false); }}
                className={cn(
                  'w-full text-left px-3 py-2 text-xs hover:bg-[var(--slate-50)] transition-colors',
                  stage === lead.crmStage ? 'font-semibold text-[var(--gold-600)]' : 'text-[var(--slate-600)]'
                )}
              >
                {CRM_STAGE_LABELS[stage]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<CrmStage | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('score');

  const leads = getAllLeads();

  const filtered = useMemo(() => {
    let result = [...leads];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.occupation?.toLowerCase().includes(q) ||
        l.primaryGoal?.toLowerCase().includes(q)
      );
    }

    if (stageFilter !== 'all') result = result.filter(l => l.crmStage === stageFilter);
    if (tierFilter !== 'all') result = result.filter(l => l.opportunityScore?.tier === tierFilter);
    if (countryFilter !== 'all') result = result.filter(l => l.country === countryFilter);

    result.sort((a, b) => {
      if (sortBy === 'score') return (b.opportunityScore?.score || 0) - (a.opportunityScore?.score || 0);
      if (sortBy === 'date') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return a.firstName.localeCompare(b.firstName);
    });

    return result;
  }, [leads, search, stageFilter, tierFilter, countryFilter, sortBy]);

  const hotCount = leads.filter(l => l.opportunityScore?.tier === 'hot').length;
  const warmCount = leads.filter(l => l.opportunityScore?.tier === 'warm').length;
  const nurtureCount = leads.filter(l => l.opportunityScore?.tier === 'nurture').length;

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--slate-900)]">Leads</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{leads.length} total · {hotCount} hot · {warmCount} warm</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs">
            <span className="flex items-center gap-1 px-2 py-1 bg-[var(--danger-bg)] text-[var(--hot)] font-bold rounded-md"><Flame className="w-3 h-3" />{hotCount}</span>
            <span className="flex items-center gap-1 px-2 py-1 bg-[var(--warning-bg)] text-[var(--warm)] font-bold rounded-md"><Sun className="w-3 h-3" />{warmCount}</span>
            <span className="flex items-center gap-1 px-2 py-1 bg-[var(--slate-100)] text-[var(--nurture)] font-bold rounded-md"><Cloud className="w-3 h-3" />{nurtureCount}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border)] rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search by name, email, role, goal…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
            />
          </div>

          {/* Tier filter */}
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
          >
            <option value="all">All Tiers</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="nurture">Nurture</option>
          </select>

          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value as CrmStage | 'all')}
            className="px-3 py-2 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
          >
            <option value="all">All Stages</option>
            {CRM_STAGE_ORDER.map(stage => (
              <option key={stage} value={stage}>{CRM_STAGE_LABELS[stage]}</option>
            ))}
          </select>

          {/* Country filter */}
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
          >
            <option value="all">All Countries</option>
            {COUNTRIES.filter(c => c.available).map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
          >
            <option value="score">Sort: Opp Score</option>
            <option value="date">Sort: Recent</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {filtered.length !== leads.length && (
          <p className="text-xs text-[var(--muted)] mt-3">
            Showing {filtered.length} of {leads.length} leads
          </p>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[var(--slate-50)] border-b border-[var(--border)] text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          <span>Lead</span>
          <span>Financial Context</span>
          <span>Goals</span>
          <span>Scores</span>
          <span>Source</span>
          <span>Last Activity</span>
          <span></span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Target className="w-10 h-10 text-[var(--slate-300)] mx-auto mb-3" />
            <p className="text-[var(--muted)]">No leads match your filters.</p>
          </div>
        ) : (
          filtered.map((lead, i) => {
            const country = COUNTRIES.find(c => c.code === lead.country);
            return (
              <div
                key={lead.id}
                className={cn(
                  'grid lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-start border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--slate-50)] transition-colors',
                  i % 2 === 0 ? '' : ''
                )}
              >
                {/* Lead info */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {lead.firstName[0]}{lead.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/dashboard/leads/${lead.id}`} className="font-semibold text-sm text-[var(--slate-800)] hover:text-[var(--gold-600)] transition-colors truncate block">
                        {lead.firstName} {lead.lastName}
                      </Link>
                      <p className="text-xs text-[var(--muted)] truncate">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {lead.country && COUNTRY_FLAGS[lead.country] && (
                      <span className="text-xs">{COUNTRY_FLAGS[lead.country]} {country?.name}</span>
                    )}
                    {lead.opportunityScore && <TierBadge tier={lead.opportunityScore.tier} />}
                  </div>
                </div>

                {/* Financial context */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[var(--slate-700)]">{lead.occupation || '—'}</p>
                  <p className="text-xs text-[var(--muted)]">{lead.annualIncomeRange || '—'}</p>
                  <p className="text-xs text-[var(--muted)]">{lead.investableAssetsRange || '—'}</p>
                </div>

                {/* Goals */}
                <div className="space-y-1">
                  {lead.primaryGoal && (
                    <p className="text-xs font-medium text-[var(--slate-700)] truncate">{lead.primaryGoal}</p>
                  )}
                  {lead.otherGoals?.slice(0, 2).map(g => (
                    <p key={g} className="text-xs text-[var(--muted)] truncate">{g}</p>
                  ))}
                </div>

                {/* Scores */}
                <div className="space-y-1">
                  {lead.wealthScore && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--muted)]">Wealth</span>
                      <span className="text-xs font-bold" style={{ color: scoreToColor(lead.wealthScore.overallScore) }}>
                        {lead.wealthScore.overallScore}
                      </span>
                    </div>
                  )}
                  {lead.opportunityScore && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--muted)]">Opp</span>
                      <span className="text-xs font-bold" style={{ color: tierToColor(lead.opportunityScore.tier) }}>
                        {lead.opportunityScore.score}
                      </span>
                    </div>
                  )}
                  {lead.wealthScore && (
                    <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 bg-[var(--slate-100)] rounded text-[var(--slate-500)]">
                      <Globe className="w-3 h-3" />
                      {lead.wealthScore.crossBorderComplexity}
                    </span>
                  )}
                </div>

                {/* Source */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[var(--slate-600)] capitalize">{lead.source || 'Direct'}</p>
                  {lead.campaign && <p className="text-xs text-[var(--muted)] truncate">{lead.campaign}</p>}
                  {lead.medium && <p className="text-xs text-[var(--muted)] capitalize">{lead.medium}</p>}
                </div>

                {/* Last activity */}
                <div className="space-y-1">
                  <p className="text-xs text-[var(--muted)]">{formatRelativeTime(lead.updatedAt)}</p>
                  {lead.activities[0] && (
                    <p className="text-xs text-[var(--slate-400)] truncate max-w-[150px]">
                      {lead.activities[0].description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div>
                  <Link
                    href={`/dashboard/leads/${lead.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--slate-900)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--slate-800)] transition-all"
                  >
                    View
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
