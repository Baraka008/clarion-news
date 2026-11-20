export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/server/auth';

const tasks = {
  summarize: 'Summarize the article with a professional headline, summary, SEO description, tags, and suggested category.',
  rewrite: 'Rewrite the article in a clear, neutral journalistic style. Preserve the facts and do not invent quotes or sources.',
  headlines: 'Generate a standard headline, an SEO headline, and a social media headline.',
  'fact-check': 'Extract verifiable claims, identify claims requiring independent verification, and list missing context. Do not claim that a claim is verified unless evidence is supplied.',
};

export async function POST(request: NextRequest) {
  if (!(await requireEditor(request))) {
    return NextResponse.json({ error: 'You must be signed in as an editor to use this tool.' }, { status: 401 });
  }

  let body: { task?: keyof typeof tasks; text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { task, text } = body;
  if (!task || !(task in tasks) || typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Choose a valid task and provide article text.' }, { status: 400 });
  }
  if (text.length > 15_000) {
    return NextResponse.json({ error: 'Article text must be 15,000 characters or fewer.' }, { status: 413 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key is not configured on the server.' }, { status: 503 });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${tasks[task]}\n\nArticle:\n${text}` }] }],
          generationConfig: { maxOutputTokens: 900, temperature: 0.2 },
        }),
        signal: AbortSignal.timeout(30_000),
      },
    );

    if (!response.ok) {
      console.error('Gemini request failed with status:', response.status);
      return NextResponse.json({ error: 'The AI provider could not complete the request.' }, { status: 502 });
    }

    const resultJson = await response.json();
    const result = resultJson?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || '')
      .join('\n')
      .trim();

    if (!result) {
      return NextResponse.json({ error: 'The AI provider returned an empty response.' }, { status: 502 });
    }
    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI assistant request failed:', error);
    return NextResponse.json({ error: 'The AI service is temporarily unavailable.' }, { status: 502 });
  }
}
