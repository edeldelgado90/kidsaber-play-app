import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalProfileRepository } from '../../src/data/repositories/LocalProfileRepository';
import { StorageKeys } from '../../src/data/storage/StorageKeys';
import type { Profile } from '../../src/domain/entities/Profile';

const mockAS = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const profile1: Profile = {
  id: 'p1',
  name: 'Ana',
  grade: 2,
  createdAt: '2024-01-01T00:00:00.000Z',
};
const profile2: Profile = {
  id: 'p2',
  name: 'Luis',
  grade: 4,
  createdAt: '2024-02-01T00:00:00.000Z',
};

function seedProfiles(profiles: Profile[]) {
  mockAS.getItem.mockImplementation(key => {
    if (key === StorageKeys.PROFILES) return Promise.resolve(JSON.stringify(profiles));
    return Promise.resolve(null);
  });
  mockAS.setItem.mockResolvedValue(undefined);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAS.getItem.mockResolvedValue(null);
  mockAS.setItem.mockResolvedValue(undefined);
  mockAS.removeItem.mockResolvedValue(undefined);
});

describe('LocalProfileRepository.getAll', () => {
  it('returns empty array when storage is empty', async () => {
    const repo = new LocalProfileRepository();
    expect(await repo.getAll()).toEqual([]);
  });

  it('returns stored profiles', async () => {
    seedProfiles([profile1]);
    const repo = new LocalProfileRepository();
    expect(await repo.getAll()).toEqual([profile1]);
  });

  it('returns empty array when stored data fails type guard', async () => {
    mockAS.getItem.mockResolvedValue(JSON.stringify([{ invalid: true }]));
    const repo = new LocalProfileRepository();
    expect(await repo.getAll()).toEqual([]);
  });
});

describe('LocalProfileRepository.getById', () => {
  it('returns the matching profile', async () => {
    seedProfiles([profile1, profile2]);
    const repo = new LocalProfileRepository();
    expect(await repo.getById('p2')).toEqual(profile2);
  });

  it('returns null when not found', async () => {
    seedProfiles([profile1]);
    const repo = new LocalProfileRepository();
    expect(await repo.getById('unknown')).toBeNull();
  });
});

describe('LocalProfileRepository.save', () => {
  it('appends a new profile', async () => {
    seedProfiles([profile1]);
    const repo = new LocalProfileRepository();
    await repo.save(profile2);

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Profile[];
    expect(saved).toHaveLength(2);
    expect(saved[1]).toEqual(profile2);
  });

  it('updates an existing profile in place', async () => {
    seedProfiles([profile1, profile2]);
    const repo = new LocalProfileRepository();
    const updated = { ...profile1, name: 'Ana Updated' };
    await repo.save(updated);

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Profile[];
    expect(saved).toHaveLength(2);
    expect(saved.find(p => p.id === 'p1')?.name).toBe('Ana Updated');
  });
});

describe('LocalProfileRepository.update', () => {
  it('merges partial updates into the profile', async () => {
    seedProfiles([profile1]);
    const repo = new LocalProfileRepository();
    await repo.update('p1', { name: 'Ana Nueva' });

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Profile[];
    expect(saved[0].name).toBe('Ana Nueva');
    expect(saved[0].grade).toBe(2);
  });

  it('throws when profile not found', async () => {
    seedProfiles([]);
    const repo = new LocalProfileRepository();
    await expect(repo.update('missing', { name: 'X' })).rejects.toThrow();
  });
});

describe('LocalProfileRepository.delete', () => {
  it('removes the profile with matching id', async () => {
    seedProfiles([profile1, profile2]);
    const repo = new LocalProfileRepository();
    await repo.delete('p1');

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Profile[];
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe('p2');
  });
});

describe('LocalProfileRepository.getActiveProfileId / setActiveProfileId', () => {
  it('returns null when no active profile stored', async () => {
    const repo = new LocalProfileRepository();
    expect(await repo.getActiveProfileId()).toBeNull();
  });

  it('returns stored active profile id', async () => {
    mockAS.getItem.mockImplementation(key => {
      if (key === StorageKeys.ACTIVE_PROFILE_ID) return Promise.resolve('p1');
      return Promise.resolve(null);
    });
    const repo = new LocalProfileRepository();
    expect(await repo.getActiveProfileId()).toBe('p1');
  });

  it('stores the active profile id', async () => {
    const repo = new LocalProfileRepository();
    await repo.setActiveProfileId('p2');
    expect(mockAS.setItem).toHaveBeenCalledWith(StorageKeys.ACTIVE_PROFILE_ID, 'p2');
  });
});
