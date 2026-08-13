/**
 * Deterministic Wealth Score Calculation Engine
 * All scores are calculated using rule-based logic — no LLM involvement.
 */

import type { AssessmentAnswer, WealthScore, DimensionScore, OpportunityScore, OpportunityTier, CountryCode } from '@/types';
import { clamp } from '@/lib/utils';

function normVal(val: unknown): string {
  if (Array.isArray(val)) return val.join(',');
  if (typeof val === 'number') return String(val);
  return (val as string) || '';
}

// ─── Scoring Constants ───────────────────────────────────────────────────────

const MAX_SCORE = 100;
const DIMENSION_WEIGHTS = {
  retirement_readiness: 0.20,
  wealth_structure: 0.18,
  family_protection: 0.15,
  liquidity_preparedness: 0.15,
  estate_planning: 0.12,
  goal_alignment: 0.12,
  financial_organization: 0.08,
};

// ─── Income Mapping ───────────────────────────────────────────────────────────

const INCOME_RANGES: Record<string, number> = {
  'under_50k': 25,
  '50k_100k': 40,
  '100k_250k': 60,
  '250k_500k': 75,
  '500k_1m': 85,
  '1m_2_5m': 92,
  '2_5m_plus': 100,
};

const ASSET_RANGES: Record<string, number> = {
  'under_50k': 20,
  '50k_100k': 35,
  '100k_250k': 55,
  '250k_500k': 70,
  '500k_1m': 80,
  '1m_2_5m': 90,
  '2_5m_plus': 100,
};

const AGE_TO_RETIREMENT_SCORE: Record<string, number> = {
  'under_30': 45,
  '30_34': 55,
  '35_39': 65,
  '40_44': 72,
  '45_49': 78,
  '50_54': 85,
  '55_plus': 90,
};

const SENIORITY_SCORES: Record<string, number> = {
  'c_suite': 100,
  'partner': 95,
  'director': 85,
  'vp': 90,
  'senior_manager': 75,
  'manager': 65,
  'professional': 60,
  'business_owner': 90,
  'entrepreneur': 85,
  'self_employed': 70,
  'other': 50,
};

// ─── Dimension Scoring Functions ─────────────────────────────────────────────

function scoreRetirementReadiness(answers: AssessmentAnswer[]): number {
  const a = (id: string) => normVal(answers.find(a => a.questionId === id)?.value);

  let score = 0;
  let factors = 0;

  // Has retirement accounts
  if (a('has_retirement_accounts') === 'yes') {
    score += 35;
  } else if (a('has_retirement_accounts') === 'partial') {
    score += 18;
  }
  factors += 35;

  // Retirement age factor
  const ageScore = AGE_TO_RETIREMENT_SCORE[a('age_range') || ''] ?? 50;
  score += (ageScore / 100) * 25;
  factors += 25;

  // Financial confidence
  const confidence = Number(a('financial_confidence')) || 5;
  score += ((confidence - 1) / 9) * 20;
  factors += 20;

  // Has investments
  if (a('has_investments') === 'yes') {
    score += 12;
  } else if (a('has_investments') === 'some') {
    score += 7;
  }
  factors += 12;

  // Retirement is a stated goal
  const goals = (a('financial_goals') || '') as string;
  if (goals.includes('retirement')) score += 8;
  factors += 8;

  return clamp(Math.round((score / factors) * 100), 0, 100);
}

function scoreWealthStructure(answers: AssessmentAnswer[]): number {
  const a = (id: string) => normVal(answers.find(a => a.questionId === id)?.value);

  let score = 0;
  let factors = 0;

  // Income range
  score += INCOME_RANGES[a('annual_income_range') || ''] ?? 40;
  factors += 100;

  // Asset range
  score += ASSET_RANGES[a('investable_assets_range') || ''] ?? 35;
  factors += 100;

  // Has investments
  if (a('has_investments') === 'yes') {
    score += 20;
  } else if (a('has_investments') === 'some') {
    score += 10;
  }
  factors += 20;

  // Has property
  if (a('has_property') === 'yes') score += 10;
  factors += 10;

  // Has existing advisor (good sign of structure)
  if (a('has_existing_advisor') === 'yes') score += 10;
  factors += 10;

  return clamp(Math.round((score / factors) * 100), 0, 100);
}

