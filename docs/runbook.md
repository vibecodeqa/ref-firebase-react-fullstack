# Operations Runbook

## Local development

1. Install dependencies with `pnpm install`.
2. Run `pnpm dev` to start Firebase emulators.
3. In another terminal, run `pnpm --filter @vcqa-ref/web dev`.
4. Open `http://localhost:5173`.

The web app can call the emulated Function through Firebase Hosting at
`http://localhost:5000/api/projects`.

## Secrets and config

- Client Firebase config must use public web app identifiers only.
- Production service-account JSON must never be committed.
- Function secrets must be stored with Firebase secret params or the deployment platform's
  secret store.
- Local-only overrides belong in `.env.local`, which is ignored.

## Deploy gates

Production deploys should require:

- clean `pnpm ci`
- reviewed Firestore rules/index changes
- protected GitHub environment approval
- Firebase project alias confirmation
- post-deploy smoke check for `/`, `/api/health`, and Firestore owner access

## Rollback

Hosting rollback and Functions rollback are separate from Firestore data recovery. If a
bad deploy writes bad data, fix-forward or restore data explicitly rather than assuming a
code rollback repairs state.

