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

export const Config = {
  /** Base URL for the KidSaber questions API. Example: https://api.kidsaber.example.com */
  API_URL,
} as const;