function scoreFamilyProtection(answers: AssessmentAnswer[]): number {
  const a = (id: string) => normVal(answers.find(a => a.questionId === id)?.value);

  let score = 0;
  let factors = 0;

  // Has insurance
  if (a('has_insurance') === 'yes') {
    score += 40;
  } else if (a('has_insurance') === 'partial') {
    score += 20;
  }
  factors += 40;

  // Dependents
  const dependents = Number(a('dependents')) || 0;
  if (dependents === 0) {
    score += 20; // no one to protect
  } else if (dependents <= 2) {
    score += 15;
  } else {
    score += 10;
  }
  factors += 20;

  // Family protection is a goal
  const goals = (a('financial_goals') || '') as string;
  if (goals.includes('protect_family')) score += 25;
  factors += 25;

  // Has emergency fund
  if (a('has_emergency_fund') === 'yes') score += 15;
  factors += 15;

  return clamp(Math.round((score / factors) * 100), 0, 100);
}

function scoreLiquidityPreparedness(answers: AssessmentAnswer[]): number {
  const a = (id: string) => normVal(answers.find(a => a.questionId === id)?.value);

  let score = 0;
  let factors = 0;

  // Has emergency fund
  if (a('has_emergency_fund') === 'yes') {
    score += 40;
  } else if (a('has_emergency_fund') === 'partial') {
    score += 20;
  }
  factors += 40;

  // Liquidity event awareness
  const hasLiquidity = a('major_liquidity_event') !== 'none' && a('major_liquidity_event') !== '';
  if (hasLiquidity) score += 20;
  factors += 20;

  // Asset range (proxy for liquidity cushion)
  score += ASSET_RANGES[a('investable_assets_range') || ''] ?? 30;
  factors += 100;

  // Income range
  score += INCOME_RANGES[a('annual_income_range') || ''] ?? 30;
  factors += 100;

  // Has investments (can be liquidated)
  if (a('has_investments') === 'yes') score += 10;
  factors += 10;

  return clamp(Math.round((score / factors) * 100), 0, 100);
}

function scoreEstatePlanning(answers: AssessmentAnswer[]): number {
  const a = (id: string) => normVal(answers.find(a => a.questionId === id)?.value);

  let score = 0;
  let factors = 0;

  // Has dependents — estate planning more relevant
  const dependents = Number(a('dependents')) || 0;
  if (dependents > 0) {
    score += 25;
    factors += 25;
  } else {
    score += 10;
    factors += 10;
  }

  // Estate planning is a goal
  const goals = (a('financial_goals') || '') as string;
  if (goals.includes('estate_planning')) score += 30;
  factors += 30;

  // Marital status
  const marital = a('marital_status');
  if (marital === 'married' || marital === 'partnership') score += 20;
  factors += 20;

  // Asset range (more assets = more to plan)
  const assetScore = ASSET_RANGES[a('investable_assets_range') || ''] ?? 40;
  score += (assetScore / 100) * 25;
  factors += 25;

  return clamp(Math.round((score / factors) * 100), 0, 100);
}

function scoreGoalAlignment(answers: AssessmentAnswer[]): number {
  const a = (id: string) => normVal(answers.find(a => a.questionId === id)?.value);

  let score = 0;
  let factors = 0;

  // Has clear primary goal
  const primaryGoal = a('primary_goal');
  if (primaryGoal && primaryGoal !== 'unsure') {
    score += 30;
  } else {
    score += 5;
  }
  factors += 30;

  // Has urgency identified
  const urgency = a('goal_urgency');
  if (urgency) score += 20;
  factors += 20;

  // Has timeframe
  const timeframe = a('goal_timeframe');
  if (timeframe) score += 15;
  factors += 15;

  // Number of goals identified
  const goals = (a('financial_goals') || '') as string;
  const goalCount = goals ? goals.split(',').length : 0;
  score += Math.min(goalCount * 5, 20);
  factors += 20;

  // Financial confidence
  const confidence = Number(a('financial_confidence')) || 5;
  score += ((confidence - 1) / 9) * 15;
  factors += 15;

  return clamp(Math.round((score / factors) * 100), 0, 100);
}

