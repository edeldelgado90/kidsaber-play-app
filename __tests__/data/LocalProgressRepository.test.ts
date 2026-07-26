import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalProgressRepository } from '../../src/data/repositories/LocalProgressRepository';
import { StorageKeys } from '../../src/data/storage/StorageKeys';
import type { Progress } from '../../src/domain/entities/Progress';

const mockAS = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

function seedProgress(progress: Progress) {
  mockAS.getItem.mockImplementation(key => {
    if (key === StorageKeys.PROGRESS) return Promise.resolve(JSON.stringify(progress));
    return Promise.resolve(null);
  });
  mockAS.setItem.mockResolvedValue(undefined);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAS.getItem.mockResolvedValue(null);
  mockAS.setItem.mockResolvedValue(undefined);
});

describe('LocalProgressRepository.getProgress', () => {
  it('returns default empty progress when nothing is stored', async () => {
    const repo = new LocalProgressRepository();
    const result = await repo.getProgress();
    expect(result).toEqual({ byProfileId: {} });
  });

  it('returns stored progress', async () => {
    const p: Progress = {
      byProfileId: {
        p1: { starsBySubject: { mathematics: 3 }, starsByGameType: {}, lastSession: null },
      },
    };
    seedProgress(p);
    const repo = new LocalProgressRepository();
    expect(await repo.getProgress()).toEqual(p);
  });
});

describe('LocalProgressRepository.addStar', () => {
  it('initialises profile entry and adds first star for subject and game type', async () => {
    seedProgress({ byProfileId: {} });
    const repo = new LocalProgressRepository();
    await repo.addStar('p1', 'mathematics', 'option_multiple');

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Progress;
    expect(saved.byProfileId['p1'].starsBySubject.mathematics).toBe(1);
    expect(saved.byProfileId['p1'].starsByGameType.option_multiple).toBe(1);
  });

  it('increments existing star counts', async () => {
    seedProgress({
      byProfileId: {
        p1: {
          starsBySubject: { mathematics: 2 },
          starsByGameType: { option_multiple: 1 },
          lastSession: null,
        },
      },
    });
    const repo = new LocalProgressRepository();
    await repo.addStar('p1', 'mathematics', 'option_multiple');

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Progress;
    expect(saved.byProfileId['p1'].starsBySubject.mathematics).toBe(3);
    expect(saved.byProfileId['p1'].starsByGameType.option_multiple).toBe(2);
  });
});

describe('LocalProgressRepository.saveLastSession', () => {
  it('saves last session info for a new profile', async () => {
    seedProgress({ byProfileId: {} });
    const repo = new LocalProgressRepository();
    await repo.saveLastSession('p1', 'language', 'matching', '2024-06-01T12:00:00.000Z');

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Progress;
    expect(saved.byProfileId['p1'].lastSession).toEqual({
      subject: 'language',
      gameType: 'matching',
      at: '2024-06-01T12:00:00.000Z',
    });
  });

  it('updates last session for existing profile without touching stars', async () => {
    seedProgress({
      byProfileId: {
        p1: { starsBySubject: { mathematics: 5 }, starsByGameType: {}, lastSession: null },
      },
    });
    const repo = new LocalProgressRepository();
    await repo.saveLastSession('p1', 'science', 'fill_in_the_blanks', '2024-07-01T00:00:00.000Z');

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Progress;
    expect(saved.byProfileId['p1'].starsBySubject.mathematics).toBe(5);
    expect(saved.byProfileId['p1'].lastSession?.subject).toBe('science');
  });
});

describe('LocalProgressRepository.resetProgress', () => {
  it('removes the profile entry from progress', async () => {
    seedProgress({
      byProfileId: {
        p1: { starsBySubject: { mathematics: 2 }, starsByGameType: {}, lastSession: null },
        p2: { starsBySubject: {}, starsByGameType: {}, lastSession: null },
      },
    });
    const repo = new LocalProgressRepository();
    await repo.resetProgress('p1');

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Progress;
    expect(saved.byProfileId['p1']).toBeUndefined();
    expect(saved.byProfileId['p2']).toBeDefined();
  });
});
