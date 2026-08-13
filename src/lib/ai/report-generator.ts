/**
 * AI Report Generator
 * Uses OpenAI to generate personalized wealth readiness reports.
 * Strict prompt engineering ensures educational output only.
 */

import OpenAI from 'openai';
import type { WealthScore, AssessmentAnswer, AiReport, OpportunityScore } from '@/types';
import { generateId } from '@/lib/utils';

export function getOpenAIClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getAnswer(answers: AssessmentAnswer[], id: string): string {
  const ans = answers.find(a => a.questionId === id)?.value;
  if (Array.isArray(ans)) return ans.join(', ');
  return (ans as string) || 'Not provided';
}

function getFirstName(answers: AssessmentAnswer[]): string {
  return getAnswer(answers, 'first_name') || 'there';
}

function buildContextualPrompt(
  answers: AssessmentAnswer[],
  wealthScore: WealthScore,
  opportunityScore: OpportunityScore
): string {
  const firstName = getFirstName(answers);
  const country = getAnswer(answers, 'country_residence');
  const nationality = getAnswer(answers, 'nationality');
  const ageRange = getAnswer(answers, 'age_range');
  const occupation = getAnswer(answers, 'occupation');
  const income = getAnswer(answers, 'annual_income_range');
  const assets = getAnswer(answers, 'investable_assets_range');
  const goals = getAnswer(answers, 'financial_goals');
  const primaryGoal = getAnswer(answers, 'primary_goal');
  const goalUrgency = getAnswer(answers, 'goal_urgency');
  const retirementAge = getAnswer(answers, 'retirement_age');
  const maritalStatus = getAnswer(answers, 'marital_status');
  const dependents = getAnswer(answers, 'dependents');
  const employmentStatus = getAnswer(answers, 'employment_status');
  const hasInvestments = getAnswer(answers, 'has_investments');
  const hasInsurance = getAnswer(answers, 'has_insurance');
  const hasRetirement = getAnswer(answers, 'has_retirement_accounts');
  const hasEmergency = getAnswer(answers, 'has_emergency_fund');
  const hasProperty = getAnswer(answers, 'has_property');
  const hasAdvisor = getAnswer(answers, 'has_existing_advisor');
  const psychological = getAnswer(answers, 'psychological_situation');
  const confidence = getAnswer(answers, 'financial_confidence');
  const crossBorder = wealthScore.crossBorderComplexity;

  const strongDimensions = wealthScore.dimensions
    .filter(d => d.percentage >= 70)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  const weakDimensions = wealthScore.dimensions
    .filter(d => d.percentage < 70)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);

  return `You are a senior financial education analyst preparing a personalized Wealth Readiness Report.

IMPORTANT COMPLIANCE RULES:
- Provide EDUCATIONAL and INFORMATIONAL content only
- NEVER give specific buy, sell, or investment recommendations
- NEVER promise returns or guarantee outcomes
- NEVER provide specific tax or legal advice
- NEVER prescribe portfolio allocations
- Use hedging language: "may wish to consider", "this area may deserve review"
- Reference specific client profile data throughout

CLIENT PROFILE:
- Name: ${firstName}
- Country of Residence: ${country}
- Nationality: ${nationality}
- Age Range: ${ageRange}
- Occupation: ${occupation}
- Employment Status: ${employmentStatus}
- Marital Status: ${maritalStatus}
- Dependents: ${dependents}
- Annual Household Income: ${income}
- Investable Assets: ${assets}
- Has Investments: ${hasInvestments}
- Has Retirement Accounts: ${hasRetirement}
- Has Insurance Coverage: ${hasInsurance}
- Has Emergency Fund: ${hasEmergency}
- Owns Property: ${hasProperty}
- Has Existing Financial Advisor: ${hasAdvisor}
- Primary Financial Goal: ${primaryGoal}
- Other Goals: ${goals}
- Goal Urgency: ${goalUrgency}
- Desired Retirement Age: ${retirementAge}
- Psychological Profile: ${psychological}
- Financial Confidence (1-10): ${confidence}
- Cross-Border Complexity: ${crossBorder}

WEALTH READINESS SCORE: ${wealthScore.overallScore}/100 (${wealthScore.overallLabel})
DIMENSIONS:
${wealthScore.dimensions.map(d => "- " + d.label + ": " + d.percentage + "/100").join('\n')}
STRONG AREAS (70+):
${strongDimensions.map(d => "- " + d.label + " (" + d.percentage + "/100)").join('\n')}
AREAS NEEDING REVIEW (<70):
${weakDimensions.map(d => "- " + d.label + " (" + d.percentage + "/100)").join('\n')}
OPPORTUNITY SCORE: ${opportunityScore.score}/100

Generate a JSON response with this exact structure:
{
  "executiveSummary": "2-3 sentence overview referencing their specific profile, score, and goals",
  "strongAreas": ["array of 2-3 sentences about their specific strengths"],
  "areasForReview": ["array of 2-3 sentences about areas that may deserve review"],
  "topPriorities": [
    {"priority": 1, "topic": "Short topic name", "explanation": "2-3 sentences why this is relevant to their situation"},
    {"priority": 2, "topic": "Short topic name", "explanation": "..."},
    {"priority": 3, "topic": "Short topic name", "explanation": "..."}
  ],
  "suggestedQuestions": ["open-ended question for advisor", "another question", "third question"],
  "advisorTalkingPoints": ["specific talking point", "another point", "third point"],
  "educationalInsights": [
    {"dimension": "dimension name", "insight": "2-3 sentence educational explanation"}
  ],
  "nextSteps": ["practical first step", "second step", "third step"]
}`;
}

