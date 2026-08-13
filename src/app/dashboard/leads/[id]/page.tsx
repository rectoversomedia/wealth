'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle,
  User,
  Briefcase,
  Target,
  TrendingUp,
  Globe,
  Shield,
  Star,
  FileText,
  Send,
  ArrowUpRight,
  Zap,
  Pause,
  Play,
  CheckCheck,
  ChevronDown,
} from 'lucide-react';
import type { Lead, CrmStage, LeadActivity } from '@/types';
import { cn, formatDateTime, formatRelativeTime, tierToColor, tierToBgColor, scoreToColor, CRM_STAGE_LABELS } from '@/lib/utils';
import { getLeadById, updateLeadStage, addLeadActivity } from '@/lib/services/leads-store';
import { COUNTRIES } from '@/types';

const COUNTRY_FLAGS: Record<string, string> = {
  sg: '🇸🇬', uae: '🇦🇪', id: '🇮🇩', my: '🇲🇾', za: '🇿🇦', uk: '🇬🇧',
};

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  ad_clicked: ArrowUpRight,
  assessment_started: Target,
  assessment_completed: CheckCircle,
  report_viewed: FileText,
  email_sent: Mail,
  email_opened: Mail,
  email_clicked: Mail,
  whatsapp_delivered: MessageSquare,
  whatsapp_read: MessageSquare,
  booking_page_viewed: ExternalLink,
  meeting_booked: Calendar,
  meeting_reminder_sent: Calendar,
  meeting_completed: CheckCircle,
  stage_changed: ArrowUpRight,
  note_added: FileText,
  consent_given: Shield,
  unsubscribed: ArrowLeft,
  profile_updated: User,
  lead_created: User,
};

