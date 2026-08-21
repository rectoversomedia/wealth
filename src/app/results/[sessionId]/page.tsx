
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Lock,
} from 'lucide-react';
import type { WealthScore, OpportunityScore, AiReport } from '@/types';

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ className = 'h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L28 28H4L16 4Z" fill="currentColor" opacity="0.9" />
      <path d="M14 18H22V22H14V18Z" fill="currentColor" />
      <text x="34" y="23" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill="currentColor">WealthLeadEngine</text>
    </svg>
  );
}

// ─── formatDate ────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
type Status = 'needs-attention' | 'review' | 'on-track';
type Urgency = 'high' | 'medium' | 'low';

function statusLabel(s: Status) {
  return { 'needs-attention': 'Needs Attention', 'review': 'Review Recommended', 'on-track': 'On Track' }[s];
}
function urgencyDot(u: Urgency) {
  return { high: 'bg-red-500', medium: 'bg-amber-400', low: 'bg-emerald-400' }[u];
}
function statusStyle(s: Status): string {
  return {
    'needs-attention': 'text-red-600 bg-red-50 border-red-200',
    'review': 'text-amber-600 bg-amber-50 border-amber-200',
    'on-track': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  }[s];
}
function leftBorder(s: Status): string {
  return {
    'needs-attention': 'border-l-red-400',
    'review': 'border-l-amber-400',
    'on-track': 'border-l-emerald-400',
  }[s];
}

// ─── RecommendationCard ───────────────────────────────────────────────────────
interface RecCard {
  icon: string;
  category: string;
  status: Status;
  headline: string;
  insight: string;
  bullets: string[];
  urgency: Urgency;
}

