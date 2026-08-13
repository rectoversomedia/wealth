'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  TrendingUp,
  Calendar,
  Trophy,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Sun,
  Cloud,
  Clock,
  ChevronRight,
  Target,
  Globe,
  Star,
  Zap,
} from 'lucide-react';
import type { Lead } from '@/types';
import { cn, formatRelativeTime, tierToColor, tierToBgColor, scoreToColor, CRM_STAGE_LABELS } from '@/lib/utils';
import { getAllLeads, getLeadsNeedingFollowUp, getFunnelMetrics } from '@/lib/services/leads-store';
import { COUNTRIES } from '@/types';

const COUNTRY_FLAGS: Record<string, string> = {
  sg: '🇸🇬', uae: '🇦🇪', id: '🇮🇩', my: '🇲🇾', za: '🇿🇦', uk: '🇬🇧', global: '🌍',
};

function TierBadge({ tier }: { tier: string }) {
  const icons = { hot: <Flame className="w-3 h-3" />, warm: <Sun className="w-3 h-3" />, nurture: <Cloud className="w-3 h-3" /> };
  const labels = { hot: 'Hot', warm: 'Warm', nurture: 'Nurture' };
  const tierKey = tier as 'hot' | 'warm' | 'nurture';
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold"
      style={{ color: tierToColor(tierKey), backgroundColor: tierToBgColor(tierKey) }}>
      {icons[tierKey]} {labels[tierKey]}
    </span>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const country = COUNTRIES.find(c => c.code === lead.country);
  return (
    <Link
      href={`/dashboard/leads/${lead.id}`}
      className="group block bg-white border border-[var(--border)] rounded-xl p-5 hover:border-[var(--slate-300)] hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-xs font-bold flex-shrink-0">
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-[var(--slate-800)] group-hover:text-[var(--gold-600)] transition-colors">
              {lead.firstName} {lead.lastName}
            </p>
            <p className="text-xs text-[var(--muted)]">{lead.occupation} {lead.country && COUNTRY_FLAGS[lead.country] ? `· ${COUNTRY_FLAGS[lead.country]} ${country?.name}` : ''}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {lead.opportunityScore && (
            <>
              <TierBadge tier={lead.opportunityScore.tier} />
              <span className="text-xs font-bold" style={{ color: tierToColor(lead.opportunityScore.tier) }}>
                {lead.opportunityScore.score}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {lead.primaryGoal && (
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-[var(--muted)] flex-shrink-0" />
            <span className="text-xs text-[var(--slate-500)] truncate">{lead.primaryGoal}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--muted)]">{CRM_STAGE_LABELS[lead.crmStage]}</span>
          {lead.wealthScore && (
            <span className="text-xs font-bold" style={{ color: scoreToColor(lead.wealthScore.overallScore) }}>
              Wealth: {lead.wealthScore.overallScore}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-subtle)]">
        <span className="text-xs text-[var(--muted)]">{formatRelativeTime(lead.updatedAt)}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:text-[var(--gold-500)] transition-colors" />
      </div>
    </Link>
  );
}

function MetricCard({ label, value, subtext, trend, icon: Icon, color }: {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` || 'var(--slate-100)' }}>
          <Icon className="w-4.5 h-4.5" style={{ color: color || 'var(--slate-600)' }} />
        </div>
        {trend && (
          <span className={cn('text-xs font-bold flex items-center gap-0.5', trend.startsWith('+') ? 'text-[var(--success)]' : 'text-[var(--danger)]')}>
            {trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-[var(--slate-900)] mb-0.5">{value}</p>
      <p className="text-sm text-[var(--muted)]">{label}</p>
      {subtext && <p className="text-xs text-[var(--muted)] mt-1">{subtext}</p>}
    </div>
  );
}

function FunnelStep({ label, value, pct, color }: { label: string; value: number; pct?: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-[var(--slate-600)]">{label}</span>
          <span className="text-xs font-bold text-[var(--slate-700)]">{value.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-[var(--slate-100)] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct || 0}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const router = useRouter();
  const [metrics, setMetrics] = useState(getFunnelMetrics());
  const [priorities, setPriorities] = useState<Lead[]>([]);
  const [greeting, setGreeting] = useState('');
  const [advisorName, setAdvisorName] = useState('Advisor');
  const [nurtureStats, setNurtureStats] = useState({ active: 0, hot: 0, warm: 0, nurture: 0, dueToday: 0 });

  useEffect(() => {
    // Auth guard
    fetch('/api/auth/session')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (data.session?.name) setAdvisorName(data.session.name.split(' ')[0]); })
      .catch(() => router.push('/login'));

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    setPriorities(getLeadsNeedingFollowUp());

    // Fetch nurture stats
    fetch('/api/nurture')
      .then(r => r.ok ? r.json() : { sequences: [] })
      .then(data => {
        const seqs = data.sequences ?? [];
        const active = seqs.filter((s: any) => s.status === 'active').length;
        const hot = seqs.filter((s: any) => s.tier === 'hot' && s.status === 'active').length;
        const warm = seqs.filter((s: any) => s.tier === 'warm' && s.status === 'active').length;
        const nurture = seqs.filter((s: any) => s.tier === 'nurture' && s.status === 'active').length;
        const now = Date.now();
        const dueToday = seqs.filter((s: any) => s.status === 'active' && s.nextStepAt && new Date(s.nextStepAt).getTime() <= now + 86400000).length;
        setNurtureStats({ active, hot, warm, nurture, dueToday });
      })
      .catch(() => {/* silent */});
  }, [router]);

  const funnelSteps = [
    { label: 'Visitors', value: metrics.visitors, pct: 100, color: 'var(--slate-400)' },
    { label: 'Assessment Started', value: metrics.assessmentStarts, pct: Math.round((metrics.assessmentStarts / metrics.visitors) * 100), color: 'var(--slate-500)' },
    { label: 'Assessment Completed', value: metrics.assessmentCompletions, pct: Math.round((metrics.assessmentCompletions / metrics.visitors) * 100), color: 'var(--gold-500)' },
    { label: 'Qualified Leads', value: metrics.qualifiedLeads, pct: Math.round((metrics.qualifiedLeads / metrics.visitors) * 100), color: 'var(--warning)' },
    { label: 'Meetings Booked', value: metrics.meetingsBooked, pct: Math.round((metrics.meetingsBooked / metrics.visitors) * 100), color: 'var(--gold-600)' },
    { label: 'Clients Won', value: metrics.clientsWon, pct: Math.round((metrics.clientsWon / metrics.visitors) * 100), color: 'var(--success)' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--muted)] mb-1">{greeting},</p>
          <h1 className="text-3xl font-extrabold text-[var(--slate-900)]">{advisorName}&apos;s Dashboard</h1>
          <p className="text-[var(--slate-500)] mt-1">Here&apos;s your pipeline overview.</p>
        </div>
        <Link href="/assessment" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-[var(--slate-900)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--slate-800)] transition-all">
          <Star className="w-4 h-4" />
          View Public Page
        </Link>
      </div>

      {/* AI Daily Brief */}
      <div className="bg-gradient-to-r from-[var(--slate-900)] to-[var(--slate-800)] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold-500)] opacity-5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[var(--gold-500)] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-400)]">Today&apos;s AI Brief</span>
          </div>
          <h2 className="text-lg font-bold mb-3">
            {priorities.length > 0
              ? `You have ${priorities.length} leads that need attention today.`
              : 'Your pipeline is up to date.'}
          </h2>
          <div className="space-y-2 text-sm text-[var(--slate-300)]">
            {priorities.slice(0, 2).map(lead => (
              <p key={lead.id}>
                <span className="font-semibold text-white">{lead.firstName} {lead.lastName}</span>
                {' '}— {lead.primaryGoal || 'General enquiry'}. Wealth Score: {lead.wealthScore?.overallScore || '—'}.
                {lead.opportunityScore && (
                  <span style={{ color: tierToColor(lead.opportunityScore.tier) }}>
                    {' '}Opportunity Score: {lead.opportunityScore.score} ({lead.opportunityScore.tier}).
                  </span>
                )}
              </p>
            ))}
            {priorities[0]?.meetingDate && (
              <p>
                <span className="font-semibold text-white">{priorities[0].firstName}</span>
                {' '}has a meeting scheduled{' '}
                {new Date(priorities[0].meetingDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}.
              </p>
            )}
          </div>
          <Link href="/dashboard/leads" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[var(--gold-400)] hover:text-[var(--gold-300)] transition-colors">
            View All Priorities <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="New Leads"
          value={metrics.assessmentCompletions}
          trend="+12%"
          icon={Users}
          color="var(--slate-600)"
        />
        <MetricCard
          label="Qualified"
          value={metrics.qualifiedLeads}
          trend="+8%"
          icon={Target}
          color="var(--warning)"
        />
        <MetricCard
          label="Meetings Booked"
          value={metrics.meetingsBooked}
          trend="+3"
          icon={Calendar}
          color="var(--gold-600)"
        />
        <MetricCard
          label="Clients Won"
          value={metrics.clientsWon}
          trend="+2"
          icon={Trophy}
          color="var(--success)"
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Funnel */}
        <div className="lg:col-span-2 bg-white border border-[var(--border)] rounded-2xl p-6">
          <h3 className="font-bold text-[var(--slate-800)] mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--gold-500)]" />
            Conversion Funnel
          </h3>
          <div className="space-y-5">
            {funnelSteps.map(step => (
              <FunnelStep key={step.label} {...step} />
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--muted)]">Overall conversion</span>
              <span className="font-bold text-[var(--success)]">
                {metrics.visitors > 0 ? Math.round((metrics.clientsWon / metrics.visitors) * 100) : 0}%
              </span>
            </div>
            <div className="h-2 bg-[var(--slate-100)] rounded-full overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-[var(--success)]"
                style={{ width: `${metrics.visitors > 0 ? Math.round((metrics.clientsWon / metrics.visitors) * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Today's Priorities */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--slate-800)] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--gold-500)]" />
              Today&apos;s Priorities
            </h3>
            <Link href="/dashboard/leads" className="text-xs font-semibold text-[var(--gold-600)] hover:text-[var(--gold-700)] flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {priorities.length === 0 ? (
              <div className="text-center py-12 bg-white border border-[var(--border)] rounded-xl">
                <Users className="w-8 h-8 text-[var(--slate-300)] mx-auto mb-3" />
                <p className="text-sm text-[var(--muted)]">No leads need attention right now.</p>
              </div>
            ) : (
              priorities.map(lead => <LeadCard key={lead.id} lead={lead} />)
            )}
          </div>
        </div>
      </div>

      {/* Country Breakdown */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <h3 className="font-bold text-[var(--slate-800)] mb-6 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--gold-500)]" />
          Leads by Country
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {COUNTRIES.filter(c => c.available).map(country => {
            const countryLeads = getAllLeads().filter(l => l.country === country.code);
            const hotCount = countryLeads.filter(l => l.opportunityScore?.tier === 'hot').length;
            return (
              <div key={country.code} className="text-center p-4 bg-[var(--slate-50)] rounded-xl border border-[var(--border)]">
                <div className="text-2xl mb-1">{country.flag}</div>
                <p className="text-xs font-semibold text-[var(--slate-700)]">{country.name}</p>
                <p className="text-lg font-extrabold text-[var(--slate-900)] mt-1">{countryLeads.length}</p>
                <p className="text-xs text-[var(--muted)]">leads</p>
                {hotCount > 0 && (
                  <span className="inline-block mt-1 text-xs font-bold text-[var(--hot)]">
                    {hotCount} hot
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Nurture Sequences Overview */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[var(--slate-800)] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--gold-500)]" />
            Active Nurture Sequences
          </h3>
          <Link href="/dashboard/leads" className="text-xs font-semibold text-[var(--gold-600)] hover:text-[var(--gold-700)] flex items-center gap-1">
            View leads <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {([
            { label: 'Active', value: nurtureStats.active, icon: Zap, color: 'var(--gold-500)', bg: 'var(--gold-50)' },
            { label: 'Due Today', value: nurtureStats.dueToday, icon: Clock, color: 'var(--warning)', bg: 'var(--warning-bg)' },
            { label: 'Hot Tier', value: nurtureStats.hot, icon: Flame, color: 'var(--danger)', bg: 'var(--danger-bg)' },
            { label: 'Warm Tier', value: nurtureStats.warm, icon: Sun, color: 'var(--warning)', bg: 'var(--warning-bg)' },
          ] as const).map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="text-center p-4 rounded-xl border border-[var(--border)]">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-2xl font-extrabold text-[var(--slate-900)]">{value}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 p-4 bg-[var(--slate-50)] rounded-xl">
          <p className="text-xs text-[var(--muted)] flex-1">
            {nurtureStats.active > 0
              ? `${nurtureStats.hot} hot · ${nurtureStats.warm} warm · ${nurtureStats.nurture} nurture sequences active`
              : 'No active sequences. Capture a lead email to start.'}
          </p>
          <button
            onClick={async () => {
              await fetch('/api/nurture', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'process' }) });
              window.location.reload();
            }}
            className="px-4 py-2 text-xs font-semibold bg-[var(--slate-900)] text-white rounded-lg hover:bg-[var(--slate-800)] transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <Zap className="w-3.5 h-3.5" /> Run nurture engine
          </button>
        </div>
      </div>
    </div>
  );
}
