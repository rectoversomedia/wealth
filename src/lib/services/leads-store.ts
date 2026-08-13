/**
 * In-memory demo leads store for the advisor dashboard.
 * Replace with Supabase in production.
 */

import type { Lead, CrmStage, LeadActivity, WealthScore, OpportunityScore, AiReport, CountryCode, OpportunityTier } from '@/types';
import { generateId } from '@/lib/utils';

const DEMO_LEADS: Lead[] = [
  {
    id: 'lead_001',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@gmail.com',
    phone: '+65 9123 4567',
    phoneCountryCode: '+65',
    preferredContact: 'email',
    country: 'sg',
    nationality: 'British',
    ageRange: '40–44',
    occupation: 'Managing Director',
    industry: 'Investment Banking',
    maritalStatus: 'Married',
    dependents: 2,
    employmentStatus: 'Senior Executive',
    annualIncomeRange: '$500k–$1M',
    investableAssetsRange: '$1M–$2.5M',
    hasProperty: true,
    hasInvestments: true,
    hasRetirementAccounts: true,
    hasInsurance: true,
    hasEmergencyFund: true,
    hasExistingAdvisor: false,
    primaryGoal: 'Retirement planning',
    otherGoals: ['Estate planning', 'Protecting family'],
    goalUrgency: '1–3 years',
    retirementAge: 60,
    goalTimeframe: '7–15 years',
    plannedRelocation: 'No plans',
    majorLiquidityEvent: 'None',
    financialConfidence: 6,
    psychologicalProfile: 'I already have a plan but want a second perspective',
    wealthScore: {
      overallScore: 76,
      overallLabel: 'Good',
      crossBorderComplexity: 'High',
      dimensions: [
        { dimension: 'retirement_readiness', label: 'Retirement Readiness', score: 72, maxScore: 100, percentage: 72, description: 'Reasonable progress' },
        { dimension: 'wealth_structure', label: 'Wealth Structure', score: 85, maxScore: 100, percentage: 85, description: 'Strong foundation' },
        { dimension: 'family_protection', label: 'Family Protection', score: 58, maxScore: 100, percentage: 58, description: 'Needs review' },
        { dimension: 'liquidity_preparedness', label: 'Liquidity Preparedness', score: 74, maxScore: 100, percentage: 74, description: 'Good position' },
        { dimension: 'estate_planning', label: 'Estate Planning', score: 45, maxScore: 100, percentage: 45, description: 'Significant gaps' },
        { dimension: 'goal_alignment', label: 'Goal Alignment', score: 68, maxScore: 100, percentage: 68, description: 'Developing' },
        { dimension: 'financial_organization', label: 'Financial Organization', score: 80, maxScore: 100, percentage: 80, description: 'Strong' },
      ],
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    opportunityScore: { score: 94, tier: 'hot', factors: { income: 85, assets: 90, age: 72, seniority: 95, businessOwnership: 30, retirementProximity: 60, crossBorder: 75, goalsCount: 30, urgency: 50, engagement: 75 } },
    crmStage: 'qualified',
    assignedAdvisorId: 'advisor_001',
    bookingUrl: 'https://cal.com/demo',
    source: 'google',
    medium: 'cpc',
    campaign: 'SG_Retirement_Exec',
    landingPage: '/sg',
    utmData: { source: 'google', medium: 'cpc', campaign: 'SG_Retirement_Exec' },
    consents: [
      { type: 'marketing', granted: true, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { type: 'assessment', granted: true, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    activities: [
      { id: '1', leadId: 'lead_001', type: 'ad_clicked', description: 'Clicked Google Ad: SG_Retirement_Exec', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '2', leadId: 'lead_001', type: 'assessment_started', description: 'Started Wealth Assessment', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '3', leadId: 'lead_001', type: 'assessment_completed', description: 'Assessment completed', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '4', leadId: 'lead_001', type: 'report_viewed', description: 'Viewed Wealth Readiness Report (Score: 76)', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '5', leadId: 'lead_001', type: 'email_sent', description: 'Report email sent', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '6', leadId: 'lead_001', type: 'email_opened', description: 'Report email opened', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '7', leadId: 'lead_001', type: 'stage_changed', description: 'Moved to Qualified', metadata: { from: 'new', to: 'qualified' }, createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead_002',
    firstName: 'Sarah',
    lastName: 'Al-Rashid',
    email: 'sarah.alrashid@outlook.com',
    phone: '+971 50 123 4567',
    phoneCountryCode: '+971',
    preferredContact: 'whatsapp',
    country: 'uae',
    nationality: 'British',
    ageRange: '45–49',
    occupation: 'Medical Director',
    industry: 'Healthcare',
    maritalStatus: 'Married',
    dependents: 3,
    employmentStatus: 'Senior Executive',
    annualIncomeRange: '$250k–$500k',
    investableAssetsRange: '$500k–$1M',
    hasProperty: true,
    hasInvestments: true,
    hasRetirementAccounts: false,
    hasInsurance: true,
    hasEmergencyFund: true,
    hasExistingAdvisor: false,
    primaryGoal: 'Protecting my family',
    otherGoals: ['Estate planning', 'Retirement planning'],
    goalUrgency: 'This year',
    financialConfidence: 4,
    wealthScore: {
      overallScore: 68,
      overallLabel: 'Developing',
      crossBorderComplexity: 'High',
      dimensions: [
        { dimension: 'retirement_readiness', label: 'Retirement Readiness', score: 55, maxScore: 100, percentage: 55, description: 'Foundation forming' },
        { dimension: 'wealth_structure', label: 'Wealth Structure', score: 72, maxScore: 100, percentage: 72, description: 'Good position' },
        { dimension: 'family_protection', label: 'Family Protection', score: 62, maxScore: 100, percentage: 62, description: 'Needs attention' },
        { dimension: 'liquidity_preparedness', label: 'Liquidity Preparedness', score: 70, maxScore: 100, percentage: 70, description: 'Reasonable' },
        { dimension: 'estate_planning', label: 'Estate Planning', score: 35, maxScore: 100, percentage: 35, description: 'Significant gaps' },
        { dimension: 'goal_alignment', label: 'Goal Alignment', score: 65, maxScore: 100, percentage: 65, description: 'Developing' },
        { dimension: 'financial_organization', label: 'Financial Organization', score: 58, maxScore: 100, percentage: 58, description: 'Needs structure' },
      ],
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    opportunityScore: { score: 81, tier: 'hot', factors: { income: 75, assets: 80, age: 78, seniority: 90, businessOwnership: 30, retirementProximity: 80, crossBorder: 75, goalsCount: 30, urgency: 100, engagement: 60 } },
    crmStage: 'contacted',
    source: 'linkedin',
    medium: 'social',
    campaign: 'UAE_Expats_Protection',
    consents: [{ type: 'marketing', granted: true, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }, { type: 'assessment', granted: true, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }],
    activities: [
      { id: '1', leadId: 'lead_002', type: 'ad_clicked', description: 'Clicked LinkedIn Ad', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '2', leadId: 'lead_002', type: 'assessment_completed', description: 'Assessment completed', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '3', leadId: 'lead_002', type: 'report_viewed', description: 'Viewed report (Score: 68)', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '4', leadId: 'lead_002', type: 'whatsapp_delivered', description: 'WhatsApp follow-up sent', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead_003',
    firstName: 'Rina',
    lastName: 'Wijaya',
    email: 'rina.wijaya@company.co.id',
    phone: '+62 812 3456 7890',
    phoneCountryCode: '+62',
    preferredContact: 'email',
    country: 'id',
    nationality: 'Indonesian',
    ageRange: '35–39',
    occupation: 'Business Owner',
    industry: 'Consumer Goods',
    maritalStatus: 'Married',
    dependents: 2,
    employmentStatus: 'Business Owner',
    annualIncomeRange: '$250k–$500k',
    investableAssetsRange: '$250k–$500k',
    hasProperty: true,
    hasInvestments: true,
    hasRetirementAccounts: false,
    hasInsurance: true,
    hasEmergencyFund: true,
    hasExistingAdvisor: false,
    primaryGoal: 'Growing wealth',
    otherGoals: ["Children's education", 'Investment review'],
    goalUrgency: '3–5 years',
    financialConfidence: 5,
    wealthScore: {
      overallScore: 71,
      overallLabel: 'Good',
      crossBorderComplexity: 'Moderate',
      dimensions: [
        { dimension: 'retirement_readiness', label: 'Retirement Readiness', score: 42, maxScore: 100, percentage: 42, description: 'Significant gaps' },
        { dimension: 'wealth_structure', label: 'Wealth Structure', score: 78, maxScore: 100, percentage: 78, description: 'Strong' },
        { dimension: 'family_protection', label: 'Family Protection', score: 65, maxScore: 100, percentage: 65, description: 'Needs review' },
        { dimension: 'liquidity_preparedness', label: 'Liquidity Preparedness', score: 68, maxScore: 100, percentage: 68, description: 'Reasonable' },
        { dimension: 'estate_planning', label: 'Estate Planning', score: 30, maxScore: 100, percentage: 30, description: 'Limited' },
        { dimension: 'goal_alignment', label: 'Goal Alignment', score: 72, maxScore: 100, percentage: 72, description: 'Good' },
        { dimension: 'financial_organization', label: 'Financial Organization', score: 55, maxScore: 100, percentage: 55, description: 'Needs structure' },
      ],
      generatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    opportunityScore: { score: 77, tier: 'warm', factors: { income: 75, assets: 70, age: 55, seniority: 90, businessOwnership: 100, retirementProximity: 40, crossBorder: 40, goalsCount: 30, urgency: 25, engagement: 50 } },
    crmStage: 'assessment_completed',
    source: 'google',
    medium: 'search',
    campaign: 'ID_BusinessOwner_Growth',
    consents: [{ type: 'marketing', granted: true, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }, { type: 'assessment', granted: true, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }],
    activities: [
      { id: '1', leadId: 'lead_003', type: 'assessment_completed', description: 'Assessment completed', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '2', leadId: 'lead_003', type: 'report_viewed', description: 'Viewed report', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead_004',
    firstName: 'James',
    lastName: 'Whitmore',
    email: 'j.whitmore@me.com',
    phone: '+65 9876 5432',
    phoneCountryCode: '+65',
    preferredContact: 'phone',
    country: 'sg',
    nationality: 'British',
    ageRange: '50–54',
    occupation: 'Partner',
    industry: 'Law',
    maritalStatus: 'Married',
    dependents: 2,
    employmentStatus: 'Senior Executive',
    annualIncomeRange: '$1M–$2.5M',
    investableAssetsRange: '$2.5M+',
    hasProperty: true,
    hasInvestments: true,
    hasRetirementAccounts: true,
    hasInsurance: true,
    hasEmergencyFund: true,
    hasExistingAdvisor: true,
    primaryGoal: 'Estate planning',
    otherGoals: ['Retirement', 'Protecting family', 'Tax efficiency'],
    goalUrgency: 'This year',
    financialConfidence: 7,
    wealthScore: {
      overallScore: 84,
      overallLabel: 'Strong',
      crossBorderComplexity: 'Very High',
      dimensions: [
        { dimension: 'retirement_readiness', label: 'Retirement Readiness', score: 88, maxScore: 100, percentage: 88, description: 'Excellent' },
        { dimension: 'wealth_structure', label: 'Wealth Structure', score: 92, maxScore: 100, percentage: 92, description: 'Excellent' },
        { dimension: 'family_protection', label: 'Family Protection', score: 75, maxScore: 100, percentage: 75, description: 'Good' },
        { dimension: 'liquidity_preparedness', label: 'Liquidity Preparedness', score: 85, maxScore: 100, percentage: 85, description: 'Strong' },
        { dimension: 'estate_planning', label: 'Estate Planning', score: 65, maxScore: 100, percentage: 65, description: 'Developing' },
        { dimension: 'goal_alignment', label: 'Goal Alignment', score: 82, maxScore: 100, percentage: 82, description: 'Strong' },
        { dimension: 'financial_organization', label: 'Financial Organization', score: 88, maxScore: 100, percentage: 88, description: 'Excellent' },
      ],
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    opportunityScore: { score: 97, tier: 'hot', factors: { income: 92, assets: 100, age: 85, seniority: 95, businessOwnership: 30, retirementProximity: 100, crossBorder: 100, goalsCount: 40, urgency: 100, engagement: 90 } },
    crmStage: 'meeting_booked',
    bookedAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    meetingDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'referral',
    medium: 'referral',
    campaign: 'SG_Wealth_Estate',
    consents: [{ type: 'marketing', granted: true, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }, { type: 'assessment', granted: true, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }],
    activities: [
      { id: '1', leadId: 'lead_004', type: 'assessment_completed', description: 'Assessment completed (Score: 84)', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '2', leadId: 'lead_004', type: 'booking_page_viewed', description: 'Booking page visited', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '3', leadId: 'lead_004', type: 'meeting_booked', description: 'Meeting booked for tomorrow 10:00 AM', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead_005',
    firstName: 'Naledi',
    lastName: 'Mokoena',
    email: 'naledi.m@startup.co.za',
    phone: '+27 82 456 7890',
    phoneCountryCode: '+27',
    preferredContact: 'email',
    country: 'za',
    nationality: 'South African',
    ageRange: '30–34',
    occupation: 'Founder & CEO',
    industry: 'Technology',
    maritalStatus: 'Single',
    dependents: 0,
    employmentStatus: 'Entrepreneur',
    annualIncomeRange: '$100k–$250k',
    investableAssetsRange: '$100k–$250k',
    hasProperty: false,
    hasInvestments: true,
    hasRetirementAccounts: true,
    hasInsurance: false,
    hasEmergencyFund: true,
    hasExistingAdvisor: false,
    primaryGoal: 'Growing wealth',
    otherGoals: ['Investment review', 'Financial independence'],
    goalUrgency: '3–5 years',
    financialConfidence: 5,
    wealthScore: {
      overallScore: 62,
      overallLabel: 'Developing',
      crossBorderComplexity: 'Low',
      dimensions: [
        { dimension: 'retirement_readiness', label: 'Retirement Readiness', score: 55, maxScore: 100, percentage: 55, description: 'Foundation forming' },
        { dimension: 'wealth_structure', label: 'Wealth Structure', score: 60, maxScore: 100, percentage: 60, description: 'Developing' },
        { dimension: 'family_protection', label: 'Family Protection', score: 80, maxScore: 100, percentage: 80, description: 'Strong (no dependents)' },
        { dimension: 'liquidity_preparedness', label: 'Liquidity Preparedness', score: 65, maxScore: 100, percentage: 65, description: 'Reasonable' },
        { dimension: 'estate_planning', label: 'Estate Planning', score: 30, maxScore: 100, percentage: 30, description: 'Limited' },
        { dimension: 'goal_alignment', label: 'Goal Alignment', score: 68, maxScore: 100, percentage: 68, description: 'Good' },
        { dimension: 'financial_organization', label: 'Financial Organization', score: 52, maxScore: 100, percentage: 52, description: 'Needs attention' },
      ],
      generatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    opportunityScore: { score: 58, tier: 'warm', factors: { income: 60, assets: 55, age: 40, seniority: 85, businessOwnership: 85, retirementProximity: 20, crossBorder: 15, goalsCount: 30, urgency: 25, engagement: 40 } },
    crmStage: 'new',
    source: 'linkedin',
    medium: 'social',
    campaign: 'ZA_Tech_Entrepreneur',
    consents: [{ type: 'marketing', granted: true, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() }, { type: 'assessment', granted: true, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() }],
    activities: [
      { id: '1', leadId: 'lead_005', type: 'assessment_completed', description: 'Assessment completed', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead_006',
    firstName: 'Wei Liang',
    lastName: 'Tan',
    email: 'wltan@gmail.com',
    phone: '+60 12 345 6789',
    phoneCountryCode: '+60',
    preferredContact: 'email',
    country: 'my',
    nationality: 'Malaysian',
    ageRange: '40–44',
    occupation: 'Senior Engineer',
    industry: 'Oil & Gas',
    maritalStatus: 'Married',
    dependents: 2,
    employmentStatus: 'Employed',
    annualIncomeRange: '$100k–$250k',
    investableAssetsRange: '$250k–$500k',
    hasProperty: true,
    hasInvestments: true,
    hasRetirementAccounts: true,
    hasInsurance: true,
    hasEmergencyFund: true,
    hasExistingAdvisor: false,
    primaryGoal: 'Retirement planning',
    otherGoals: ['Protecting family', "Children's education"],
    goalUrgency: '7–15 years',
    financialConfidence: 5,
    wealthScore: {
      overallScore: 74,
      overallLabel: 'Good',
      crossBorderComplexity: 'Moderate',
      dimensions: [
        { dimension: 'retirement_readiness', label: 'Retirement Readiness', score: 68, maxScore: 100, percentage: 68, description: 'Reasonable' },
        { dimension: 'wealth_structure', label: 'Wealth Structure', score: 72, maxScore: 100, percentage: 72, description: 'Good' },
        { dimension: 'family_protection', label: 'Family Protection', score: 70, maxScore: 100, percentage: 70, description: 'Good' },
        { dimension: 'liquidity_preparedness', label: 'Liquidity Preparedness', score: 78, maxScore: 100, percentage: 78, description: 'Strong' },
        { dimension: 'estate_planning', label: 'Estate Planning', score: 45, maxScore: 100, percentage: 45, description: 'Needs attention' },
        { dimension: 'goal_alignment', label: 'Goal Alignment', score: 72, maxScore: 100, percentage: 72, description: 'Good' },
        { dimension: 'financial_organization', label: 'Financial Organization', score: 65, maxScore: 100, percentage: 65, description: 'Developing' },
      ],
      generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    opportunityScore: { score: 62, tier: 'warm', factors: { income: 60, assets: 70, age: 72, seniority: 65, businessOwnership: 30, retirementProximity: 60, crossBorder: 40, goalsCount: 30, urgency: 10, engagement: 30 } },
    crmStage: 'qualified',
    source: 'google',
    medium: 'search',
    campaign: 'MY_Retirement_Middle',
    consents: [{ type: 'marketing', granted: true, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }],
    activities: [
      { id: '1', leadId: 'lead_006', type: 'assessment_completed', description: 'Assessment completed', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead_007',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.h@corp.ae',
    phone: '+971 55 987 6543',
    phoneCountryCode: '+971',
    preferredContact: 'whatsapp',
    country: 'uae',
    nationality: 'Egyptian',
    ageRange: '35–39',
    occupation: 'Senior Engineer',
    industry: 'Energy',
    maritalStatus: 'Married',
    dependents: 3,
    employmentStatus: 'Employed',
    annualIncomeRange: '$100k–$250k',
    investableAssetsRange: '$100k–$250k',
    hasProperty: false,
    hasInvestments: false,
    hasRetirementAccounts: false,
    hasInsurance: true,
    hasEmergencyFund: false,
    hasExistingAdvisor: false,
    primaryGoal: 'Retirement planning',
    otherGoals: ['Growing wealth'],
    goalUrgency: '7–15 years',
    financialConfidence: 4,
    wealthScore: {
      overallScore: 48,
      overallLabel: 'Foundation Stage',
      crossBorderComplexity: 'High',
      dimensions: [
        { dimension: 'retirement_readiness', label: 'Retirement Readiness', score: 35, maxScore: 100, percentage: 35, description: 'Limited' },
        { dimension: 'wealth_structure', label: 'Wealth Structure', score: 45, maxScore: 100, percentage: 45, description: 'Needs building' },
        { dimension: 'family_protection', label: 'Family Protection', score: 55, maxScore: 100, percentage: 55, description: 'Foundation forming' },
        { dimension: 'liquidity_preparedness', label: 'Liquidity Preparedness', score: 40, maxScore: 100, percentage: 40, description: 'Limited' },
        { dimension: 'estate_planning', label: 'Estate Planning', score: 20, maxScore: 100, percentage: 20, description: 'Minimal' },
        { dimension: 'goal_alignment', label: 'Goal Alignment', score: 50, maxScore: 100, percentage: 50, description: 'Developing' },
        { dimension: 'financial_organization', label: 'Financial Organization', score: 35, maxScore: 100, percentage: 35, description: 'Needs structure' },
      ],
      generatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    opportunityScore: { score: 42, tier: 'nurture', factors: { income: 60, assets: 55, age: 55, seniority: 60, businessOwnership: 30, retirementProximity: 40, crossBorder: 75, goalsCount: 20, urgency: 10, engagement: 20 } },
    crmStage: 'new',
    source: 'meta',
    medium: 'social',
    campaign: 'UAE_Middle_Income',
    consents: [{ type: 'marketing', granted: true, timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() }],
    activities: [
      { id: '1', leadId: 'lead_007', type: 'assessment_completed', description: 'Assessment completed', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead_008',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@techsg.io',
    phone: '+65 8765 4321',
    phoneCountryCode: '+65',
    preferredContact: 'email',
    country: 'sg',
    nationality: 'Indian',
    ageRange: '30–34',
    occupation: 'VP Engineering',
    industry: 'Technology',
    maritalStatus: 'Married',
    dependents: 1,
    employmentStatus: 'Senior Executive',
    annualIncomeRange: '$250k–$500k',
    investableAssetsRange: '$250k–$500k',
    hasProperty: false,
    hasInvestments: true,
    hasRetirementAccounts: true,
    hasInsurance: true,
    hasEmergencyFund: true,
    hasExistingAdvisor: false,
    primaryGoal: 'Growing wealth',
    otherGoals: ['Retirement', 'Financial independence'],
    goalUrgency: '3–5 years',
    financialConfidence: 6,
    wealthScore: {
      overallScore: 78,
      overallLabel: 'Good',
      crossBorderComplexity: 'Moderate',
      dimensions: [
        { dimension: 'retirement_readiness', label: 'Retirement Readiness', score: 72, maxScore: 100, percentage: 72, description: 'Good' },
        { dimension: 'wealth_structure', label: 'Wealth Structure', score: 75, maxScore: 100, percentage: 75, description: 'Good' },
        { dimension: 'family_protection', label: 'Family Protection', score: 72, maxScore: 100, percentage: 72, description: 'Good' },
        { dimension: 'liquidity_preparedness', label: 'Liquidity Preparedness', score: 78, maxScore: 100, percentage: 78, description: 'Strong' },
        { dimension: 'estate_planning', label: 'Estate Planning', score: 40, maxScore: 100, percentage: 40, description: 'Needs review' },
        { dimension: 'goal_alignment', label: 'Goal Alignment', score: 80, maxScore: 100, percentage: 80, description: 'Strong' },
        { dimension: 'financial_organization', label: 'Financial Organization', score: 72, maxScore: 100, percentage: 72, description: 'Good' },
      ],
      generatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    opportunityScore: { score: 79, tier: 'warm', factors: { income: 75, assets: 70, age: 55, seniority: 90, businessOwnership: 30, retirementProximity: 40, crossBorder: 40, goalsCount: 30, urgency: 50, engagement: 60 } },
    crmStage: 'follow_up',
    source: 'google',
    medium: 'search',
    campaign: 'SG_Tech_Wealth',
    consents: [{ type: 'marketing', granted: true, timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() }],
    activities: [],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Store Functions ─────────────────────────────────────────────────────────

const leadsMap = new Map<string, Lead>(DEMO_LEADS.map(l => [l.id, l]));

export function getAllLeads(): Lead[] {
  return Array.from(leadsMap.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getLeadById(id: string): Lead | undefined {
  return leadsMap.get(id);
}

export function getLeadsByStage(stage: CrmStage): Lead[] {
  return getAllLeads().filter(l => l.crmStage === stage);
}

export function getHotLeads(): Lead[] {
  return getAllLeads().filter(l => l.opportunityScore?.tier === 'hot');
}

export function getWarmLeads(): Lead[] {
  return getAllLeads().filter(l => l.opportunityScore?.tier === 'warm');
}

export function getNurtureLeads(): Lead[] {
  return getAllLeads().filter(l => l.opportunityScore?.tier === 'nurture');
}

export function getLeadsNeedingFollowUp(): Lead[] {
  return getAllLeads()
    .filter(l => {
      if (l.crmStage === 'meeting_booked' || l.crmStage === 'client') return false;
      return true;
    })
    .sort((a, b) => (b.opportunityScore?.score || 0) - (a.opportunityScore?.score || 0))
    .slice(0, 5);
}

export function updateLeadStage(id: string, stage: CrmStage): Lead | undefined {
  const lead = leadsMap.get(id);
  if (!lead) return undefined;
  const updated = { ...lead, crmStage: stage, updatedAt: new Date().toISOString() };
  leadsMap.set(id, updated);
  return updated;
}

export function addLeadActivity(leadId: string, activity: Omit<LeadActivity, 'id' | 'leadId' | 'createdAt'>): Lead | undefined {
  const lead = leadsMap.get(leadId);
  if (!lead) return undefined;
  const newActivity: LeadActivity = {
    ...activity,
    id: generateId(),
    leadId,
    createdAt: new Date().toISOString(),
  };
  const updated = { ...lead, activities: [newActivity, ...lead.activities], updatedAt: new Date().toISOString() };
  leadsMap.set(leadId, updated);
  return updated;
}

export function getFunnelMetrics() {
  const leads = getAllLeads();
  return {
    visitors: 1846,
    assessmentStarts: Math.round(1846 * 0.35),
    assessmentCompletions: leads.length,
    qualifiedLeads: leads.filter(l => ['qualified', 'contacted', 'meeting_booked', 'meeting_completed', 'follow_up', 'client'].includes(l.crmStage)).length,
    meetingsBooked: leads.filter(l => ['meeting_booked', 'meeting_completed', 'follow_up', 'client'].includes(l.crmStage)).length,
    meetingsCompleted: leads.filter(l => ['meeting_completed', 'follow_up', 'client'].includes(l.crmStage)).length,
    clientsWon: leads.filter(l => l.crmStage === 'client').length,
  };
}

export function getSourceMetrics() {
  const leads = getAllLeads();
  const sources = ['google', 'linkedin', 'meta', 'referral', 'direct'];
  return sources.map(source => {
    const sourceLeads = leads.filter(l => l.source === source);
    return {
      source: source.charAt(0).toUpperCase() + source.slice(1),
      visitors: Math.round(Math.random() * 400 + 100),
      leads: sourceLeads.length,
      qualified: sourceLeads.filter(l => ['qualified', 'contacted', 'meeting_booked', 'meeting_completed', 'follow_up', 'client'].includes(l.crmStage)).length,
      meetings: sourceLeads.filter(l => ['meeting_booked', 'meeting_completed', 'follow_up', 'client'].includes(l.crmStage)).length,
      clients: sourceLeads.filter(l => l.crmStage === 'client').length,
      conversionRate: sourceLeads.length > 0 ? Math.round((sourceLeads.filter(l => l.crmStage !== 'new').length / sourceLeads.length) * 100) : 0,
    };
  });
}
