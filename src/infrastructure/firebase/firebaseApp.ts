import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, inMemoryPersistence, type Auth } from 'firebase/auth';
import { Config } from '../config/env';

const isFirebaseConfigured =
  Boolean(Config.FIREBASE_API_KEY) &&
  Boolean(Config.FIREBASE_AUTH_DOMAIN) &&
  Boolean(Config.FIREBASE_PROJECT_ID) &&
  Boolean(Config.FIREBASE_APP_ID);

// Returns null when Firebase env vars are absent (e.g. local dev without credentials).
// QuestionsApiService accepts an optional token provider, so the app works without auth.
export const firebaseAuth: Auth | null = (() => {
  if (!isFirebaseConfigured) return null;

  const app =
    getApps().length === 0
      ? initializeApp({
          apiKey: Config.FIREBASE_API_KEY,
          authDomain: Config.FIREBASE_AUTH_DOMAIN,
          projectId: Config.FIREBASE_PROJECT_ID,
          appId: Config.FIREBASE_APP_ID,
        })
      : getApp();

  // initializeAuth throws if called more than once (e.g. Fast Refresh). Fall
  // back to getAuth() which returns the already-initialized instance.
  // inMemoryPersistence is intentional: anonymous auth is only used to issue
  // bearer tokens. All user profile/progress state lives in AsyncStorage, so
  // the Firebase UID does not need to survive process restarts.
  try {
    return initializeAuth(app, { persistence: inMemoryPersistence });
  } catch {
    return getAuth(app);
  }
})();
