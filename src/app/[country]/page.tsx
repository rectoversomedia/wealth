import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, Shield, Globe, ArrowLeft } from 'lucide-react';
import { COUNTRIES, Country } from '@/types';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
  return COUNTRIES.map(c => ({ country: c.code }));
}

export async function generateMetadata({ params }: Props) {
  const { country } = await params;
  const countryData = COUNTRIES.find(c => c.code === country);
  if (!countryData) return { title: 'Not Found' };
  return {
    title: `${countryData.name} — Wealth Readiness Assessment`,
    description: countryData.heroSubtext,
  };
}

export default async function CountryPage({ params }: Props) {
  const { country: code } = await params;
  const countryData = COUNTRIES.find(c => c.code === code);

  if (!countryData) notFound();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center gap-2 mx-auto">
            <Logo />
            <span className="font-bold text-[15px] tracking-tight">Wealth Lead Engine</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--slate-700)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Global
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Country indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold-50)] border border-[var(--gold-200)] text-[var(--gold-700)] text-sm font-semibold mb-8">
          <span className="text-xl">{countryData.flag}</span>
          {countryData.name}
        </div>

        {/* Hero */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold-50)] border border-[var(--gold-200)] text-[var(--gold-700)] text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-500)]" />
            AI-Powered Wealth Readiness
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6">
            {countryData.heroHeadline}
          </h1>

          <p className="text-xl text-[var(--slate-500)] leading-relaxed mb-10 max-w-2xl">
            {countryData.heroSubtext}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href={`/assessment?country=${code}`}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--slate-900)] text-white text-base font-semibold rounded-xl hover:bg-[var(--slate-800)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {countryData.heroCTA}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-[var(--muted)]">
            <TrustItem icon={<CheckCircle className="w-3.5 h-3.5" />}>Free assessment</TrustItem>
            <TrustItem icon={<Clock className="w-3.5 h-3.5" />}>~5 minutes</TrustItem>
            <TrustItem icon={<Shield className="w-3.5 h-3.5" />}>No obligation</TrustItem>
            <TrustItem icon={<Globe className="w-3.5 h-3.5" />}>{countryData.currency} context</TrustItem>
          </div>
        </div>

        {/* What you get */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 mb-12">
          <h2 className="text-2xl font-bold mb-6">What You Receive</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Personalized Wealth Score', desc: 'Calculated across 7 financial dimensions, specific to your situation.' },
              { title: 'Cross-Border Analysis', desc: `Understand how your ${countryData.name} financial position interacts with international considerations.` },
              { title: 'AI-Generated Insights', desc: 'Personalized observations and educational content based on your actual profile.' },
              { title: 'Advisor Conversation Brief', desc: 'Suggested talking points and questions to make your advisory meeting most productive.' },
            ].map(item => (
              <div key={item.title} className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--gold-100)] flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--gold-500)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--slate-800)] mb-1">{item.title}</h3>
                  <p className="text-sm text-[var(--slate-500)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[var(--slate-50)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-xs text-[var(--slate-400)] leading-relaxed">
            <strong className="text-[var(--slate-500)]">Disclaimer:</strong> {countryData.disclaimer}
          </p>
        </div>

        {/* Other countries */}
        <div className="mt-16 pt-12 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted)] mb-4">Also available in:</p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.filter(c => c.code !== code && c.available).map(c => (
              <Link
                key={c.code}
                href={`/${c.code}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--slate-600)] hover:border-[var(--slate-300)] hover:bg-[var(--slate-50)] transition-all"
              >
                <span>{c.flag}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </main>
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
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#b8892a" />
      <path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <circle cx="16" cy="14" r="3" fill="white" />
      <path d="M16 17V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
