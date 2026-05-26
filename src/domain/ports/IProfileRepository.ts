import { type Profile } from '../entities/Profile';

/**
 * Port (interface) for the profile persistence layer.
 * Implementations live in src/data/repositories/.
 */
export interface IProfileRepository {
  getAll(): Promise<Profile[]>;
  getById(id: string): Promise<Profile | null>;
  save(profile: Profile): Promise<void>;
  update(id: string, updates: Partial<Pick<Profile, 'name' | 'grade'>>): Promise<void>;
  delete(id: string): Promise<void>;
  getActiveProfileId(): Promise<string | null>;
  setActiveProfileId(id: string): Promise<void>;
}
