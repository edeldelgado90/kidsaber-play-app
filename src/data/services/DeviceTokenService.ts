import AsyncStorage from '@react-native-async-storage/async-storage';
import { type ITokenProvider } from '../../domain/ports/ITokenProvider';
import { fetchDeviceToken } from '../api/authApi';
import { StorageKeys } from '../storage/StorageKeys';

// Refresh the token this many seconds before its stated expiry to avoid
// using a token that expires mid-request.
const REFRESH_BEFORE_EXPIRY_S = 60;

// ---------------------------------------------------------------------------
// UUID generation
// ---------------------------------------------------------------------------

/**
 * Generates a UUID v4 using crypto.getRandomValues when available (React
 * Native / modern browsers). Falls back to Math.random() for environments
 * that lack the Web Crypto API — sufficient for a non-secret device ID.
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Set version (4) and variant bits per RFC 4122 §4.4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  // Math.random fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * Manages short-lived bearer tokens for API authentication.
 *
 * ## How it works
 * 1. On first launch a stable, random deviceId is generated and stored in
 *    AsyncStorage. It is NOT a secret — it is only used for per-device token
 *    issuance and rate limiting on the backend.
 * 2. The deviceId is exchanged at `POST /auth/token` for a short-lived JWT.
 * 3. The JWT is cached in memory and refreshed proactively 60 s before expiry.
 * 4. Concurrent callers share one in-flight refresh (no thundering herd).
 * 5. If the token endpoint is unavailable or the backend has auth disabled,
 *    getToken() returns null and requests proceed without a bearer header.
 *
 * ## Security properties
 * - No long-lived secret is ever bundled in the app or in AsyncStorage.
 * - The JWT is never written to persistent storage; it lives only in memory
 *   and must be re-fetched after a process restart.
 * - Rotating the backend secret automatically invalidates all current tokens.
 */
export class DeviceTokenService implements ITokenProvider {
  private cachedToken: string | null = null;
  private expiresAtS: number = 0; // Unix timestamp in seconds
  private refreshPromise: Promise<string | null> | null = null;

  constructor(private readonly baseUrl: string) {}

  /**
   * Returns a valid bearer token, or null if auth is not enabled on the
   * backend. Never throws — all errors are treated as "auth unavailable".
   *
   * Concurrent calls during an in-flight refresh share the same promise so
   * only one network request is made regardless of how many callers are
   * waiting.
   */
  async getToken(): Promise<string | null> {
    const nowS = Date.now() / 1000;
    if (this.cachedToken !== null && this.expiresAtS - REFRESH_BEFORE_EXPIRY_S > nowS) {
      return this.cachedToken;
    }

    // Deduplicate concurrent refresh requests
    if (this.refreshPromise !== null) return this.refreshPromise;

    this.refreshPromise = this.refresh().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private async refresh(): Promise<string | null> {
    try {
      const deviceId = await this.getOrCreateDeviceId();
      const { token, expiresAt } = await fetchDeviceToken(this.baseUrl, deviceId);
      this.cachedToken = token;
      this.expiresAtS = expiresAt;
      return token;
    } catch {
      // Auth is optional — if the token endpoint doesn't exist or auth is
      // disabled on this backend instance, proceed without a token.
      this.cachedToken = null;
      this.expiresAtS = 0;
      return null;
    }
  }

  private async getOrCreateDeviceId(): Promise<string> {
    const existing = await AsyncStorage.getItem(StorageKeys.DEVICE_ID);
    if (existing !== null) return existing;

    const newId = generateUUID();
    await AsyncStorage.setItem(StorageKeys.DEVICE_ID, newId);
    return newId;
  }
}
