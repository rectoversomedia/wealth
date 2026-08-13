'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, ExternalLink, FileText, Loader2, RefreshCw } from 'lucide-react';
import { COUNTRIES } from '@/types';
import { cn } from '@/lib/utils';

const FORMATS = [
  { id: 'linkedin_long', label: 'LinkedIn Post (Long)', icon: '📝', description: '800–1200 word professional post' },
  { id: 'linkedin_short', label: 'LinkedIn Post (Short)', icon: '💬', description: '150–300 word engagement post' },
  { id: 'carousel', label: 'Carousel Outline', icon: '🎠', description: '8–10 slide structure for LinkedIn carousel' },
  { id: 'reels', label: 'Reels Script', icon: '🎬', description: '30–60 second video script' },
  { id: 'youtube_short', label: 'YouTube Shorts Script', icon: '📺', description: 'Short-form video script' },
  { id: 'email', label: 'Email Campaign', icon: '📧', description: 'Nurture email with CTA' },
  { id: 'ad_variation', label: 'Ad Copy Variations', icon: '📣', description: '3 ad copy variants' },
  { id: 'blog_outline', label: 'Blog Outline', icon: '📄', description: 'Article structure and key points' },
];

const DEMO_CONTENT = {
  linkedin_long: `As a British expat in Singapore, retirement planning looks completely different from what you might expect back home.

The CPF system, Singapore tax treatment of overseas income, and the nuances of UK-Singapore double taxation agreements create a planning landscape that few advisers fully understand — especially when you've built significant wealth across both jurisdictions.

Three things I consistently see overlooked:

1. CPF vs. Private Pension allocation — how much should stay in CPF vs. be drawn down privately?

2. UK Pension traps for expats — certain UK pension transfers become taxable events when you leave the UK for a certain period. Getting this wrong is expensive.

3. Cross-border estate coordination — a UK will and a Singapore estate plan don't automatically work together. Your family could face unnecessary complications.

If you're a British professional in Singapore and want a no-obligation conversation about how your retirement picture might differ from what you've assumed, reply here or book a 30-minute call. Link in bio.`,

  linkedin_short: `Retirement as an expat isn't just about saving more — it's about understanding the specific rules that apply to your situation.

A British professional in Singapore faces a completely different planning landscape than colleagues back home.

Small adjustments in how you structure your CPF, private pension, and drawdown strategy could mean significantly different outcomes in 10 years.

Happy to have a no-obligation conversation.`,

  email: `Subject: Your retirement readiness — a quick note from your Singapore assessment

Hi {{first_name}},

Thank you for completing your Wealth Readiness Assessment.

Based on your profile, one area that stood out was your retirement readiness score of {{score}}/100.

For professionals in your situation, this often comes down to three questions:

1. Have you reviewed your CPF Strategy recently?

2. Do you understand how your UK pension interacts with your Singapore tax residency?

3. Is your drawdown plan aligned with your actual retirement vision?

These aren't things to worry about — but they are worth understanding clearly.

If you'd like to explore any of these in a no-obligation 30-minute call, I'm happy to make time.

Book here: [calendar link]

Best regards,
[Advisor Name]`,

  ad_variation: `Variant A:
Headline: "British in Singapore? Your retirement plan may need a second look."
Body: "The rules that apply to your wealth as an expat are different from what you might assume. A 30-minute conversation could clarify a lot. Free assessment — no obligation."

Variant B:
Headline: "How ready is your financial life for retirement?"
Body: "Most professionals we speak with have never had a comprehensive review of how their expat status affects their long-term plan. Take 5 minutes to check your Wealth Readiness Score."

Variant C:
Headline: "Singapore expat? See your Wealth Readiness Score."
Body: "Understanding your financial readiness across retirement, protection, and cross-border complexity takes just 5 minutes. Get your personalized score — free, no obligation."`,
};

const STATUS_COLORS = {
  draft: 'var(--slate-400)',
  approved: 'var(--success)',
  published: 'var(--gold-500)',
};

const DEMO_ASSETS = [
  { id: '1', title: 'British Expats SG — Retirement (LinkedIn Long)', country: 'sg', format: 'linkedin_long', status: 'approved', createdAt: '2026-08-01' },
  { id: '2', title: 'British Expats SG — Retirement (Email)', country: 'sg', format: 'email', status: 'draft', createdAt: '2026-08-05' },
  { id: '3', title: 'UAE Expats — Protection (LinkedIn Short)', country: 'uae', format: 'linkedin_short', status: 'published', createdAt: '2026-08-08' },
  { id: '4', title: 'SG Business Owners — Wealth (Ad Variations)', country: 'sg', format: 'ad_variation', status: 'draft', createdAt: '2026-08-10' },
];

