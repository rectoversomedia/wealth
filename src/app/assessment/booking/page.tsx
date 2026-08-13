'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, CheckCircle, Video, Phone, MapPin, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const SLOT_DAYS = [
  { day: 'Mon', date: '15', available: true },
  { day: 'Tue', date: '16', available: true },
  { day: 'Wed', date: '17', available: false },
  { day: 'Thu', date: '18', available: true },
  { day: 'Fri', date: '19', available: true },
  { day: 'Mon', date: '22', available: true },
  { day: 'Tue', date: '23', available: false },
];
const SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

export default function BookingPage() {
  const [step, setStep] = useState<'calendar' | 'form' | 'confirm'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calUrl, setCalUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState('');

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', callType: 'video', notes: '' });

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.bookingUrl) setCalUrl(data.bookingUrl);
      })
      .catch(() => {/* not authenticated, that's ok */})
      .finally(() => setLoading(false));
  }, []);

  const handleDateSelect = (date: string, available: boolean) => {
    if (!available) return;
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: `${form.firstName} ${form.lastName}`.trim(),
          leadEmail: form.email,
          leadPhone: form.phone,
          callType: form.callType,
          preferredDate: selectedDate,
          preferredTime: selectedTime,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmationMsg(data.confirmationMessage ?? 'Your booking request has been received.');
        setConfirmed(true);
        setStep('confirm');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--gold-500)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center gap-2 mx-auto">
            <Logo />
            <span className="font-bold text-sm">Wealth Lead Engine</span>
          </Link>
          <Link href="/" className="text-xs text-[var(--muted)] hover:text-[var(--slate-700)]">← Back</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {step === 'confirm' ? (
          /* ── Confirmation ── */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[var(--success-bg)] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-[var(--success)]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--slate-900)] mb-3">You&apos;re all set!</h1>
            <p className="text-[var(--slate-500)] mb-2">{confirmationMsg || 'Your booking request has been received.'}</p>
            <p className="text-sm text-[var(--slate-400)] mb-8">
              A confirmation will be sent to <span className="font-semibold text-[var(--slate-600)]">{form.email}</span>
            </p>
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 text-left mb-6">
              <h2 className="font-bold text-[var(--slate-800)] mb-4">Booking summary</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[var(--gold-500)]" />
                  <span className="text-sm text-[var(--slate-600)]">Date: <span className="font-semibold">{selectedDate}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[var(--gold-500)]" />
                  <span className="text-sm text-[var(--slate-600)]">Time: <span className="font-semibold">{selectedTime}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  {form.callType === 'video' ? <Video className="w-4 h-4 text-[var(--gold-500)]" /> : <Phone className="w-4 h-4 text-[var(--gold-500)]" />}
                  <span className="text-sm text-[var(--slate-600)]">Type: <span className="font-semibold">{form.callType === 'video' ? 'Video Call' : 'Phone Call'}</span></span>
                </div>
              </div>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--slate-900)] text-white font-semibold text-sm rounded-xl hover:bg-[var(--slate-800)] transition-all">
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[var(--gold-100)] flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-[var(--gold-600)]" />
              </div>
              <h1 className="text-2xl font-extrabold text-[var(--slate-900)] mb-2">Book Your Free Review</h1>
              <p className="text-[var(--slate-500)]">
                A 30-minute conversation to review your Wealth Readiness Report together.
              </p>
            </div>

            {/* Cal.com embed (if configured) */}
            {calUrl && step !== 'form' && (
              <div className="bg-white border border-[var(--border)] rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[var(--gold-500)]" />
                  <h2 className="font-bold text-[var(--slate-800)]">Or book directly via calendar</h2>
                </div>
                <p className="text-xs text-[var(--muted)] mb-4">Select a time that works for you from the advisor&apos;s live calendar.</p>
                <a href={calUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--gold-500)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--gold-600)] transition-all">
                  Open Calendar <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
              {['Select time', 'Your details'].map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    i === 0 && step === 'calendar' ? 'bg-[var(--gold-500)] text-white' :
                    i === 1 && step === 'form' ? 'bg-[var(--gold-500)] text-white' :
                    'bg-[var(--slate-100)] text-[var(--muted)]'
                  )}>
                    {i + 1}
                  </div>
                  <span className={cn('text-xs font-medium hidden sm:block', i === 0 && step === 'calendar' ? 'text-[var(--slate-700)]' : 'text-[var(--muted)]')}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar slots */}
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 mb-8">
              <h2 className="font-bold text-[var(--slate-800)] mb-4">Select a day</h2>
              <div className="grid grid-cols-7 gap-2 mb-6">
                {SLOT_DAYS.map((slot, i) => (
                  <button key={i}
                    onClick={() => handleDateSelect(`${slot.day} ${slot.date}`, slot.available)}
                    disabled={!slot.available}
                    className={cn('flex flex-col items-center p-3 rounded-xl border transition-all',
                      slot.available
                        ? selectedDate === `${slot.day} ${slot.date}`
                          ? 'border-[var(--gold-500)] bg-[var(--gold-50)]'
                          : 'border-[var(--border)] hover:border-[var(--gold-400)] hover:bg-[var(--gold-50)] cursor-pointer'
                        : 'border-[var(--border)] opacity-40 cursor-not-allowed bg-[var(--slate-50)]'
                    )}>
                    <span className="text-xs text-[var(--muted)]">{slot.day}</span>
                    <span className="text-lg font-bold text-[var(--slate-700)]">{slot.date}</span>
                  </button>
                ))}
              </div>

              {selectedDate && (
                <>
                  <h3 className="font-semibold text-[var(--slate-700)] mb-3 text-sm">Available times on {selectedDate}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {SLOTS.map(slot => (
                      <button key={slot} onClick={() => handleTimeSelect(slot)}
                        className="py-2.5 px-3 text-sm font-medium text-[var(--slate-600)] bg-[var(--slate-50)] border border-[var(--border)] rounded-lg hover:border-[var(--gold-400)] hover:bg-[var(--gold-50)] transition-all">
                        {slot}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Details form */}
            {step === 'form' && selectedDate && selectedTime && (
              <div className="bg-white border border-[var(--border)] rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-[var(--gold-500)]" />
                  <p className="text-sm font-semibold text-[var(--slate-700)]">{selectedDate} at {selectedTime}</p>
                </div>
                <h2 className="font-bold text-[var(--slate-800)] mb-4">Your details</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">First Name *</label>
                      <input type="text" required value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        placeholder="Michael"
                        className="w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Last Name *</label>
                      <input type="text" required value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        placeholder="Chen"
                        className="w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Email Address *</label>
                    <input type="email" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="michael@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Phone</label>
                    <input type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+65 9123 4567"
                      className="w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Preferred call type</label>
                    <div className="flex gap-2">
                      {(['video', 'phone'] as const).map(opt => (
                        <label key={opt}
                          className={cn('flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg cursor-pointer transition-all',
                            'has-[:checked]:border-[var(--gold-500)] has-[:checked]:bg-[var(--gold-50)]',
                            'border-[var(--border)] hover:bg-[var(--slate-50)]')}>
                          <input type="radio" name="callType" value={opt}
                            checked={form.callType === opt}
                            onChange={() => setForm(f => ({ ...f, callType: opt }))}
                            className="sr-only" />
                          {opt === 'video' ? <Video className="w-4 h-4 text-[var(--slate-400)]" /> : <Phone className="w-4 h-4 text-[var(--slate-400)]" />}
                          <span className="text-sm font-medium text-[var(--slate-600)]">{opt === 'video' ? 'Video Call' : 'Phone'}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Notes (optional)</label>
                    <textarea rows={2} value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Anything you&apos;d like to cover in the call..."
                      className="w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)] resize-none" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep('calendar')}
                      className="px-5 py-3 text-sm font-semibold text-[var(--slate-600)] bg-[var(--slate-50)] border border-[var(--border)] rounded-xl hover:bg-[var(--slate-100)] transition-all">
                      ← Change time
                    </button>
                    <button type="submit" disabled={submitting || !form.firstName || !form.email}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--slate-900)] text-white font-semibold text-sm rounded-xl hover:bg-[var(--slate-800)] transition-all disabled:opacity-50">
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Confirming…</> : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* What to expect */}
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
              <h2 className="font-bold text-[var(--slate-800)] mb-4">What to expect</h2>
              <div className="space-y-3">
                {[
                  { icon: Clock, text: '30-minute video or phone call' },
                  { icon: CheckCircle, text: 'Review your personalised Wealth Readiness Report' },
                  { icon: MapPin, text: 'No sales pressure — purely educational' },
                  { icon: Video, text: 'Video call link sent on booking confirmation' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-[var(--gold-500)] flex-shrink-0" />
                    <span className="text-sm text-[var(--slate-600)]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <p className="text-center text-xs text-[var(--muted)] mt-6">
          By booking, you agree to our{' '}
          <Link href="#" className="text-[var(--gold-600)] hover:underline">Privacy Policy</Link>
          {' '}and{' '}
          <Link href="#" className="text-[var(--gold-600)] hover:underline">Terms of Service</Link>.
        </p>
      </main>
    </div>
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
