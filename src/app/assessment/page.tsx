'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '@/lib/assessment/questions';
import type { AssessmentAnswer, CountryCode } from '@/types';
import { cn, generateId } from '@/lib/utils';

// ─── Progress Bar ───────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>Question {current + 1} of {total}</span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-1 bg-[var(--slate-200)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--gold-500)] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Question Types ───────────────────────────────────────────────────────────

function SingleChoiceQuestion({
  question,
  options,
  value,
  onChange,
}: {
  question: { id: string; question: string; subtitle?: string };
  options: { value: string; label: string; description?: string }[];
  value?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">{question.question}</h2>
        {question.subtitle && (
          <p className="text-[var(--slate-500)] text-base">{question.subtitle}</p>
        )}
      </div>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'w-full text-left px-5 py-4 rounded-xl border-2 transition-all',
              value === opt.value
                ? 'border-[var(--gold-500)] bg-[var(--gold-50)] shadow-sm'
                : 'border-[var(--border)] bg-white hover:border-[var(--slate-300)] hover:bg-[var(--slate-50)]'
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className={cn(
                  'font-semibold text-sm',
                  value === opt.value ? 'text-[var(--gold-700)]' : 'text-[var(--slate-700)]'
                )}>
                  {opt.label}
                </span>
                {opt.description && (
                  <p className="text-xs text-[var(--muted)] mt-0.5">{opt.description}</p>
                )}
              </div>
              <div className={cn(
                'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                value === opt.value
                  ? 'border-[var(--gold-500)] bg-[var(--gold-500)]'
                  : 'border-[var(--slate-300)]'
              )}>
                {value === opt.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiChoiceQuestion({
  question,
  options,
  value,
  onChange,
}: {
  question: { id: string; question: string; subtitle?: string };
  options: { value: string; label: string }[];
  value?: string[];
  onChange: (val: string[]) => void;
}) {
  const selected = value || [];
  const toggle = (v: string) => {
    if (selected.includes(v)) {
      onChange(selected.filter(x => x !== v));
    } else {
      onChange([...selected, v]);
    }
  };
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">{question.question}</h2>
          <span className="text-xs font-semibold px-2 py-1 bg-[var(--slate-100)] text-[var(--slate-500)] rounded-md whitespace-nowrap mt-2">
            Select all
          </span>
        </div>
        {question.subtitle && (
          <p className="text-[var(--slate-500)] text-base">{question.subtitle}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={cn(
                'w-full text-left px-5 py-4 rounded-xl border-2 transition-all',
                isSelected
                  ? 'border-[var(--gold-500)] bg-[var(--gold-50)]'
                  : 'border-[var(--border)] bg-white hover:border-[var(--slate-300)] hover:bg-[var(--slate-50)]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  isSelected ? 'border-[var(--gold-500)] bg-[var(--gold-500)]' : 'border-[var(--slate-300)]'
                )}>
                  {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={cn(
                  'text-sm font-semibold',
                  isSelected ? 'text-[var(--gold-700)]' : 'text-[var(--slate-700)]'
                )}>
                  {opt.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScaleQuestion({
  question,
  value,
  onChange,
}: {
  question: { id: string; question: string; subtitle?: string; scaleLabels?: { min: string; max: string } };
  value?: number;
  onChange: (val: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value ?? 0;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">{question.question}</h2>
        {question.subtitle && (
          <p className="text-[var(--slate-500)] text-base">{question.subtitle}</p>
        )}
      </div>
      <div className="bg-[var(--slate-50)] border border-[var(--border)] rounded-xl p-8">
        <div className="flex justify-between text-xs text-[var(--muted)] mb-6">
          <span className="font-medium">{question.scaleLabels?.min}</span>
          <span className="font-medium">{question.scaleLabels?.max}</span>
        </div>
        <div className="flex justify-between gap-1">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
            const isActive = displayValue >= n;
            const isSelected = value === n;
            return (
              <button
                key={n}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onChange(n)}
                className={cn(
                  'flex-1 h-12 rounded-lg font-bold text-sm transition-all',
                  isActive
                    ? isSelected
                      ? 'bg-[var(--gold-500)] text-white shadow-sm'
                      : 'bg-[var(--gold-100)] text-[var(--gold-700)] hover:bg-[var(--gold-200)]'
                    : 'bg-[var(--slate-200)] text-[var(--slate-400)] hover:bg-[var(--slate-300)]'
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
        {value && (
          <div className="mt-4 text-center">
            <span className="text-2xl font-extrabold text-[var(--gold-600)]">{value}</span>
            <span className="text-[var(--slate-400)] text-sm ml-2">/ 10</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TextQuestion({
  question,
  value,
  onChange,
}: {
  question: { id: string; question: string; subtitle?: string; placeholder?: string };
  value?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">{question.question}</h2>
        {question.subtitle && (
          <p className="text-[var(--slate-500)] text-base">{question.subtitle}</p>
        )}
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full px-5 py-4 text-base bg-white border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--gold-400)] focus:ring-0 transition-colors placeholder:text-[var(--slate-400)]"
      />
      <p className="text-xs text-[var(--muted)]">Optional — you can skip this question if you prefer.</p>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, description, section, current, total }: {
  title: string;
  description?: string;
  section: string;
  current: number;
  total: number;
}) {
  return (
    <div className="mb-8 pb-8 border-b border-[var(--border)]">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-500)]">
          Section {section}
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      {description && <p className="text-[var(--slate-500)] mt-2">{description}</p>}
    </div>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

const GENERATION_STEPS = [
  'Reviewing your financial foundation',
  'Evaluating long-term goals',
  'Assessing protection needs',
  'Analysing international complexity',
  'Scoring your wealth dimensions',
  'Preparing your personalized report',
];

function LoadingScreen({ progress }: { progress: number }) {
  const stepIndex = Math.min(Math.floor((progress / 100) * GENERATION_STEPS.length), GENERATION_STEPS.length - 1);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--background)]">
      <div className="text-center max-w-md">
        {/* Animated logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[var(--gold-500)] flex items-center justify-center animate-pulse-glow">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="16" cy="14" r="3" fill="white" />
                <path d="M16 17V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Analysing your financial profile…</h2>
        <p className="text-[var(--slate-500)] mb-10">
          Your Wealth Readiness Report is being generated based on your answers.
        </p>

        {/* Progress */}
        <div className="mb-6">
          <div className="h-1.5 bg-[var(--slate-200)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--gold-500)] rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm font-semibold text-[var(--gold-600)] mt-3">{progress}%</p>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-left">
          {GENERATION_STEPS.map((step, i) => {
            const isDone = i < stepIndex;
            const isActive = i === stepIndex;
            return (
              <div key={step} className="flex items-center gap-3">
                <div className={cn(
                  'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all',
                  isDone ? 'bg-[var(--success)]' : isActive ? 'bg-[var(--gold-500)] animate-spin' : 'bg-[var(--slate-200)]'
                )}>
                  {isDone && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className={cn(
                  'text-sm transition-all',
                  isDone ? 'text-[var(--success)] font-medium' : isActive ? 'text-[var(--slate-700)] font-semibold' : 'text-[var(--slate-400)]'
                )}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-[var(--muted)] mt-16">
        This usually takes 10–20 seconds. Please don&apos;t close this page.
      </p>
    </div>
  );
}

// ─── Main Assessment Component ────────────────────────────────────────────────

export default function AssessmentPage() {
  const router = useRouter();
  const [sessionId] = useState(() => generateId());
  const [country, setCountry] = useState<CountryCode>('global');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AssessmentAnswer>>({});
  const [phase, setPhase] = useState<'intro' | 'assessment' | 'loading' | 'done'>('intro');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [animating, setAnimating] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Capture UTM params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || undefined;
    const utmMedium = params.get('utm_medium') || undefined;
    const utmCampaign = params.get('utm_campaign') || undefined;
    const countryParam = params.get('country') as CountryCode | null;
    if (countryParam) setCountry(countryParam);

    // Store UTM in sessionStorage for later use
    if (utmSource || utmCampaign) {
      sessionStorage.setItem('utm_data', JSON.stringify({
        source: utmSource,
        medium: utmMedium,
        campaign: utmCampaign,
        landingPage: window.location.pathname,
        referrer: document.referrer,
      }));
    }
  }, []);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQuestion = ASSESSMENT_QUESTIONS[currentQIndex];
  const currentAnswer = answers[currentQIndex];

  const handleAnswer = useCallback((value: string | string[] | number) => {
    const answer: AssessmentAnswer = {
      questionId: currentQuestion.id,
      section: currentQuestion.section,
      value,
      label: typeof value === 'string' ? currentQuestion.options?.find(o => o.value === value)?.label : undefined,
    };
    setAnswers(prev => ({ ...prev, [currentQIndex]: answer }));
  }, [currentQIndex, currentQuestion]);

  const goNext = useCallback(() => {
    if (animating) return;
    if (currentQIndex >= totalQuestions - 1) {
      handleSubmit();
      return;
    }
    setDirection('forward');
    setAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      setCurrentQIndex(i => i + 1);
      setShowContent(true);
      setTimeout(() => setAnimating(false), 300);
    }, 200);
    // Scroll to top of container
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentQIndex, totalQuestions, animating]);

  const goBack = useCallback(() => {
    if (currentQIndex === 0) return;
    if (animating) return;
    setDirection('backward');
    setAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      setCurrentQIndex(i => i - 1);
      setShowContent(true);
      setTimeout(() => setAnimating(false), 300);
    }, 200);
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentQIndex, animating]);

  const handleSubmit = useCallback(async () => {
    setPhase('loading');
    setLoadingProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setLoadingProgress(p => {
        if (p >= 95) { clearInterval(interval); return p; }
        return p + Math.random() * 8 + 2;
      });
    }, 300);

    try {
      const allAnswers = Object.values(answers);
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          country,
          answers: allAnswers,
          utmData: JSON.parse(sessionStorage.getItem('utm_data') || '{}'),
        }),
      });

      clearInterval(interval);
      setLoadingProgress(100);

      const data = await res.json();
      if (!res.ok) {
        clearInterval(interval);
        setPhase('assessment');
        alert('Something went wrong. Please try again.');
        return;
      }
      // Store result in sessionStorage to avoid URL length limits
      sessionStorage.setItem('assessment_result', JSON.stringify(data));
      setTimeout(() => {
        setPhase('done');
        router.push(`/results/${sessionId}`);
      }, 600);
    } catch {
      clearInterval(interval);
      // Fallback: redirect to results page with stored answers
      router.push(`/results/${sessionId}`);
    }
  }, [answers, sessionId, country, router]);

  // Keyboard navigation
  useEffect(() => {
    if (phase !== 'assessment') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && currentAnswer) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, currentAnswer, goNext]);

  if (phase === 'loading') {
    return <LoadingScreen progress={Math.round(loadingProgress)} />;
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col" ref={containerRef}>
        <header className="border-b border-[var(--border)] py-4 px-6">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Logo />
            <span className="font-bold text-sm">Wealth Lead Engine</span>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold-50)] border border-[var(--gold-200)] text-[var(--gold-700)] text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-500)]" />
              100% Free · No obligation · No account needed
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              How financially ready are you?
            </h1>
            <p className="text-lg text-[var(--slate-500)] leading-relaxed mb-8">
              Answer a few questions about your financial situation, and we&apos;ll generate a personalized Wealth Readiness Report — complete with AI-powered insights specific to your profile.
            </p>
            <button
              onClick={() => setPhase('assessment')}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[var(--slate-900)] text-white text-base font-semibold rounded-xl hover:bg-[var(--slate-800)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Begin Assessment
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-5 mt-6 text-xs text-[var(--muted)]">
              <span>No account required</span>
              <span>•</span>
              <span>Results in 2 minutes</span>
              <span>•</span>
              <span>Educational assessment only</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = currentQuestion.section;
  const isFirstInSection = currentQIndex === 0 ||
    ASSESSMENT_QUESTIONS[currentQIndex - 1].section !== currentSection;

  const canProceed = currentAnswer && (
    currentQuestion.type === 'multiple'
      ? (Array.isArray(currentAnswer.value) && currentAnswer.value.length > 0)
      : true
  );

  return (
    <div className="min-h-screen flex flex-col" ref={containerRef}>
      {/* Header */}
      <header className="border-b border-[var(--border)] py-4 px-6 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-bold text-sm text-[var(--slate-600])">Wealth Lead Engine</span>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
                  router.push('/');
                }
              }}
              className="text-xs text-[var(--muted)] hover:text-[var(--slate-700)] transition-colors"
            >
              Exit
            </button>
          </div>
          {/* Section dots */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {(['A', 'B', 'C', 'D', 'E'] as const).map((section) => {
              const sectionIndex = ['A', 'B', 'C', 'D', 'E'].indexOf(section);
              const isCompleted = currentQuestion.section > section;
              const isCurrent = currentQuestion.section === section;
              return (
                <div
                  key={section}
                  className={cn(
                    'flex items-center gap-1',
                    isCompleted && 'text-[var(--gold-500)]',
                    isCurrent && 'text-[var(--gold-600)]',
                    !isCompleted && !isCurrent && 'text-[var(--slate-300)]'
                  )}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    isCompleted && 'bg-[var(--gold-500)]',
                    isCurrent && 'bg-[var(--gold-600)] ring-2 ring-[var(--gold-200)]',
                    !isCompleted && !isCurrent && 'bg-[var(--slate-200)]'
                  )} />
                </div>
              );
            })}
          </div>
          <ProgressBar current={currentQIndex} total={totalQuestions} />
        </div>
      </header>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {showContent && (
            <div className={cn(
              'transition-all duration-300',
              direction === 'forward'
                ? 'animate-fade-in'
                : 'animate-fade-in'
            )}>
              {isFirstInSection && (
                <SectionHeader
                  section={currentQuestion.section}
                  title={currentQuestion.sectionTitle ?? ''}
                  description={currentQuestion.sectionDescription}
                  current={currentQIndex}
                  total={totalQuestions}
                />
              )}

              {currentQuestion.type === 'single' && (
                <SingleChoiceQuestion
                  question={currentQuestion}
                  options={currentQuestion.options || []}
                  value={currentAnswer?.value as string | undefined}
                  onChange={(v) => { handleAnswer(v); }}
                />
              )}

              {currentQuestion.type === 'select' && (
                <SingleChoiceQuestion
                  question={currentQuestion}
                  options={currentQuestion.options || []}
                  value={currentAnswer?.value as string | undefined}
                  onChange={(v) => { handleAnswer(v); }}
                />
              )}

              {currentQuestion.type === 'multiple' && (
                <MultiChoiceQuestion
                  question={currentQuestion}
                  options={currentQuestion.options || []}
                  value={currentAnswer?.value as string[] | undefined}
                  onChange={(v) => { handleAnswer(v); }}
                />
              )}

              {currentQuestion.type === 'scale' && (
                <ScaleQuestion
                  question={currentQuestion}
                  value={currentAnswer?.value as number | undefined}
                  onChange={(v) => { handleAnswer(v); }}
                />
              )}

              {currentQuestion.type === 'text' && (
                <TextQuestion
                  question={currentQuestion}
                  value={currentAnswer?.value as string | undefined}
                  onChange={(v) => { handleAnswer(v); }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-[var(--border)] bg-white px-6 py-5 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={currentQIndex === 0}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all',
              currentQIndex === 0
                ? 'border-[var(--border)] text-[var(--muted)] cursor-not-allowed opacity-50'
                : 'border-[var(--border)] text-[var(--slate-600)] hover:bg-[var(--slate-50)] hover:border-[var(--slate-300)]'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-xs text-[var(--muted)]">
            {currentQIndex === totalQuestions - 1 ? (
              <span className="font-medium text-[var(--gold-600)]">Last question — submit to see your report</span>
            ) : (
              <span>Press Enter ↵ to continue</span>
            )}
          </div>

          <button
            onClick={goNext}
            disabled={!canProceed}
            className={cn(
              'inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all',
              !canProceed
                ? 'bg-[var(--slate-100)] text-[var(--slate-400)] cursor-not-allowed'
                : 'bg-[var(--slate-900)] text-white hover:bg-[var(--slate-800)] shadow-sm hover:shadow-md'
            )}
          >
            {currentQIndex === totalQuestions - 1 ? 'See My Results' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
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
