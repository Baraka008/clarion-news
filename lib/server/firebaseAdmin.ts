import admin from 'firebase-admin';
import { isFirebaseServerConfigured } from '@/lib/config';

// Initialise lazily: importing this file must never throw when the keys are missing,
// otherwise every page and API route that touches the database fails to build.
function getAdminApp() {
  if (!isFirebaseServerConfigured) return null;
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  return admin;
}

export function getAdminDb() {
  return getAdminApp()?.firestore() ?? null;
}

export function getAdminStorage() {
  return getAdminApp()?.storage() ?? null;
}
