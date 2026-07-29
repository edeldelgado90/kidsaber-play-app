import { type Economy, type ProfileEconomy } from '../entities/Economy';

/**
 * Port for persisting the star economy (lifetime earned / spendable wallet).
 */
export interface IEconomyRepository {
  getEconomy(): Promise<Economy>;
  getProfileEconomy(profileId: string): Promise<ProfileEconomy | null>;
  saveProfileEconomy(profileId: string, economy: ProfileEconomy): Promise<void>;
  /** Increments both lifetime and wallet counters by 1 (star earned in a session). */
  creditStar(profileId: string): Promise<void>;
  /** Removes economy data of a profile (used when the profile is deleted). */
  resetEconomy(profileId: string): Promise<void>;
}
