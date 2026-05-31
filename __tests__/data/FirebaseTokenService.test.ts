/**
 * Tests for FirebaseTokenService — anonymous sign-in, token retrieval, and error handling.
 * Mocks firebase/auth to avoid real Firebase calls.
 */
import { signInAnonymously, type Auth } from 'firebase/auth';
import { FirebaseTokenService } from '../../src/data/services/FirebaseTokenService';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('firebase/auth', () => ({
  signInAnonymously: jest.fn(),
}));

const mockSignInAnonymously = signInAnonymously as jest.Mock;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockUser(token = 'firebase-id-token') {
  return { getIdToken: jest.fn().mockResolvedValue(token) };
}

type MockUser = ReturnType<typeof makeMockUser>;

function makeMockAuth(currentUser: MockUser | null = null) {
  return { currentUser } as unknown as Auth;
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('FirebaseTokenService.getToken()', () => {
  it('signs in anonymously when there is no current user', async () => {
    const mockUser = makeMockUser();
    const mockAuth = makeMockAuth(null);
    mockSignInAnonymously.mockImplementation(async (auth: Auth) => {
      (auth as unknown as { currentUser: MockUser }).currentUser = mockUser;
    });
    const service = new FirebaseTokenService(mockAuth);

    await service.getToken();

    expect(mockSignInAnonymously).toHaveBeenCalledWith(mockAuth);
  });

  it('skips sign-in when a user session already exists', async () => {
    const mockAuth = makeMockAuth(makeMockUser());
    const service = new FirebaseTokenService(mockAuth);

    await service.getToken();

    expect(mockSignInAnonymously).not.toHaveBeenCalled();
  });

  it('returns the token from an existing session', async () => {
    const mockAuth = makeMockAuth(makeMockUser('existing-session-token'));
    const service = new FirebaseTokenService(mockAuth);

    const token = await service.getToken();

    expect(token).toBe('existing-session-token');
  });

  it('returns the token issued after anonymous sign-in', async () => {
    const mockUser = makeMockUser('new-anon-token');
    const mockAuth = makeMockAuth(null);
    mockSignInAnonymously.mockImplementation(async (auth: Auth) => {
      (auth as unknown as { currentUser: MockUser }).currentUser = mockUser;
    });
    const service = new FirebaseTokenService(mockAuth);

    const token = await service.getToken();

    expect(token).toBe('new-anon-token');
  });

  it('returns null when signInAnonymously throws', async () => {
    const mockAuth = makeMockAuth(null);
    mockSignInAnonymously.mockRejectedValue(new Error('auth/network-request-failed'));
    const service = new FirebaseTokenService(mockAuth);

    const token = await service.getToken();

    expect(token).toBeNull();
  });

  it('returns null when getIdToken throws', async () => {
    const mockUser = { getIdToken: jest.fn().mockRejectedValue(new Error('auth/token-expired')) };
    const mockAuth = makeMockAuth(mockUser);
    const service = new FirebaseTokenService(mockAuth);

    const token = await service.getToken();

    expect(token).toBeNull();
  });

  it('calls getIdToken on each invocation so Firebase can auto-refresh the token', async () => {
    const mockUser = makeMockUser();
    mockUser.getIdToken
      .mockResolvedValueOnce('token-v1')
      .mockResolvedValueOnce('token-v2');
    const mockAuth = makeMockAuth(mockUser);
    const service = new FirebaseTokenService(mockAuth);

    const first = await service.getToken();
    const second = await service.getToken();

    expect(first).toBe('token-v1');
    expect(second).toBe('token-v2');
    expect(mockUser.getIdToken).toHaveBeenCalledTimes(2);
  });
});
