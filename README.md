# Clarion Feature

A responsive newsroom platform built with Next.js, Tailwind CSS, Firebase Auth/Firestore/Storage, and Gemini AI.

## Local setup

1. Install Node.js 22 or newer.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Fill in the Firebase web configuration, Firebase Admin service-account values, and Gemini API key.
5. Start the app: `npm run dev`.

## Environment variables

- `NEXT_PUBLIC_FIREBASE_*`: Firebase browser configuration. These values are public client configuration, not service-account secrets.
- `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`: server-only Firebase Admin credentials. Keep them in Vercel encrypted environment variables and never commit real values.
- `GEMINI_API_KEY`: server-only Google Gemini key. Never expose it to browser code.

## Admin access

Firebase Auth sign-in is required. Add an authenticated user document to the Firestore `Users` collection with `role: "admin"` or `role: "editor"`. The AI assistant and image upload API routes verify the Firebase ID token and editor role on the server; the client-side admin screen is not treated as the security boundary.

## Deployment

Vercel is configured for this repository. Add the environment variables above to the Vercel project before expecting Firebase-backed admin, newsletter, upload, or AI features to work. The homepage has fallback editorial content if Firestore is unavailable.

## Verification

`npm run build` is run by GitHub Actions on pull requests and pushes to the improvement branch. The workflow does not require real production credentials to compile and prerender the public site.
