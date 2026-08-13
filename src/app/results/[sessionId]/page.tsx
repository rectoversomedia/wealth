'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Download, Mail, CheckCircle, Star, TrendingUp, Shield, Globe, Lock, ChevronDown } from 'lucide-react';
import type { WealthScore, OpportunityScore, AiReport } from '@/types';
import { cn, scoreToColor, tierToColor, tierToBgColor, formatDate } from '@/lib/utils';

// ─── Score Ring Component ────────────────────────────────────────────────────

function ScoreRing({ score, size = 200 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreToColor(score);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="score-ring">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--slate-200)"
        strokeWidth="12"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </svg>
  );
}

// ─── Dimension Bar ───────────────────────────────────────────────────────────

function DimensionBar({ label, score, description, index }: {
  label: string;
  score: number;
  description: string;
  index: number;
}) {
  const color = scoreToColor(score);
  return (
    <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-[var(--slate-700)]">{label}</span>
          <span className="ml-2 text-xs text-[var(--muted)]">{description}</span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>{score}</span>
      </div>
      <div className="h-2 bg-[var(--slate-100)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${score}%`,
            backgroundColor: color,
            transitionDelay: `${index * 80 + 200}ms`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Priority Card ───────────────────────────────────────────────────────────

function PriorityCard({ priority, topic, explanation, index }: {
  priority: number;
  topic: string;
  explanation: string;
  index: number;
}) {
  const icons = [<Star className="w-4 h-4" />, <TrendingUp className="w-4 h-4" />, <Shield className="w-4 h-4" />];
  return (
    <div className="p-5 bg-[var(--slate-50)] border border-[var(--border)] rounded-xl">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--gold-100)] text-[var(--gold-600)] flex items-center justify-center">
          {icons[index]}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[var(--gold-500)] uppercase tracking-wide">Priority {priority}</span>
          </div>
          <h4 className="font-bold text-[var(--slate-800)] mb-1.5">{topic}</h4>
          <p className="text-sm text-[var(--slate-500)] leading-relaxed">{explanation}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Lead Capture Form ───────────────────────────────────────────────────────

function LeadCaptureForm({ sessionId, opportunityScore, topDimension, weakDimension, onSubmitted }: {
  sessionId: string;
  opportunityScore: number;
  topDimension: string;
  weakDimension: string;
  onSubmitted: (email: string) => void;
}) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phoneCountryCode: '+65',
    preferredContact: 'email',
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setSubmitting(true);

    try {
      await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sessionId,
          // Nurture sequence context
          opportunityScore,
          topDimension,
          weakDimension,
        }),
      });
      setSubmitted(true);
      onSubmitted(form.email);
    } catch {
      setSubmitted(true); // Continue anyway in demo
      onSubmitted(form.email);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 animate-scale-in">
        <div className="w-14 h-14 rounded-full bg-[var(--success-bg)] flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-[var(--success)]" />
        </div>
        <h3 className="text-xl font-bold mb-2">You&apos;re all set!</h3>
        <p className="text-[var(--slate-500)] text-sm">Your report has been sent to {form.email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">First Name</label>
          <input
            required
            type="text"
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
            placeholder="Michael"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Last Name</label>
          <input
            required
            type="text"
            value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
            placeholder="Chen"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Email Address</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
          placeholder="michael@example.com"
        />
      </div>
      <div className="flex items-start gap-2.5">
        <input
          required
          type="checkbox"
          id="consent"
          checked={form.consent}
          onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
          className="mt-0.5 w-4 h-4 rounded border-[var(--border)] text-[var(--gold-500)] focus:ring-[var(--gold-400)]"
        />
        <label htmlFor="consent" className="text-xs text-[var(--slate-500)] leading-relaxed cursor-pointer">
          Send me my personalized Wealth Readiness Report. This is for educational purposes only.
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting || !form.consent}
        className={cn(
          'w-full py-3 rounded-xl font-semibold text-sm transition-all',
          submitting || !form.consent
            ? 'bg-[var(--slate-100)] text-[var(--slate-400)] cursor-not-allowed'
            : 'bg-[var(--gold-500)] text-white hover:bg-[var(--gold-600)] shadow-sm hover:shadow-md'
        )}
      >
        {submitting ? 'Sending your report…' : 'Email My Report'}
      </button>
    </form>
  );
}

