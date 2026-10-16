# Clarion Feature

A modern news platform built with Next.js 14 (App Router), Tailwind CSS, Firebase and Gemini AI.

## Quick start (demo mode)

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no Firebase keys, Clarion runs in **demo mode**:

- the site is filled with built-in sample stories (`lib/demo/articles.ts`) and local cover art (`public/demo`)
- home, categories, article pages and search all work
- comments are saved in your browser only
- the admin dashboard is open to everyone, and saving articles is disabled
- the AI assistant uses a simple offline helper

A yellow banner on every page shows when demo mode is on.

## Going live with Firebase

1. Create a Firebase project with Authentication (Google provider), Firestore and Storage.
2. Copy `.env.example` to `.env.local` and fill in the web app config and an Admin service account key.
3. Deploy the security rules: `firebase deploy --only firestore:rules,storage`.
4. Give your account access to the dashboard: create a `Users/{your uid}` document with `role: "admin"`.
   The Firestore and Storage rules check a `role` custom claim, so also set that claim on your user
   (for example with the Admin SDK: `auth.setCustomUserClaims(uid, { role: 'admin' })`).
5. Restart the server. The demo banner disappears and articles come from the `Articles` collection.

## AI assistant

Add `GEMINI_API_KEY` (from https://aistudio.google.com/apikey) to `.env.local`. `GEMINI_MODEL` defaults to `gemini-2.5-flash`.

## Scripts

- `npm run dev` start the dev server
- `npm run build` production build
- `npm start` serve the production build

## Architecture

- `app/` pages and API routes (`/api/search`, `/api/subscribe`, `/api/upload-image`, `/api/ai/assistant`)
- `lib/db/` data access; uses Firestore when configured and the demo stories otherwise
- `lib/server/firebaseAdmin.ts` lazily initialised Admin SDK (never throws when keys are missing)
- `lib/firebaseClient.ts` browser SDK; exports `null` in demo mode
- `components/` UI, including the shared `ArticleForm` used to create and edit stories
