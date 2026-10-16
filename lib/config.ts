// Clarion runs in two modes:
// - live: Firebase keys are set, so articles, comments and uploads use Firestore and Storage.
// - demo: no keys yet, so the site serves the built-in sample stories in lib/demo instead of crashing.

export const isFirebaseServerConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY,
);

export const isFirebaseClientConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
);

export const isDemoMode = !isFirebaseServerConfigured;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
