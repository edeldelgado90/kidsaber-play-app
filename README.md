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
| Persistence | AsyncStorage (local, no auth)               |
| Font        | Nunito via @expo-google-fonts               |
| Icons       | @expo/vector-icons (MaterialCommunityIcons) |

## Getting started

### Prerequisites

- Node.js 20+
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
.github/workflows/    CI (ci.yml) and CD (deploy.yml)
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

- **CI**: GitHub Actions — lint + typecheck + tests on every push/PR
- **CD (Android)**: EAS Build + EAS Submit — AAB to Google Play internal track on `main`
- **CD (web)**: Cloudflare Pages builds on every push, straight from the Git integration

Required GitHub secrets:

- `EXPO_TOKEN` — from expo.dev account settings
- `EXPO_PUBLIC_API_URL` — questions API base URL
- `GOOGLE_SERVICE_ACCOUNT_KEY` — Google Play API access JSON

## Deploy web (Cloudflare Pages)

The web build is a static export: `npm run build:web` runs `expo export -p web`
and copies `+not-found.html` to `404.html`, the filename Cloudflare Pages serves
for unmatched routes. Everything in `public/` (currently `_headers`) is copied to
the export root.

**One-time setup** — Cloudflare dashboard → Workers & Pages → Create → Connect to Git:

| Setting | Value |
|---------|-------|
| Project name | `kidsaber-play` (defines the `*.pages.dev` URL) |
| Production branch | `main` |
| Build command | `npm run build:web` |
| Output directory | `dist` |

Then add the `EXPO_PUBLIC_*` variables under Settings → Environment variables, for
**both** Production and Preview. Expo inlines them at build time, so a missing
variable silently ships a broken bundle rather than failing the build — except
`EXPO_PUBLIC_API_URL`, which must be `https://` or the export aborts.

**The API must allow the origin.** `CORS_ALLOWED_ORIGINS` on the API has to list
the Pages URLs, or the browser blocks every request:

```
https://kidsaber-play.pages.dev,https://*.kidsaber-play.pages.dev
```

The wildcard covers the per-deployment preview hostnames. The app authenticates
with a Firebase anonymous ID token sent as `Authorization: Bearer <idToken>`;
the API accepts it when `FIREBASE_PROJECT_ID` is configured there.

Before the first deploy, confirm in Firebase Console → Authentication → Settings
→ Authorized domains that the Pages domain is allowed, and check whether the web
API key has HTTP referrer restrictions that would exclude it.

## Environment variables

See `.env.example`:

```
EXPO_PUBLIC_API_URL=http://localhost:8080
```

Never commit `.env` — only `.env.example`.
