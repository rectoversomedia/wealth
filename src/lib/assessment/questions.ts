export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface Question {
  id: string;
  section: 'A' | 'B' | 'C' | 'D' | 'E';
  sectionTitle?: string;
  sectionDescription?: string;
  type: 'single' | 'multiple' | 'scale' | 'text' | 'select';
  question: string;
  subtitle?: string;
  placeholder?: string;
  options?: QuestionOption[];
  scaleLabels?: { min: string; max: string };
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
  conditionalOn?: {
    questionId: string;
    value: string | string[];
  };
  saveKey: string;
}

export const ASSESSMENT_QUESTIONS: Question[] = [
  // ─── Section A: About You ────────────────────────────────────────
  {
    id: 'country_residence',
    section: 'A',
    sectionTitle: 'About You',
    type: 'select',
    question: 'Where do you currently live?',
    subtitle: 'This helps us personalize the assessment to your local context.',
    options: [
      { value: 'Singapore', label: 'Singapore' },
      { value: 'UAE', label: 'United Arab Emirates' },
      { value: 'Indonesia', label: 'Indonesia' },
      { value: 'Malaysia', label: 'Malaysia' },
      { value: 'South Africa', label: 'South Africa' },
      { value: 'United Kingdom', label: 'United Kingdom' },
      { value: 'Other', label: 'Other' },
    ],
    saveKey: 'country_residence',
    validation: { required: true },
  },
  {
    id: 'nationality',
    section: 'A',
    type: 'select',
    question: 'What is your nationality?',
    subtitle: 'Your nationality can affect tax residency and cross-border planning.',
    options: [
      { value: 'Singaporean', label: 'Singaporean' },
      { value: 'British', label: 'British' },
      { value: 'Indonesian', label: 'Indonesian' },
      { value: 'Malaysian', label: 'Malaysian' },
      { value: 'South African', label: 'South African' },
      { value: 'American', label: 'American' },
      { value: 'Australian', label: 'Australian' },
      { value: 'Indian', label: 'Indian' },
      { value: 'Chinese', label: 'Chinese' },
      { value: 'UAE National', label: 'UAE National' },
      { value: 'Other', label: 'Other' },
    ],
    saveKey: 'nationality',
  },
  {
    id: 'age_range',
    section: 'A',
    type: 'select',
    question: 'What is your age range?',
    subtitle: 'Financial priorities often shift across different life stages.',
    options: [
      { value: 'under_30', label: 'Under 30' },
      { value: '30_34', label: '30 – 34' },
      { value: '35_39', label: '35 – 39' },
      { value: '40_44', label: '40 – 44' },
      { value: '45_49', label: '45 – 49' },
      { value: '50_54', label: '50 – 54' },
      { value: '55_plus', label: '55 or older' },
    ],
    saveKey: 'age_range',
    validation: { required: true },
  },
  {
    id: 'marital_status',
    section: 'A',
    type: 'select',
    question: 'What is your marital status?',
    options: [
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married' },
      { value: 'partnership', label: 'Long-term partnership' },
      { value: 'divorced', label: 'Divorced' },
      { value: 'widowed', label: 'Widowed' },
    ],
    saveKey: 'marital_status',
  },
  {
    id: 'dependents',
    section: 'A',
    type: 'select',
    question: 'How many dependents do you have?',
    subtitle: 'Include children or other family members who rely on your income.',
    options: [
      { value: '0', label: 'None' },
      { value: '1', label: '1 person' },
      { value: '2', label: '2 people' },
      { value: '3', label: '3 people' },
      { value: '4_plus', label: '4 or more' },
    ],
    saveKey: 'dependents',
  },
  {
    id: 'occupation',
    section: 'A',
    type: 'text',
    question: 'What is your current role or profession?',
    placeholder: 'e.g. Managing Director, Senior Engineer, Business Owner…',
    saveKey: 'occupation',
  },
  {
    id: 'employment_status',
    section: 'A',
    type: 'select',
    question: 'How would you describe your employment status?',
    options: [
      { value: 'employed_corporate', label: 'Corporate employee' },
      { value: 'senior_executive', label: 'Senior executive / C-suite' },
      { value: 'business_owner', label: 'Business owner' },
      { value: 'entrepreneur', label: 'Entrepreneur / Founder' },
      { value: 'self_employed', label: 'Self-employed / Freelance' },
      { value: 'professional_practice', label: 'Professional practice (Doctor, Lawyer, etc.)' },
      { value: 'international_expat', label: 'International expat' },
      { value: 'retired', label: 'Retired' },
      { value: 'other', label: 'Other' },
    ],
    saveKey: 'employment_status',
  },

  // ─── Section B: Financial Position ──────────────────────────────
  {
    id: 'annual_income_range',
    section: 'B',
    sectionTitle: 'Your Financial Position',
    type: 'select',
    question: 'What is your approximate annual household income?',
    subtitle: 'We use ranges to keep this assessment quick and private.',
    options: [
      { value: 'under_50k', label: 'Under $50,000', description: 'USD equivalent' },
      { value: '50k_100k', label: '$50,000 – $100,000', description: 'USD equivalent' },
      { value: '100k_250k', label: '$100,000 – $250,000', description: 'USD equivalent' },
      { value: '250k_500k', label: '$250,000 – $500,000', description: 'USD equivalent' },
      { value: '500k_1m', label: '$500,000 – $1,000,000', description: 'USD equivalent' },
      { value: '1m_2_5m', label: '$1,000,000 – $2,500,000', description: 'USD equivalent' },
      { value: '2_5m_plus', label: '$2,500,000 or more', description: 'USD equivalent' },
    ],
    saveKey: 'annual_income_range',
    validation: { required: true },
  },
  {
    id: 'investable_assets_range',
    section: 'B',
    type: 'select',
    question: 'What is the approximate value of your investable financial assets?',
    subtitle: 'Include savings, investments, and retirement accounts. Exclude property.',
    options: [
      { value: 'under_50k', label: 'Under $50,000' },
      { value: '50k_100k', label: '$50,000 – $100,000' },
      { value: '100k_250k', label: '$100,000 – $250,000' },
      { value: '250k_500k', label: '$250,000 – $500,000' },
      { value: '500k_1m', label: '$500,000 – $1,000,000' },
      { value: '1m_2_5m', label: '$1,000,000 – $2,500,000' },
      { value: '2_5m_plus', label: '$2,500,000 or more' },
    ],
    saveKey: 'investable_assets_range',
    validation: { required: true },
  },
  {
    id: 'has_property',
    section: 'B',
    type: 'select',
    question: 'Do you own property?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'purchasing', label: 'Currently purchasing' },
    ],
    saveKey: 'has_property',
  },
  {
    id: 'has_investments',
    section: 'B',
    type: 'select',
    question: 'Do you currently have investments beyond savings accounts?',
    options: [
      { value: 'yes', label: 'Yes, diversified portfolio' },
      { value: 'some', label: 'Some, but limited' },
      { value: 'no', label: 'No' },
      { value: 'not_sure', label: 'Not sure' },
    ],
    saveKey: 'has_investments',
  },
  {
    id: 'has_retirement_accounts',
    section: 'B',
    type: 'select',
    question: 'Do you have retirement accounts or pension arrangements?',
    options: [
      { value: 'yes', label: 'Yes, well-established' },
      { value: 'partial', label: 'Some, but not consolidated' },
      { value: 'no', label: 'No' },
      { value: 'not_sure', label: 'Not sure' },
    ],
    saveKey: 'has_retirement_accounts',
  },
  {
    id: 'has_insurance',
    section: 'B',
    type: 'select',
    question: 'Do you have personal insurance coverage?',
    subtitle: 'Life, health, or critical illness coverage.',
    options: [
      { value: 'yes', label: 'Yes, comprehensive' },
      { value: 'partial', label: 'Some coverage' },
      { value: 'no', label: 'No' },
    ],
    saveKey: 'has_insurance',
  },
  {
    id: 'has_emergency_fund',
    section: 'B',
    type: 'select',
    question: 'Do you have an emergency fund set aside?',
    subtitle: 'Readily accessible savings for 3–6 months of expenses.',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'partial', label: 'Partially' },
      { value: 'no', label: 'No' },
    ],
    saveKey: 'has_emergency_fund',
  },
  {
    id: 'has_existing_advisor',
    section: 'B',
    type: 'select',
    question: 'Do you currently work with a financial advisor?',
    options: [
      { value: 'yes', label: 'Yes, regularly' },
      { value: 'previous', label: 'Had one previously' },
      { value: 'no', label: 'No, managing myself' },
    ],
    saveKey: 'has_existing_advisor',
  },

  // ─── Section C: Financial Goals ────────────────────────────────
  {
    id: 'financial_goals',
    section: 'C',
    sectionTitle: 'Your Financial Goals',
    type: 'multiple',
    question: 'What matters most to you financially right now?',
    subtitle: 'Select all that apply.',
    options: [
      { value: 'retirement', label: 'Retirement planning' },
      { value: 'growing_wealth', label: 'Growing and building wealth' },
      { value: 'protect_family', label: 'Protecting my family' },
      { value: 'childrens_education', label: 'Children\'s education' },
      { value: 'investment_review', label: 'Reviewing my investments' },
      { value: 'moving_country', label: 'Moving to another country' },
      { value: 'tax_efficiency', label: 'Tax efficiency' },
      { value: 'estate_planning', label: 'Estate planning' },
      { value: 'business_succession', label: 'Business succession' },
      { value: 'financial_independence', label: 'Financial independence' },
      { value: 'unsure', label: 'Unsure / need clarity' },
    ],
    saveKey: 'financial_goals',
    validation: { required: true },
  },
  {
    id: 'primary_goal',
    section: 'C',
    type: 'select',
    question: 'Which feels most urgent right now?',
    subtitle: 'If you had to pick just one.',
    options: [
      { value: 'retirement', label: 'Retirement planning' },
      { value: 'growing_wealth', label: 'Building and growing wealth' },
      { value: 'protect_family', label: 'Protecting my family' },
      { value: 'childrens_education', label: 'Children\'s education funding' },
      { value: 'investment_review', label: 'Investment review and structure' },
      { value: 'moving_country', label: 'Relocating and cross-border planning' },
      { value: 'tax_efficiency', label: 'Tax efficiency' },
      { value: 'estate_planning', label: 'Estate and legacy planning' },
      { value: 'business_succession', label: 'Business succession' },
      { value: 'financial_independence', label: 'Achieving financial independence' },
      { value: 'unsure', label: 'I\'m not sure yet' },
    ],
    saveKey: 'primary_goal',
    validation: { required: true },
  },

  // ─── Section D: Timeline ────────────────────────────────────────
  {
    id: 'goal_timeframe',
    section: 'D',
    sectionTitle: 'Your Timeline',
    type: 'select',
    question: 'What is your primary financial timeframe?',
    subtitle: 'When do you most want to achieve your main goal?',
    options: [
      { value: '1_3_years', label: '1 – 3 years' },
      { value: '3_7_years', label: '3 – 7 years' },
      { value: '7_15_years', label: '7 – 15 years' },
      { value: '15_plus_years', label: '15 years or more' },
      { value: 'ongoing', label: 'This is an ongoing priority' },
    ],
    saveKey: 'goal_timeframe',
  },
  {
    id: 'planned_relocation',
    section: 'D',
    type: 'select',
    question: 'Do you plan to relocate to another country?',
    options: [
      { value: 'none', label: 'No plans to relocate' },
      { value: 'considering', label: 'Considering it' },
      { value: 'active_plans', label: 'Actively planning to relocate' },
      { value: 'recently_relocated', label: 'Recently relocated' },
    ],
    saveKey: 'planned_relocation',
  },
  {
    id: 'major_liquidity_event',
    section: 'D',
    type: 'select',
    question: 'Do you expect any major liquidity events in the next 5–10 years?',
    subtitle: 'Business sale, inheritance, IPO, etc.',
    options: [
      { value: 'none', label: 'None that I\'m aware of' },
      { value: 'business_sale', label: 'Business sale or exit' },
      { value: 'inheritance', label: 'Expected inheritance' },
      { value: 'property_sale', label: 'Property sale' },
      { value: 'ipo', label: 'Equity event / IPO' },
      { value: 'other', label: 'Other' },
    ],
    saveKey: 'major_liquidity_event',
  },
  {
    id: 'financial_confidence',
    section: 'D',
    type: 'scale',
    question: 'How confident are you in your current financial plan?',
    subtitle: '1 = No plan at all · 10 = Fully confident',
    scaleLabels: { min: 'No plan', max: 'Fully confident' },
    saveKey: 'financial_confidence',
    validation: { required: true, min: 1, max: 10 },
  },

  // ─── Section E: Psychological ───────────────────────────────────
  {
    id: 'psychological_situation',
    section: 'E',
    sectionTitle: 'Your Financial Perspective',
    type: 'select',
    question: 'Which statement feels closest to your situation?',
    options: [
      { value: 'earn_well_no_plan', label: 'I earn well but don\'t have a clear long-term plan' },
      { value: 'invest_unsure_fit', label: 'I invest but I\'m unsure whether everything fits together' },
      { value: 'moved_countries', label: 'My finances became more complicated after moving countries' },
      { value: 'protect_family', label: 'I want to protect my family better than I currently do' },
      { value: 'approaching_retirement', label: 'I\'m approaching retirement and want clarity' },
      { value: 'second_opinion', label: 'I already have a plan but want a second perspective' },
      { value: 'just_starting', label: 'I\'m just starting to think seriously about my finances' },
    ],
    saveKey: 'psychological_situation',
  },
  {
    id: 'psychological_worry',
    section: 'E',
    type: 'text',
    question: 'What worries you most about your financial future?',
    subtitle: 'Optional — but the more you share, the more useful your report.',
    placeholder: 'e.g. "I\'m worried I won\'t have enough for retirement if I slow down"',
    saveKey: 'psychological_worry',
  },
];

export function getQuestionsBySection(): Record<string, Question[]> {
  return ASSESSMENT_QUESTIONS.reduce((acc, q) => {
    if (!acc[q.section]) acc[q.section] = [];
    acc[q.section].push(q);
    return acc;
  }, {} as Record<string, Question[]>);
}

export function getAllSections(): { section: string; title: string; description?: string }[] {
  const seen = new Set<string>();
  return ASSESSMENT_QUESTIONS.filter(q => {
    if (seen.has(q.section)) return false;
    seen.add(q.section);
    return true;
  }).map(q => ({
    section: q.section,
    title: q.sectionTitle ?? '',
    description: q.sectionDescription,
  }));
}
