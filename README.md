# KidSaber Play — App

React Native + Expo app for KidSaber Play — an educational game-style experience for children (Primary Education in Spain, 1.º–6.º).

## Tech stack

| Layer       | Tech                                        |
| ----------- | ------------------------------------------- |
| Framework   | React Native + Expo ~53                     |
| Navigation  | Expo Router ~4                              |
| Language    | TypeScript 5 (strict)                       |
| State       | Zustand ^5                                  |
| UI          | React Native Paper ^5 (MD3)                 |
| Persistence | AsyncStorage (local, no accounts)           |
| Client auth | Firebase anonymous ID token + App Check     |
| Font        | Nunito via @expo-google-fonts               |
| Icons       | @expo/vector-icons (MaterialCommunityIcons) |

## Getting started

### Prerequisites

- Node.js 20+ (CI and both deploy workflows run Node 24)
- npm 10+
- [Expo Go](https://expo.dev/client) on your phone (for development)
- Or Android emulator / iOS Simulator

### Setup

```bash
# 1. Clone the repo
git clone <repo-url> kidsaber-play-app
cd kidsaber-play-app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set EXPO_PUBLIC_API_URL to your backend URL
```

### Running the app

```bash
# Start Expo dev server
npx expo start

# Options:
# Press 'a' for Android emulator
# Press 'w' for web browser
# Scan QR code with Expo Go on physical device
```

### Running tests

```bash
# All tests
npm test

# With coverage
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

### Type checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
npm run format        # Fix Prettier issues
npm run format:check  # Check only
```

## Project structure

```
app/                  Expo Router routes (thin wrappers around screens)
src/
  domain/             Pure TypeScript — entities, use cases, port interfaces
  data/               Repository implementations, API client, storage adapters
  infrastructure/     Zustand stores, platform hooks, DI container, config
  presentation/       Screens, components, hooks, theme
assets/brand/         Logos (logo-full.png) + capybara images
__tests__/            Unit + component tests
.github/workflows/    CI (ci.yml), Android CD (deploy.yml), web CD (deploy-web.yml)
```

## Architecture

Clean Architecture with feature-based modules:

```
Presentation → Infrastructure → Domain ← Data
                    ↑                      ↑
               Zustand stores       Repositories
```

- **Domain**: entities + use cases — pure TypeScript, zero dependencies
- **Data**: repository implementations backed by AsyncStorage and the REST API
- **Infrastructure**: Zustand stores that wire domain use cases + platform utilities
- **Presentation**: screens + components + hooks that render and interact

## Questions API contract

The app fetches questions from the KidSaber questions backend (never calls AI directly):

```
GET /questions?subject={subject}&grade={grade}&type={type}&count=10
```

Response: `{ "questions": Question[] }`

Canonical answer field: **`correctAnswers`** (array).

## Navigation flow

```
/loading → /(onboarding)/setup (first run)
        → /(main)/subjects     (returning user)

/(main)/subjects
  → /(main)/games/[subject]
    → /(main)/play/[subject]/[gameType]
      → /(main)/evolution (after session)
  → /(main)/evolution (via header ⭐)
  → /(main)/pet       (via header 🏠)
  → /profiles         (via header profile chip)
```

## CI/CD

All workflows run on Node 24.

| Workflow         | Trigger                   | What it does                                                    |
| ---------------- | ------------------------- | --------------------------------------------------------------- |
| `ci.yml`         | every push / PR           | lint + typecheck + tests                                        |
| `deploy.yml`     | push to `main`            | EAS Build + Submit — AAB to Google Play internal track          |
| `deploy-web.yml` | push to `main`, or manual | builds the static web export and uploads it to Cloudflare Pages |

Required GitHub secrets, by workflow:

| Secret                             | Used by                                                                |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `EXPO_TOKEN`                       | `deploy.yml` — from expo.dev account settings                          |
| `GOOGLE_SERVICE_ACCOUNT_KEY`       | `deploy.yml` — Google Play API access JSON                             |
| `CLOUDFLARE_API_TOKEN`             | `deploy-web.yml` — custom token with Account → Cloudflare Pages → Edit |
| `CLOUDFLARE_ACCOUNT_ID`            | `deploy-web.yml` — Workers & Pages sidebar                             |
| `EXPO_PUBLIC_API_URL`              | `deploy-web.yml` — questions API base URL (must be `https://`)         |
| `EXPO_PUBLIC_FIREBASE_API_KEY`     | `deploy-web.yml`                                                       |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `deploy-web.yml`                                                       |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID`  | `deploy-web.yml`                                                       |
| `EXPO_PUBLIC_FIREBASE_APP_ID`      | `deploy-web.yml`                                                       |
| `EXPO_PUBLIC_RECAPTCHA_SITE_KEY`   | `deploy-web.yml` — reCAPTCHA Enterprise site key for App Check         |

`deploy-web.yml` fails on its first step if any of its secrets are missing, rather
than shipping a bundle with a silently empty value.

## Deploy web (Cloudflare Pages)

The web build is a static export uploaded by GitHub Actions via `wrangler`. The
Cloudflare Git integration is **not** used, so Cloudflare never builds anything —
it only receives the finished `dist/`. Build settings in the Cloudflare dashboard
are therefore irrelevant; the pipeline lives entirely in `deploy-web.yml`.

`npm run build:web` runs `expo export -p web --clear` and copies
`+not-found.html` to `404.html`, the filename Cloudflare Pages serves for
unmatched routes. `--clear` matters: Metro's transform cache is not keyed on
`EXPO_PUBLIC_*` values, so a warm cache can silently inline a stale API URL.
Everything in `public/` (currently `_headers`) is copied to the export root.

**One-time Cloudflare setup:**

1. **Account ID** — Workers & Pages sidebar. Store as the `CLOUDFLARE_ACCOUNT_ID` secret.
2. **Create the Pages project** — Workers & Pages → Create → Pages → _Upload assets_
   (not "Connect to Git"). Name it **`kidsaber-play`**: it must match
   `--project-name` in `deploy-web.yml` and it defines the `*.pages.dev` URL.
   Creation requires an initial upload; any placeholder works, the first Actions
   run replaces it.
3. **API token** — My Profile → API Tokens → Create Custom Token, permission
   **Account → Cloudflare Pages → Edit**, scoped to your account. Store as
   `CLOUDFLARE_API_TOKEN`.

Then add every `EXPO_PUBLIC_*` secret listed above under the repo's Settings →
Secrets and variables → Actions. Expo inlines them at build time, so they must be
present in the workflow environment, not in the Cloudflare dashboard.

**The API must allow the origin.** `CORS_ALLOWED_ORIGINS` on the API has to list
the Pages URLs, or the browser blocks every request:

```
https://kidsaber-play.pages.dev,https://*.kidsaber-play.pages.dev
```

`.pages.dev` is Cloudflare's own domain — the `dev` is part of the hostname, not
an environment marker. `kidsaber-play.pages.dev` _is_ the production URL. The
wildcard covers the per-deployment preview hostnames.

## Client authentication

The app sends two independent credentials; the API accepts either on its own
(`internal/adapter/http/middleware.go` in the API repo):

| Credential         | Header                            | Provided by                                                    |
| ------------------ | --------------------------------- | -------------------------------------------------------------- |
| Firebase ID token  | `Authorization: Bearer <idToken>` | anonymous sign-in, `FirebaseTokenService`                      |
| Firebase App Check | `X-Firebase-AppCheck`             | reCAPTCHA Enterprise, `FirebaseAppCheckService` — **web only** |

The ID token attests _who_ is calling (an anonymous UID); App Check attests _what_
is calling (a genuine app instance). Anyone can mint an anonymous ID token, so
App Check is what actually keeps unknown clients off the API. Native builds
attest via Play Integrity / DeviceCheck, which need the `@react-native-firebase`
native modules rather than the JS SDK — not wired up yet.

Both providers degrade to `null` on failure and the corresponding header is
simply omitted, so a reCAPTCHA outage cannot block gameplay.

**Firebase console setup**, in order:

1. Google Cloud → Security → reCAPTCHA → create a **Website**, **score-based**
   key. Domains: `kidsaber-play.pages.dev` and `localhost`. Registering a domain
   also covers its subdomains, so preview hostnames need no extra entries. Leave
   _Disable domain verification_ off.
2. Firebase Console → Authentication → Sign-in method → enable **Anonymous**.
3. Firebase Console → App Check → your Web app → provider **reCAPTCHA
   Enterprise**, paste the site key. Set the token **TTL to 7 days** under App
   Check → Apps: a reCAPTCHA assessment is billed per token issuance, not per API
   request, so a long TTL keeps usage inside the free 10,000/month tier.
4. Keep App Check in **monitor** mode until the Requests panel shows ~100%
   verified traffic, then switch to **enforce**.
5. Google Cloud → Credentials → restrict the web API key to HTTP referrers
   `kidsaber-play.pages.dev/*` and `*.kidsaber-play.pages.dev/*`.
6. Firebase Console → Authentication → Settings → Authorized domains: add
   `kidsaber-play.pages.dev`. Wildcards are not supported here, but this list
   only gates OAuth redirect flows, which anonymous sign-in does not use.

The API needs `AUTH_ENABLED=true` and `FIREBASE_PROJECT_ID` set to the same
project, otherwise it rejects both credentials.

## Environment variables

See `.env.example` for the full list with comments. Never commit `.env` — only
`.env.example`. Leaving the Firebase or reCAPTCHA values empty is supported: the
app then runs unauthenticated, which is the intended local-dev setup against an
API with `AUTH_ENABLED=false`.
