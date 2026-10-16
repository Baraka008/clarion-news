import { NextRequest, NextResponse } from 'next/server';

const tasks = {
  summarize: 'Summarize the article with a professional headline, summary, SEO description, tags, and suggested category.',
  rewrite: 'Rewrite the article text in neutral, short, and long versions.',
  headlines: 'Generate a standard headline, SEO headline, and social media headline.',
  'fact-check': 'Extract key facts, highlight claims requiring verification, and identify missing information.',
};

type Task = keyof typeof tasks;

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { task?: Task; text?: string };
  const { task, text } = body;

  if (!task || !text?.trim()) {
    return NextResponse.json({ error: 'Missing task or text' }, { status: 400 });
  }
  const taskKey: Task = task in tasks ? task : 'summarize';

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // No key yet: answer with a simple built-in helper so the assistant is still usable.
    return NextResponse.json({ result: offlineAssist(taskKey, text), mode: 'offline' });
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${tasks[taskKey]}\n\nArticle:\n${text}` }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: `Gemini request failed (${response.status}): ${errorText}` }, { status: 502 });
  }

  const resultJson = await response.json();
  const parts: Array<{ text?: string }> = resultJson?.candidates?.[0]?.content?.parts ?? [];
  const result = parts.map((part) => part.text ?? '').join('').trim();
  return NextResponse.json({ result: result || 'Gemini returned an empty response.', mode: 'gemini' });
}

function sentencesOf(text: string) {
  return text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
}

function keywordsOf(text: string, count = 5) {
  const stop = new Set('the a an and or but of to in on for with at by from is are was were be been it this that as its their they them his her our we you your will would can could has have had not more most into than then also about after before over under'.split(' '));
  const freq = new Map<string, number>();
  for (const word of text.toLowerCase().match(/[a-z][a-z'-]{3,}/g) ?? []) {
    if (!stop.has(word)) freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, count).map(([word]) => word);
}

function offlineAssist(task: Task, text: string) {
  const sentences = sentencesOf(text);
  const first = sentences[0] ?? text.trim();
  const keywords = keywordsOf(text);
  const headline = first.replace(/[.!?]+$/, '').slice(0, 90);
  const note = '(Offline helper. Add GEMINI_API_KEY to .env.local for AI-written results.)';

  switch (task) {
    case 'headlines':
      return [
        `Headline: ${headline}`,
        `SEO headline: ${headline.slice(0, 60)}${keywords[0] ? ` | ${keywords[0]}` : ''}`,
        `Social headline: ${headline}${keywords.length ? ` #${keywords.slice(0, 2).join(' #')}` : ''}`,
        '',
        note,
      ].join('\n');
    case 'rewrite':
      return [
        `Short version:\n${sentences.slice(0, 2).join(' ')}`,
        '',
        `Long version:\n${sentences.join(' ')}`,
        '',
        note,
      ].join('\n');
    case 'fact-check': {
      const claims = sentences.filter((s) => /\d|%|said|according|report|percent|million|billion/i.test(s));
      return [
        'Claims to verify:',
        ...(claims.length ? claims.map((c) => `- ${c}`) : ['- No numbers, quotes or attributed claims found.']),
        '',
        'Check before publishing: named sources, dates, figures and any direct quotes.',
        '',
        note,
      ].join('\n');
    }
    default:
      return [
        `Headline: ${headline}`,
        `Summary: ${sentences.slice(0, 2).join(' ')}`,
        `SEO description: ${(sentences[0] ?? '').slice(0, 155)}`,
        `Tags: ${keywords.join(', ') || 'none found'}`,
        '',
        note,
      ].join('\n');
  }
}
