import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body.email?.toLowerCase()?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const collection = adminDb.collection('NewsletterSubscribers');
  await collection.doc(email).set({
    email,
    subscribedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
