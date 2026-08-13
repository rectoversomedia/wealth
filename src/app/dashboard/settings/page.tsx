'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, User, Globe, Shield, Calendar, MessageSquare, LogOut, Loader2 } from 'lucide-react';
import { COUNTRIES } from '@/types';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'countries', label: 'Countries', icon: Globe },
  { id: 'booking', label: 'Booking', icon: Calendar },
  { id: 'integrations', label: 'Integrations', icon: MessageSquare },
  { id: 'compliance', label: 'Compliance', icon: Shield },
];

interface AdvisorProfile {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  company: string;
  bio: string;
  bookingUrl: string;
  disclaimer: string;
  privacyUrl: string;
  termsUrl: string;
  countries: string[];
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<AdvisorProfile | null>(null);
  const [activeCountries, setActiveCountries] = useState<string[]>([]);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [localProfile, setLocalProfile] = useState({
    name: '', email: '', phone: '', whatsapp: '', company: '', bio: '',
    bookingUrl: '', disclaimer: '', privacyUrl: '', termsUrl: '',
  });

  useEffect(() => {
    fetch('/api/auth/profile')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const adv = data.advisor;
        setProfile(adv);
        setActiveCountries(adv.countries ?? []);
        setLocalProfile({
          name: adv.name ?? '',
          email: adv.email ?? '',
          phone: adv.phone ?? '',
          whatsapp: adv.whatsapp ?? '',
          company: adv.company ?? '',
          bio: adv.bio ?? '',
          bookingUrl: adv.bookingUrl ?? '',
          disclaimer: adv.disclaimer ?? '',
          privacyUrl: adv.privacyUrl ?? '',
          termsUrl: adv.termsUrl ?? '',
        });
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = useCallback(async () => {
    if (!localProfile.email) return;
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...localProfile, countries: activeCountries }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }, [localProfile, activeCountries]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/login');
    router.refresh();
  };

  const toggleCountry = (code: string) => {
    setActiveCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="h-12 w-full skeleton rounded-xl" />
        <div className="h-64 w-full skeleton rounded-2xl" />
      </div>
    );
  }

  if (!profile) return null;

