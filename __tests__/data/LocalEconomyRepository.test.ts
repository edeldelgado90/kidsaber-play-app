import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalEconomyRepository } from '../../src/data/repositories/LocalEconomyRepository';
import { StorageKeys } from '../../src/data/storage/StorageKeys';
import { type Economy } from '../../src/domain/entities/Economy';

const mockAS = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

function seedEconomy(economy: Economy) {
  mockAS.getItem.mockImplementation(key => {
    if (key === StorageKeys.ECONOMY) return Promise.resolve(JSON.stringify(economy));
    return Promise.resolve(null);
  });
  mockAS.setItem.mockResolvedValue(undefined);
}

function lastSaved(): Economy {
  const calls = (mockAS.setItem as jest.Mock).mock.calls;
  return JSON.parse(calls[calls.length - 1][1] as string) as Economy;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAS.getItem.mockResolvedValue(null);
  mockAS.setItem.mockResolvedValue(undefined);
});

describe('LocalEconomyRepository', () => {
  it('returns empty economy when nothing is stored', async () => {
    const repo = new LocalEconomyRepository();
    expect(await repo.getEconomy()).toEqual({ byProfileId: {} });
    expect(await repo.getProfileEconomy('p1')).toBeNull();
  });

  it('creditStar increments both counters, starting from zero', async () => {
    const repo = new LocalEconomyRepository();
    await repo.creditStar('p1');

    expect(lastSaved().byProfileId['p1']).toEqual({
      lifetimeStarsEarned: 1,
      starWalletBalance: 1,
    });
  });

  it('creditStar increments existing counters', async () => {
    seedEconomy({ byProfileId: { p1: { lifetimeStarsEarned: 7, starWalletBalance: 3 } } });
    const repo = new LocalEconomyRepository();
    await repo.creditStar('p1');

    expect(lastSaved().byProfileId['p1']).toEqual({
      lifetimeStarsEarned: 8,
      starWalletBalance: 4,
    });
  });

  it('saveProfileEconomy overwrites a single profile', async () => {
    seedEconomy({ byProfileId: { p1: { lifetimeStarsEarned: 7, starWalletBalance: 3 } } });
    const repo = new LocalEconomyRepository();
    await repo.saveProfileEconomy('p1', { lifetimeStarsEarned: 7, starWalletBalance: 1 });

    expect(lastSaved().byProfileId['p1']).toEqual({
      lifetimeStarsEarned: 7,
      starWalletBalance: 1,
    });
  });

  it('resetEconomy removes only that profile', async () => {
    seedEconomy({
      byProfileId: {
        p1: { lifetimeStarsEarned: 1, starWalletBalance: 1 },
        p2: { lifetimeStarsEarned: 2, starWalletBalance: 2 },
      },
    });
    const repo = new LocalEconomyRepository();
    await repo.resetEconomy('p1');

    const saved = lastSaved();
    expect(saved.byProfileId['p1']).toBeUndefined();
    expect(saved.byProfileId['p2']).toBeDefined();
  });
});
