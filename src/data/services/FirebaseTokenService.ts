import { signInAnonymously, type Auth } from 'firebase/auth';
import { type ITokenProvider } from '../../domain/ports/ITokenProvider';

/**
 * Provides Firebase ID tokens for outbound API calls.
 *
 * On the first call the service signs in anonymously — Firebase issues an
 * anonymous UID. The session uses inMemoryPersistence (see firebaseApp.ts)
 * so it does NOT survive process restarts; a new sign-in happens on each
 * cold start. Subsequent calls within the same process return the cached
 * token; Firebase automatically refreshes it when it nears expiry
 * (tokens last 1 hour).
 *
 * Returns null on any Firebase error so API calls can still proceed if auth
 * is temporarily unavailable.
 */
export class FirebaseTokenService implements ITokenProvider {
  constructor(private readonly auth: Auth) {}

  async getToken(): Promise<string | null> {
    try {
      if (!this.auth.currentUser) {
        await signInAnonymously(this.auth);
      }
      const user = this.auth.currentUser;
      if (!user) return null;
      return await user.getIdToken();
    } catch {
      return null;
    }
  }
}
