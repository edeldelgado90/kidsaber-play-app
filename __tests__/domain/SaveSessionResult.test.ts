import { saveSessionResult } from '../../src/domain/usecases/game/SaveSessionResult';
import type { IProgressRepository } from '../../src/domain/ports/IProgressRepository';

function makeRepo(): jest.Mocked<IProgressRepository> {
  return {
    getProgress: jest.fn(),
    addStar: jest.fn().mockResolvedValue(undefined),
    saveLastSession: jest.fn().mockResolvedValue(undefined),
    resetProgress: jest.fn(),
  };
}

describe('saveSessionResult', () => {
  it('always calls saveLastSession', async () => {
    const repo = makeRepo();
    await saveSessionResult(repo, {
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

  it('calls addStar when starEarned is true', async () => {
    const repo = makeRepo();
    await saveSessionResult(repo, {
      profileId: 'p1',
      subject: 'language',
      gameType: 'matching',
      starEarned: true,
    });

    expect(repo.addStar).toHaveBeenCalledWith('p1', 'language', 'matching');
  });

  it('does NOT call addStar when starEarned is false', async () => {
    const repo = makeRepo();
    await saveSessionResult(repo, {
      profileId: 'p1',
      subject: 'science',
      gameType: 'fill_in_the_blanks',
      starEarned: false,
    });

    expect(repo.addStar).not.toHaveBeenCalled();
  });

  it('saveLastSession receives an ISO 8601 timestamp', async () => {
    const repo = makeRepo();
    await saveSessionResult(repo, {
      profileId: 'p1',
      subject: 'mathematics',
      gameType: 'quick_calculation',
      starEarned: false,
    });

    const [[, , , timestamp]] = (repo.saveLastSession as jest.Mock).mock.calls;
    expect(new Date(timestamp as string).toISOString()).toBe(timestamp);
  });
});
