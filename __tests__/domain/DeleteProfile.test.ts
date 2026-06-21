import { deleteProfile } from '../../src/domain/usecases/profile/DeleteProfile';
import { type IProfileRepository } from '../../src/domain/ports/IProfileRepository';
import { type IProgressRepository } from '../../src/domain/ports/IProgressRepository';
import { type Profile } from '../../src/domain/entities/Profile';

const makeProfile = (id: string): Profile => ({
  id,
  name: `Perfil ${id}`,
  grade: 3,
  createdAt: new Date().toISOString(),
});

function makeProfileRepo(
  profiles: Profile[],
  activeId: string | null,
): jest.Mocked<IProfileRepository> {
  const stored = [...profiles];
  return {
    getAll: jest.fn().mockResolvedValue(stored),
    getById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn().mockImplementation(async (id: string) => {
      const idx = stored.findIndex(p => p.id === id);
      if (idx !== -1) stored.splice(idx, 1);
    }),
    getActiveProfileId: jest.fn().mockResolvedValue(activeId),
    setActiveProfileId: jest.fn().mockResolvedValue(undefined),
  };
}

function makeProgressRepo(): jest.Mocked<IProgressRepository> {
  return {
    getProgress: jest.fn(),
    addStar: jest.fn(),
    saveLastSession: jest.fn(),
    resetProgress: jest.fn().mockResolvedValue(undefined),
  };
}

describe('deleteProfile', () => {
  it('throws when only one profile exists', async () => {
    const profileRepo = makeProfileRepo([makeProfile('p1')], 'p1');
    const progressRepo = makeProgressRepo();

    await expect(deleteProfile(profileRepo, progressRepo, 'p1')).rejects.toThrow(
      'Debe existir al menos un perfil',
    );
    expect(profileRepo.delete).not.toHaveBeenCalled();
    expect(progressRepo.resetProgress).not.toHaveBeenCalled();
  });

  it('deletes the profile and erases its progress data', async () => {
    const profiles = [makeProfile('p1'), makeProfile('p2')];
    const profileRepo = makeProfileRepo(profiles, 'p2');
    const progressRepo = makeProgressRepo();

    await deleteProfile(profileRepo, progressRepo, 'p1');

    expect(profileRepo.delete).toHaveBeenCalledWith('p1');
    expect(progressRepo.resetProgress).toHaveBeenCalledWith('p1');
  });

  it('does not change the active profile when a non-active profile is deleted', async () => {
    const profiles = [makeProfile('p1'), makeProfile('p2')];
    const profileRepo = makeProfileRepo(profiles, 'p2');
    const progressRepo = makeProgressRepo();

    await deleteProfile(profileRepo, progressRepo, 'p1');

    expect(profileRepo.setActiveProfileId).not.toHaveBeenCalled();
  });

  it('switches active profile to another when the active one is deleted', async () => {
    const profiles = [makeProfile('p1'), makeProfile('p2')];
    const profileRepo = makeProfileRepo(profiles, 'p1');
    const progressRepo = makeProgressRepo();

    await deleteProfile(profileRepo, progressRepo, 'p1');

    expect(profileRepo.setActiveProfileId).toHaveBeenCalledWith('p2');
  });

  it('still erases progress even when the deleted profile was not active', async () => {
    const profiles = [makeProfile('p1'), makeProfile('p2')];
    const profileRepo = makeProfileRepo(profiles, 'p2');
    const progressRepo = makeProgressRepo();

    await deleteProfile(profileRepo, progressRepo, 'p1');

    expect(progressRepo.resetProgress).toHaveBeenCalledWith('p1');
  });
});
