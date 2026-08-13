/**
 * In-memory session store for demo mode.
 * Replace with Supabase calls in production.
 */

import type { AssessmentAnswer, WealthScore, AiReport, OpportunityScore, CountryCode } from '@/types';
import { generateId } from '@/lib/utils';

export interface Session {
  id: string;
  country: CountryCode;
  currentStep: number;
  answers: AssessmentAnswer[];
  wealthScore?: WealthScore;
  opportunityScore?: OpportunityScore;
  aiReport?: AiReport;
  leadId?: string;
  leadEmail?: string;
  utmData: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
    referrer?: string;
    landingPage?: string;
    device?: string;
  };
  status: 'in_progress' | 'submitting' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
}

// In-memory store (persists during server runtime in dev; use Supabase in production)
const sessions = new Map<string, Session>();

export function createSession(country: CountryCode = 'global', utmData = {}): Session {
  const id = generateId();
  const session: Session = {
    id,
    country,
    currentStep: 0,
    answers: [],
    utmData: utmData as Session['utmData'],
    status: 'in_progress',
    startedAt: new Date().toISOString(),
  };
  sessions.set(id, session);
  return session;
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, updates: Partial<Session>): Session | undefined {
  const session = sessions.get(id);
  if (!session) return undefined;
  const updated = { ...session, ...updates };
  sessions.set(id, updated);
  return updated;
}

export function saveAnswer(sessionId: string, answer: AssessmentAnswer): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  const existingIndex = session.answers.findIndex(a => a.questionId === answer.questionId);
  if (existingIndex >= 0) {
    session.answers[existingIndex] = answer;
  } else {
    session.answers.push(answer);
  }
  sessions.set(sessionId, session);
}

export function setSessionScores(
  sessionId: string,
  wealthScore: WealthScore,
  opportunityScore: OpportunityScore
): void {
  const session = sessions.get(sessionId);
  if (!session) return;
  session.wealthScore = wealthScore;
  session.opportunityScore = opportunityScore;
  session.status = 'completed';
  session.completedAt = new Date().toISOString();
  sessions.set(sessionId, session);
}

export function setSessionReport(sessionId: string, report: AiReport): void {
  const session = sessions.get(sessionId);
  if (!session) return;
  session.aiReport = report;
  sessions.set(sessionId, session);
}

export function setSessionLead(sessionId: string, leadId: string, email: string): void {
  const session = sessions.get(sessionId);
  if (!session) return;
  session.leadId = leadId;
  session.leadEmail = email;
  sessions.set(sessionId, session);
}

