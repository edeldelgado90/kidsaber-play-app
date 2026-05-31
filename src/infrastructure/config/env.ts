/**
 * Environment variable access.
 * Expo exposes EXPO_PUBLIC_* variables at build time.
 * Never hardcode URLs or keys — always use env vars.
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

if (!API_URL && process.env.NODE_ENV !== 'test') {
  console.warn(
    '[KidSaber] EXPO_PUBLIC_API_URL is not set. API calls will fail. ' +
      'Copy .env.example to .env and fill in the value.',
  );
}

// Enforce HTTPS in production to prevent transmitting bearer tokens over plain HTTP.
if (API_URL && !API_URL.startsWith('https://') && process.env.NODE_ENV === 'production') {
  throw new Error('[KidSaber] EXPO_PUBLIC_API_URL must use https:// in production.');
}

const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '';
const FIREBASE_AUTH_DOMAIN = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '';
const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '';
const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '';

if (process.env.NODE_ENV !== 'test') {
  const missingFirebase = [
    !FIREBASE_API_KEY && 'EXPO_PUBLIC_FIREBASE_API_KEY',
    !FIREBASE_AUTH_DOMAIN && 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    !FIREBASE_PROJECT_ID && 'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    !FIREBASE_APP_ID && 'EXPO_PUBLIC_FIREBASE_APP_ID',
  ].filter(Boolean);

  if (missingFirebase.length > 0) {
    console.warn(
      `[KidSaber] Missing Firebase config vars: ${missingFirebase.join(', ')}. ` +
        'Anonymous auth will fail. Copy .env.example to .env and fill in the values.',
    );
  }
}

export const Config = {
  /** Base URL for the KidSaber questions API. Example: https://api.kidsaber.example.com */
  API_URL,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_APP_ID,
} as const;
