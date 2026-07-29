import { type Economy, type ProfileEconomy } from '../../domain/entities/Economy';
import { type IEconomyRepository } from '../../domain/ports/IEconomyRepository';
import { AsyncStorageAdapter } from '../storage/AsyncStorageAdapter';
import { StorageKeys } from '../storage/StorageKeys';

function isProfileEconomy(val: unknown): val is ProfileEconomy {
  if (typeof val !== 'object' || val === null) return false;
  const eco = val as ProfileEconomy;
  return typeof eco.lifetimeStarsEarned === 'number' && typeof eco.starWalletBalance === 'number';
}

function isEconomy(val: unknown): val is Economy {
  if (typeof val !== 'object' || val === null) return false;
  const eco = val as Economy;
  if (typeof eco.byProfileId !== 'object' || eco.byProfileId === null) return false;
  return Object.values(eco.byProfileId).every(isProfileEconomy);
}

/**
 * AsyncStorage-backed repository for the star economy
 * (lifetime earned vs. spendable wallet, per child profile).
 */
export class LocalEconomyRepository implements IEconomyRepository {
  private async loadEconomy(): Promise<Economy> {
    const stored = await AsyncStorageAdapter.get(StorageKeys.ECONOMY, isEconomy);
    return stored ?? { byProfileId: {} };
  }

  private async saveEconomy(economy: Economy): Promise<void> {
    await AsyncStorageAdapter.set(StorageKeys.ECONOMY, economy);
  }

  async getEconomy(): Promise<Economy> {
    return this.loadEconomy();
  }

  async getProfileEconomy(profileId: string): Promise<ProfileEconomy | null> {
    const economy = await this.loadEconomy();
    return economy.byProfileId[profileId] ?? null;
  }

  async saveProfileEconomy(profileId: string, profileEconomy: ProfileEconomy): Promise<void> {
    const economy = await this.loadEconomy();
    economy.byProfileId[profileId] = profileEconomy;
    await this.saveEconomy(economy);
  }

  async creditStar(profileId: string): Promise<void> {
    const economy = await this.loadEconomy();
    const current = economy.byProfileId[profileId] ?? {
      lifetimeStarsEarned: 0,
      starWalletBalance: 0,
    };
    economy.byProfileId[profileId] = {
      lifetimeStarsEarned: current.lifetimeStarsEarned + 1,
      starWalletBalance: current.starWalletBalance + 1,
    };
    await this.saveEconomy(economy);
  }

  async resetEconomy(profileId: string): Promise<void> {
    const economy = await this.loadEconomy();
    delete economy.byProfileId[profileId];
    await this.saveEconomy(economy);
  }
}
