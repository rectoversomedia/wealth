'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, ExternalLink, ToggleRight, ToggleLeft, X, Loader2, ChevronDown } from 'lucide-react';
import { COUNTRIES } from '@/types';
import { cn } from '@/lib/utils';

interface Campaign {
  id: string;
  name: string;
  country: string;
  audience: string;
  coreConcern: string;
  landingUrl: string;
  channels: string[];
  status: 'active' | 'paused' | 'draft';
  leads: number;
  qualified: number;
  meetings: number;
  clients: number;
  spend: number;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--success)',
  paused: 'var(--warning)',
  draft: 'var(--slate-400)',
};

const CHANNELS = ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'Google', 'WhatsApp', 'Email', 'Referral'];
const AUDIENCE_OPTIONS = [
  'Expat professionals, 35–55', 'High-net-worth individuals, 40–60',
  'Young professionals, 25–35', 'Female business owners, 30–50',
  'Business owners, 35–55', 'Retirees, 55–70',
];
const CONCERN_OPTIONS = [
  'Retirement readiness', 'Cross-border estate planning', 'Investment diversification',
  'Emergency fund building', 'Business succession', 'Family protection', 'Debt management',
];

const EMPTY_FORM = {
  name: '', country: 'sg', audience: '', coreConcern: '',
  landingUrl: '/sg', channels: [] as string[], status: 'draft' as Campaign['status'],
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [dropOpen, setDropOpen] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns ?? []);
      }
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const filtered = filter === 'all' ? campaigns : campaigns.filter(c => c.status === filter);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (c: Campaign) => {
    setForm({
      name: c.name, country: c.country, audience: c.audience,
      coreConcern: c.coreConcern, landingUrl: c.landingUrl,
      channels: c.channels, status: c.status,
    });
    setEditingId(c.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.country) return;
    setSaving(true);
    try {
      if (editingId) {
        await fetch('/api/campaigns', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form }),
        });
      } else {
        await fetch('/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      await fetchCampaigns();
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
      await fetchCampaigns();
    } finally {
      setDeletingId(null);
    }
  };

  const toggleChannel = (ch: string) => {
    setForm(f => ({
      ...f,
      channels: f.channels.includes(ch)
        ? f.channels.filter(c => c !== ch)
        : [...f.channels, ch],
    }));
  };

  const updateField = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value, landingUrl: key === 'country' ? `/${value}` : f.landingUrl }));
  };

  const Input = ({ label, keyName, placeholder, required = false }: { label: string; keyName: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">{label}{required && ' *'}</label>
      <input type="text" value={(form as any)[keyName]} required={required}
        onChange={e => updateField(keyName, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]" />
    </div>
  );

  const Dropdown = ({ label, keyName, options }: { label: string; keyName: string; options: string[] }) => (
    <div>
      <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">{label}</label>
      <div className="relative">
        <button type="button" onClick={() => setDropOpen(dropOpen === keyName ? null : keyName)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--gold-400)]">
          <span className={cn('truncate', (form as any)[keyName] ? 'text-[var(--slate-700)]' : 'text-[var(--slate-400)]')}>
            {(form as any)[keyName] || `Select ${label}`}
          </span>
          <ChevronDown className={cn('w-4 h-4 text-[var(--muted)] flex-shrink-0 ml-2', dropOpen === keyName && 'rotate-180')} />
        </button>
        {dropOpen === keyName && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
            {options.map(opt => (
              <button key={opt} type="button" onClick={() => { updateField(keyName, opt); setDropOpen(null); }}
                className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-[var(--slate-50)] transition-colors">
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-6xl space-y-6">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-64 skeleton rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--slate-900)]">Campaigns</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--slate-900)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--slate-800)] transition-all">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {['all', 'active', 'paused', 'draft'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-all capitalize',
              filter === f ? 'bg-[var(--slate-900)] text-white' : 'bg-white border border-[var(--border)] text-[var(--slate-500)] hover:bg-[var(--slate-50)]'
            )}>
            {f}
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(campaign => {
          const country = COUNTRIES.find(c => c.code === campaign.country);
          return (
            <div key={campaign.id} className="bg-white border border-[var(--border)] rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {country && <span className="text-lg">{country.flag}</span>}
                    <h3 className="font-bold text-[var(--slate-800)] truncate">{campaign.name}</h3>
                  </div>
                  <p className="text-xs text-[var(--muted)]">{campaign.audience || '—'} · {campaign.coreConcern || '—'}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md flex-shrink-0"
                  style={{ color: STATUS_COLORS[campaign.status], backgroundColor: `${STATUS_COLORS[campaign.status]}15` }}>
                  {campaign.status === 'active' ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  {campaign.status}
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 bg-[var(--slate-50)] rounded-lg mb-4">
                <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)] flex-shrink-0" />
                <span className="text-xs text-[var(--slate-500)] truncate">{campaign.landingUrl}</span>
              </div>

              <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                {campaign.channels.map(ch => (
                  <span key={ch} className="text-xs px-2 py-0.5 bg-[var(--slate-100)] text-[var(--slate-500)] rounded capitalize">
                    {ch}
                  </span>
                ))}
                {campaign.channels.length === 0 && <span className="text-xs text-[var(--muted)] italic">No channels</span>}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'Leads', value: campaign.leads },
                  { label: 'Qualified', value: campaign.qualified },
                  { label: 'Meetings', value: campaign.meetings },
                  { label: 'Clients', value: campaign.clients },
                ].map(m => (
                  <div key={m.label} className="text-center p-2 bg-[var(--slate-50)] rounded-lg">
                    <p className="text-lg font-extrabold text-[var(--slate-900)]">{m.value}</p>
                    <p className="text-[10px] text-[var(--muted)]">{m.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                <button onClick={() => openEdit(campaign)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[var(--slate-50)] text-[var(--slate-600)] text-xs font-semibold rounded-lg hover:bg-[var(--slate-100)] transition-all">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(campaign.id)} disabled={deletingId === campaign.id}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[var(--slate-50)] text-[var(--danger)] text-xs font-semibold rounded-lg hover:bg-[var(--danger-bg)] transition-all disabled:opacity-50">
                  {deletingId === campaign.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white border border-[var(--border)] rounded-2xl">
          <p className="text-[var(--muted)]">No campaigns match your filter. <button onClick={openCreate} className="text-[var(--gold-600)] font-semibold">Create one</button></p>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold text-[var(--slate-800)]">{editingId ? 'Edit Campaign' : 'New Campaign'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[var(--muted)] hover:text-[var(--slate-700)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Campaign Name" keyName="name" placeholder="e.g. SG Expats — Retirement Q4" required />
              <div className="grid grid-cols-2 gap-4">
                <Dropdown label="Country" keyName="country" options={COUNTRIES.filter(c => c.available).map(c => c.code)} />
                <div>
                  <label className="block text-xs font-semibold text-[var(--slate-600)] mb-1.5">Status</label>
                  <div className="flex gap-2">
                    {(['active', 'paused', 'draft'] as const).map(s => (
                      <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                        className={cn('flex-1 py-2 text-xs font-semibold rounded-lg border transition-all capitalize',
                          form.status === s ? 'bg-[var(--slate-900)] text-white border-[var(--slate-900)]' : 'border-[var(--border)] text-[var(--slate-500)] hover:bg-[var(--slate-50)]')}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Dropdown label="Target Audience" keyName="audience" options={AUDIENCE_OPTIONS} />
              <Dropdown label="Core Concern" keyName="coreConcern" options={CONCERN_OPTIONS} />
              <div>
                <label className="block text-xs font-semibold text-[var(--slate-600)] mb-2">Channels</label>
                <div className="flex flex-wrap gap-2">
                  {CHANNELS.map(ch => (
                    <button key={ch} type="button" onClick={() => toggleChannel(ch)}
                      className={cn('text-xs px-3 py-1.5 rounded-full border font-medium transition-all capitalize',
                        form.channels.includes(ch)
                          ? 'bg-[var(--slate-900)] text-white border-[var(--slate-900)]'
                          : 'border-[var(--border)] text-[var(--slate-500)] hover:bg-[var(--slate-50)]')}>
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-[var(--border)]">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-[var(--slate-600)] bg-[var(--slate-50)] rounded-lg hover:bg-[var(--slate-100)] transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.name}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[var(--slate-900)] rounded-lg hover:bg-[var(--slate-800)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update Campaign' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
