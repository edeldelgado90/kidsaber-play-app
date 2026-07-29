// The factory must be self-contained: jest hoists `jest.mock` above the ESM
// imports, and those imports run before any module-level `const`, so a factory
// referencing outer variables would capture them as `undefined`.
jest.mock('../../src/infrastructure/di/container', () => ({
  profileRepository: {},
  progressRepository: {
    getProgress: jest.fn(),
    addStar: jest.fn(),
    saveLastSession: jest.fn(),
    resetProgress: jest.fn(),
  },
  questionsService: {},
}));

import { progressRepository } from '../../src/infrastructure/di/container';
import { useProgressStore } from '../../src/infrastructure/store/progressStore';

const mockProgressRepo = progressRepository as jest.Mocked<typeof progressRepository>;

beforeEach(() => {
  jest.clearAllMocks();
  useProgressStore.setState({ progress: { byProfileId: {} }, isLoading: false });
});

describe('progressStore', () => {
  it('loadProgress — success: updates progress', async () => {
    mockProgressRepo.getProgress.mockResolvedValue({
      byProfileId: {
        p1: { starsBySubject: { mathematics: 2 }, starsByGameType: {}, lastSession: null },
      },
    });

    await useProgressStore.getState().loadProgress();

    expect(useProgressStore.getState().progress.byProfileId['p1'].starsBySubject.mathematics).toBe(
      2,
    );
    expect(useProgressStore.getState().isLoading).toBe(false);
  });

  it('loadProgress — error: clears loading flag', async () => {
    mockProgressRepo.getProgress.mockRejectedValue(new Error('fail'));

    await useProgressStore.getState().loadProgress();

    expect(useProgressStore.getState().isLoading).toBe(false);
  });

  it('addStar calls repo and refreshes progress', async () => {
    mockProgressRepo.addStar.mockResolvedValue(undefined);
    mockProgressRepo.getProgress.mockResolvedValue({
      byProfileId: {
        p1: { starsBySubject: { science: 1 }, starsByGameType: {}, lastSession: null },
      },
    });

    await useProgressStore.getState().addStar('p1', 'science', 'option_multiple');

    expect(mockProgressRepo.addStar).toHaveBeenCalledWith('p1', 'science', 'option_multiple');
    expect(useProgressStore.getState().progress.byProfileId['p1'].starsBySubject.science).toBe(1);
  });

  it('getProfileProgress returns existing profile progress', async () => {
    useProgressStore.setState({
      progress: {
        byProfileId: {
          p1: { starsBySubject: { language: 4 }, starsByGameType: {}, lastSession: null },
        },
      },
      isLoading: false,
    });

    const pp = useProgressStore.getState().getProfileProgress('p1');
    expect(pp.starsBySubject.language).toBe(4);
  });

  it('getProfileProgress returns empty progress for unknown profileId', async () => {
    const pp = useProgressStore.getState().getProfileProgress('unknown');
    expect(pp.starsBySubject).toEqual({});
    expect(pp.lastSession).toBeNull();
  });

  it('getStarsForSubject returns star count', async () => {
    useProgressStore.setState({
      progress: {
        byProfileId: {
          p1: { starsBySubject: { english: 7 }, starsByGameType: {}, lastSession: null },
        },
      },
      isLoading: false,
    });

    expect(useProgressStore.getState().getStarsForSubject('p1', 'english')).toBe(7);
  });

  it('getStarsForSubject returns 0 for unknown subject', async () => {
    expect(useProgressStore.getState().getStarsForSubject('p1', 'mathematics')).toBe(0);
  });

  it('getTotalStars sums all subject stars', async () => {
    useProgressStore.setState({
      progress: {
        byProfileId: {
          p1: {
            starsBySubject: { mathematics: 3, language: 2 },
            starsByGameType: {},
            lastSession: null,
          },
        },
      },
      isLoading: false,
    });

    expect(useProgressStore.getState().getTotalStars('p1')).toBe(5);
  });
});
