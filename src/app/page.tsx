import Link from 'next/link';
import { ArrowRight, Shield, Target, Globe, Lock, CheckCircle, AlertTriangle, TrendingUp, Users, FileText, Scale, BookOpen } from 'lucide-react';

function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#b8892a"/>
      <path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <circle cx="16" cy="14" r="3" fill="white"/>
      <path d="M16 17V22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function BannerPage() {

  const recommendations = [
    {
      icon: TrendingUp,
      color: '#f59e0b',
      label: 'Retirement Readiness',
      preview: 'CPF projections, SRS strategy, corpus targets',
    },
    {
      icon: Users,
      color: '#ef4444',
      label: 'Family Protection',
      preview: 'Coverage gaps, HLV, insurance adequacy',
    },
    {
      icon: FileText,
      color: '#f97316',
      label: 'Estate Planning',
      preview: 'Will, LPA, cross-border inheritance',
    },
    {
      icon: Scale,
      color: '#8b5cf6',
      label: 'Tax Efficiency',
      preview: 'DTA optimization, residency strategy',
    },
    {
      icon: AlertTriangle,
      color: '#06b6d4',
      label: 'Investment Growth',
      preview: 'Portfolio audit, fee impact, rebalancing',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Banner card */}
      <Link
        href="/assessment"
        className="group w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      >

        {/* Simulated LinkedIn post header */}
        <div className="bg-slate-900 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Logo size={22} />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">Wealth Lead Engine</p>
              <p className="text-slate-400 text-xs mt-px">Sponsored · Financial Services · 3h ago</p>
            </div>
          </div>
          <Globe className="w-4 h-4 text-slate-400" />
        </div>

        {/* 2-column body */}
        <div className="flex flex-col md:flex-row">

          {/* LEFT — copy + CTA */}
          <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-amber-400 opacity-[0.06] blur-3xl" />
            <div className="absolute -bottom-16 -left-8 w-40 h-40 rounded-full bg-blue-500 opacity-[0.06] blur-3xl" />

            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                AI-Powered Wealth Assessment
              </div>

              {/* Headline */}
              <h2 className="text-white text-3xl md:text-4xl font-extrabold leading-[1.1] tracking-tight mb-4">
                How Ready Is Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                  Financial Life
                </span>
                <br />For What&apos;s Next?
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Get your personalized Wealth Readiness Score —<br />
                in under 5 minutes. Free. No obligation.
              </p>

              {/* 4 feature bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { icon: Shield,   text: 'Understand Your Gaps' },
                  { icon: Target,   text: 'Prioritize What Matters' },
                  { icon: Globe,    text: 'Global Perspective' },
                  { icon: Lock,     text: '100% Private & Secure' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-slate-300 text-xs">
                    <span className="w-7 h-7 rounded-lg bg-slate-700/60 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 relative">
              <div className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-amber-400 text-slate-900 text-sm font-extrabold rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 group-hover:shadow-amber-400/30 group-hover:gap-3">
                CHECK MY WEALTH SCORE
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="text-slate-500 text-[11px] mt-2.5">
                5 Minutes · No Obligation · Available in Multiple Countries
              </p>
            </div>
          </div>

          {/* RIGHT — recommendation preview */}
          <div className="w-full md:w-80 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-8 flex flex-col">

            {/* Section label */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 text-center">
              What You&apos;ll Receive
            </p>

            {/* Recommendation list */}
            <div className="space-y-3 flex-1">
              {recommendations.map(function(rec) {
                return (
                  <div key={rec.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: rec.color + '18' }}>
                      <rec.icon className="w-4 h-4" style={{ color: rec.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 leading-tight">{rec.label}</p>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{rec.preview}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider + depth indicator */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { n: '7+', label: 'Areas Analyzed' },
                  { n: '50+', label: 'Data Points' },
                  { n: '30min', label: 'Advisor Session' },
                ].map(function(stat) {
                  return (
                    <div key={stat.label} className="text-center">
                      <p className="text-base font-extrabold text-slate-800">{stat.n}</p>
                      <p className="text-[10px] text-slate-400 leading-tight">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Sample depth teaser */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Sample insight:</p>
                <p className="text-[11px] text-slate-600 leading-snug">
                  <span className="font-semibold text-amber-600">Retirement:</span> Your CPF SA at current trajectory reaches only 68% of target corpus by 65. Recommended: maximize voluntary contributions + SRS top-ups before end of financial year.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer trust bar */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <p className="text-xs text-slate-500">
            Trusted by professionals, expats &amp; global families across <strong className="text-slate-700">7+ countries</strong>
          </p>
        </div>

      </Link>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Banner card */}
      <Link
        href="/assessment"
        className="group w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      >

        {/* Simulated LinkedIn post header */}
        <div className="bg-slate-900 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Logo size={22} />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">Wealth Lead Engine</p>
              <p className="text-slate-400 text-xs mt-px">Sponsored · Financial Services · 3h ago</p>
            </div>
          </div>
          <Globe className="w-4 h-4 text-slate-400" />
        </div>

        {/* 2-column body */}
        <div className="flex flex-col md:flex-row">

          {/* LEFT — copy + CTA */}
          <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-amber-400 opacity-[0.06] blur-3xl" />
            <div className="absolute -bottom-16 -left-8 w-40 h-40 rounded-full bg-blue-500 opacity-[0.06] blur-3xl" />

            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                AI-Powered Wealth Assessment
              </div>

              {/* Headline */}
              <h2 className="text-white text-3xl md:text-4xl font-extrabold leading-[1.1] tracking-tight mb-4">
                How Ready Is Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                  Financial Life
                </span>
                <br />For What&apos;s Next?
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Get your personalized Wealth Readiness Score —<br />
                in under 5 minutes. Free. No obligation.
              </p>

              {/* 4 feature bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { icon: Shield,   text: 'Understand Your Gaps' },
                  { icon: Target,   text: 'Prioritize What Matters' },
                  { icon: Globe,    text: 'Global Perspective' },
                  { icon: Lock,     text: '100% Private & Secure' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-slate-300 text-xs">
                    <span className="w-7 h-7 rounded-lg bg-slate-700/60 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 relative">
              <div className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-amber-400 text-slate-900 text-sm font-extrabold rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 group-hover:shadow-amber-400/30 group-hover:gap-3">
                CHECK MY WEALTH SCORE
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="text-slate-500 text-[11px] mt-2.5">
                5 Minutes · No Obligation · Available in Multiple Countries
              </p>
            </div>
          </div>

          {/* RIGHT — score preview */}
          <div className="w-full md:w-72 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-8 flex flex-col items-center">

            {/* Section label */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">
              Wealth Readiness Score
            </p>

            {/* Ring */}
            <div className="mb-4">
              <ScoreRing score={score} />
            </div>

            {/* Summary */}
            <p className="text-xs text-slate-500 text-center leading-snug mb-5">
              Your financial foundation is strong,<br />with some areas worth reviewing.
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-slate-200 mb-5" />

            {/* Score bars */}
            <div className="w-full space-y-3.5">
              {scores.map((s) => (
                <ScoreBar key={s.label} label={s.label} score={s.score} color={s.color} />
              ))}
            </div>

        </div>

        {/* Footer trust bar */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <p className="text-xs text-slate-500">
            Trusted by professionals, expats &amp; global families across <strong className="text-slate-700">7+ countries</strong>
          </p>
        </div>

      </Link>
    </div>
  );
}
