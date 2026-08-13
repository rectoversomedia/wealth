-- Wealth Lead Engine — Supabase Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE crm_stage AS ENUM (
  'new',
  'assessment_completed',
  'qualified',
  'contacted',
  'meeting_booked',
  'meeting_completed',
  'follow_up',
  'client',
  'not_qualified',
  'lost'
);

CREATE TYPE opportunity_tier AS ENUM ('hot', 'warm', 'nurture');
CREATE TYPE activity_type AS ENUM (
  'ad_clicked',
  'assessment_started',
  'assessment_completed',
  'report_viewed',
  'email_sent',
  'email_opened',
  'email_clicked',
  'whatsapp_delivered',
  'whatsapp_read',
  'booking_page_viewed',
  'meeting_booked',
  'meeting_reminder_sent',
  'meeting_completed',
  'stage_changed',
  'note_added',
  'consent_given',
  'unsubscribed',
  'profile_updated',
  'lead_created'
);
CREATE TYPE content_format AS ENUM (
  'linkedin_long',
  'linkedin_short',
  'carousel',
  'reels',
  'youtube_short',
  'email',
  'ad_variation',
  'blog_outline'
);
CREATE TYPE consent_type AS ENUM ('marketing', 'assessment', 'whatsapp', 'data_processing');
CREATE TYPE content_status AS ENUM ('draft', 'approved', 'published');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'ended');

-- ─── Tables ──────────────────────────────────────────────────────────────────

-- Advisors
CREATE TABLE advisors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  company TEXT,
  bio TEXT,
  profile_image_url TEXT,
  booking_url TEXT,
  supported_countries TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Sessions
CREATE TABLE assessment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer TEXT,
  landing_page TEXT,
  device TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 20,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Answers
CREATE TABLE assessment_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  section TEXT NOT NULL,
  value TEXT,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wealth Scores
CREATE TABLE wealth_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  overall_label TEXT,
  cross_border_complexity TEXT CHECK (cross_border_complexity IN ('Low', 'Moderate', 'High', 'Very High')),
  dimensions JSONB DEFAULT '[]'::JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunity Scores
CREATE TABLE opportunity_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  tier opportunity_tier,
  factors JSONB DEFAULT '{}'::JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES assessment_sessions(id),
  advisor_id UUID REFERENCES advisors(id),

  -- Contact
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  phone_country_code TEXT DEFAULT '+65',
  preferred_contact TEXT DEFAULT 'email' CHECK (preferred_contact IN ('email', 'whatsapp', 'phone', 'either')),

  -- Profile
  country TEXT,
  nationality TEXT,
  age_range TEXT,
  occupation TEXT,
  industry TEXT,
  marital_status TEXT,
  dependents INTEGER DEFAULT 0,
  employment_status TEXT,

  -- Financial
  annual_income_range TEXT,
  investable_assets_range TEXT,
  has_property BOOLEAN DEFAULT FALSE,
  has_investments TEXT,
  has_retirement_accounts TEXT,
  has_insurance TEXT,
  has_emergency_fund TEXT,
  has_existing_advisor TEXT,

  -- Goals
  primary_goal TEXT,
  other_goals TEXT[],
  goal_urgency TEXT,
  retirement_age INTEGER,
  goal_timeframe TEXT,
  planned_relocation TEXT,
  major_liquidity_event TEXT,
  financial_confidence INTEGER CHECK (financial_confidence >= 1 AND financial_confidence <= 10),
  psychological_profile TEXT,
  psychological_worry TEXT,

  -- CRM
  crm_stage crm_stage DEFAULT 'new',
  booked_at TIMESTAMPTZ,
  meeting_date TIMESTAMPTZ,
  meeting_notes TEXT,

  -- Attribution
  source TEXT,
  medium TEXT,
  campaign TEXT,
  content TEXT,
  term TEXT,
  landing_page TEXT,
  utm_data JSONB DEFAULT '{}'::JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead Activities
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  type activity_type NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Reports
CREATE TABLE ai_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  session_id UUID REFERENCES assessment_sessions(id),
  executive_summary TEXT,
  strong_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  areas_for_review TEXT[] DEFAULT ARRAY[]::TEXT[],
  top_priorities JSONB DEFAULT '[]'::JSONB,
  suggested_questions TEXT[] DEFAULT ARRAY[]::TEXT[],
  advisor_talking_points TEXT[] DEFAULT ARRAY[]::TEXT[],
  educational_insights JSONB DEFAULT '[]'::JSONB,
  next_steps TEXT[] DEFAULT ARRAY[]::TEXT[],
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  model TEXT,
  tokens INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consents
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  type consent_type NOT NULL,
  granted BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  source TEXT
);

-- Countries Configuration
CREATE TABLE countries (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  flag TEXT,
  currency TEXT,
  currency_symbol TEXT,
  hero_headline TEXT,
  hero_subtext TEXT,
  hero_cta TEXT,
  disclaimer TEXT,
  available BOOLEAN DEFAULT TRUE,
  locale TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT,
  audience TEXT,
  core_concern TEXT,
  landing_page TEXT,
  primary_cta TEXT,
  channels TEXT[] DEFAULT ARRAY[]::TEXT[],
  status campaign_status DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Assets
CREATE TABLE content_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  country TEXT,
  audience TEXT,
  persona TEXT,
  theme TEXT,
  format content_format,
  content TEXT,
  cta TEXT,
  status content_status DEFAULT 'draft',
  campaign_id UUID REFERENCES campaigns(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Advisor Settings
CREATE TABLE advisor_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID REFERENCES advisors(id) UNIQUE,
  scoring_weights JSONB DEFAULT '{}'::JSONB,
  opportunity_weights JSONB DEFAULT '{}'::JSONB,
  default_disclaimer TEXT,
  email_sender_name TEXT,
  email_from TEXT,
  branding_color TEXT DEFAULT '#b8892a',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID REFERENCES advisors(id),
  provider TEXT NOT NULL,
  config JSONB DEFAULT '{}'::JSONB,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_crm_stage ON leads(crm_stage);
CREATE INDEX idx_leads_country ON leads(country);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_sessions_country ON assessment_sessions(country);
CREATE INDEX idx_sessions_status ON assessment_sessions(status);
CREATE INDEX idx_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_activities_created_at ON lead_activities(created_at DESC);
CREATE INDEX idx_content_status ON content_assets(status);

-- ─── Updated At Trigger ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER advisors_updated_at BEFORE UPDATE ON advisors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER content_assets_updated_at BEFORE UPDATE ON content_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;

-- Public can insert into assessment sessions (for the public assessment)
CREATE POLICY "Public can insert assessment sessions"
  ON assessment_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can insert assessment answers"
  ON assessment_answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read their own session"
  ON assessment_sessions FOR SELECT
  USING (true); -- In production, add auth.uid() check

CREATE POLICY "Public can update their own session"
  ON assessment_sessions FOR UPDATE
  USING (true); -- In production, add auth.uid() check

-- Advisor policies (in production, use auth.uid() = advisor_id)
CREATE POLICY "Advisors can read all leads"
  ON leads FOR SELECT
  USING (true);

CREATE POLICY "Advisors can update leads"
  ON leads FOR UPDATE
  USING (true);

CREATE POLICY "Advisors can read activities"
  ON lead_activities FOR SELECT
  USING (true);

CREATE POLICY "Advisors can insert activities"
  ON lead_activities FOR INSERT
  WITH CHECK (true);
