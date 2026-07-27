/**
 * Port: provides a Firebase App Check token for outbound API calls.
 *
 * App Check attests that the request comes from a genuine instance of this app,
 * as opposed to ITokenProvider, which attests *who* the caller is (an anonymous
 * Firebase UID). The API accepts either credential; sending both is strongest.
 *
 * Returns null when App Check is unavailable — not configured, not supported on
 * the current platform, or the attestation failed. Callers proceed without the
 * header so the app degrades to ID-token-only auth rather than breaking.
 */
export interface IAppCheckProvider {
  /** Returns a valid App Check token, or null if unavailable. */
  getAppCheckToken(): Promise<string | null>;
}
