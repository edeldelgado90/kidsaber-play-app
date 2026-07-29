/**
 * Canonical AsyncStorage key constants.
 * All keys are prefixed with @kidsaber/ to avoid collisions.
 */
export const StorageKeys = {
  SCHEMA_VERSION: '@kidsaber/schema_version',
  ACTIVE_PROFILE_ID: '@kidsaber/active_profile_id',
  PROFILES: '@kidsaber/profiles',
  PROGRESS: '@kidsaber/progress',
  PETS: '@kidsaber/pets',
  ECONOMY: '@kidsaber/economy',
  PET_INTRO_SEEN: '@kidsaber/pet_intro_seen',
} as const;

// v2: pet + star economy added (v1.5 feature). Profiles without economy data
// are seeded from historic stars on first load (EnsureEconomySeeded).
export const CURRENT_SCHEMA_VERSION = 2;
