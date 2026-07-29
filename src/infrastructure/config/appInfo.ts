/**
 * Static app identity surfaced in the UI (version footer + "Acerca de" screen).
 *
 * The real build number lives on the EAS server — eas.json sets
 * `appVersionSource: "remote"`, so it never appears in app.json and only exists
 * inside the native binary. expo-application reads it from there; on web and in
 * Expo Go it is null and the UI shows the version on its own.
 */

import * as Application from 'expo-application';
import Constants from 'expo-constants';

const VERSION = Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? '1.0.0';

const BUILD_NUMBER = Application.nativeBuildVersion ?? null;

// Optional: kept out of the source so no personal address is committed, and so
// the address can change without a code change. Empty hides the contact row.
const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? '';

export const AppInfo = {
  name: 'KidSaber Play',
  version: VERSION,
  buildNumber: BUILD_NUMBER,
  /** "1.0.0 (12)" on a native build, "1.0.0" where no build number exists. */
  versionLabel: BUILD_NUMBER ? `${VERSION} (${BUILD_NUMBER})` : VERSION,
  supportEmail: SUPPORT_EMAIL,
  /** Matches the year in LICENSE; the holder is the product, not a person. */
  copyright: '© 2026 KidSaber Play',
  license: 'MIT',
} as const;
