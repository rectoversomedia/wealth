import Link from 'next/link';
import { ArrowRight, Shield, Target, Globe, Lock } from 'lucide-react';

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

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const gap  = circ - dash;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))' }}>
      {/* Track */}
      <circle cx="64" cy="64" r={r} fill="none" stroke="#f1f5f9" strokeWidth="9" />
      {/* Progress */}
      <circle
        cx="64" cy="64" r={r} fill="none"
        stroke={color} strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={circ * 0.25}
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      {/* Score text */}
      <text x="64" y="58" textAnchor="middle" fontSize="26" fontWeight="800"
        fill={color} fontFamily="Manrope, sans-serif" letterSpacing="-1">
        {score}
      </text>
      <text x="64" y="74" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Manrope, sans-serif">
        / 100
      </text>
    </svg>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <span className="text-xs font-bold text-slate-700 tabular-nums">{score}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${score}%`,
            backgroundColor: color,
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
}

export default function BannerPage() {
  const score = 76;
  const scores = [
    { label: 'Retirement Readiness',   score: 72, color: '#f59e0b' },
    { label: 'Wealth Structure',         score: 81, color: '#22c55e' },
    { label: 'Family Protection',       score: 58, color: '#ef4444' },
    { label: 'Estate Planning',         score: 63, color: '#f97316' },
    { label: 'Cross-Border Complexity', score: 65, color: '#8b5cf6' },
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

            {/* Complexity badge */}
            <div className="mt-4 w-full flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v4l3 2" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-[10px] font-semibold text-purple-700">Cross-Border: High</span>
              </span>
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
