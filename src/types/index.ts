// ─── Core Domain Types ──────────────────────────────────────────────────────

export type CountryCode = 'sg' | 'uae' | 'id' | 'my' | 'za' | 'uk' | 'global';

export interface Country {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  heroHeadline: string;
  heroSubtext: string;
  heroCTA: string;
  disclaimer: string;
  available: boolean;
  locale: string;
}

// ─── Assessment Types ─────────────────────────────────────────────────────────

export interface AssessmentAnswer {
  questionId: string;
  section: string;
  value: string | string[] | number;
  label?: string;
}

export interface AssessmentSession {
  id: string;
  country?: CountryCode;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingPage?: string;
  device?: string;
  startedAt: string;
  completedAt?: string;
  answers: AssessmentAnswer[];
  currentStep: number;
  totalSteps: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

// ─── Wealth Score Types ─────────────────────────────────────────────────────

export interface DimensionScore {
  dimension: string;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
  description: string;
}

export interface WealthScore {
  overallScore: number;
  overallLabel: string;
  dimensions: DimensionScore[];
  crossBorderComplexity: 'Low' | 'Moderate' | 'High' | 'Very High';
  generatedAt: string;
}

// ─── Opportunity Score Types ─────────────────────────────────────────────────

export type OpportunityTier = 'hot' | 'warm' | 'nurture';

export interface OpportunityScore {
  score: number;
  tier: OpportunityTier;
  factors: {
    income: number;
    assets: number;
    age: number;
    seniority: number;
    businessOwnership: number;
    retirementProximity: number;
    crossBorder: number;
    goalsCount: number;
    urgency: number;
    engagement: number;
  };
}

// ─── Lead Types ─────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneCountryCode?: string;
  preferredContact: 'email' | 'whatsapp' | 'phone' | 'either';
  country: CountryCode;
  nationality?: string;
  ageRange?: string;
  occupation?: string;
  industry?: string;
  maritalStatus?: string;
  dependents?: number;
  employmentStatus?: string;
  annualIncomeRange?: string;
  investableAssetsRange?: string;
  hasProperty: boolean;
  hasInvestments: boolean;
  hasRetirementAccounts: boolean;
  hasInsurance: boolean;
  hasEmergencyFund: boolean;
  hasExistingAdvisor: boolean;
  primaryGoal?: string;
  otherGoals?: string[];
  goalUrgency?: string;
  retirementAge?: number;
  goalTimeframe?: string;
  plannedRelocation?: string;
  majorLiquidityEvent?: string;
  financialConfidence?: number;
  psychologicalProfile?: string;
  psychologicalWorry?: string;
  assessmentSessionId?: string;
  wealthScore?: WealthScore;
  opportunityScore?: OpportunityScore;
  crmStage: CrmStage;
  assignedAdvisorId?: string;
  bookingUrl?: string;
  bookedAt?: string;
  meetingDate?: string;
  meetingNotes?: string;
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPage?: string;
  utmData?: Record<string, string>;
  consents: ConsentRecord[];
  activities: LeadActivity[];
  createdAt: string;
  updatedAt: string;
}

export type CrmStage =
  | 'new'
  | 'assessment_completed'
  | 'qualified'
  | 'contacted'
  | 'meeting_booked'
  | 'meeting_completed'
  | 'follow_up'
  | 'client'
  | 'not_qualified'
  | 'lost';

export const CRM_STAGE_LABELS: Record<CrmStage, string> = {
  new: 'New',
  assessment_completed: 'Assessment Completed',
  qualified: 'Qualified',
  contacted: 'Contacted',
  meeting_booked: 'Meeting Booked',
  meeting_completed: 'Meeting Completed',
  follow_up: 'Follow-Up',
  client: 'Client',
  not_qualified: 'Not Qualified',
  lost: 'Lost',
};

