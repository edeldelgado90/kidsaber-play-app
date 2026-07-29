import { ensureEconomySeeded } from '../../src/domain/usecases/economy/EnsureEconomySeeded';
import { type IProgressRepository } from '../../src/domain/ports/IProgressRepository';
import { type Progress } from '../../src/domain/entities/Progress';
import { makeInMemoryEconomyRepo } from '../../test-utils/petFakes';

function makeProgressRepo(progress: Progress): jest.Mocked<IProgressRepository> {
  return {
    getProgress: jest.fn().mockResolvedValue(progress),
    addStar: jest.fn(),
    saveLastSession: jest.fn(),
    resetProgress: jest.fn(),
  };
}

describe('ensureEconomySeeded', () => {
  it('seeds profiles without economy from their historic stars', async () => {
    const economyRepo = makeInMemoryEconomyRepo();
    const progressRepo = makeProgressRepo({
      byProfileId: {
        p1: {
          starsBySubject: { mathematics: 3, language: 2 },
          starsByGameType: {},
          lastSession: null,
        },
      },
    });

    await ensureEconomySeeded(economyRepo, progressRepo, ['p1', 'p2']);

    // p1 had 5 historic stars → lifetime and wallet start at 5
    expect(await economyRepo.getProfileEconomy('p1')).toEqual({
      lifetimeStarsEarned: 5,
      starWalletBalance: 5,
    });
    // p2 had no progress → zeros
    expect(await economyRepo.getProfileEconomy('p2')).toEqual({
      lifetimeStarsEarned: 0,
      starWalletBalance: 0,
    });
  });

  it('never overwrites existing economy data', async () => {
    const economyRepo = makeInMemoryEconomyRepo({
      p1: { lifetimeStarsEarned: 9, starWalletBalance: 1 },
    });
    const progressRepo = makeProgressRepo({
      byProfileId: {
        p1: { starsBySubject: { mathematics: 3 }, starsByGameType: {}, lastSession: null },
      },
    });

    await ensureEconomySeeded(economyRepo, progressRepo, ['p1']);

    expect(await economyRepo.getProfileEconomy('p1')).toEqual({
      lifetimeStarsEarned: 9,
      starWalletBalance: 1,
    });
  });
});
