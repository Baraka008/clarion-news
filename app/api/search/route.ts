import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/db/articles';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const from = searchParams.get('from') || undefined;
  const to = searchParams.get('to') || undefined;

  const results = await searchArticles(q, category, from, to);
  return NextResponse.json({ results });
}
