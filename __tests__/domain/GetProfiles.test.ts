import { getProfiles } from '../../src/domain/usecases/profile/GetProfiles';
import type { IProfileRepository } from '../../src/domain/ports/IProfileRepository';

function makeRepo(
  profiles = [{ id: '1', name: 'Ana', grade: 2 as const, createdAt: '2024-01-01' }],
  activeId: string | null = '1',
): jest.Mocked<IProfileRepository> {
  return {
    getAll: jest.fn().mockResolvedValue(profiles),
    getById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getActiveProfileId: jest.fn().mockResolvedValue(activeId),
    setActiveProfileId: jest.fn(),
  };
}

describe('getProfiles', () => {
  it('returns profiles and activeProfileId in parallel', async () => {
    const repo = makeRepo();
    const result = await getProfiles(repo);

    expect(result.profiles).toHaveLength(1);
    expect(result.profiles[0].name).toBe('Ana');
    expect(result.activeProfileId).toBe('1');
  });

  it('returns empty array when no profiles stored', async () => {
    const repo = makeRepo([], null);
    const result = await getProfiles(repo);

    expect(result.profiles).toEqual([]);
    expect(result.activeProfileId).toBeNull();
  });

  it('calls getAll and getActiveProfileId', async () => {
    const repo = makeRepo();
    await getProfiles(repo);

    expect(repo.getAll).toHaveBeenCalledTimes(1);
    expect(repo.getActiveProfileId).toHaveBeenCalledTimes(1);
  });
});
