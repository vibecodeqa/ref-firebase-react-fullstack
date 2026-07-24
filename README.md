# Firebase React Fullstack Reference

Reference implementation for the VibeCode QA Firebase React Fullstack stack.

This repo models the Firebase platform shape that appears repeatedly in local product repos:

- `web/`: Vite + React + TypeScript app hosted by Firebase Hosting
- `functions/`: Firebase Functions v2 HTTP API
- `shared/`: shared TypeScript contracts and runtime schemas
- `rules-tests/`: Firestore security rules tests
- `firebase.json`, `firestore.rules`, and `firestore.indexes.json` as deployable evidence

## Local workflow

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm test:rules
```

Run the app and emulators together:

```bash
pnpm dev
```

The demo project ID is `demo-vcqa-ref-firebase`. Do not put real production project IDs,
service-account JSON, API keys, or secrets in this repo.

## VCQA role

This repo is a scanner fixture and template for:

- Firebase Hosting SPA fallback and security headers
- same-origin `/api/**` rewrites to Functions
- Functions boundary auth, validation, and error handling
- Firestore rules and index evidence
- shared TypeScript contracts across app and API
- emulator-backed rules tests
- CI gates for typecheck, tests, build, and Firebase rules

See [docs/vcqa-report.md](docs/vcqa-report.md).

