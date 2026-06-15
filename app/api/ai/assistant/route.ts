import { NextRequest, NextResponse } from 'next/server';

const tasks = {
  summarize: 'Summarize the article with a professional headline, summary, SEO description, tags, and suggested category.',
  rewrite: 'Rewrite the article text in neutral, short, and long versions.',
  headlines: 'Generate a standard headline, SEO headline, and social media headline.',
  'fact-check': 'Extract key facts, highlight claims requiring verification, and identify missing information.',
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { task?: keyof typeof tasks; text?: string };
  const { task, text } = body;

  if (!task || !text) {
    return NextResponse.json({ error: 'Missing task or text' }, { status: 400 });
  }

  const prompt = `${tasks[task] ?? tasks.summarize}\n\nArticle:\n${text}`;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
  }

  const response = await fetch('https://api.gemini.google.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gemini-1.0',
      prompt,
      max_output_tokens: 600,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: errorText }, { status: response.status });
  }

  const resultJson = await response.json();
  const result = resultJson?.candidates?.[0]?.content || resultJson?.output?.[0]?.content || JSON.stringify(resultJson);
  return NextResponse.json({ result });
}