function TimelineItem({ activity, isLast }: { activity: LeadActivity; isLast: boolean }) {
  const Icon = ACTIVITY_ICONS[activity.type] || Clock;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-[var(--slate-100)] border border-[var(--border)] flex items-center justify-center z-10">
          <Icon className="w-3.5 h-3.5 text-[var(--slate-500)]" />
        </div>
        {!isLast && <div className="w-px flex-1 bg-[var(--border)] mt-2 min-h-[24px]" />}
      </div>
      <div className="pb-6 flex-1">
        <p className="text-sm text-[var(--slate-700)]">{activity.description}</p>
        <p className="text-xs text-[var(--muted)] mt-0.5">{formatDateTime(activity.createdAt)}</p>
        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(activity.metadata).map(([k, v]) => (
              <span key={k} className="text-xs px-2 py-0.5 bg-[var(--slate-100)] text-[var(--slate-500)] rounded">
                {k}: {String(v)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DimensionScore({ label, score, description }: { label: string; score: number; description: string }) {
  const color = scoreToColor(score);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--slate-600)]">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{score}</span>
      </div>
      <div className="h-1.5 bg-[var(--slate-100)] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const found = getLeadById(id);
    if (!found) {
      router.push('/dashboard/leads');
      return;
    }
    setLead(found);
  }, [params.id, router]);

  const handleStageChange = (stage: CrmStage) => {
    if (!lead) return;
    const updated = updateLeadStage(lead.id, stage);
    if (updated) {
      addLeadActivity(lead.id, {
        type: 'stage_changed',
        description: `Moved to ${CRM_STAGE_LABELS[stage]}`,
        metadata: { from: lead.crmStage, to: stage },
      });
      setLead(updated);
    }
  };

  const handleAddNote = () => {
    if (!lead || !newNote.trim()) return;
    setAddingNote(true);
    const updated = addLeadActivity(lead.id, {
      type: 'note_added',
      description: newNote.trim(),
    });
    if (updated) setLead(updated);
    setNewNote('');
    setAddingNote(false);
  };

  if (!lead) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--gold-500)] border-t-transparent animate-spin" />
      </div>
    );
  }

  const country = COUNTRIES.find(c => c.code === lead.country);

  return (
    <div className="max-w-6xl space-y-6">
      {/* Back */}
      <Link href="/dashboard/leads" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--slate-700)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Leads
      </Link>

      {/* Header */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-xl font-bold flex-shrink-0">
              {lead.firstName[0]}{lead.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-extrabold text-[var(--slate-900)]">
                  {lead.firstName} {lead.lastName}
                </h1>
                {lead.opportunityScore && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold"
                    style={{ color: tierToColor(lead.opportunityScore.tier), backgroundColor: tierToBgColor(lead.opportunityScore.tier) }}>
                    Opp Score: {lead.opportunityScore.score}
                  </span>
                )}
              </div>
              <p className="text-[var(--slate-500)]">
                {lead.occupation || 'Professional'} {lead.industry ? `· ${lead.industry}` : ''}
                {lead.country && COUNTRY_FLAGS[lead.country] ? ` · ${COUNTRY_FLAGS[lead.country]} ${country?.name}` : ''}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {lead.email && (
                  <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 text-xs text-[var(--gold-600)] hover:text-[var(--gold-700)] font-medium transition-colors">
                    <Mail className="w-3.5 h-3.5" />{lead.email}
                  </a>
                )}
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 text-xs text-[var(--gold-600)] hover:text-[var(--gold-700)] font-medium transition-colors">
                    <Phone className="w-3.5 h-3.5" />{lead.phoneCountryCode} {lead.phone}
                  </a>
                )}
                <span className="text-xs text-[var(--muted)]">Age: {lead.ageRange}</span>
                <span className="text-xs text-[var(--muted)]">{lead.maritalStatus}</span>
                {lead.dependents != null && lead.dependents > 0 && <span className="text-xs text-[var(--muted)]">{lead.dependents} dependent{lead.dependents > 1 ? 's' : ''}</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <select
              value={lead.crmStage}
              onChange={e => handleStageChange(e.target.value as CrmStage)}
              className="px-3 py-2 text-sm font-semibold bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
            >
              {Object.entries(CRM_STAGE_LABELS).map(([stage, label]) => (
                <option key={stage} value={stage}>{label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[var(--slate-900)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--slate-800)] transition-all"
              >
                <Mail className="w-3.5 h-3.5" />Email
              </a>
              {lead.phone && (
                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[var(--success)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--success)]/90 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Advisor Brief */}
          {lead.wealthScore && (
            <div className="bg-gradient-to-br from-[var(--slate-900)] to-[var(--slate-800)] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-[var(--gold-500)] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-400)]">AI Advisor Brief</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{lead.firstName}&apos;s Profile Summary</h3>
              <p className="text-sm text-[var(--slate-300)] leading-relaxed mb-5">
                {lead.firstName} is a {lead.ageRange ? lead.ageRange.replace('-', '–').replace('_', ' ') : 'professional'} {lead.occupation?.toLowerCase()} {lead.industry ? `in ${lead.industry}` : ''} based in {country?.name || lead.country}. Their strongest financial foundation appears to be in{' '}
                {lead.wealthScore.dimensions.filter(d => d.percentage >= 70).sort((a, b) => b.percentage - a.percentage)[0]?.label || 'their overall structure'}.
                {lead.primaryGoal && ` Their key concern is ${lead.primaryGoal.toLowerCase()}.`}
                {lead.wealthScore.crossBorderComplexity !== 'Low' && ` Their ${lead.wealthScore.crossBorderComplexity.toLowerCase()} cross-border complexity adds planning considerations.`}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--slate-400)]">Suggested Conversation Topics</h4>
                {[
                  lead.primaryGoal ? `${lead.primaryGoal} timeline and structure` : 'Financial goal prioritization',
                  lead.wealthScore.crossBorderComplexity !== 'Low' ? `Cross-border financial coordination (${lead.wealthScore.crossBorderComplexity})` : 'Investment portfolio alignment',
                  lead.wealthScore.dimensions.filter(d => d.percentage < 70).sort((a, b) => a.percentage - b.percentage)[0]?.label || 'Estate planning review',
                ].map((topic, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--slate-300)]">{topic}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold-400)] mb-2">Suggested Opening</h4>
                <p className="text-sm text-[var(--slate-200)] italic">
                  &ldquo;{lead.primaryGoal
                    ? `You mentioned ${lead.primaryGoal.toLowerCase()} as your biggest priority. Which aspect feels less clear to you today — the timeline, the structure, or knowing where to start?`
                    : `You completed our assessment recently. What stood out to you most from your report?`
                  }&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Wealth Score Breakdown */}
          {lead.wealthScore && (
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[var(--slate-800)] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--gold-500)]" />
                  Wealth Readiness
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold" style={{ color: scoreToColor(lead.wealthScore.overallScore) }}>
                    {lead.wealthScore.overallScore}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-[var(--slate-500)]">/100</div>
                    <div className="text-xs text-[var(--muted)]">{lead.wealthScore.overallLabel}</div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {lead.wealthScore.dimensions.map(dim => (
                  <DimensionScore key={dim.dimension} label={dim.label} score={dim.percentage} description={dim.description} />
                ))}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
                <Globe className="w-4 h-4 text-[var(--muted)]" />
                <span className="text-xs text-[var(--muted)]">Cross-Border Complexity:</span>
                <span className="text-xs font-bold" style={{
                  color: lead.wealthScore.crossBorderComplexity === 'Very High' ? 'var(--danger)' :
                         lead.wealthScore.crossBorderComplexity === 'High' ? 'var(--warning)' : 'var(--muted)'
                }}>
                  {lead.wealthScore.crossBorderComplexity}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h3 className="font-bold text-[var(--slate-800)] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--gold-500)]" />
              Profile
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Country', value: lead.country ? `${COUNTRY_FLAGS[lead.country]} ${country?.name}` : '—' },
                { label: 'Nationality', value: lead.nationality || '—' },
                { label: 'Age', value: lead.ageRange || '—' },
                { label: 'Marital Status', value: lead.maritalStatus || '—' },
                { label: 'Dependents', value: lead.dependents ? String(lead.dependents) : 'None' },
                { label: 'Employment', value: lead.employmentStatus || '—' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">{row.label}</span>
                  <span className="font-medium text-[var(--slate-700)]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Context */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h3 className="font-bold text-[var(--slate-800)] mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[var(--gold-500)]" />
              Financial Context
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Income', value: lead.annualIncomeRange || '—' },
                { label: 'Assets', value: lead.investableAssetsRange || '—' },
                { label: 'Investments', value: lead.hasInvestments ? 'Yes' : 'No' },
                { label: 'Retirement', value: lead.hasRetirementAccounts ? 'Yes' : 'No' },
                { label: 'Insurance', value: lead.hasInsurance ? 'Yes' : 'No' },
                { label: 'Emergency Fund', value: lead.hasEmergencyFund ? 'Yes' : 'Partial' },
                { label: 'Property', value: lead.hasProperty ? 'Yes' : 'No' },
                { label: 'Existing Advisor', value: lead.hasExistingAdvisor ? 'Yes' : 'No' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">{row.label}</span>
                  <span className={cn('font-medium', row.value === 'Yes' ? 'text-[var(--success)]' : row.value === 'No' ? 'text-[var(--slate-500)]' : 'text-[var(--slate-700)]')}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h3 className="font-bold text-[var(--slate-800)] mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--gold-500)]" />
              Goals
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--muted)] mb-1">Primary Goal</p>
                <p className="text-sm font-semibold text-[var(--slate-700)]">{lead.primaryGoal || '—'}</p>
                {lead.goalUrgency && <p className="text-xs text-[var(--warning)] font-medium">Urgency: {lead.goalUrgency}</p>}
              </div>
              {lead.otherGoals && lead.otherGoals.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--muted)] mb-1">Other Goals</p>
                  <div className="space-y-1">
                    {lead.otherGoals.map(g => (
                      <p key={g} className="text-xs text-[var(--slate-500)]">{g}</p>
                    ))}
                  </div>
                </div>
              )}
              {lead.psychologicalProfile && (
                <div>
                  <p className="text-xs text-[var(--muted)] mb-1">Financial Perspective</p>
                  <p className="text-xs text-[var(--slate-600)]">{lead.psychologicalProfile}</p>
                </div>
              )}
              {lead.psychologicalWorry && (
                <div className="p-3 bg-[var(--warning-bg)] rounded-lg">
                  <p className="text-xs text-[var(--muted)] mb-0.5">Their biggest worry:</p>
                  <p className="text-xs text-[var(--slate-700)]">{lead.psychologicalWorry}</p>
                </div>
              )}
            </div>
          </div>

          {/* Attribution */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h3 className="font-bold text-[var(--slate-800)] mb-4 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[var(--gold-500)]" />
              Attribution
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Source', value: lead.source },
                { label: 'Medium', value: lead.medium },
                { label: 'Campaign', value: lead.campaign },
                { label: 'Landing Page', value: lead.landingPage },
              ].map(row => row.value && (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">{row.label}</span>
                  <span className="font-medium text-[var(--slate-600)] capitalize">{row.value}</span>
                </div>
              ))}
              <p className="text-xs text-[var(--muted)] pt-1">
                Created {formatDateTime(lead.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <h3 className="font-bold text-[var(--slate-800)] mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--gold-500)]" />
          Activity Timeline
        </h3>

        {/* Add note */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a note or follow-up action…"
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddNote()}
            className="flex-1 px-3 py-2 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim() || addingNote}
            className="px-4 py-2 bg-[var(--slate-900)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--slate-800)] transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {lead.activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-[var(--slate-300)] mx-auto mb-2" />
            <p className="text-sm text-[var(--muted)]">No activity recorded yet.</p>
          </div>
        ) : (
          <div>
            {lead.activities.map((activity, i) => (
              <TimelineItem key={activity.id} activity={activity} isLast={i === lead.activities.length - 1} />
            ))}
          </div>
        )}
      </div>

      {/* Nurture Sequence Panel */}
      <NurtureSequencePanel leadId={lead.id} leadEmail={lead.email} leadFirstName={lead.firstName} />
    </div>
  );
}