export function getAllSessions(): Session[] {
  return Array.from(sessions.values());
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

export function seedDemoSessions(): void {
  if (sessions.size > 0) return;

  const demoLeads = [
    {
      id: generateId(),
      country: 'sg' as CountryCode,
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@gmail.com',
      phone: '+65 9123 4567',
      occupation: 'Managing Director',
      industry: 'Investment Banking',
      ageRange: '40_44',
      maritalStatus: 'married',
      dependents: '2',
      employmentStatus: 'senior_executive',
      annualIncomeRange: '500k_1m',
      investableAssetsRange: '1m_2_5m',
      hasProperty: 'yes',
      hasInvestments: 'yes',
      hasRetirementAccounts: 'partial',
      hasInsurance: 'yes',
      hasEmergencyFund: 'yes',
      hasExistingAdvisor: 'previous',
      primaryGoal: 'retirement',
      otherGoals: ['estate_planning', 'protect_family'],
      goalTimeframe: '7_15_years',
      plannedRelocation: 'none',
      majorLiquidityEvent: 'none',
      financialConfidence: '6',
      psychologicalSituation: 'second_opinion',
      utmSource: 'google',
      utmCampaign: 'SG_Retirement_Exec',
      utmMedium: 'cpc',
    },
    {
      id: generateId(),
      country: 'uae' as CountryCode,
      firstName: 'Sarah',
      lastName: 'Al-Rashid',
      email: 'sarah.alrashid@outlook.com',
      phone: '+971 50 123 4567',
      occupation: 'Medical Director',
      industry: 'Healthcare',
      ageRange: '45_49',
      maritalStatus: 'married',
      dependents: '3',
      employmentStatus: 'senior_executive',
      annualIncomeRange: '250k_500k',
      investableAssetsRange: '500k_1m',
      hasProperty: 'yes',
      hasInvestments: 'some',
      hasRetirementAccounts: 'no',
      hasInsurance: 'yes',
      hasEmergencyFund: 'partial',
      hasExistingAdvisor: 'no',
      primaryGoal: 'protect_family',
      otherGoals: ['estate_planning', 'retirement'],
      goalTimeframe: '7_15_years',
      plannedRelocation: 'considering',
      majorLiquidityEvent: 'none',
      financialConfidence: '4',
      psychologicalSituation: 'protect_family',
      utmSource: 'linkedin',
      utmCampaign: 'UAE_Expats_Protection',
      utmMedium: 'social',
    },
    {
      id: generateId(),
      country: 'id' as CountryCode,
      firstName: 'Rina',
      lastName: 'Wijaya',
      email: 'rina.wijaya@company.co.id',
      phone: '+62 812 3456 7890',
      occupation: 'Business Owner',
      industry: 'Consumer Goods',
      ageRange: '35_39',
      maritalStatus: 'married',
      dependents: '2',
      employmentStatus: 'business_owner',
      annualIncomeRange: '250k_500k',
      investableAssetsRange: '250k_500k',
      hasProperty: 'yes',
      hasInvestments: 'some',
      hasRetirementAccounts: 'no',
      hasInsurance: 'partial',
      hasEmergencyFund: 'partial',
      hasExistingAdvisor: 'no',
      primaryGoal: 'growing_wealth',
      otherGoals: ['childrens_education', 'investment_review'],
      goalTimeframe: '3_7_years',
      plannedRelocation: 'none',
      majorLiquidityEvent: 'business_sale',
      financialConfidence: '5',
      psychologicalSituation: 'earn_well_no_plan',
      utmSource: 'google',
      utmCampaign: 'ID_BusinessOwner_Growth',
      utmMedium: 'search',
    },
    {
      id: generateId(),
      country: 'sg' as CountryCode,
      firstName: 'James',
      lastName: 'Whitmore',
      email: 'j.whitmore@me.com',
      phone: '+65 9876 5432',
      occupation: 'Partner',
      industry: 'Law',
      ageRange: '50_54',
      maritalStatus: 'married',
      dependents: '2',
      employmentStatus: 'senior_executive',
      annualIncomeRange: '1m_2_5m',
      investableAssetsRange: '2_5m_plus',
      hasProperty: 'yes',
      hasInvestments: 'yes',
      hasRetirementAccounts: 'yes',
      hasInsurance: 'yes',
      hasEmergencyFund: 'yes',
      hasExistingAdvisor: 'yes',
      primaryGoal: 'estate_planning',
      otherGoals: ['retirement', 'protect_family', 'tax_efficiency'],
      goalTimeframe: 'ongoing',
      plannedRelocation: 'none',
      majorLiquidityEvent: 'inheritance',
      financialConfidence: '7',
      psychologicalSituation: 'second_opinion',
      utmSource: 'referral',
      utmCampaign: 'SG_Wealth_Estate',
      utmMedium: 'referral',
    },
    {
      id: generateId(),
      country: 'za' as CountryCode,
      firstName: 'Naledi',
      lastName: 'Mokoena',
      email: 'naledi.m@startup.co.za',
      phone: '+27 82 456 7890',
      occupation: 'Founder & CEO',
      industry: 'Technology',
      ageRange: '30_34',
      maritalStatus: 'single',
      dependents: '0',
      employmentStatus: 'entrepreneur',
      annualIncomeRange: '100k_250k',
      investableAssetsRange: '100k_250k',
      hasProperty: 'no',
      hasInvestments: 'some',
      hasRetirementAccounts: 'partial',
      hasInsurance: 'no',
      hasEmergencyFund: 'partial',
      hasExistingAdvisor: 'no',
      primaryGoal: 'growing_wealth',
      otherGoals: ['investment_review', 'financial_independence'],
      goalTimeframe: '7_15_years',
      plannedRelocation: 'none',
      majorLiquidityEvent: 'ipo',
      financialConfidence: '5',
      psychologicalSituation: 'invest_unsure_fit',
      utmSource: 'linkedin',
      utmCampaign: 'ZA_Tech_Entrepreneur',
      utmMedium: 'social',
    },
    {
      id: generateId(),
      country: 'my' as CountryCode,
      firstName: 'Wei Liang',
      lastName: 'Tan',
      email: 'wltan@gmail.com',
      phone: '+60 12 345 6789',
      occupation: 'Senior Engineer',
      industry: 'Oil & Gas',
      ageRange: '40_44',
      maritalStatus: 'married',
      dependents: '2',
      employmentStatus: 'employed_corporate',
      annualIncomeRange: '100k_250k',
      investableAssetsRange: '250k_500k',
      hasProperty: 'yes',
      hasInvestments: 'some',
      hasRetirementAccounts: 'partial',
      hasInsurance: 'partial',
      hasEmergencyFund: 'yes',
      hasExistingAdvisor: 'no',
      primaryGoal: 'retirement',
      otherGoals: ['protect_family', 'childrens_education'],
      goalTimeframe: '7_15_years',
      plannedRelocation: 'none',
      majorLiquidityEvent: 'none',
      financialConfidence: '5',
      psychologicalSituation: 'earn_well_no_plan',
      utmSource: 'google',
      utmCampaign: 'MY_Retirement_Middle',
      utmMedium: 'search',
    },
  ];

  demoLeads.forEach((lead) => {
    const session = createSession(lead.country, {
      source: lead.utmSource,
      medium: lead.utmMedium,
      campaign: lead.utmCampaign,
    });

    // Build answers array
    const answers: AssessmentAnswer[] = [
      { questionId: 'country_residence', section: 'A', value: lead.country.toUpperCase() === 'SG' ? 'Singapore' : lead.country.toUpperCase() === 'UAE' ? 'UAE' : lead.country },
      { questionId: 'age_range', section: 'A', value: lead.ageRange },
      { questionId: 'occupation', section: 'A', value: lead.occupation },
      { questionId: 'employment_status', section: 'A', value: lead.employmentStatus },
      { questionId: 'marital_status', section: 'A', value: lead.maritalStatus },
      { questionId: 'dependents', section: 'A', value: lead.dependents },
      { questionId: 'annual_income_range', section: 'B', value: lead.annualIncomeRange },
      { questionId: 'investable_assets_range', section: 'B', value: lead.investableAssetsRange },
      { questionId: 'has_property', section: 'B', value: lead.hasProperty },
      { questionId: 'has_investments', section: 'B', value: lead.hasInvestments },
      { questionId: 'has_retirement_accounts', section: 'B', value: lead.hasRetirementAccounts },
      { questionId: 'has_insurance', section: 'B', value: lead.hasInsurance },
      { questionId: 'has_emergency_fund', section: 'B', value: lead.hasEmergencyFund },
      { questionId: 'has_existing_advisor', section: 'B', value: lead.hasExistingAdvisor },
      { questionId: 'financial_goals', section: 'C', value: lead.otherGoals },
      { questionId: 'primary_goal', section: 'C', value: lead.primaryGoal },
      { questionId: 'goal_timeframe', section: 'D', value: lead.goalTimeframe },
      { questionId: 'planned_relocation', section: 'D', value: lead.plannedRelocation },
      { questionId: 'major_liquidity_event', section: 'D', value: lead.majorLiquidityEvent },
      { questionId: 'financial_confidence', section: 'D', value: lead.financialConfidence },
      { questionId: 'psychological_situation', section: 'E', value: lead.psychologicalSituation },
    ];

    sessions.set(session.id, {
      ...session,
      answers,
      status: 'completed',
      completedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  });
}
