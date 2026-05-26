import { type Profile } from '../../domain/entities/Profile';
import { type IProfileRepository } from '../../domain/ports/IProfileRepository';
import { AsyncStorageAdapter } from '../storage/AsyncStorageAdapter';
import { StorageKeys } from '../storage/StorageKeys';

// Type guard for Profile array
function isProfileArray(val: unknown): val is Profile[] {
  if (!Array.isArray(val)) return false;
  return val.every(
    p =>
      typeof p === 'object' &&
      p !== null &&
      typeof (p as Profile).id === 'string' &&
      typeof (p as Profile).name === 'string' &&
      typeof (p as Profile).grade === 'number' &&
      (p as Profile).grade >= 1 &&
      (p as Profile).grade <= 6 &&
      typeof (p as Profile).createdAt === 'string',
  );
}

/**
 * AsyncStorage-backed repository for child profiles.
 * Validates all data on read to handle schema changes gracefully.
 */
export class LocalProfileRepository implements IProfileRepository {
  async getAll(): Promise<Profile[]> {
    const profiles = await AsyncStorageAdapter.get(StorageKeys.PROFILES, isProfileArray);
    return profiles ?? [];
  }

  async getById(id: string): Promise<Profile | null> {
    const all = await this.getAll();
    return all.find(p => p.id === id) ?? null;
  }

  async save(profile: Profile): Promise<void> {
    const all = await this.getAll();
    const existing = all.findIndex(p => p.id === profile.id);
    if (existing >= 0) {
      all[existing] = profile;
    } else {
      all.push(profile);
    }
    await AsyncStorageAdapter.set(StorageKeys.PROFILES, all);
  }

  async update(id: string, updates: Partial<Pick<Profile, 'name' | 'grade'>>): Promise<void> {
    const all = await this.getAll();
    const index = all.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Profile ${id} not found`);

    all[index] = { ...all[index], ...updates };
    await AsyncStorageAdapter.set(StorageKeys.PROFILES, all);
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter(p => p.id !== id);
    await AsyncStorageAdapter.set(StorageKeys.PROFILES, filtered);
  }

  async getActiveProfileId(): Promise<string | null> {
    return AsyncStorageAdapter.getString(StorageKeys.ACTIVE_PROFILE_ID);
  }

  async setActiveProfileId(id: string): Promise<void> {
    await AsyncStorageAdapter.setString(StorageKeys.ACTIVE_PROFILE_ID, id);
  }
}