  const SaveButton = ({ className = '' }: { className?: string }) => (
    <button
      onClick={handleSave}
      disabled={saving}
      className={cn(
        'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all',
        saved
          ? 'bg-[var(--success)] text-white'
          : 'bg-[var(--slate-900)] text-white hover:bg-[var(--slate-800)]',
        saving && 'opacity-70 cursor-not-allowed',
        className
      )}
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
    </button>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--slate-900)]">Settings</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">Configure your advisor profile and integrations</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveButton />
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--danger)] bg-[var(--danger-bg)] hover:bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-lg transition-colors"
          >
            {logoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Logout
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-white border border-[var(--border)] rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all flex-1 justify-center',
              activeTab === tab.id
                ? 'bg-[var(--slate-900)] text-white'
                : 'text-[var(--slate-500)] hover:text-[var(--slate-700)] hover:bg-[var(--slate-50)]'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[var(--slate-800)]">Advisor Profile</h2>
            <SaveButton />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-xl font-bold">
              {localProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SM'}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--slate-700)]">Profile Photo</p>
              <p className="text-xs text-[var(--muted)]">Recommended: 400×400px, JPG or PNG</p>
              <button className="mt-1 text-xs text-[var(--gold-600)] font-semibold hover:text-[var(--gold-700)]">Upload photo</button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Sarah Mitchell' },
              { label: 'Company Name', key: 'company', type: 'text', placeholder: 'Mitchell Wealth Advisory' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'sarah@example.com' },
              { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+65 9123 4567' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  value={(localProfile as any)[f.key]}
                  onChange={e => setLocalProfile(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">WhatsApp</label>
              <input
                type="tel"
                value={localProfile.whatsapp}
                onChange={e => setLocalProfile(p => ({ ...p, whatsapp: e.target.value }))}
                placeholder="+65 9123 4567"
                className="w-full px-4 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Bio</label>
              <textarea rows={4} value={localProfile.bio}
                onChange={e => setLocalProfile(p => ({ ...p, bio: e.target.value }))}
                placeholder="Tell your leads about your expertise and approach..."
                className="w-full px-4 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)] resize-none" />
            </div>
          </div>
        </div>
      )}

      {/* Countries Tab */}
      {activeTab === 'countries' && (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[var(--slate-800)]">Supported Countries</h2>
              <p className="text-sm text-[var(--slate-500)] mt-0.5">Select which countries you want to activate for lead generation.</p>
            </div>
            <SaveButton />
          </div>
          <div className="space-y-3">
            {COUNTRIES.filter(c => c.available).map(country => (
              <div key={country.code} className="flex items-center justify-between p-4 bg-[var(--slate-50)] border border-[var(--border)] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <p className="font-semibold text-sm text-[var(--slate-700)]">{country.name}</p>
                    <p className="text-xs text-[var(--muted)]">{country.currency} · {country.locale}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCountry(country.code)}
                  className={cn(
                    'relative inline-flex items-center cursor-pointer transition-colors',
                    'w-9 h-5 rounded-full',
                    activeCountries.includes(country.code) ? 'bg-[var(--gold-500)]' : 'bg-[var(--slate-200)]'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 bg-white border border-[var(--slate-300)] rounded-full h-4 w-4 transition-transform',
                      activeCountries.includes(country.code) && 'translate-x-4'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Tab */}
      {activeTab === 'booking' && (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[var(--slate-800)] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--gold-500)]" />
              Calendar Integration
            </h2>
            <SaveButton />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Cal.com Booking URL</label>
              <input type="url" value={localProfile.bookingUrl}
                onChange={e => setLocalProfile(p => ({ ...p, bookingUrl: e.target.value }))}
                placeholder="https://cal.com/your-username"
                className="w-full px-4 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]" />
              <p className="text-xs text-[var(--muted)] mt-1">Your Cal.com link is used in nurture emails so leads can book a call</p>
            </div>
            <div className="p-4 bg-[var(--slate-50)] border border-[var(--border)] rounded-xl">
              <p className="text-xs font-semibold text-[var(--slate-600)] mb-2">Supported Integrations</p>
              <div className="flex flex-wrap gap-2">
                {['Cal.com ✓', 'Calendly', 'Google Calendar', 'HubSpot Meetings', 'Acuity'].map(int => (
                  <span key={int} className="text-xs px-2.5 py-1 bg-white border border-[var(--border)] rounded-lg text-[var(--slate-500)]">{int}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-[var(--slate-800)]">Integrations</h2>
          {[
            { name: 'WhatsApp Business', desc: 'Send automated messages to leads via Twilio', connected: !!process.env.NEXT_PUBLIC_TWILIO_WHATSAPP_FROM, icon: MessageSquare },
            { name: 'Email (Resend)', desc: 'Send personalised emails and reports', connected: !!process.env.RESEND_API_KEY, icon: MessageSquare },
            { name: 'Google Analytics', desc: 'Track website performance', connected: !!process.env.NEXT_PUBLIC_GA_ID, icon: Globe },
            { name: 'Facebook Pixel', desc: 'Track ad conversions', connected: !!process.env.NEXT_PUBLIC_FB_PIXEL_ID, icon: Globe },
          ].map(int => (
            <div key={int.name} className="flex items-center justify-between p-4 bg-[var(--slate-50)] border border-[var(--border)] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center">
                  <int.icon className="w-4 h-4 text-[var(--slate-500)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--slate-700)]">{int.name}</p>
                  <p className="text-xs text-[var(--muted)]">{int.desc}</p>
                </div>
              </div>
              <span className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-lg',
                int.connected ? 'bg-[var(--success-bg)] text-[var(--success)]' : 'bg-[var(--slate-100)] text-[var(--slate-400)]'
              )}>
                {int.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          ))}
          <p className="text-xs text-[var(--muted)] pt-2">
            Configure integrations by adding the relevant environment variables to your deployment.
          </p>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[var(--slate-800)] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--gold-500)]" />
              Compliance & Disclaimers
            </h2>
            <SaveButton />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Default Assessment Disclaimer</label>
              <textarea rows={4} value={localProfile.disclaimer}
                onChange={e => setLocalProfile(p => ({ ...p, disclaimer: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Privacy Policy URL</label>
              <input type="url" value={localProfile.privacyUrl}
                onChange={e => setLocalProfile(p => ({ ...p, privacyUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-4 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Terms of Service URL</label>
              <input type="url" value={localProfile.termsUrl}
                onChange={e => setLocalProfile(p => ({ ...p, termsUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-4 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]" />
            </div>
            <div className="p-4 bg-[var(--warning-bg)] border border-[var(--warning)]/20 rounded-xl">
              <p className="text-xs font-semibold text-[var(--warning)] mb-1">Compliance Note</p>
              <p className="text-xs text-[var(--slate-500)]">Ensure your disclaimers comply with the financial regulations of each country you operate in. Consult with a qualified legal professional.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
