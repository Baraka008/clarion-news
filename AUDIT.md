# Repository audit — first pass

## Findings
- Next.js 14.2.5 application with Firebase client/admin dependencies.
- The `lint` script uses `next lint`; confirm compatibility with the installed Next.js CLI and ESLint configuration in CI.
- React 18 is paired with `@types/react` 19; align React type packages with the actual React major to avoid misleading type errors.
- Review Firestore and Storage rules, server-only Firebase Admin imports, and environment-variable handling before production deployment.
- Vercel is a suitable hosting target; Firebase services still require their own project configuration.

## Verification
Package manifest and repository structure inspected; build and rules emulator checks not run.