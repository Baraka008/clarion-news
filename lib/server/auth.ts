import type { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/server/firebaseAdmin';

export async function requireEditor(request: NextRequest): Promise<boolean> {
  const authorization = request.headers.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;

  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    const snapshot = await adminDb.collection('Users').doc(decoded.uid).get();
    const role = snapshot.data()?.role;
    return role === 'admin' || role === 'editor';
  } catch {
    return false;
  }
}
