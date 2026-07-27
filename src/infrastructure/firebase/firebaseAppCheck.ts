import { Platform } from 'react-native';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, type AppCheck } from 'firebase/app-check';
import { firebaseApp } from './firebaseApp';
import { Config } from '../config/env';

/**
 * Firebase App Check, backed by reCAPTCHA Enterprise.
 *
 * Web only. The reCAPTCHA Enterprise provider needs a DOM to score the session,
 * so it cannot run under React Native. Native builds attest via Play Integrity
 * (Android) / DeviceCheck (iOS), which require the @react-native-firebase native
 * modules rather than this JS SDK — wire those up when the Android build lands.
 *
 * Returns null when App Check is unavailable; the app then falls back to sending
 * only the Firebase ID token, which the API still accepts.
 *
 * Cost note: a reCAPTCHA assessment is billed per App Check *token issuance*,
 * not per API request. Token TTL is configured in the Firebase console (App
 * Check → Apps → TTL), not here; a longer TTL means fewer assessments.
 */
export const firebaseAppCheck: AppCheck | null = (() => {
  if (Platform.OS !== 'web') return null;
  if (!firebaseApp || !Config.RECAPTCHA_SITE_KEY) return null;

  try {
    return initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaEnterpriseProvider(Config.RECAPTCHA_SITE_KEY),
      // Firebase transparently refreshes the token at roughly half its TTL,
      // so getToken() stays cheap and never blocks on a fresh assessment.
      isTokenAutoRefreshEnabled: true,
    });
  } catch {
    // Already initialized (Fast Refresh) or reCAPTCHA failed to load.
    return null;
  }
})();