function scoreFinancialOrganization(answers: AssessmentAnswer[]): number {
  const a = (id: string) => normVal(answers.find(a => a.questionId === id)?.value);

  let score = 0;
  let factors = 0;

  // Has existing advisor
  if (a('has_existing_advisor') === 'yes') {
    score += 30;
  } else if (a('has_existing_advisor') === 'previous') {
    score += 15;
  }
  factors += 30;

  // Has investments
  if (a('has_investments') === 'yes') score += 25;
  factors += 25;

  // Has retirement accounts
  if (a('has_retirement_accounts') === 'yes') score += 20;
  factors += 20;

  // Has insurance
  if (a('has_insurance') === 'yes') score += 15;
  factors += 15;

  // Has property
  if (a('has_property') === 'yes') score += 10;
  factors += 10;

  return clamp(Math.round((score / factors) * 100), 0, 100);
}

// ─── Cross-Border Complexity ─────────────────────────────────────────────────

function calculateCrossBorderComplexity(answers: AssessmentAnswer[]): 'Low' | 'Moderate' | 'High' | 'Very High' {
  let score = 0;
  const a = (id: string) => normVal(answers.find(a => a.questionId === id)?.value);

  // Nationality ≠ residence
  if (a('nationality') && a('country_residence') &&
      a('nationality') !== a('country_residence')) {
    score += 2;
  }

  // Multiple countries involvement
  const plannedReloc = a('planned_relocation');
  if (plannedReloc && plannedReloc !== 'none') score += 2;

  // International business
  const employmentStatus = a('employment_status');
  if (employmentStatus === 'international_expat' || employmentStatus === 'international_corporate') {
    score += 1;
  }

  // Business ownership with international operations
  const occupation = a('occupation') || '';
  if (occupation.toLowerCase().includes('owner') ||
      occupation.toLowerCase().includes('founder') ||
      occupation.toLowerCase().includes('entrepreneur')) {
    score += 1;
  }

  // Cross-border planning as a goal
  const goals = (a('financial_goals') || '') as string;
  if (goals.includes('moving_country') || goals.includes('cross_border')) score += 2;

  // High income (proxy for more complex structure)
  const incomeScore = INCOME_RANGES[a('annual_income_range') || ''] ?? 0;
  if (incomeScore >= 75) score += 1;

  if (score >= 5) return 'Very High';
  if (score >= 3) return 'High';
  if (score >= 1) return 'Moderate';
  return 'Low';
}

// ─── Main Calculation ─────────────────────────────────────────────────────────

export function calculateWealthScore(answers: AssessmentAnswer[]): WealthScore {
  const dimensions: DimensionScore[] = [
    {
      dimension: 'retirement_readiness',
      label: 'Retirement Readiness',
      score: scoreRetirementReadiness(answers),
      maxScore: MAX_SCORE,
      percentage: scoreRetirementReadiness(answers),
      description: getDimensionDescription('retirement_readiness', scoreRetirementReadiness(answers)),
    },
    {
      dimension: 'wealth_structure',
      label: 'Wealth Structure',
      score: scoreWealthStructure(answers),
      maxScore: MAX_SCORE,
      percentage: scoreWealthStructure(answers),
      description: getDimensionDescription('wealth_structure', scoreWealthStructure(answers)),
    },
    {
      dimension: 'family_protection',
      label: 'Family Protection',
      score: scoreFamilyProtection(answers),
      maxScore: MAX_SCORE,
      percentage: scoreFamilyProtection(answers),
      description: getDimensionDescription('family_protection', scoreFamilyProtection(answers)),
    },
    {
      dimension: 'liquidity_preparedness',
      label: 'Liquidity Preparedness',
      score: scoreLiquidityPreparedness(answers),
      maxScore: MAX_SCORE,
      percentage: scoreLiquidityPreparedness(answers),
      description: getDimensionDescription('liquidity_preparedness', scoreLiquidityPreparedness(answers)),
    },
    {
      dimension: 'estate_planning',
      label: 'Estate Planning',
      score: scoreEstatePlanning(answers),
      maxScore: MAX_SCORE,
      percentage: scoreEstatePlanning(answers),
      description: getDimensionDescription('estate_planning', scoreEstatePlanning(answers)),
    },
    {
      dimension: 'goal_alignment',
      label: 'Goal Alignment',
      score: scoreGoalAlignment(answers),
      maxScore: MAX_SCORE,
      percentage: scoreGoalAlignment(answers),
      description: getDimensionDescription('goal_alignment', scoreGoalAlignment(answers)),
    },
    {
      dimension: 'financial_organization',
      label: 'Financial Organization',
      score: scoreFinancialOrganization(answers),
      maxScore: MAX_SCORE,
      percentage: scoreFinancialOrganization(answers),
      description: getDimensionDescription('financial_organization', scoreFinancialOrganization(answers)),
    },
  ];

  const overallScore = Math.round(
    dimensions.reduce((sum, d) => {
      const weight = DIMENSION_WEIGHTS[d.dimension as keyof typeof DIMENSION_WEIGHTS] ?? 0.1;
      return sum + d.score * weight;
    }, 0)
  );

  return {
    overallScore,
    overallLabel: getOverallLabel(overallScore),
    dimensions,
    crossBorderComplexity: calculateCrossBorderComplexity(answers),
    generatedAt: new Date().toISOString(),
  };
}