export default function ContentStudioPage() {
  const [country, setCountry] = useState('sg');
  const [audience, setAudience] = useState('British Expats');
  const [persona, setPersona] = useState('Senior Professional');
  const [theme, setTheme] = useState('Retirement');
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [assets] = useState(DEMO_ASSETS);

  const handleGenerate = async () => {
    if (!selectedFormat) return;
    setGenerating(true);
    setGeneratedContent('');
    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: selectedFormat, country, audience, topic: theme }),
      });
      const data = await res.json();
      if (res.ok && data.content) {
        setGeneratedContent(data.content);
      } else {
        setGeneratedContent(`[Demo content — configure OPENAI_API_KEY in .env.local]\n\nFormat: ${selectedFormat}\nAudience: ${audience}\nCountry: ${country}\nTheme: ${theme}`);
      }
    } catch {
      setGeneratedContent('Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDef = FORMATS.find(f => f.id === selectedFormat);
  const countryData = COUNTRIES.find(c => c.code === country);

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--slate-900)]">Content Studio</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">AI-powered content creation for your campaigns</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Generator */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h2 className="font-bold text-[var(--slate-800)] mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold-500)]" />
              Generate Content
            </h2>

            {/* Config */}
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-3 py-2 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg">
                  {COUNTRIES.filter(c => c.available).map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Audience</label>
                <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full px-3 py-2 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg">
                  <option>British Expats</option>
                  <option>Indian Expats</option>
                  <option>Business Owners</option>
                  <option>Senior Professionals</option>
                  <option>High Net Worth Individuals</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Persona</label>
                <select value={persona} onChange={e => setPersona(e.target.value)} className="w-full px-3 py-2 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg">
                  <option>Senior Professional</option>
                  <option>C-Suite Executive</option>
                  <option>Business Owner</option>
                  <option>Entrepreneur</option>
                  <option>Doctor / Lawyer / Accountant</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Theme</label>
                <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full px-3 py-2 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg">
                  <option>Retirement</option>
                  <option>Family Protection</option>
                  <option>Wealth Structuring</option>
                  <option>Estate Planning</option>
                  <option>Tax Efficiency</option>
                  <option>Investment Review</option>
                </select>
              </div>
            </div>

            {/* Format selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[var(--slate-600)] mb-2">Output Format</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FORMATS.map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => { setSelectedFormat(fmt.id); setGeneratedContent(''); }}
                    className={cn(
                      'text-left p-3 rounded-xl border-2 transition-all',
                      selectedFormat === fmt.id
                        ? 'border-[var(--gold-500)] bg-[var(--gold-50)]'
                        : 'border-[var(--border)] bg-white hover:border-[var(--slate-300)]'
                    )}
                  >
                    <span className="text-xl mb-1 block">{fmt.icon}</span>
                    <p className="text-xs font-semibold text-[var(--slate-700)]">{fmt.label.split(' ')[0]}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedFormat || generating}
              className={cn(
                'w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2',
                !selectedFormat || generating
                  ? 'bg-[var(--slate-100)] text-[var(--slate-400)] cursor-not-allowed'
                  : 'bg-[var(--slate-900)] text-white hover:bg-[var(--slate-800)] shadow-sm hover:shadow-md'
              )}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating content…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </>
              )}
            </button>

            {!process.env.NEXT_PUBLIC_AI_ENABLED && (
              <p className="text-xs text-[var(--muted)] text-center mt-2">
                Demo mode — set NEXT_PUBLIC_AI_ENABLED=true and OPENAI_API_KEY for AI generation
              </p>
            )}
          </div>

          {/* Generated content */}
          {generatedContent && (
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--gold-500)] mb-0.5">Generated Content</p>
                  <p className="text-sm text-[var(--muted)]">{formatDef?.label} · {countryData?.flag} {countryData?.name}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--slate-50)] border border-[var(--border)] rounded-lg text-xs font-semibold text-[var(--slate-600)] hover:bg-[var(--slate-100)] transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[var(--success)]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-[var(--slate-600)] leading-relaxed font-sans bg-[var(--slate-50)] p-4 rounded-xl border border-[var(--border)]">
                  {generatedContent}
                </pre>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                <button onClick={handleGenerate} className="flex-1 py-2 text-xs font-semibold text-[var(--slate-600)] bg-[var(--slate-50)] rounded-lg hover:bg-[var(--slate-100)] transition-all flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
                <button onClick={handleCopy} className="flex-1 py-2 text-xs font-semibold text-[var(--slate-600)] bg-[var(--slate-50)] rounded-lg hover:bg-[var(--slate-100)] transition-all flex items-center justify-center gap-1.5">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button className="flex-1 py-2 text-xs font-semibold text-white bg-[var(--success)] rounded-lg hover:bg-[var(--success)]/90 transition-all flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Saved Assets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[var(--border)] rounded-2xl p-5">
            <h3 className="font-bold text-[var(--slate-800)] mb-4">Saved Assets</h3>
            <div className="space-y-3">
              {assets.map(asset => {
                const country = COUNTRIES.find(c => c.code === asset.country);
                const fmt = FORMATS.find(f => f.id === asset.format);
                return (
                  <div key={asset.id} className="p-3 bg-[var(--slate-50)] border border-[var(--border)] rounded-xl hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {country && <span>{country.flag}</span>}
                        <span className="text-sm font-semibold text-[var(--slate-700)] truncate">{asset.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[var(--muted)]">{fmt?.icon} {fmt?.label}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize"
                        style={{ color: STATUS_COLORS[asset.status as keyof typeof STATUS_COLORS], backgroundColor: `${STATUS_COLORS[asset.status as keyof typeof STATUS_COLORS]}15` }}>
                        {asset.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Generator */}
          <div className="bg-[var(--gold-50)] border border-[var(--gold-200)] rounded-2xl p-5">
            <h3 className="font-bold text-[var(--gold-800)] mb-3">CTA Suggestions</h3>
            <p className="text-xs text-[var(--gold-700)] mb-3">Generated CTA variants for your campaigns:</p>
            <div className="space-y-2">
              {[
                'Check Your Wealth Score',
                'Discover Your Wealth Readiness',
                'See How Ready You Are',
                'Get Your Free Assessment',
                'Book Your Free Review',
              ].map(cta => (
                <div key={cta} className="flex items-center justify-between p-2.5 bg-white border border-[var(--gold-200)] rounded-lg">
                  <span className="text-xs font-medium text-[var(--slate-700)]">{cta}</span>
                  <button className="text-[10px] text-[var(--gold-600)] hover:text-[var(--gold-700)] font-semibold">
                    Use →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