export const CRM_STAGE_ORDER: CrmStage[] = [
  'new',
  'assessment_completed',
  'qualified',
  'contacted',
  'meeting_booked',
  'meeting_completed',
  'follow_up',
  'client',
  'not_qualified',
  'lost',
];

// ─── Activity Types ─────────────────────────────────────────────────────────

export type ActivityType =
  | 'ad_clicked'
  | 'assessment_started'
  | 'assessment_completed'
  | 'report_viewed'
  | 'email_sent'
  | 'email_opened'
  | 'email_clicked'
  | 'whatsapp_delivered'
  | 'whatsapp_read'
  | 'booking_page_viewed'
  | 'meeting_booked'
  | 'meeting_reminder_sent'
  | 'meeting_completed'
  | 'stage_changed'
  | 'note_added'
  | 'consent_given'
  | 'unsubscribed'
  | 'profile_updated'
  | 'lead_created';

export interface LeadActivity {
  id: string;
  leadId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
}

// ─── Consent Types ───────────────────────────────────────────────────────────

export interface ConsentRecord {
  type: 'marketing' | 'assessment' | 'whatsapp' | 'data_processing';
  granted: boolean;
  timestamp: string;
  source?: string;
}

// ─── Advisor Types ──────────────────────────────────────────────────────────

export interface Advisor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  company?: string;
  bio?: string;
  profileImageUrl?: string;
  bookingUrl?: string;
  supportedCountries: CountryCode[];
  createdAt: string;
  updatedAt: string;
}

// ─── AI Report Types ────────────────────────────────────────────────────────

export interface AiReport {
  id: string;
  leadId?: string;
  sessionId: string;
  executiveSummary: string;
  strongAreas: string[];
  areasForReview: string[];
  topPriorities: { priority: number; topic: string; explanation: string }[];
  suggestedQuestions: string[];
  advisorTalkingPoints: string[];
  educationalInsights: { dimension: string; insight: string }[];
  nextSteps: string[];
  generatedAt: string;
  model?: string;
  tokens?: number;
}

// ─── Scoring Configuration ──────────────────────────────────────────────────

export interface ScoringWeights {
  dimensionWeights: Record<string, number>;
  opportunityWeights: {
    income: number;
    assets: number;
    age: number;
    seniority: number;
    businessOwnership: number;
    retirementProximity: number;
    crossBorder: number;
    goalsCount: number;
    urgency: number;
    engagement: number;
  };
}

// ─── Dashboard Analytics Types ───────────────────────────────────────────────

export interface FunnelMetrics {
  visitors: number;
  assessmentStarts: number;
  assessmentCompletions: number;
  qualifiedLeads: number;
  meetingsBooked: number;
  meetingsCompleted: number;
  clientsWon: number;
}

export interface SourceMetrics {
  source: string;
  visitors: number;
  leads: number;
  qualified: number;
  meetings: number;
  clients: number;
  conversionRate: number;
}

export interface CountryMetrics {
  country: CountryCode;
  name: string;
  visitors: number;
  assessmentStarts: number;
  completions: number;
  qualified: number;
  meetings: number;
  clients: number;
  completionRate: number;
}

// ─── Content Studio Types ────────────────────────────────────────────────────

