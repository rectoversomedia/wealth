import { NextRequest, NextResponse } from 'next/server';
import { calculateWealthScore, calculateOpportunityScore } from '@/lib/scoring/wealth-score';
import { generateDemoReport } from '@/lib/ai/report-generator';
import { createSession, setSessionScores, setSessionReport, saveAnswer } from '@/lib/assessment/session-store';
import type { AssessmentAnswer, CountryCode, AiReport } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId: _clientSessionId, country, answers, utmData } = body as {
      sessionId?: string;
      country: CountryCode;
      answers: AssessmentAnswer[];
      utmData: Record<string, string>;
    };

    if (!answers || answers.length === 0) {
      return NextResponse.json({ error: 'No answers provided' }, { status: 400 });
    }

    // Initialize session
    const session = createSession(country ?? 'global', utmData ?? {});

    // Save all answers to session
    answers.forEach(a => saveAnswer(session.id, a));

    // Calculate scores deterministically
    const wealthScore = calculateWealthScore(answers);
    const opportunityScore = calculateOpportunityScore(answers);

    // Store scores
    setSessionScores(session.id, wealthScore, opportunityScore);

    // Generate AI report (demo mode if no API key)
    let aiReport: AiReport;
    if (process.env.OPENAI_API_KEY) {
      const { generateAiReport } = await import('@/lib/ai/report-generator');
      aiReport = await generateAiReport(answers, wealthScore, opportunityScore);
    } else {
      aiReport = generateDemoReport(answers, wealthScore, opportunityScore);
    }

    setSessionReport(session.id, aiReport);

    return NextResponse.json({
      sessionId: session.id,
      wealthScore,
      opportunityScore,
      aiReport,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Assessment submit error:', err);
    return NextResponse.json(
      { error: 'Failed to process assessment', detail: message },
      { status: 500 }
    );
  }
}
