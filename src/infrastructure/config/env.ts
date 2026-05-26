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

export const Config = {
  /** Base URL for the KidSaber questions API. Example: https://api.kidsaber.example.com */
  API_URL,
} as const;
