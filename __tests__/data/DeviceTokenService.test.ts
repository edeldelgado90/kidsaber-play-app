/**
 * Tests for DeviceTokenService — token lifecycle, caching, and refresh.
 * Mocks AsyncStorage and fetch to avoid real I/O.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceTokenService } from '../../src/data/services/DeviceTokenService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_URL = 'https://api.example.com';
const DEVICE_ID_KEY = '@kidsaber/device_id';

function nowS(): number {
  return Math.floor(Date.now() / 1000);
}

function makeTokenResponse(token: string, ttlSeconds = 3600): unknown {
  return { token, expiresAt: nowS() + ttlSeconds };
}

function mockFetchSuccess(token: string, ttlSeconds = 3600): void {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => makeTokenResponse(token, ttlSeconds),
    clone: function () {
      return this;
    },
  } as unknown as Response);
}

function mockFetchError(status = 404): void {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ message: 'not found' }),
    clone: function () {
      return this;
    },
  } as unknown as Response);
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  // Default: no stored device ID
  mockGetItem.mockResolvedValue(null);
  mockSetItem.mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DeviceTokenService.getToken()', () => {
  it('generates a deviceId on first call and stores it', async () => {
    mockFetchSuccess('jwt-abc');
    const service = new DeviceTokenService(BASE_URL);

    await service.getToken();

    expect(mockSetItem).toHaveBeenCalledWith(
      DEVICE_ID_KEY,
      expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      ),
    );
  });

  it('reuses existing deviceId from storage', async () => {
    mockGetItem.mockResolvedValue('existing-device-id');
    mockFetchSuccess('jwt-abc');
    const service = new DeviceTokenService(BASE_URL);

    await service.getToken();

    expect(mockSetItem).not.toHaveBeenCalled();
    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body as string) as {
      deviceId: string;
    };
    expect(body.deviceId).toBe('existing-device-id');
  });

  it('returns the token from the backend', async () => {
    mockFetchSuccess('my-token');
    const service = new DeviceTokenService(BASE_URL);

    const token = await service.getToken();

    expect(token).toBe('my-token');
  });

  it('posts to /auth/token with the deviceId', async () => {
    mockGetItem.mockResolvedValue('device-123');
    mockFetchSuccess('jwt-xyz');
    const service = new DeviceTokenService(BASE_URL);

    await service.getToken();

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.example.com/auth/token');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body as string)).toEqual({ deviceId: 'device-123' });
  });

  it('returns cached token on second call without fetching again', async () => {
    mockFetchSuccess('cached-token', 3600);
    const service = new DeviceTokenService(BASE_URL);

    const first = await service.getToken();
    const second = await service.getToken();

    expect(first).toBe('cached-token');
    expect(second).toBe('cached-token');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('re-fetches when the cached token is about to expire', async () => {
    // Set up a single mock that returns different values on consecutive calls
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => makeTokenResponse('expiring-token', 30), // expires in 30 s
        clone: function () {
          return this;
        },
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => makeTokenResponse('fresh-token', 3600),
        clone: function () {
          return this;
        },
      } as unknown as Response);
    global.fetch = fetchMock;

    const service = new DeviceTokenService(BASE_URL);

    // First call: token is fetched and cached (expires in 30 s)
    await service.getToken();

    // Second call: token is within the 60 s refresh window → triggers a new fetch
    const token = await service.getToken();

    expect(token).toBe('fresh-token');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('returns null when the token endpoint returns 404 (auth disabled)', async () => {
    mockFetchError(404);
    const service = new DeviceTokenService(BASE_URL);

    const token = await service.getToken();

    expect(token).toBeNull();
  });

  it('returns null when fetch throws a network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed'));
    const service = new DeviceTokenService(BASE_URL);

    const token = await service.getToken();

    expect(token).toBeNull();
  });

  it('deduplicates concurrent refresh calls into one fetch', async () => {
    mockFetchSuccess('dedup-token', 3600);
    const service = new DeviceTokenService(BASE_URL);

    // Fire three concurrent calls
    const [t1, t2, t3] = await Promise.all([
      service.getToken(),
      service.getToken(),
      service.getToken(),
    ]);

    expect(t1).toBe('dedup-token');
    expect(t2).toBe('dedup-token');
    expect(t3).toBe('dedup-token');
    // Only one network request should have been made
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
