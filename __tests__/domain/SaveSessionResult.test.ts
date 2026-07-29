import { saveSessionResult } from '../../src/domain/usecases/game/SaveSessionResult';
import type { IProgressRepository } from '../../src/domain/ports/IProgressRepository';
import type { IEconomyRepository } from '../../src/domain/ports/IEconomyRepository';

function makeRepo(): jest.Mocked<IProgressRepository> {
  return {
    getProgress: jest.fn(),
    addStar: jest.fn().mockResolvedValue(undefined),
    saveLastSession: jest.fn().mockResolvedValue(undefined),
    resetProgress: jest.fn(),
  };
}

function makeEconomyRepo(): jest.Mocked<IEconomyRepository> {
  return {
    getEconomy: jest.fn(),
    getProfileEconomy: jest.fn(),
    saveProfileEconomy: jest.fn(),
    creditStar: jest.fn().mockResolvedValue(undefined),
    resetEconomy: jest.fn(),
  };
}

describe('saveSessionResult', () => {
  it('always calls saveLastSession', async () => {
    const repo = makeRepo();
    const economyRepo = makeEconomyRepo();
    await saveSessionResult(repo, economyRepo, {
      profileId: 'p1',
      subject: 'mathematics',
      gameType: 'option_multiple',
      starEarned: false,
    });

    expect(repo.saveLastSession).toHaveBeenCalledWith(
      'p1',
      'mathematics',
      'option_multiple',
      expect.any(String),
    );
  });

  it('calls addStar and creditStar when starEarned is true', async () => {
    const repo = makeRepo();
    const economyRepo = makeEconomyRepo();
    await saveSessionResult(repo, economyRepo, {
      profileId: 'p1',
      subject: 'language',
      gameType: 'matching',
      starEarned: true,
    });

    expect(repo.addStar).toHaveBeenCalledWith('p1', 'language', 'matching');
    expect(economyRepo.creditStar).toHaveBeenCalledWith('p1');
  });

  it('does NOT call addStar nor creditStar when starEarned is false', async () => {
    const repo = makeRepo();
    const economyRepo = makeEconomyRepo();
    await saveSessionResult(repo, economyRepo, {
      profileId: 'p1',
      subject: 'science',
      gameType: 'fill_in_the_blanks',
      starEarned: false,
    });

    expect(repo.addStar).not.toHaveBeenCalled();
    expect(economyRepo.creditStar).not.toHaveBeenCalled();
  });

  it('saveLastSession receives an ISO 8601 timestamp', async () => {
    const repo = makeRepo();
    const economyRepo = makeEconomyRepo();
    await saveSessionResult(repo, economyRepo, {
      profileId: 'p1',
      subject: 'mathematics',
      gameType: 'quick_calculation',
      starEarned: false,
    });

    const [[, , , timestamp]] = (repo.saveLastSession as jest.Mock).mock.calls;
    expect(new Date(timestamp as string).toISOString()).toBe(timestamp);
  });
});
