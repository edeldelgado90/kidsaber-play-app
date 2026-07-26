import { getProgress } from '../../src/domain/usecases/progress/GetProgress';
import { createEmptyProfileProgress } from '../../src/domain/entities/Progress';
import type { IProgressRepository } from '../../src/domain/ports/IProgressRepository';

function makeRepo(data = {}): jest.Mocked<IProgressRepository> {
  return {
    getProgress: jest.fn().mockResolvedValue({ byProfileId: data }),
    addStar: jest.fn(),
    saveLastSession: jest.fn(),
    resetProgress: jest.fn(),
  };
}

describe('getProgress', () => {
  it('returns stored progress when profile exists', async () => {
    const stored = {
      starsBySubject: { mathematics: 2 },
      starsByGameType: {},
      lastSession: null,
    };
    const repo = makeRepo({ 'profile-1': stored });
    const result = await getProgress(repo, 'profile-1');

    expect(result).toEqual(stored);
  });

  it('returns empty profile progress when profile not found', async () => {
    const repo = makeRepo({});
    const result = await getProgress(repo, 'unknown-id');

    expect(result).toEqual(createEmptyProfileProgress());
  });

  it('calls repository.getProgress', async () => {
    const repo = makeRepo({});
    await getProgress(repo, 'any');

    expect(repo.getProgress).toHaveBeenCalledTimes(1);
  });
});
