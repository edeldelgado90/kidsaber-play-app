import { getToken, type AppCheck } from 'firebase/app-check';
import { type IAppCheckProvider } from '../../domain/ports/IAppCheckProvider';

/**
 * Provides Firebase App Check tokens for outbound API calls.
 *
 * Firebase caches the token and auto-refreshes it at roughly half its TTL, so
 * getToken() normally resolves from cache without a network round trip or a new
 * reCAPTCHA assessment.
 *
 * Returns null on any failure (reCAPTCHA blocked, offline, score below the
 * configured threshold) so requests still go out with the ID token alone.
 */
export class FirebaseAppCheckService implements IAppCheckProvider {
  constructor(private readonly appCheck: AppCheck) {}

  async getAppCheckToken(): Promise<string | null> {
    try {
      const result = await getToken(this.appCheck, /* forceRefresh */ false);
      return result.token;
    } catch {
      return null;
    }
  }
}
