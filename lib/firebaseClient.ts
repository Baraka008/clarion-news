import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export type FirebaseClientServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
};

let cachedServices: FirebaseClientServices | undefined;

/**
 * Initialize Firebase only in the browser, when a feature actually needs it.
 * This keeps Next.js build/prerender steps independent from deployment secrets.
 */
export function getFirebaseClient(): FirebaseClientServices {
  if (typeof window === 'undefined') {
    throw new Error('Firebase client services are available only in the browser.');
  }
  if (cachedServices) return cachedServices;

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missing = Object.entries(config)
    .filter(([key, value]) => key !== 'storageBucket' && !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Firebase is not configured. Add these public environment variables: ${missing.join(', ')}.`);
  }

  const app = getApps().length ? getApp() : initializeApp(config);
  cachedServices = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };
  return cachedServices;
}