export async function generateAiReport(
  answers: AssessmentAnswer[],
  wealthScore: WealthScore,
  opportunityScore: OpportunityScore
): Promise<AiReport> {
  const prompt = buildContextualPrompt(answers, wealthScore, opportunityScore);

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a senior financial education analyst. Respond only with valid JSON matching the schema provided. No markdown code blocks, no explanation outside the JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 2000,
  });

  const rawContent = completion.choices[0]?.message?.content;

  if (!rawContent) {
    throw new Error('No response from OpenAI');
  }

  let parsed: AiReport;

  try {
    parsed = JSON.parse(rawContent) as AiReport;
  } catch {
    throw new Error('Failed to parse AI response');
  }

  return {
    ...parsed,
    id: generateId(),
    sessionId: answers[0]?.value as string || '',
    generatedAt: new Date().toISOString(),
    model: 'gpt-4o-mini',
    tokens: completion.usage?.total_tokens,
  };
}

// ─── Demo Mode (when no OpenAI key) ─────────────────────────────────────────

export function generateDemoReport(
  answers: AssessmentAnswer[],
  wealthScore: WealthScore,
  _opportunityScore: OpportunityScore
): AiReport {
  const firstName = getFirstName(answers);
  const country = getAnswer(answers, 'country_residence');
  const primaryGoal = getAnswer(answers, 'primary_goal');
  const income = getAnswer(answers, 'annual_income_range');

  const strongAreas = wealthScore.dimensions.filter(d => d.percentage >= 70);
  const weakAreas = wealthScore.dimensions.filter(d => d.percentage < 70);

  const goal = primaryGoal || 'achieving financial clarity';
  const strongLabel = strongAreas[0]?.label || 'your current financial structure';
  const weakLabel = weakAreas[0]?.label || 'certain financial dimensions';
  const weakLabel2 = weakAreas[1]?.label || 'financial planning';
  const incomeDisplay = income || 'your current';

  const execSummary = firstName + ', based on your profile as a professional in ' + country + ' with ' + incomeDisplay + ' annual income, your Wealth Readiness Score of ' + wealthScore.overallScore + '/100 indicates a ' + wealthScore.overallLabel.toLowerCase() + ' financial foundation. Your assessment reveals particular strength in ' + strongLabel + ', while areas including ' + weakLabel + ' may benefit from further review. Given your goal of ' + goal + ', these findings suggest a focused conversation could provide valuable perspective.';

  return {
    id: generateId(),
    sessionId: '',
    executiveSummary: execSummary,
    strongAreas: strongAreas.slice(0, 3).map(d =>
      'Your ' + d.label.toLowerCase() + ' score of ' + d.percentage + '/100 reflects meaningful progress in this area. This foundation can serve as a strong base for addressing your broader financial picture.'
    ),
    areasForReview: weakAreas.slice(0, 3).map(d =>
      'Your ' + d.label.toLowerCase() + ' at ' + d.percentage + '/100 suggests this area may benefit from closer attention. Given your overall profile, this could become a more significant gap over time if not addressed.'
    ),
    topPriorities: [
      {
        priority: 1,
        topic: 'Financial Foundation Review',
        explanation: 'With a score of ' + wealthScore.overallScore + '/100, reviewing your overall financial structure could help ensure all elements work together effectively toward your ' + goal + '.',
      },
      {
        priority: 2,
        topic: 'Goal-Specific Planning',
        explanation: 'Your stated priority of ' + goal + ' suggests that goal-aligned planning could help translate your current financial position into meaningful progress.',
      },
      {
        priority: 3,
        topic: 'Cross-Border Considerations',
        explanation: 'Your ' + wealthScore.crossBorderComplexity.toLowerCase() + ' cross-border complexity level indicates that international financial coordination deserves attention in your long-term plan.',
      },
    ],
    suggestedQuestions: [
      'How does my current financial structure align with my stated goals?',
      'What blind spots might exist in my current financial plan?',
      'How should I prioritize my financial goals given my current position?',
    ],
    advisorTalkingPoints: [
      firstName + ' has identified ' + goal + ' as their primary goal -- this should anchor the advisory conversation.',
      'With a ' + wealthScore.overallLabel.toLowerCase() + ' overall score, there are clear opportunities to add structure and alignment.',
      'The ' + weakLabel2 + ' dimension appears to be an area where focused attention could yield meaningful results.',
    ],
    educationalInsights: wealthScore.dimensions.slice(0, 3).map(d => {
      const insightText = d.percentage >= 70
        ? 'solid foundations that can be built upon'
        : d.percentage >= 50
        ? 'a developing foundation with clear opportunities for improvement'
        : 'an area that may need focused attention as part of your broader financial plan';
      return {
        dimension: d.label,
        insight: 'Your ' + d.label.toLowerCase() + ' score of ' + d.percentage + '/100 reflects ' + insightText + '. ' + d.description,
      };
    }),
    nextSteps: [
      'Review your Wealth Readiness Report in detail, paying particular attention to your lowest-scoring dimensions.',
      'Consider scheduling a no-obligation conversation to explore how your specific situation maps to your goals.',
      'Think about your top 1-2 financial priorities before your advisory meeting to make the conversation most productive.',
    ],
    generatedAt: new Date().toISOString(),
  };
}
