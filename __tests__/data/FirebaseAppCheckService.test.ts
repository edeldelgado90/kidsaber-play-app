/**
 * Tests for FirebaseAppCheckService.
 * Mocks firebase/app-check so no reCAPTCHA assessment is ever performed.
 */
import { getToken, type AppCheck } from 'firebase/app-check';
import { FirebaseAppCheckService } from '../../src/data/services/FirebaseAppCheckService';

jest.mock('firebase/app-check', () => ({
  getToken: jest.fn(),
}));

const mockGetToken = getToken as jest.Mock;
const mockAppCheck = {} as AppCheck;

describe('FirebaseAppCheckService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the token issued by Firebase', async () => {
    mockGetToken.mockResolvedValue({ token: 'appcheck-token' });

    const service = new FirebaseAppCheckService(mockAppCheck);

    await expect(service.getAppCheckToken()).resolves.toBe('appcheck-token');
  });

  it('does not force a refresh, so cached tokens avoid a new reCAPTCHA assessment', async () => {
    mockGetToken.mockResolvedValue({ token: 'appcheck-token' });

    await new FirebaseAppCheckService(mockAppCheck).getAppCheckToken();

    expect(mockGetToken).toHaveBeenCalledWith(mockAppCheck, false);
  });

  it('returns null when attestation fails so the request still goes out', async () => {
    mockGetToken.mockRejectedValue(new Error('appCheck/recaptcha-error'));

    const service = new FirebaseAppCheckService(mockAppCheck);

    await expect(service.getAppCheckToken()).resolves.toBeNull();
  });
});
