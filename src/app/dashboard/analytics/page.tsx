'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';
import { BarChart3, TrendingUp, Users, Target, Calendar, Trophy, Globe, ArrowUpRight } from 'lucide-react';
import { getFunnelMetrics, getSourceMetrics, getAllLeads } from '@/lib/services/leads-store';
import { COUNTRIES } from '@/types';
import { cn } from '@/lib/utils';

const CHART_COLORS = ['#b8892a', '#d4a54a', '#e4c080', '#f0dab3', '#6b7280', '#9ca3af', '#374151', '#1f2937'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const metrics = getFunnelMetrics();
  const sourceData = getSourceMetrics();
  const leads = getAllLeads();

  const completionRate = metrics.assessmentStarts > 0
    ? Math.round((metrics.assessmentCompletions / metrics.assessmentStarts) * 100) : 0;
  const qualifyRate = metrics.assessmentCompletions > 0
    ? Math.round((metrics.qualifiedLeads / metrics.assessmentCompletions) * 100) : 0;
  const meetingRate = metrics.qualifiedLeads > 0
    ? Math.round((metrics.meetingsBooked / metrics.qualifiedLeads) * 100) : 0;
  const leadToClientRate = metrics.qualifiedLeads > 0
    ? Math.round((metrics.clientsWon / metrics.qualifiedLeads) * 100) : 0;

  // Score distribution
  const scoreRanges = [
    { label: '90–100', count: leads.filter(l => l.wealthScore && l.wealthScore.overallScore >= 90).length, color: '#16a34a' },
    { label: '80–89', count: leads.filter(l => l.wealthScore && l.wealthScore.overallScore >= 80 && l.wealthScore.overallScore < 90).length, color: '#22c55e' },
    { label: '70–79', count: leads.filter(l => l.wealthScore && l.wealthScore.overallScore >= 70 && l.wealthScore.overallScore < 80).length, color: '#b8892a' },
    { label: '60–69', count: leads.filter(l => l.wealthScore && l.wealthScore.overallScore >= 60 && l.wealthScore.overallScore < 70).length, color: '#d97706' },
    { label: '50–59', count: leads.filter(l => l.wealthScore && l.wealthScore.overallScore >= 50 && l.wealthScore.overallScore < 60).length, color: '#ea580c' },
    { label: '<50', count: leads.filter(l => l.wealthScore && l.wealthScore.overallScore < 50).length, color: '#dc2626' },
  ];

  // Country data
  const countryData = COUNTRIES.filter(c => c.available).map(c => {
    const countryLeads = leads.filter(l => l.country === c.code);
    return {
      name: c.name,
      flag: c.flag,
      leads: countryLeads.length,
      qualified: countryLeads.filter(l => ['qualified', 'contacted', 'meeting_booked', 'meeting_completed', 'follow_up', 'client'].includes(l.crmStage)).length,
      meetings: countryLeads.filter(l => ['meeting_booked', 'meeting_completed', 'follow_up', 'client'].includes(l.crmStage)).length,
    };
  });

  // Real time-series: aggregate leads by their createdAt date
  const timeSeriesData = (() => {
    // Build date buckets from actual leads
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const buckets: Record<string, { visitors: number; leads: number; qualified: number }> = {};

    // Initialize all date buckets
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      buckets[key] = { visitors: 0, leads: 0, qualified: 0 };
    }

    // Seed with demo visitor data (realistic baseline)
    const visitorBase = Math.round(120 * (days / 30)); // scales with period
    Object.keys(buckets).forEach((key, i) => {
      buckets[key].visitors = Math.round(visitorBase * 0.7 + (visitorBase * 0.3 * (i + 1)) / days);
    });

    // Aggregate real leads into buckets
    leads.forEach(lead => {
      const key = new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      if (buckets[key]) {
        buckets[key].leads += 1;
        if (['qualified', 'contacted', 'meeting_booked', 'meeting_completed', 'follow_up', 'client'].includes(lead.crmStage)) {
          buckets[key].qualified += 1;
        }
      }
    });

    return Object.entries(buckets).map(([date, vals]) => ({ date, ...vals }));
  })();

  return (
    <div className="max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--slate-900)]">Analytics</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">Campaign performance and funnel analytics</p>
        </div>
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-[var(--border)] rounded-lg"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Visitors', value: metrics.visitors.toLocaleString(), icon: Users, color: 'var(--slate-600)', sub: '+12% vs last period' },
          { label: 'Assessment Completions', value: metrics.assessmentCompletions, icon: Target, color: 'var(--gold-500)', sub: `${completionRate}% from visitors` },
          { label: 'Qualified Leads', value: metrics.qualifiedLeads, icon: BarChart3, color: 'var(--warning)', sub: `${qualifyRate}% from completions` },
          { label: 'Clients Won', value: metrics.clientsWon, icon: Trophy, color: 'var(--success)', sub: `${leadToClientRate}% from qualified` },
        ].map(m => (
          <div key={m.label} className="bg-white border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}15` }}>
                <m.icon className="w-4.5 h-4.5" style={{ color: m.color }} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--success)]" />
            </div>
            <p className="text-2xl font-extrabold text-[var(--slate-900)]">{m.value}</p>
            <p className="text-sm text-[var(--muted)] mt-0.5">{m.label}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <h2 className="font-bold text-[var(--slate-800)] mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--gold-500)]" />
          Conversion Funnel
        </h2>
        <div className="space-y-4 max-w-2xl">
          {[
            { label: 'Visitors', value: metrics.visitors, color: 'var(--slate-400)', pct: 100 },
            { label: 'Assessment Started', value: metrics.assessmentStarts, color: 'var(--slate-500)', pct: Math.round((metrics.assessmentStarts / metrics.visitors) * 100) },
            { label: 'Assessment Completed', value: metrics.assessmentCompletions, color: 'var(--gold-500)', pct: Math.round((metrics.assessmentCompletions / metrics.visitors) * 100) },
            { label: 'Qualified Leads', value: metrics.qualifiedLeads, color: 'var(--warning)', pct: Math.round((metrics.qualifiedLeads / metrics.visitors) * 100) },
            { label: 'Meetings Booked', value: metrics.meetingsBooked, color: 'var(--gold-600)', pct: Math.round((metrics.meetingsBooked / metrics.visitors) * 100) },
            { label: 'Clients Won', value: metrics.clientsWon, color: 'var(--success)', pct: Math.round((metrics.clientsWon / metrics.visitors) * 100) },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-4">
              <span className="text-sm text-[var(--muted)] w-40 text-right flex-shrink-0">{step.label}</span>
              <div className="flex-1">
                <div className="h-8 bg-[var(--slate-100)] rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg flex items-center px-3 transition-all duration-1000"
                    style={{ width: `${step.pct}%`, backgroundColor: step.color }}
                  >
                    <span className="text-xs font-bold text-white">{step.value.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[var(--slate-500)] w-10 text-right">{step.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Traffic over time */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <h2 className="font-bold text-[var(--slate-800)] mb-6">Traffic & Leads Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-200)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
              <Line type="monotone" dataKey="visitors" stroke="var(--slate-400)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="leads" stroke="var(--gold-500)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="qualified" stroke="var(--warning)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4 justify-center">
            {[{ label: 'Visitors', color: 'var(--slate-400)' }, { label: 'Leads', color: 'var(--gold-500)' }, { label: 'Qualified', color: 'var(--warning)' }].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-3 h-0.5 rounded" style={{ backgroundColor: l.color }} />
                <span className="text-xs text-[var(--muted)]">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wealth Score Distribution */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <h2 className="font-bold text-[var(--slate-800)] mb-6">Wealth Score Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreRanges} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-200)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--muted)' }} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: 'var(--muted)' }} width={40} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {scoreRanges.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Source Performance Table */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <h2 className="font-bold text-[var(--slate-800)] mb-6 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--gold-500)]" />
          Source Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Source', 'Visitors', 'Leads', 'Qualified', 'Meetings', 'Clients', 'Conv. Rate'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)] pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sourceData.map(row => (
                <tr key={row.source} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--slate-50)]">
                  <td className="py-3 pr-4 text-sm font-semibold text-[var(--slate-700)]">{row.source}</td>
                  <td className="py-3 pr-4 text-sm text-[var(--slate-600)]">{row.visitors}</td>
                  <td className="py-3 pr-4 text-sm text-[var(--slate-600)]">{row.leads}</td>
                  <td className="py-3 pr-4 text-sm text-[var(--slate-600)]">{row.qualified}</td>
                  <td className="py-3 pr-4 text-sm text-[var(--slate-600)]">{row.meetings}</td>
                  <td className="py-3 pr-4 text-sm text-[var(--slate-600)]">{row.clients}</td>
                  <td className="py-3 text-sm">
                    <span className={cn(
                      'font-semibold',
                      row.conversionRate >= 30 ? 'text-[var(--success)]' :
                      row.conversionRate >= 15 ? 'text-[var(--warning)]' : 'text-[var(--slate-400)]'
                    )}>
                      {row.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Country Performance */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <h2 className="font-bold text-[var(--slate-800)] mb-6 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--gold-500)]" />
          Country Performance
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {countryData.map(c => (
            <div key={c.name} className="p-4 bg-[var(--slate-50)] border border-[var(--border)] rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{c.flag}</span>
                <span className="font-bold text-[var(--slate-800)]">{c.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Leads', value: c.leads },
                  { label: 'Qualified', value: c.qualified },
                  { label: 'Meetings', value: c.meetings },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <p className="text-lg font-extrabold text-[var(--slate-900)]">{m.value}</p>
                    <p className="text-xs text-[var(--muted)]">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