function RecommendationCard({ card, index }: { card: RecCard; index: number }) {
  const delay = Math.min(index * 80, 400);
  return (
    <div
      className={`bg-white border border-slate-200 border-l-4 ${leftBorder(card.status)} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
          {card.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.category}</span>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle(card.status)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${urgencyDot(card.urgency)}`} />
              {statusLabel(card.status)}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1.5">{card.headline}</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-3">{card.insight}</p>
          <ul className="space-y-1.5">
            {card.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── RoadmapCard ─────────────────────────────────────────────────────────────
function RoadmapCard({ priority, index }: { priority: { priority: number; topic: string; explanation: string }; index: number }) {
  const colors = ['bg-amber-400', 'bg-blue-400', 'bg-purple-400'];
  return (
    <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${colors[index]} text-white font-bold text-sm flex items-center justify-center flex-shrink-0`}>
          {priority.priority}
        </div>
        {index < 2 && <div className="w-px flex-1 bg-slate-200 my-2 min-h-[40px]" />}
      </div>
      <div className="flex-1 pb-6">
        <h4 className="font-bold text-slate-800 mb-1">{priority.topic}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{priority.explanation}</p>
      </div>
    </div>
  );
}

// ─── EmailCaptureForm ─────────────────────────────────────────────────────────
function EmailCaptureForm({ sessionId, opportunityScore, topDimension, weakDimension, onSubmitted }: {
  sessionId: string; opportunityScore: number; topDimension: string; weakDimension: string; onSubmitted: () => void;
}) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', consent: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const setField = function(name: string, value: string | boolean) {
    setForm(function(prev) { return { ...prev, [name]: value } as typeof prev; });
  };

  const handleSubmit = async function(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email) { setError('Email is required'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sessionId, opportunityScore, topDimension, weakDimension }),
      });
      if (res.ok) { setSent(true); onSubmitted(); }
      else { setError('Something went wrong. Please try again.'); }
    } catch { setError('Connection error.'); }
    finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
        <p className="text-sm text-emerald-700 font-semibold">Report sent! Check your inbox.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="First name"
          value={form.firstName}
          onChange={function(ev) { setField('firstName', ev.currentTarget.value); }}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
        />
        <input
          required
          placeholder="Last name"
          value={form.lastName}
          onChange={function(ev) { setField('lastName', ev.currentTarget.value); }}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
        />
      </div>
      <input
        required
        type="email"
        placeholder="Email address"
        value={form.email}
        onChange={function(ev) { setField('email', ev.currentTarget.value); }}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
      />
      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={function() { setField('consent', !form.consent); }}
          className="mt-0.5"
        />
        <span className="text-xs text-slate-500">I agree to receive communications about financial planning. No spam - unsubscribe anytime.</span>
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button type="submit" disabled={loading || !form.consent} className="w-full py-2.5 bg-amber-400 text-slate-900 font-bold text-sm rounded-lg hover:bg-amber-300 disabled:opacity-50 transition-all">
        {loading ? 'Sending...' : 'Send My Report'}
      </button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
interface ResultsData {
  sessionId: string;
  wealthScore: WealthScore;
  opportunityScore: OpportunityScore;
  aiReport: AiReport;
  firstName?: string;
}

export default function ResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const router = useRouter();
  const [data, setData] = useState<ResultsData | null>(null);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(function() {
    const stored = sessionStorage.getItem('assessment_result');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.error) { router.replace('/assessment'); return; }
        setData(parsed);
      } catch { router.replace('/assessment'); }
    } else { router.replace('/assessment'); }
  }, [router]);

  useEffect(function() {
    if (data) {
      sessionStorage.setItem('assessment_result', JSON.stringify(data));
    }
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading your report...</p>
        </div>
      </div>
    );
  }

  const { wealthScore, opportunityScore, aiReport } = data;
  const rawName = data.firstName || aiReport?.executiveSummary?.split(' ')[1]?.replace(/,/g, '') || 'there';
  const allDims = wealthScore.dimensions;
  const topDim = [...allDims].sort(function(a, b) { return b.percentage - a.percentage; })[0];
  const weakDim = [...allDims].sort(function(a, b) { return a.percentage - b.percentage; })[0];

  const recs: RecCard[] = [];

  // 1. Retirement
  var retDim = allDims.find(function(d) { return d.label === 'Retirement Readiness'; });
  if (retDim) {
    var retStatus: Status = retDim.percentage < 60 ? 'needs-attention' : retDim.percentage < 75 ? 'review' : 'on-track';
    recs.push({
      icon: String.fromCodePoint(0x1F3D6),
      category: 'Retirement',
      status: retStatus,
      headline: retDim.percentage < 60 ? 'Retirement Fund Requires Immediate Review' :
                retDim.percentage < 75 ? 'Retirement Planning Has Room to Optimize' :
                'Retirement Fund is Progressing Well',
      insight: retDim.description || 'Your current retirement planning trajectory determines when and how comfortably you can stop working.',
      bullets: retDim.percentage < 60 ? [
        'Calculate your target retirement corpus - most professionals need 20x their annual expenses',
        'Maximize CPF Special Account contributions and consider top-ups before end of year',
        'Review your drawdown strategy: CPF Life vs. private pension drawdown',
        'Consider consulting a retirement planning specialist within the next 3 months',
      ] : retDim.percentage < 75 ? [
        'Run a CPF projection to understand your expected CPF Life payouts at 65/70/75',
        'Identify any gap between your target retirement lifestyle and projected income',
        'Review your investment-linked policies for retirement adequacy',
      ] : [
        'Your retirement foundation is strong - focus on optimization',
        'Consider increasing voluntary CPF top-ups above the CPF ceiling',
        'Review your investment allocation as you approach retirement age',
      ],
      urgency: retDim.percentage < 60 ? 'high' : retDim.percentage < 75 ? 'medium' : 'low',
    });
  }

  // 2. Asset Allocation
  var assetDim = allDims.find(function(d) { return d.label === 'Wealth Structure'; });
  if (assetDim) {
    recs.push({
      icon: String.fromCodePoint(0x1F4CA),
      category: 'Asset Allocation',
      status: assetDim.percentage < 65 ? 'needs-attention' : assetDim.percentage < 78 ? 'review' : 'on-track',
      headline: assetDim.percentage < 65 ? 'Portfolio Diversification Needs Attention' : 'Asset Allocation Review Recommended',
      insight: assetDim.description || 'How your wealth is distributed across asset classes determines both growth potential and downside protection.',
      bullets: [
        'Map your current assets: liquid investments, property equity, CPF, insurance surrender values',
        'Assess whether your risk profile matches your current portfolio allocation',
        'Consider rebalancing if any single asset class exceeds 40% of total portfolio',
        'Review currency diversification if you hold assets in more than one jurisdiction',
      ],
      urgency: assetDim.percentage < 65 ? 'high' : 'medium',
    });
  }

  // 3. Family Protection
  var protDim = allDims.find(function(d) { return d.label === 'Family Protection'; });
  if (protDim) {
    recs.push({
      icon: String.fromCodePoint(0x1F6E1),
      category: 'Family Protection',
      status: protDim.percentage < 65 ? 'needs-attention' : protDim.percentage < 78 ? 'review' : 'on-track',
      headline: protDim.percentage < 65 ? 'Inadequate Protection Coverage Detected' : 'Protection Coverage Review Recommended',
      insight: protDim.description || "Without adequate protection, a single health event or loss of income could unravel your family's financial security.",
      bullets: [
        "Calculate your family's financial dependency ratio - how much would your family need if you were unable to earn?",
        'Review life insurance coverage: income replacement for at minimum 5-10x annual income',
        'Check if critical illness and disability coverage is adequate for your lifestyle',
        'Ensure beneficiary designations on policies and CPF are up to date',
      ],
      urgency: protDim.percentage < 65 ? 'high' : 'medium',
    });
  }

  // 4. Estate Planning
  var estDim = allDims.find(function(d) { return d.label === 'Estate Planning'; });
  if (estDim) {
    recs.push({
      icon: String.fromCodePoint(0x1F4CB),
      category: 'Estate Planning',
      status: estDim.percentage < 65 ? 'needs-attention' : estDim.percentage < 78 ? 'review' : 'on-track',
      headline: estDim.percentage < 65 ? 'Estate Planning Has Significant Gaps' : 'Estate Planning Review Recommended',
      insight: estDim.description || 'Estate planning ensures your wealth reaches who you intend, when you intend, and without unnecessary complications.',
      bullets: [
        'Confirm you have a valid, up-to-date will that reflects your current assets and family situation',
        'Review nominees and beneficiaries across CPF, insurance policies, and investment accounts',
        'Consider a lasting power of attorney (LPA) - critical if you become incapacitated',
        'As your wealth grows, review estate planning structures with a qualified estate planning attorney',
      ],
      urgency: estDim.percentage < 65 ? 'high' : 'medium',
    });
  }

  // 5. Education Planning
  var sumText = (aiReport?.executiveSummary || '').toLowerCase();
  var hasDeps = sumText.includes('depend') || sumText.includes('children') || sumText.includes('family');
  if (hasDeps || (opportunityScore.score > 50 && opportunityScore.score < 80)) {
    recs.push({
      icon: String.fromCodePoint(0x1F393),
      category: 'Education Planning',
      status: 'review',
      headline: 'Education Costs Deserve Early Attention',
      insight: 'With rising education costs across Singapore, UAE, and major global cities, starting early can reduce the financial burden significantly.',
      bullets: [
        "Calculate the projected cost of your children's education goals (local + overseas university)",
        'Consider SSCE/education savings plans with tax-efficient compounding',
        'Review whether whole life or endowment policies for education are cost-effective vs. unit trusts',
        'Factor in inflation: education costs typically rise 4-6% per year',
      ],
      urgency: 'medium',
    });
  }

  // 6. Tax Efficiency
  var crossHigh = wealthScore.crossBorderComplexity === 'High' || wealthScore.crossBorderComplexity === 'Very High';
  recs.push({
    icon: String.fromCodePoint(0x1F3DE),
    category: 'Tax Efficiency',
    status: crossHigh ? 'needs-attention' : 'review',
    headline: crossHigh ? 'Cross-Border Tax Complexity Requires Specialist Attention' : 'Tax Efficiency Opportunities May Exist',
    insight: crossHigh
      ? "Your situation spans multiple tax jurisdictions. Without proper structure, you may be paying more than necessary."
      : 'Proactive tax planning can preserve significant wealth over time. Small adjustments now compound meaningfully.',
    bullets: [
      'Review your tax residency status - spending days in Singapore, UAE, UK or other jurisdictions has implications',
      'Understand how the UK-Singapore double taxation agreement applies to your situation',
      'Consider corporate structures vs. personal holdings for investment assets',
      crossHigh
        ? 'Engage a cross-border tax specialist familiar with UK-Singapore or UAE-Singapore tax treaties'
        : "Review your CPF tax treatment and SRS (Supplementary Retirement Scheme) contribution strategy",
    ],
    urgency: crossHigh ? 'high' : 'medium',
  });

  // 7. Investment Growth
  var invDim = allDims.find(function(d) { return d.label === 'Investment Growth'; });
  if (invDim) {
    recs.push({
      icon: String.fromCodePoint(0x1F4C8),
      category: 'Investment Growth',
      status: invDim.percentage < 60 ? 'needs-attention' : invDim.percentage < 75 ? 'review' : 'on-track',
      headline: invDim.percentage < 60 ? 'Investment Portfolio Requires Restructuring' : 'Investment Portfolio Has Optimization Potential',
      insight: invDim.description || 'Investment decisions should align with your time horizon, risk tolerance, and specific financial goals.',
      bullets: [
        'Clarify your investment time horizon - are you investing for retirement (20+ years) or shorter-term goals?',
        'Review whether your current investments match your stated risk tolerance',
        'Consider dollar-cost averaging into diversified portfolios rather than lump sums',
        'Assess whether high-fee products (endowment, ILP) are undermining your long-term returns',
      ],
      urgency: invDim.percentage < 60 ? 'high' : 'medium',
    });
  }

  var priorities = aiReport?.topPriorities || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-sm text-slate-700">Wealth Lead Engine</span>
          </div>
          <Link href="/assessment" className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors">
            Retake &rarr;
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Hero Summary */}
        <section className="mb-10 animate-fade-in-up">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Wealth Readiness Report
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
              Here&apos;s what we found,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">{rawName}</span>
            </h1>
            {aiReport?.executiveSummary && (
              <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
                {aiReport.executiveSummary}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Overall Readiness', value: String(wealthScore.overallScore) + '/100', sub: wealthScore.overallLabel, color: 'text-slate-800' },
              { label: 'Top Strength', value: (topDim?.label || '-').split(' ').slice(0, 2).join(' '), sub: String(topDim?.percentage || 0) + '%', color: 'text-emerald-600' },
              { label: 'Needs Focus', value: (weakDim?.label || '-').split(' ').slice(0, 2).join(' '), sub: String(weakDim?.percentage || 0) + '%', color: 'text-red-500' },
            ].map(function(stat) {
              return (
                <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <p className={'font-extrabold text-lg ' + stat.color}>{stat.value}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{stat.sub}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <CheckCircle width={16} height={16} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Personalized Recommendations</h2>
              <p className="text-sm text-slate-500">{recs.length} areas identified based on your profile</p>
            </div>
          </div>
          <div className="space-y-4">
            {recs.map(function(card, i) {
              return <RecommendationCard key={card.category} card={card} index={i} />;
            })}
          </div>
        </section>

        {/* Roadmap */}
        {priorities.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your Action Roadmap</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              {priorities.map(function(p, i) {
                return <RoadmapCard key={p.priority} priority={p} index={i} />;
              })}
            </div>
          </section>
        )}

        {/* PEAK CTA */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-400 opacity-[0.07] blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-blue-500 opacity-[0.07] blur-3xl" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-400/30">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                You&apos;ve seen where you stand.
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-2 text-base leading-relaxed">
                These findings are specific to your situation - and most people find that a 30-minute conversation
                with an advisor clarifies exactly which steps to take next.
              </p>
              <p className="text-slate-500 max-w-lg mx-auto mb-8 text-sm">
                No obligation. No hard sell. Just a focused conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/assessment/booking"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-amber-400 text-slate-900 font-extrabold text-sm rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
                >
                  <Calendar width={16} height={16} />
                  Book Your Free 30-Min Review
                </Link>
                <button
                  onClick={function() { setShowEmail(!showEmail); }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  <Mail width={16} height={16} />
                  Send My Report by Email
                </button>
              </div>
              <div className="flex items-center justify-center gap-5 mt-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Lock width={12} height={12} />
                  100% Free
                </span>
                <span>&middot;</span>
                <span>No Obligation</span>
                <span>&middot;</span>
                <span>Confidential</span>
              </div>
            </div>
          </div>
        </section>

        {/* Email Form */}
        {showEmail && (
          <section className="mb-12 animate-scale-in">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Send yourself a copy</h3>
              <p className="text-sm text-slate-500 mb-6">Your report will arrive immediately. We never share your details.</p>
              <EmailCaptureForm
                sessionId={data.sessionId}
                opportunityScore={opportunityScore.score}
                topDimension={topDim?.label || 'financial position'}
                weakDimension={weakDim?.label || 'financial planning'}
                onSubmitted={function() { setTimeout(function() { setShowEmail(false); }, 2000); }}
              />
            </div>
          </section>
        )}

        {/* Questions */}
        {aiReport?.suggestedQuestions && aiReport.suggestedQuestions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-500">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Questions Worth Asking an Advisor
            </h2>
            <div className="space-y-3">
              {aiReport.suggestedQuestions.map(function(q, i) {
                return (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700">{q}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Cross-Border Alert */}
        {(wealthScore.crossBorderComplexity === 'High' || wealthScore.crossBorderComplexity === 'Very High') && (
          <section className="mb-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle width={18} height={18} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Cross-Border Complexity: {wealthScore.crossBorderComplexity}</h3>
                  <p className="text-sm text-red-600 leading-relaxed mb-3">
                    Your situation spans multiple jurisdictions. This is common for expats - but requires specific expertise to manage correctly. A specialist advisor can help identify opportunities you might otherwise miss.
                  </p>
                  <Link href="/assessment/booking" className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 hover:text-red-800 transition-colors">
                    Speak to a cross-border specialist &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong>Disclaimer:</strong> This assessment is for general educational and informational purposes only. It does not constitute financial, investment, legal, tax, or professional advice. Results are based on information provided by the user and should not be relied upon as a substitute for qualified professional advice.
          </p>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 z-40 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700">{priorities[0]?.topic || 'Your recommendations are ready'}</p>
            <p className="text-xs text-slate-400">Personalized for your situation</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={function() { setShowEmail(!showEmail); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all"
            >
              Email Report
            </button>
            <Link href="/assessment/booking" className="inline-flex items-center gap-2 px-5 py-2 bg-amber-400 text-slate-900 text-xs font-extrabold rounded-lg hover:bg-amber-300 transition-all shadow-sm">
              Book Free Review
              <ArrowRight width={12} height={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
