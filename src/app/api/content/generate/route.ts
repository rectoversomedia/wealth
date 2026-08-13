import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/services/session-store';
import { getOpenAIClient } from '@/lib/ai/report-generator';

const CONTENT_PROMPTS: Record<string, string> = {
  linkedin_long: `Write a professional LinkedIn post (800–1000 words) for a financial advisor targeting expat professionals. The post should be educational, authoritative, and written in first person from the advisor's perspective. Include specific insights relevant to {{country}} {{audience}}. End with a soft CTA that invites conversation. Do NOT be salesy. Write as a knowledgeable peer sharing useful perspective.`,
  linkedin_short: `Write a concise, engaging LinkedIn post (150–250 words) for a financial advisor targeting {{country}} {{audience}}. Hook the reader in the first line. Be direct and specific. End with a question or invitation to reply — not a link or CTA.`,
  carousel: `Outline a LinkedIn carousel with 8–10 slides. For each slide give: slide number, headline (max 6 words), and 2–3 bullet points of content. Topic: {{topic}} for {{country}} {{audience}}. Make the slide structure compelling and educational, not a sales pitch.`,
  reels: `Write a 30–60 second video script for a financial advisor reel targeting {{country}} {{audience}}. Start with a strong hook. Include a key insight or myth-busting stat. End with a relatable call to reflection. Format as: HOOK | BODY (key points) | CLOSE.`,
  youtube_short: `Write a YouTube Shorts script (30–60 seconds, ~150 words) for a financial advisor targeting {{country}} {{audience}}. Hook immediately. Deliver one clear, actionable insight. Conversational tone. End with a question that sparks comments.`,
  email: `Write a nurture email (150–200 words) for a financial advisor. Subject line must be included. Warm, personal tone — like an email from a trusted colleague. Content: {{topic}} for {{country}} {{audience}}. End with a soft, specific CTA. Include the advisor name placeholder [Advisor Name].`,
  ad_variation: `Write 3 distinct ad copy variations for a financial advisor campaign targeting {{country}} {{audience}}. Each variation should have: a headline (max 10 words) and body copy (2 sentences). Vary the angle: first variation should be curiosity-gap, second should be authority/credibility, third should be empathy/relatability. No emojis.`,
  blog_outline: `Write a blog article outline for a financial advisor targeting {{country}} {{audience}}. Topic: {{topic}}. Structure as: Hook (1 sentence), 4–5 main sections with H2 headers and 3 bullet points each, and a conclusion with a CTA suggestion. Make it comprehensive and genuinely useful.`,
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { format, country, audience, topic } = await req.json();

    if (!format || !CONTENT_PROMPTS[format]) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    const prompt = CONTENT_PROMPTS[format]
      .replace(/\{\{country\}\}/g, country || 'their region')
      .replace(/\{\{audience\}\}/g, audience || 'audience')
      .replace(/\{\{topic\}\}/g, topic || 'financial planning');

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a world-class content writer for financial advisors. Your content is always educational, specific, and ethically written. Never make misleading claims. Never use emojis in the output. Write with confidence and clarity.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1200,
      temperature: 0.75,
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? '';

    return NextResponse.json({ content, format });
  } catch (err: any) {
    // Demo mode: return structured content when OpenAI is not configured
    if (err?.message?.includes('Incorrect API key') || err?.message?.includes('apiKey')) {
      return NextResponse.json({
        content: getDemoContent(req),
        format: 'demo',
      });
    }
    console.error('Content generation error:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

function getDemoContent(req: any): string {
  const { format, country, audience } = req ?? {};
  return `[Demo content — add OPENAI_API_KEY to .env.local to enable AI generation]

Format: ${format ?? 'unknown'}
Audience: ${audience ?? 'your target audience'}
Country: ${country ?? 'your market'}

This is placeholder content. Configure your OpenAI API key to generate real content using AI.`;
}
