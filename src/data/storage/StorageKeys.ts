/**
 * Canonical AsyncStorage key constants.
 * All keys are prefixed with @kidsaber/ to avoid collisions.
 */
export const StorageKeys = {
  SCHEMA_VERSION: '@kidsaber/schema_version',
  ACTIVE_PROFILE_ID: '@kidsaber/active_profile_id',
  PROFILES: '@kidsaber/profiles',
  PROGRESS: '@kidsaber/progress',
  /**
   * Stable device identifier generated on first launch.
   * Not a secret — used only so the backend can issue per-device tokens and
   * apply per-device rate limiting. Never sent as an auth credential by itself.
   */
  DEVICE_ID: '@kidsaber/device_id',
} as const;

export const CURRENT_SCHEMA_VERSION = 1;