// ─── Nurture Sequence Panel ────────────────────────────────────────────────

interface NurtureSequencePanelProps {
  leadId: string;
  leadEmail: string;
  leadFirstName: string;
}

function NurtureSequencePanel({ leadId, leadEmail, leadFirstName }: NurtureSequencePanelProps) {
  const [sequence, setSequence] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchSequence = async () => {
    try {
      const res = await fetch(`/api/nurture?leadId=${leadId}`);
      if (res.ok) {
        const data = await res.json();
        setSequence(data.sequence);
      }
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSequence(); }, [leadId]);

  const handleAction = async (action: string) => {
    setProcessing(true);
    try {
      if (action === 'process') {
        await fetch('/api/nurture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'process' }),
        });
      } else {
        await fetch('/api/nurture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, leadId }),
        });
      }
      await fetchSequence();
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="h-5 w-40 skeleton rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!sequence) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[var(--gold-500)]" />
          <h3 className="text-base font-bold text-[var(--slate-800)]">Nurture Sequence</h3>
        </div>
        <p className="text-sm text-[var(--muted)] mb-4">
          No active sequence yet. Sequence starts when lead submits their email.
        </p>
        <button
          onClick={() => handleAction('process')}
          disabled={processing}
          className="text-xs px-3 py-1.5 bg-[var(--slate-100)] text-[var(--slate-600)] rounded-lg font-medium hover:bg-[var(--slate-200)] transition-colors disabled:opacity-50"
        >
          {processing ? 'Processing…' : 'Run nurture engine'}
        </button>
      </div>
    );
  }

  const tierColors = {
    hot: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    warm: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' },
    nurture: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500', dot: 'bg-slate-400' },
  };
  const tc = tierColors[sequence.tier as keyof typeof tierColors] || tierColors.nurture;

  const nextStepAt = sequence.nextStepAt ? new Date(sequence.nextStepAt) : null;
  const nextStepRelative = nextStepAt
    ? (nextStepAt.getTime() > Date.now()
        ? `in ${Math.ceil((nextStepAt.getTime() - Date.now()) / 86400000)} days`
        : 'due now')
    : 'completed';

  const progress = sequence.sentSteps?.length ?? 0;

  return (
    <div className={cn('card border p-6', tc.border)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', tc.bg)}>
            <Zap className={cn('w-4 h-4', tc.text)} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--slate-800)]">Nurture Sequence</h3>
            <p className="text-xs text-[var(--muted)]">{sequence.sequenceName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', tc.bg, tc.text)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', tc.dot)} />
            {sequence.tier.charAt(0).toUpperCase() + sequence.tier.slice(1)}
          </span>
          {sequence.status === 'completed' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">
              <CheckCheck className="w-3 h-3" /> Done
            </span>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[var(--slate-50)] rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-[var(--slate-800)]">{progress}</p>
          <p className="text-xs text-[var(--muted)]">Steps sent</p>
        </div>
        <div className="bg-[var(--slate-50)] rounded-lg p-3 text-center">
          <p className={cn('text-lg font-bold', nextStepAt && nextStepAt.getTime() > Date.now() ? 'text-[var(--slate-500)]' : 'text-amber-600')}>
            {nextStepRelative}
          </p>
          <p className="text-xs text-[var(--muted)]">Next step</p>
        </div>
        <div className="bg-[var(--slate-50)] rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-[var(--slate-800)]">{sequence.currentDay}d</p>
          <p className="text-xs text-[var(--muted)]">Day in sequence</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2 bg-[var(--slate-100)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--gold-500)] rounded-full transition-all"
            style={{ width: `${Math.min((progress / 8) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-[var(--muted)] mt-1">
          {sequence.status === 'completed'
            ? 'Sequence complete'
            : `Started ${new Date(sequence.startedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
        </p>
      </div>

      {/* Steps list */}
      <div className="border-t border-[var(--border)] pt-4">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--slate-500)] hover:text-[var(--slate-700)] mb-3"
        >
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', expanded && 'rotate-180')} />
          {expanded ? 'Hide' : 'Show'} sequence steps
        </button>

        {expanded && (
          <div className="space-y-2">
            {sequence.sentSteps?.map((step: any, i: number) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--slate-700)]">{step.headline}</p>
                  <p className="text-[10px] text-[var(--muted)]">
                    Day {step.day} · {step.channel} · {new Date(step.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
            {(!sequence.sentSteps || sequence.sentSteps.length === 0) && (
              <p className="text-xs text-[var(--muted)] italic">No steps sent yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 border-t border-[var(--border)] pt-4">
        {sequence.status === 'active' && (
          <button
            onClick={() => handleAction('pause')}
            disabled={processing}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[var(--slate-100)] text-[var(--slate-600)] rounded-lg font-medium hover:bg-[var(--slate-200)] transition-colors disabled:opacity-50"
          >
            <Pause className="w-3.5 h-3.5" /> Pause
          </button>
        )}
        {sequence.status === 'paused' && (
          <button
            onClick={() => handleAction('resume')}
            disabled={processing}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" /> Resume
          </button>
        )}
        <button
          onClick={() => handleAction('convert')}
          disabled={processing || sequence.status === 'converted'}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[var(--gold-50)] text-[var(--gold-700)] rounded-lg font-medium hover:bg-[var(--gold-100)] transition-colors disabled:opacity-50 border border-[var(--gold-200)]"
        >
          <CheckCheck className="w-3.5 h-3.5" /> Mark Converted
        </button>
        <button
          onClick={() => handleAction('process')}
          disabled={processing}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[var(--slate-900)] text-white rounded-lg font-medium hover:bg-[var(--slate-800)] transition-colors disabled:opacity-50 ml-auto"
        >
          {processing ? '…' : <Zap className="w-3.5 h-3.5" />} Run now
        </button>
      </div>
    </div>
  );
}
