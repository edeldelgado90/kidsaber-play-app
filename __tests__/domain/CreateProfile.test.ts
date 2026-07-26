import { createProfile } from '../../src/domain/usecases/profile/CreateProfile';
import type { IProfileRepository } from '../../src/domain/ports/IProfileRepository';

function makeRepo(): jest.Mocked<IProfileRepository> {
  return {
    getAll: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    getActiveProfileId: jest.fn().mockResolvedValue(null),
    setActiveProfileId: jest.fn().mockResolvedValue(undefined),
  };
}

describe('createProfile', () => {
  it('creates a profile with trimmed name and correct grade', async () => {
    const repo = makeRepo();
    const { profile } = await createProfile(repo, { name: '  Ana  ', grade: 3 });

    expect(profile.name).toBe('Ana');
    expect(profile.grade).toBe(3);
    expect(profile.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(profile.createdAt).toBeTruthy();
  });

  it('calls repo.save and repo.setActiveProfileId', async () => {
    const repo = makeRepo();
    const { profile } = await createProfile(repo, { name: 'María', grade: 2 });

    expect(repo.save).toHaveBeenCalledWith(profile);
    expect(repo.setActiveProfileId).toHaveBeenCalledWith(profile.id);
  });

  it('throws when name is too short after trimming', async () => {
    const repo = makeRepo();
    await expect(createProfile(repo, { name: 'A', grade: 1 })).rejects.toThrow();
  });

  it('throws when name is too long', async () => {
    const repo = makeRepo();
    await expect(createProfile(repo, { name: 'A'.repeat(21), grade: 1 })).rejects.toThrow();
  });

  it('throws for invalid grade', async () => {
    const repo = makeRepo();
    await expect(createProfile(repo, { name: 'María', grade: 7 })).rejects.toThrow();
  });

  it('throws for grade 0', async () => {
    const repo = makeRepo();
    await expect(createProfile(repo, { name: 'María', grade: 0 })).rejects.toThrow();
  });

  it('uses Math.random fallback when crypto is not available', async () => {
    const originalCrypto = global.crypto;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).crypto = undefined;

    try {
      const repo = makeRepo();
      const { profile } = await createProfile(repo, { name: 'Carlos', grade: 4 });
      expect(profile.id).toHaveLength(36);
    } finally {
      global.crypto = originalCrypto;
    }
  });
});
