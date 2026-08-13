'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, GripVertical } from 'lucide-react';
import type { Lead, CrmStage } from '@/types';
import { cn, CRM_STAGE_LABELS, CRM_STAGE_ORDER, tierToColor, tierToBgColor } from '@/lib/utils';
import { getAllLeads, updateLeadStage } from '@/lib/services/leads-store';

const STAGE_COLORS: Record<string, string> = {
  new: 'var(--slate-400)',
  assessment_completed: 'var(--slate-500)',
  qualified: 'var(--warning)',
  contacted: 'var(--gold-500)',
  meeting_booked: 'var(--gold-600)',
  meeting_completed: 'var(--success)',
  follow_up: 'var(--success)',
  client: '#16a34a',
  not_qualified: 'var(--slate-400)',
  lost: 'var(--danger)',
};

function LeadCard({ lead, onStageChange }: { lead: Lead; onStageChange: (id: string, stage: CrmStage) => void }) {
  return (
    <div className="group bg-white border border-[var(--border)] rounded-lg p-3 hover:border-[var(--slate-300)] hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <Link href={`/dashboard/leads/${lead.id}`} className="text-xs font-semibold text-[var(--slate-700)] hover:text-[var(--gold-600)] truncate transition-colors">
            {lead.firstName} {lead.lastName}
          </Link>
        </div>
        {lead.opportunityScore && (
          <span className="text-[10px] font-bold flex-shrink-0" style={{ color: tierToColor(lead.opportunityScore.tier) }}>
            {lead.opportunityScore.score}
          </span>
        )}
      </div>

      {lead.primaryGoal && (
        <p className="text-[10px] text-[var(--muted)] truncate mb-2">{lead.primaryGoal}</p>
      )}

      <div className="flex items-center justify-between">
        {lead.wealthScore && (
          <span className="text-[10px] font-medium" style={{ color: `hsl(${lead.wealthScore.overallScore * 1.2}, 70%, 40%)` }}>
            Wealth {lead.wealthScore.overallScore}
          </span>
        )}
        <span className="text-[10px] text-[var(--muted)]">{lead.country?.toUpperCase()}</span>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [leads, setLeads] = useState(getAllLeads());
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [, setRenderKey] = useState(0);

  const leadsByStage = CRM_STAGE_ORDER.reduce((acc, stage) => {
    acc[stage] = leads.filter(l => l.crmStage === stage);
    return acc;
  }, {} as Record<CrmStage, Lead[]>);

  const handleDrop = (stage: CrmStage) => {
    if (draggedLead) {
      updateLeadStage(draggedLead.id, stage);
      setLeads(getAllLeads());
      setRenderKey(k => k + 1);
      setDraggedLead(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--slate-900)]">Pipeline</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{leads.length} leads across {CRM_STAGE_ORDER.length} stages</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {CRM_STAGE_ORDER.map(stage => {
            const stageLeads = leadsByStage[stage] || [];
            const color = STAGE_COLORS[stage] || 'var(--slate-400)';
            return (
              <div
                key={stage}
                className="w-72 flex-shrink-0"
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(stage)}
              >
                <div className="sticky top-0 bg-[var(--background)] z-10 pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs font-bold text-[var(--slate-600)]">{CRM_STAGE_LABELS[stage]}</span>
                    <span className="text-xs font-bold text-[var(--muted)] ml-auto">{stageLeads.length}</span>
                  </div>
                  <div className="h-0.5 rounded-full" style={{ backgroundColor: color, opacity: 0.3 }} />
                </div>

                <div className="space-y-2">
                  {stageLeads.length === 0 ? (
                    <div className="h-24 border-2 border-dashed border-[var(--border)] rounded-lg flex items-center justify-center">
                      <span className="text-xs text-[var(--muted)]">Drop lead here</span>
                    </div>
                  ) : (
                    stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => setDraggedLead(lead)}
                        onDragEnd={() => setDraggedLead(null)}
                        className={cn(
                          'cursor-grab active:cursor-grabbing',
                          draggedLead?.id === lead.id && 'opacity-50'
                        )}
                      >
                        <LeadCard lead={lead} onStageChange={() => {}} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[var(--slate-50)] border border-[var(--border)] rounded-xl p-4">
        <p className="text-xs text-[var(--muted)]">
          <strong className="text-[var(--slate-600)]">Tip:</strong> Drag and drop leads between stages to update their status. Click any lead card to view full details.
        </p>
      </div>
    </div>
  );
}