export interface ContentAsset {
  id: string;
  title: string;
  country: CountryCode;
  audience: string;
  persona: string;
  theme: string;
  format: ContentFormat;
  content: string;
  cta?: string;
  status: 'draft' | 'approved' | 'published';
  campaignId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContentFormat =
  | 'linkedin_long'
  | 'linkedin_short'
  | 'carousel'
  | 'reels'
  | 'youtube_short'
  | 'email'
  | 'ad_variation'
  | 'blog_outline';

// ─── Campaign Types ─────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  name: string;
  country: CountryCode;
  audience: string;
  coreConcern: string;
  landingPage: string;
  primaryCTA: string;
  channels: string[];
  status: 'draft' | 'active' | 'paused' | 'ended';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Nurture Types ───────────────────────────────────────────────────────────

export interface NurtureSequence {
  id: string;
  name: string;
  trigger: 'immediate' | 'stage_change' | 'time_based';
  stages?: CrmStage[];
  steps: NurtureStep[];
  isActive: boolean;
  createdAt: string;
}

export interface NurtureStep {
  day: number;
  channel: 'email' | 'whatsapp';
  template: string;
  condition?: 'no_meeting' | 'no_response' | 'always';
}

// ─── Country Configuration ───────────────────────────────────────────────────

export const COUNTRIES: Country[] = [
  {
    code: 'sg',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    heroHeadline: 'You\'ve built your career in Singapore. Is your retirement plan ready for what comes next?',
    heroSubtext: 'Understand how prepared your financial structure is for the next chapter of your life in under 5 minutes.',
    heroCTA: 'Check Your Wealth Score',
    disclaimer: 'This assessment is for educational purposes only and does not constitute financial advice. Results are based on information you provide.',
    available: true,
    locale: 'en-SG',
  },
  {
    code: 'uae',
    name: 'UAE',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED ',
    heroHeadline: 'Building wealth in the UAE? Understand how ready your financial structure is for your long-term goals.',
    heroSubtext: 'Get a personalized view of your financial readiness across retirement, protection, investments, and international complexity.',
    heroCTA: 'Discover My Wealth Score',
    disclaimer: 'This assessment is for educational and informational purposes only. It does not constitute regulated financial advice.',
    available: true,
    locale: 'en-AE',
  },
  {
    code: 'id',
    name: 'Indonesia',
    flag: '🇮🇩',
    currency: 'IDR',
    currencySymbol: 'Rp',
    heroHeadline: 'Bisnis Anda bertumbuh. Apakah kekayaan pribadi Anda sudah terstruktur dengan baik?',
    heroSubtext: 'Ketahui kesiapan finansial Anda untuk tujuan jangka panjang dalam waktu 5 menit.',
    heroCTA: 'Cek Skor Kekayaan Saya',
    disclaimer: 'Penilaian ini bersifat edukatif dan informatif, bukan nasihat keuangan yang diatur oleh regulator.',
    available: true,
    locale: 'id-ID',
  },
  {
    code: 'my',
    name: 'Malaysia',
    flag: '🇲🇾',
    currency: 'MYR',
    currencySymbol: 'RM',
    heroHeadline: 'You\'ve worked hard to build your wealth. Is it structured for what\'s next?',
    heroSubtext: 'Discover your financial readiness across retirement, protection, investments, and long-term planning.',
    heroCTA: 'Check My Wealth Score',
    disclaimer: 'This assessment is for general educational purposes only.',
    available: true,
    locale: 'en-MY',
  },
  {
    code: 'za',
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    currencySymbol: 'R',
    heroHeadline: 'You\'ve built your wealth. Is your financial plan ready for the next chapter?',
    heroSubtext: 'Understand your financial readiness across retirement, investments, estate planning, and cross-border complexity.',
    heroCTA: 'Check Your Wealth Score',
    disclaimer: 'This assessment is educational and informational in nature and does not constitute financial advice.',
    available: true,
    locale: 'en-ZA',
  },
  {
    code: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    heroHeadline: 'Planning your financial future? See how ready your wealth structure is for what\'s ahead.',
    heroSubtext: 'Understand your readiness across retirement, investments, estate planning, and financial complexity in under 5 minutes.',
    heroCTA: 'Discover Your Wealth Score',
    disclaimer: 'This assessment is for general educational and informational purposes only and does not constitute regulated financial advice.',
    available: true,
    locale: 'en-GB',
  },
];

// ─── UI State Types ─────────────────────────────────────────────────────────

export interface AssessmentUIState {
  sessionId: string;
  currentStep: number;
  totalSteps: number;
  answers: Record<string, AssessmentAnswer>;
  isSubmitting: boolean;
  isGenerating: boolean;
  generationProgress: number;
  generationStep: string;
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
