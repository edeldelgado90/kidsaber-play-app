/**
 * Port: provides a bearer token for outbound API calls.
 *
 * Implementations handle token acquisition, in-memory caching, and proactive
 * refresh. Callers never manage token lifecycle — they just call getToken().
 *
 * Returns null when the backend has auth disabled (e.g. local development
 * with AUTH_ENABLED=false), allowing unauthenticated requests to proceed.
 */
export interface ITokenProvider {
  /** Returns a valid bearer token, or null if auth is not enabled. */
  getToken(): Promise<string | null>;
}
