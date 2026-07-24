# VCQA Report

Score: **91/100**

This reference repo is intentionally small, but it carries the evidence VCQA expects from a
Firebase React Fullstack project.

## Covered by authored standards

- [React SPA v1](https://vibecodeqa.online/standards/react-spa/v1/): Vite React app,
  static build output, SPA fallback, public client config discipline, and UI tests.
- [Security v1](https://vibecodeqa.online/standards/security/v1/): server-side API auth,
  runtime validation, denied-by-default Firestore/Storage rules, hosting headers, and
  least-privilege CI permissions.
- [Testing v1](https://vibecodeqa.online/standards/testing/v1/): unit tests for shared
  contracts, frontend behavior tests, API helper tests, and emulator-backed rules tests.
- [TypeScript v1](https://vibecodeqa.online/standards/typescript/v1/): strict shared,
  web, functions, and rules-test TypeScript projects with explicit local typecheck scripts.

## Firebase-specific evidence

- `firebase.json` declares Hosting, Functions, Firestore, Storage, and emulator ports.
- Hosting sends security headers and rewrites `/api/**` to the `api` Function before SPA
  fallback.
- `firestore.rules` restricts profile/project access by authenticated user ownership and
  denies all unmatched paths.
- `firestore.indexes.json` tracks query indexes used by the API and app.
- `rules-tests/` uses the Firestore emulator to prove owner access and deny cross-user
  access.
- `functions/src/index.ts` validates request bodies with shared schemas before writing to
  Firestore.

## Remaining standard gaps

- Firebase React Fullstack is not yet an authored VCQA rubric.
- Dependency Hygiene is still planned.
- Accessibility is still planned, though this fixture keeps semantic HTML and basic status
  regions.

## Why this is not 100

The repo intentionally avoids real Firebase project IDs, real deploy credentials, and a
production release environment. A production app should add protected deploy environments,
App Check enforcement policy, monitored backup/restore procedures, and incident runbooks.

