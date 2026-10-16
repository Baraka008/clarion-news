import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/server/firebaseAdmin';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = body.email?.toLowerCase()?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const db = getAdminDb();
  if (!db) {
    // Demo mode: accept the sign-up so the form can be tried, but nothing is stored.
    return NextResponse.json({ success: true, demo: true });
  }

  await db.collection('NewsletterSubscribers').doc(email).set({
    email,
    subscribedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
