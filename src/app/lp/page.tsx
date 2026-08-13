import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Globe, Clock, Users, TrendingUp, ChevronDown } from 'lucide-react';
import { COUNTRIES } from '@/types';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-[15px] tracking-tight">Wealth Lead Engine</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">How It Works</a>
            <a href="#why-it-matters" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Why It Matters</a>
            <Link href="/assessment" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--gold-500)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--gold-600)] transition-all shadow-sm hover:shadow-md">
              Check My Wealth Score
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[var(--gold-100)] via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[var(--slate-100)] to-transparent opacity-40" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-32">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold-50)] border border-[var(--gold-200)] text-[var(--gold-700)] text-xs font-semibold tracking-wide uppercase mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-500)]" />
              AI-Powered Wealth Readiness
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 animate-fade-in stagger-1">
              You may be building{' '}
              <span className="text-gradient">wealth.</span>
              <br />
              But how ready is your
              <br />
              financial life for
              <br />
              what comes next?
            </h1>

            {/* Supporting copy */}
            <p className="text-xl text-[var(--slate-500)] leading-relaxed mb-10 max-w-2xl animate-fade-in stagger-2">
              Get a personalized assessment of your long-term financial readiness across retirement, protection, investment structure, family goals, and cross-border complexity.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in stagger-3">
              <Link href="/assessment" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--slate-900)] text-white text-base font-semibold rounded-xl hover:bg-[var(--slate-800)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Check My Wealth Score
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--slate-700)] text-base font-semibold rounded-xl border border-[var(--border)] hover:border-[var(--slate-300)] hover:bg-[var(--slate-50)] transition-all">
                See How It Works
              </a>
            </div>

            {/* Trust copy */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--muted)] animate-fade-in stagger-4">
              <TrustItem icon={<CheckCircle className="w-3.5 h-3.5" />}>Free assessment</TrustItem>
              <TrustItem icon={<Clock className="w-3.5 h-3.5" />}>Approximately 5 minutes</TrustItem>
              <TrustItem icon={<Shield className="w-3.5 h-3.5" />}>No obligation</TrustItem>
              <TrustItem icon={<Globe className="w-3.5 h-3.5" />}>Multiple countries supported</TrustItem>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof section */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-600)] mb-3">What you receive</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Wealth Readiness Snapshot</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Score visualization mock */}
            <div className="relative">
              <div className="bg-[var(--slate-50)] border border-[var(--border)] rounded-2xl p-10">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Your Wealth Readiness Score</p>
                  <span className="text-xs px-2 py-1 bg-[var(--success-bg)] text-[var(--success)] font-semibold rounded-md">Personalized</span>
                </div>
                <div className="flex items-end gap-6 mb-10">
                  <div className="text-8xl font-extrabold text-[var(--slate-900)] leading-none">76</div>
                  <div className="text-3xl font-bold text-[var(--slate-400)] mb-3">/100</div>
                  <div className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
                    <div className="font-semibold text-[var(--slate-600)]">Good</div>
                    <div>Foundation</div>
                  </div>
                </div>

                {/* Dimension bars */}
                <div className="space-y-4">
                  {[
                    { label: 'Retirement Readiness', score: 72, highlight: false },
                    { label: 'Wealth Structure', score: 81, highlight: true },
                    { label: 'Family Protection', score: 58, highlight: false },
                    { label: 'Estate Planning', score: 63, highlight: false },
                    { label: 'Cross-Border Complexity', score: 0, highlight: false, text: 'Moderate' },
                  ].map((dim) => (
                    <div key={dim.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-[var(--slate-600)]">{dim.label}</span>
                        {dim.text ? (
                          <span className="text-xs font-semibold px-2 py-0.5 bg-[var(--warning-bg)] text-[var(--warning)] rounded-md">{dim.text}</span>
                        ) : (
                          <span className="text-sm font-bold text-[var(--slate-700)]">{dim.score}</span>
                        )}
                      </div>
                      {dim.text ? null : (
                        <div className="h-2 bg-[var(--slate-200)] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${dim.highlight ? 'bg-[var(--success)]' : 'bg-[var(--gold-400)]'}`}
                            style={{ width: `${dim.score}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating label */}
              <div className="absolute -top-3 -right-3 bg-[var(--gold-500)] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md rotate-3">
                Sample Report
              </div>
            </div>

            {/* What it means */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">A clear picture of where you stand</h3>
                <p className="text-[var(--slate-500)] leading-relaxed">
                  Your score helps identify areas that may deserve further review before they become larger financial blind spots. You&apos;ll receive an AI-generated explanation specific to your situation — not generic advice.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Personalized to your profile',
                    desc: 'Your score accounts for your income, goals, timeline, family situation, and international complexity.',
                    icon: <Users className="w-5 h-5 text-[var(--gold-500)]" />,
                  },
                  {
                    title: 'Dimension-by-dimension breakdown',
                    desc: 'See exactly where your financial foundation is strong and where it may need attention.',
                    icon: <TrendingUp className="w-5 h-5 text-[var(--gold-500)]" />,
                  },
                  {
                    title: 'Actionable advisor brief',
                    desc: 'The report generates suggested conversation topics and questions worth discussing with a financial advisor.',
                    icon: <Shield className="w-5 h-5 text-[var(--gold-500)]" />,
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--gold-50)] border border-[var(--gold-100)] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--slate-800)] mb-1">{item.title}</h4>
                      <p className="text-sm text-[var(--slate-500)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-[var(--slate-500)] text-sm mb-4">Start with your own personalized assessment</p>
            <Link href="/assessment" className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--slate-900)] text-white text-base font-semibold rounded-xl hover:bg-[var(--slate-800)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Check My Wealth Score
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-600)] mb-3">Simple process</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
            <p className="text-[var(--slate-500)] mt-3 max-w-xl mx-auto">Three steps to a personalized view of your financial readiness.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Answer a few questions',
                desc: 'A short, conversational assessment about your financial situation, goals, and priorities. One question at a time. Takes about 5 minutes.',
                time: '~5 minutes',
              },
              {
                step: '02',
                title: 'Receive your analysis',
                desc: 'Your personalized Wealth Readiness Report is generated instantly, covering your score across key financial dimensions with AI-powered insights.',
                time: 'Instant',
              },
              {
                step: '03',
                title: 'Connect with an advisor',
                desc: 'If your report identifies areas worth exploring, you can choose to review it with a qualified financial advisor — no pressure, no obligation.',
                time: 'Optional',
              },
            ].map((item, i) => (
              <div key={item.step} className="relative p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--slate-300)] transition-colors group">
                <div className="text-6xl font-extrabold text-[var(--slate-100)] absolute top-6 right-6 select-none group-hover:text-[var(--slate-200)] transition-colors">
                  {item.step}
                </div>
                <div className="relative">
                  <div className="text-xs font-bold uppercase tracking-widest text-[var(--gold-500)] mb-3">{item.time}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-[var(--slate-500)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-600)] mb-3">Global reach</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Personalized for Your Country</h2>
            <p className="text-[var(--slate-500)] mt-3">Select your location to see a tailored assessment experience.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {COUNTRIES.filter(c => c.available).map((country) => (
              <Link
                key={country.code}
                href={`/${country.code}`}
                className="group flex flex-col items-center gap-3 p-6 bg-[var(--slate-50)] border border-[var(--border)] rounded-xl hover:border-[var(--gold-300)] hover:bg-[var(--gold-50)] transition-all text-center"
              >
                <span className="text-3xl">{country.flag}</span>
                <div>
                  <p className="font-semibold text-sm text-[var(--slate-700)] group-hover:text-[var(--gold-700)] transition-colors">{country.name}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{country.currency}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Advisor Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-[var(--slate-900)] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold-500)] opacity-5 rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--gold-400)] opacity-5 rounded-full" />
            </div>
            <div className="relative">
              <p className="text-[var(--gold-400)] text-sm font-semibold uppercase tracking-widest mb-4">For Financial Advisors</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Turn Traffic Into Clients</h2>
              <p className="text-[var(--slate-400)] max-w-xl mx-auto mb-8 leading-relaxed">
                Wealth Lead Engine gives advisors a complete AI-powered client acquisition operating system. Score leads, track prospects, and focus your time on conversations that convert.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--gold-500)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--gold-600)] transition-all">
                Access Advisor Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-[var(--border)] py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[var(--slate-50)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-[var(--slate-600)] mb-2">Important Disclaimer</h3>
            <p className="text-xs text-[var(--slate-400)] leading-relaxed">
              This assessment is provided for general educational and informational purposes only. It does not constitute financial, investment, legal, tax, or other professional advice. Results are based solely on information provided by the user and should not be relied upon as a substitute for advice from qualified professionals. Past performance is not indicative of future results. Consult with a licensed financial advisor before making any investment decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="text-sm font-semibold text-[var(--muted)]">Wealth Lead Engine</span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Wealth Lead Engine. For educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}

function TrustItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-[var(--gold-500)]">{icon}</span>
      {children}
    </span>
  );
}

function Logo({ size = 29 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#b8892a" />
      <path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <circle cx="16" cy="14" r="3" fill="white" />
      <path d="M16 17V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
