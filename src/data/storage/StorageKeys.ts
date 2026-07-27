/**
 * Canonical AsyncStorage key constants.
 * All keys are prefixed with @kidsaber/ to avoid collisions.
 */
export const StorageKeys = {
  SCHEMA_VERSION: '@kidsaber/schema_version',
  ACTIVE_PROFILE_ID: '@kidsaber/active_profile_id',
  PROFILES: '@kidsaber/profiles',
  PROGRESS: '@kidsaber/progress',
} as const;

export const CURRENT_SCHEMA_VERSION = 1;
