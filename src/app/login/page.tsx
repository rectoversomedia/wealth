'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Unable to connect. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--slate-900)] flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold-500)] opacity-5 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--gold-400)] opacity-5 rounded-full" />
        </div>

        <div className="relative">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <Logo />
            <span className="font-bold text-white text-sm">Wealth Lead Engine</span>
          </Link>

          <div className="space-y-8">
            <div>
              <p className="text-[var(--gold-400)] text-sm font-semibold uppercase tracking-widest mb-4">Advisor Portal</p>
              <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
                Your client acquisition operating system.
              </h1>
              <p className="text-[var(--slate-400)] leading-relaxed">
                From anonymous traffic to qualified conversations. Every lead scored, contextualised, and ready to convert.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              {[
                { metric: '147', label: 'Leads this month', trend: '+12%' },
                { metric: '23', label: 'Qualified conversations', trend: '+8%' },
                { metric: '8', label: 'New clients', trend: '+3' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between py-4 border-b border-[var(--slate-800)]">
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.metric}</p>
                    <p className="text-sm text-[var(--slate-400)]">{stat.label}</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--success)]">{stat.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="text-xs text-[var(--slate-500)]">
            © {new Date().getFullYear()} Wealth Lead Engine · Advisor Portal
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Logo />
              <span className="font-bold text-sm">Wealth Lead Engine</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--slate-900)] mb-2">Sign in to your dashboard</h2>
            <p className="text-[var(--slate-500)] text-sm">
              Access your leads, pipeline, and analytics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[var(--slate-700)] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="demo@wealthleadengine.com"
                autoComplete="email"
                className="w-full px-4 py-3 bg-white border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--gold-400)] text-sm transition-colors placeholder:text-[var(--slate-400)]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-[var(--slate-700)]">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 bg-white border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--gold-400)] text-sm transition-colors placeholder:text-[var(--slate-400)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--slate-600)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[var(--danger-bg)] border border-[var(--danger)]/20 rounded-lg">
                <p className="text-xs text-[var(--danger)]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-3 bg-[var(--slate-900)] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2',
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--slate-800)] shadow-sm hover:shadow-md'
              )}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center p-3 bg-[var(--gold-50)] border border-[var(--gold-200)] rounded-xl">
              <p className="text-xs text-[var(--slate-600)]">
                Demo credentials: <span className="font-semibold">demo@wealthleadengine.com</span> / <span className="font-semibold">demo123</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#b8892a" />
      <path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <circle cx="16" cy="14" r="3" fill="white" />
      <path d="M16 17V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
