import { updateProfile } from '../../src/domain/usecases/profile/UpdateProfile';
import type { IProfileRepository } from '../../src/domain/ports/IProfileRepository';

function makeRepo(): jest.Mocked<IProfileRepository> {
  return {
    getAll: jest.fn(),
    getById: jest.fn(),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn(),
    getActiveProfileId: jest.fn(),
    setActiveProfileId: jest.fn(),
  };
}

describe('updateProfile', () => {
  it('updates name only when only name provided', async () => {
    const repo = makeRepo();
    await updateProfile(repo, { id: '1', name: 'Nueva' });

    expect(repo.update).toHaveBeenCalledWith('1', { name: 'Nueva' });
  });

  it('updates grade only when only grade provided', async () => {
    const repo = makeRepo();
    await updateProfile(repo, { id: '1', grade: 5 });

    expect(repo.update).toHaveBeenCalledWith('1', { grade: 5 });
  });

  it('updates both name and grade when both provided', async () => {
    const repo = makeRepo();
    await updateProfile(repo, { id: '1', name: 'Juan', grade: 3 });

    expect(repo.update).toHaveBeenCalledWith('1', { name: 'Juan', grade: 3 });
  });

  it('does not call repo.update when no fields provided', async () => {
    const repo = makeRepo();
    await updateProfile(repo, { id: '1' });

    expect(repo.update).not.toHaveBeenCalled();
  });

  it('trims name before updating', async () => {
    const repo = makeRepo();
    await updateProfile(repo, { id: '1', name: '  Luisa  ' });

    expect(repo.update).toHaveBeenCalledWith('1', { name: 'Luisa' });
  });

  it('throws when name is too short', async () => {
    const repo = makeRepo();
    await expect(updateProfile(repo, { id: '1', name: 'X' })).rejects.toThrow();
  });

  it('throws when grade is invalid', async () => {
    const repo = makeRepo();
    await expect(updateProfile(repo, { id: '1', grade: 0 })).rejects.toThrow();
  });
});
