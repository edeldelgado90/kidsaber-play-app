import type { Profile } from '../../src/domain/entities/Profile';

// The factory must be self-contained: jest hoists `jest.mock` above the ESM
// imports, and those imports run before any module-level `const`, so a factory
// referencing outer variables would capture them as `undefined`.
jest.mock('../../src/infrastructure/di/container', () => ({
  profileRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getActiveProfileId: jest.fn(),
    setActiveProfileId: jest.fn(),
  },
  progressRepository: {
    getProgress: jest.fn(),
    addStar: jest.fn(),
    saveLastSession: jest.fn(),
    resetProgress: jest.fn(),
  },
  petRepository: {
    getPets: jest.fn(),
    getPet: jest.fn(),
    savePet: jest.fn(),
    resetPet: jest.fn(),
  },
  economyRepository: {
    getEconomy: jest.fn(),
    getProfileEconomy: jest.fn(),
    saveProfileEconomy: jest.fn(),
    creditStar: jest.fn(),
    resetEconomy: jest.fn(),
  },
  questionsService: { fetchQuestions: jest.fn() },
}));

import { profileRepository, progressRepository } from '../../src/infrastructure/di/container';
import { useProfileStore } from '../../src/infrastructure/store/profileStore';

const mockProfileRepo = profileRepository as jest.Mocked<typeof profileRepository>;
const mockProgressRepo = progressRepository as jest.Mocked<typeof progressRepository>;

const p1: Profile = { id: 'p1', name: 'Ana', grade: 2, createdAt: '2024-01-01T00:00:00.000Z' };
const p2: Profile = { id: 'p2', name: 'Luis', grade: 4, createdAt: '2024-02-01T00:00:00.000Z' };

beforeEach(() => {
  jest.clearAllMocks();
  useProfileStore.setState({ profiles: [], activeProfileId: null, isLoading: false, error: null });
});

describe('profileStore', () => {
  it('loadProfiles — success: sets profiles and activeProfileId', async () => {
    mockProfileRepo.getAll.mockResolvedValue([p1, p2]);
    mockProfileRepo.getActiveProfileId.mockResolvedValue('p1');

    await useProfileStore.getState().loadProfiles();

    expect(useProfileStore.getState().profiles).toEqual([p1, p2]);
    expect(useProfileStore.getState().activeProfileId).toBe('p1');
    expect(useProfileStore.getState().isLoading).toBe(false);
  });

  it('loadProfiles — error: sets error message', async () => {
    mockProfileRepo.getAll.mockRejectedValue(new Error('fail'));

    await useProfileStore.getState().loadProfiles();

    expect(useProfileStore.getState().error).toBeTruthy();
    expect(useProfileStore.getState().isLoading).toBe(false);
  });

  it('setActiveProfile saves and updates state', async () => {
    mockProfileRepo.setActiveProfileId.mockResolvedValue(undefined);

    await useProfileStore.getState().setActiveProfile('p2');

    expect(mockProfileRepo.setActiveProfileId).toHaveBeenCalledWith('p2');
    expect(useProfileStore.getState().activeProfileId).toBe('p2');
  });

  it('addProfile — success: appends profile', async () => {
    mockProfileRepo.save.mockResolvedValue(undefined);
    mockProfileRepo.setActiveProfileId.mockResolvedValue(undefined);
    mockProfileRepo.getAll.mockResolvedValue([]);
    mockProfileRepo.getActiveProfileId.mockResolvedValue(null);

    await useProfileStore.getState().addProfile('María', 3);

    const { profiles } = useProfileStore.getState();
    expect(profiles).toHaveLength(1);
    expect(profiles[0].name).toBe('María');
  });

  it('addProfile — validation error: sets error and rethrows', async () => {
    await expect(useProfileStore.getState().addProfile('X', 3)).rejects.toThrow();
    expect(useProfileStore.getState().error).toBeTruthy();
  });

  it('updateProfile — success: reloads profiles', async () => {
    mockProfileRepo.update.mockResolvedValue(undefined);
    mockProfileRepo.getAll.mockResolvedValue([{ ...p1, name: 'Ana Updated' }]);

    useProfileStore.setState({ profiles: [p1] });
    await useProfileStore.getState().updateProfile('p1', 'Ana Updated', 2);

    expect(useProfileStore.getState().profiles[0].name).toBe('Ana Updated');
  });

  it('updateProfile — error: sets error and rethrows', async () => {
    mockProfileRepo.update.mockRejectedValue(new Error('update fail'));

    await expect(useProfileStore.getState().updateProfile('p1', 'A', 2)).rejects.toThrow();
    expect(useProfileStore.getState().error).toBeTruthy();
  });

  it('deleteProfile — success: reloads profiles', async () => {
    mockProgressRepo.resetProgress.mockResolvedValue(undefined);
    mockProfileRepo.delete.mockResolvedValue(undefined);
    // First call is the use case's "at least one profile must remain" guard,
    // the second is the store reloading after the deletion.
    mockProfileRepo.getAll.mockResolvedValueOnce([p1, p2]).mockResolvedValue([p2]);
    mockProfileRepo.getActiveProfileId.mockResolvedValue('p2');

    useProfileStore.setState({ profiles: [p1, p2], activeProfileId: 'p1' });
    await useProfileStore.getState().deleteProfile('p1');

    expect(useProfileStore.getState().profiles).toEqual([p2]);
    expect(useProfileStore.getState().activeProfileId).toBe('p2');
  });

  it('deleteProfile — error: sets error and rethrows', async () => {
    mockProgressRepo.resetProgress.mockRejectedValue(new Error('del fail'));

    useProfileStore.setState({ profiles: [p1] });
    await expect(useProfileStore.getState().deleteProfile('p1')).rejects.toThrow();
    expect(useProfileStore.getState().error).toBeTruthy();
  });

  it('clearError sets error to null', async () => {
    useProfileStore.setState({ error: 'some error' });
    useProfileStore.getState().clearError();
    expect(useProfileStore.getState().error).toBeNull();
  });

  it('getActiveProfile returns matching profile', async () => {
    useProfileStore.setState({ profiles: [p1, p2], activeProfileId: 'p2' });
    expect(useProfileStore.getState().getActiveProfile()).toEqual(p2);
  });

  it('getActiveProfile returns null when no activeProfileId', async () => {
    useProfileStore.setState({ profiles: [p1], activeProfileId: null });
    expect(useProfileStore.getState().getActiveProfile()).toBeNull();
  });
});