// ─── Main Results Page ────────────────────────────────────────────────────────

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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);
  const scoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read result from sessionStorage (assessment page stores it there to avoid URL length limits)
    const stored = sessionStorage.getItem('assessment_result');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.error) {
          sessionStorage.removeItem('assessment_result');
          router.replace('/assessment');
          return;
        }
        setData(parsed);
      } catch {
        sessionStorage.removeItem('assessment_result');
        router.replace('/assessment');
      }
    } else {
      // No stored result — redirect back to assessment
      router.replace('/assessment');
    }
  }, [router]);

  useEffect(() => {
    if (data) {
      sessionStorage.setItem('assessment_result', JSON.stringify(data));
      setTimeout(() => setAnimated(true), 100);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--gold-500)] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-[var(--muted)]">Loading your report…</p>
        </div>
      </div>
    );
  }

  const { wealthScore, opportunityScore, aiReport } = data;
  const firstName = aiReport?.executiveSummary?.split(',')[0]?.replace(/^You|Hi |Hello /, '').trim() || 'there';

  const strongDimensions = wealthScore.dimensions.filter(d => d.percentage >= 70);
  const weakDimensions = wealthScore.dimensions.filter(d => d.percentage < 70)
    .sort((a, b) => a.percentage - b.percentage);
  const topDimension = strongDimensions[0]?.label ?? 'your financial position';
  const weakDimension = weakDimensions[0]?.label ?? 'financial planning';

  const crossBorderColor =
    wealthScore.crossBorderComplexity === 'Very High' ? 'var(--danger)' :
    wealthScore.crossBorderComplexity === 'High' ? 'var(--warning)' :
    'var(--slate-500)';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <Logo />
            <span className="font-bold text-sm">Wealth Lead Engine</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--muted)] hidden sm:block">
              Assessment · {formatDate(new Date().toISOString())}
            </span>
            <Link href="/assessment" className="text-xs font-medium text-[var(--gold-600)] hover:text-[var(--gold-700)] transition-colors">
              Retake →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Score */}
        <section className="text-center mb-16 animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-500)] mb-4">
            Your Wealth Readiness Score
          </p>

          <div className="relative inline-flex items-center justify-center mb-6" ref={scoreRef}>
            <ScoreRing score={animated ? wealthScore.overallScore : 0} size={240} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-7xl font-extrabold text-[var(--slate-900)] leading-none">
                {animated ? wealthScore.overallScore : '—'}
              </div>
              <div className="text-[var(--slate-400)] font-semibold">/100</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-xl font-bold text-[var(--slate-800)]">
              {wealthScore.overallLabel} Foundation
            </p>
            <p className="text-[var(--slate-500)] max-w-lg mx-auto leading-relaxed">
              {wealthScore.overallScore >= 75
                ? 'Your financial foundation appears reasonably developed. Several areas show solid progress, with targeted improvements potentially yielding meaningful results.'
                : wealthScore.overallScore >= 60
                ? 'Your financial foundation is developing. Key areas are forming, though deliberate attention to specific dimensions could significantly strengthen your overall position.'
                : 'Your financial foundation shows significant opportunity. Identifying and addressing key gaps now could help prevent larger issues over time.'}
            </p>
          </div>

          {/* Cross-border */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--slate-50)] border border-[var(--border)] rounded-full">
            <Globe className="w-4 h-4" style={{ color: crossBorderColor }} />
            <span className="text-sm font-medium">Cross-Border Complexity:</span>
            <span className="text-sm font-bold" style={{ color: crossBorderColor }}>
              {wealthScore.crossBorderComplexity}
            </span>
          </div>

          {/* Save to email — low friction */}
          {!showEmailForm && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowEmailForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--border)] text-sm font-semibold text-[var(--slate-700)] rounded-lg hover:bg-[var(--slate-50)] hover:border-[var(--slate-300)] transition-all"
              >
                <Mail className="w-4 h-4" />
                Email my results
              </button>
              <span className="text-xs text-[var(--muted)]">— save your report instantly</span>
            </div>
          )}
        </section>

        {/* AI Executive Summary */}
        {aiReport && (
          <section className="mb-16 animate-fade-in-up stagger-2">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-[var(--gold-100)] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--gold-600)" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="var(--gold-600)" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="var(--gold-600)" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-600)]">AI Analysis</span>
              </div>
              <p className="text-lg text-[var(--slate-700)] leading-relaxed font-medium">
                {aiReport.executiveSummary}
              </p>
            </div>
          </section>
        )}

        {/* Dimension Scores */}
        <section className="mb-16 animate-fade-in-up stagger-3">
          <h2 className="text-2xl font-bold mb-8">Dimension Breakdown</h2>
          <div className="space-y-6">
            {wealthScore.dimensions.map((dim, i) => (
              <DimensionBar
                key={dim.dimension}
                label={dim.label}
                score={dim.percentage}
                description={dim.description}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* Strong Areas / Areas for Review */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {strongDimensions.length > 0 && (
            <section className="animate-fade-in-up stagger-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                Strongest Areas
              </h3>
              <div className="space-y-3">
                {strongDimensions.map((dim) => (
                  <div key={dim.dimension} className="p-4 bg-[var(--success-bg)] border border-[var(--success)]/10 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-[var(--slate-800)]">{dim.label}</span>
                      <span className="text-sm font-bold text-[var(--success)]">{dim.percentage}/100</span>
                    </div>
                    <p className="text-xs text-[var(--slate-500)]">{dim.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {weakDimensions.length > 0 && (
            <section className="animate-fade-in-up stagger-5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--warning)]" />
                Areas Worth Review
              </h3>
              <div className="space-y-3">
                {weakDimensions.slice(0, 3).map((dim) => (
                  <div key={dim.dimension} className="p-4 bg-[var(--warning-bg)] border border-[var(--warning)]/10 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-[var(--slate-800)]">{dim.label}</span>
                      <span className="text-sm font-bold text-[var(--warning)]">{dim.percentage}/100</span>
                    </div>
                    <p className="text-xs text-[var(--slate-500)]">{dim.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Top Priorities */}
        {aiReport?.topPriorities && (
          <section className="mb-16 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6">Your Top 3 Priorities</h2>
            <div className="space-y-4">
              {aiReport.topPriorities.map((p, i) => (
                <PriorityCard key={p.priority} {...p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Advisor CTA */}
        <section className="mb-16 animate-fade-in-up">
          <div className="bg-[var(--slate-900)] rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold-500)] opacity-5 rounded-full" />
            </div>
            <div className="relative">
              <Lock className="w-8 h-8 text-[var(--gold-400)] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">
                Review this with an advisor
              </h2>
              <p className="text-[var(--slate-400)] max-w-md mx-auto mb-8 leading-relaxed">
                A 30-minute conversation can help you better understand the areas highlighted in your report — with no obligation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--gold-500)] text-white font-semibold text-sm rounded-lg hover:bg-[var(--gold-600)] transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Email My Report
                </button>
                <Link href="/assessment/booking" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[var(--slate-800)] font-semibold text-sm rounded-lg hover:bg-[var(--slate-50)] transition-all">
                  Book a Review
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Email Form */}
        {showEmailForm && (
          <section className="mb-16 animate-scale-in">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm max-w-lg mx-auto">
              <h3 className="text-lg font-bold mb-1">Get your report by email</h3>
              <p className="text-sm text-[var(--slate-500)] mb-6">
                Enter your details and we&apos;ll send your personalized Wealth Readiness Report immediately.
              </p>
              <LeadCaptureForm
                sessionId={data.sessionId}
                opportunityScore={opportunityScore.score}
                topDimension={topDimension}
                weakDimension={weakDimension}
                onSubmitted={() => {}}
              />
            </div>
          </section>
        )}

        {/* Suggested Questions */}
        {aiReport?.suggestedQuestions && (
          <section className="mb-16 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6">Questions to Ask an Advisor</h2>
            <div className="space-y-3">
              {aiReport.suggestedQuestions.map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white border border-[var(--border)] rounded-xl">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--gold-100)] text-[var(--gold-600)] text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[var(--slate-700)]">{q}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Educational Insights */}
        {aiReport?.educationalInsights && aiReport.educationalInsights.length > 0 && (
          <section className="mb-16 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6">What This Means for You</h2>
            <div className="space-y-4">
              {aiReport.educationalInsights.map((insight, i) => (
                <details
                  key={i}
                  className="group bg-white border border-[var(--border)] rounded-xl"
                  open={expandedSection === insight.dimension}
                  onToggle={() => setExpandedSection(expandedSection === insight.dimension ? null : insight.dimension)}
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                    <span className="font-semibold text-[var(--slate-800)]">{insight.dimension}</span>
                    <ChevronDown className={cn(
                      'w-4 h-4 text-[var(--muted)] transition-transform',
                      expandedSection === insight.dimension && 'rotate-180'
                    )} />
                  </summary>
                  <div className="px-5 pb-5 border-t border-[var(--border)] pt-4">
                    <p className="text-sm text-[var(--slate-500)] leading-relaxed">{insight.insight}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="border-t border-[var(--border)] pt-8">
          <div className="bg-[var(--slate-50)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="text-xs font-semibold text-[var(--slate-500)] uppercase tracking-wider mb-2">Important Disclaimer</h3>
            <p className="text-xs text-[var(--slate-400)] leading-relaxed">
              This assessment is provided for general educational and informational purposes only. It does not constitute financial, investment, legal, tax, or other professional advice. Results are based solely on information provided by the user and should not be relied upon as a substitute for advice from qualified professionals. Wealth Readiness Scores are algorithmic calculations and do not represent a guarantee of financial performance or outcomes.
            </p>
          </div>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] py-3 px-6 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-[var(--slate-700)]">
              Your Wealth Readiness Score: {wealthScore.overallScore}/100
            </p>
            <p className="text-xs text-[var(--muted)]">{wealthScore.overallLabel} Foundation</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEmailForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--border)] text-sm font-semibold rounded-lg hover:bg-[var(--slate-50)] transition-all"
            >
              <Mail className="w-4 h-4" />
              Email Report
            </button>
            <Link href="/assessment/booking" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--slate-900)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--slate-800)] transition-all shadow-sm">
              Book a Review
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="h-16" /> {/* spacer for sticky footer */}
    </div>
  );
}

function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#b8892a" />
      <path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <circle cx="16" cy="14" r="3" fill="white" />
      <path d="M16 17V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