// ─── Label Helpers ────────────────────────────────────────────────────────────

function getDimensionDescription(dimension: string, score: number): string {
  if (score >= 80) return 'Strong foundation in this area';
  if (score >= 65) return 'Reasonable progress, with room for refinement';
  if (score >= 50) return 'Foundation is forming, deserves review';
  if (score >= 35) return 'Significant gaps identified';
  return 'Limited progress — this area may need focused attention';
}

function getOverallLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 65) return 'Developing';
  if (score >= 50) return 'Foundation Stage';
  return 'Early Stage';
}

// ─── Opportunity Score ──────────────────────────────────────────────────────

const OPPORTUNITY_WEIGHTS = {
  income: 0.18,
  assets: 0.15,
  age: 0.08,
  seniority: 0.12,
  businessOwnership: 0.08,
  retirementProximity: 0.06,
  crossBorder: 0.08,
  goalsCount: 0.05,
  urgency: 0.10,
  engagement: 0.10,
};

export function calculateOpportunityScore(
  answers: AssessmentAnswer[],
  engagementScore = 50
): OpportunityScore {
  const a = (id: string) => normVal(answers.find(a => a.questionId === id)?.value);

  const income = INCOME_RANGES[a('annual_income_range') || ''] ?? 40;
  const assets = ASSET_RANGES[a('investable_assets_range') || ''] ?? 35;

  const seniority = SENIORITY_SCORES[a('occupation')?.toLowerCase() || ''] ?? 50;

  const isBusinessOwner =
    (a('occupation') || '').toLowerCase().includes('owner') ||
    (a('occupation') || '').toLowerCase().includes('founder') ||
    (a('occupation') || '').toLowerCase().includes('entrepreneur') ||
    a('employment_status') === 'business_owner';
  const businessOwnership = isBusinessOwner ? 100 : 30;

  const ageRange = a('age_range') || '';
  const retirementProximity =
    ageRange === '50_54' || ageRange === '55_plus' ? 100 :
    ageRange === '45_49' ? 80 :
    ageRange === '40_44' ? 60 :
    ageRange === '35_39' ? 40 :
    ageRange === '30_34' ? 20 : 10;

  const crossBorder =
    calculateCrossBorderComplexity(answers) === 'Very High' ? 100 :
    calculateCrossBorderComplexity(answers) === 'High' ? 75 :
    calculateCrossBorderComplexity(answers) === 'Moderate' ? 40 : 15;

  const goals = (a('financial_goals') || '') as string;
  const goalsCount = goals ? Math.min(goals.split(',').length * 10, 50) : 10;

  const urgencyScore =
    (a('goal_urgency') === 'immediate' ? 100 :
     a('goal_urgency') === 'this_year' ? 75 :
     a('goal_urgency') === '1_3_years' ? 50 :
     a('goal_urgency') === '3_5_years' ? 25 : 10);

  const factors = {
    income,
    assets,
    age: AGE_TO_RETIREMENT_SCORE[ageRange] ?? 50,
    seniority,
    businessOwnership,
    retirementProximity,
    crossBorder,
    goalsCount,
    urgency: urgencyScore,
    engagement: engagementScore,
  };

  const rawScore = Object.entries(factors).reduce((sum, [key, value]) => {
    const weight = OPPORTUNITY_WEIGHTS[key as keyof typeof OPPORTUNITY_WEIGHTS] ?? 0;
    return sum + value * weight;
  }, 0);

  const score = clamp(Math.round(rawScore), 0, 100);

  let tier: OpportunityTier;
  if (score >= 81) tier = 'hot';
  else if (score >= 51) tier = 'warm';
  else tier = 'nurture';

  return { score, tier, factors };
}
