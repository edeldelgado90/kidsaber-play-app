import { httpPost } from './httpClient';

// ---------------------------------------------------------------------------
// DTO shape + type guard
// ---------------------------------------------------------------------------

interface TokenResponseDto {
  /** Short-lived bearer token to include in Authorization headers. */
  token: string;
  /** Unix timestamp (seconds) when the token expires. */
  expiresAt: number;
}

function isTokenResponseDto(data: unknown): data is TokenResponseDto {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return typeof d.token === 'string' && typeof d.expiresAt === 'number';
}

// ---------------------------------------------------------------------------
// Public result type
// ---------------------------------------------------------------------------

export interface DeviceTokenResult {
  token: string;
  /** Unix timestamp (seconds) when the token expires. */
  expiresAt: number;
}

// ---------------------------------------------------------------------------
// API call
// ---------------------------------------------------------------------------

/**
 * Requests a short-lived bearer token from the backend auth endpoint.
 *
 * The backend identifies the device by a stable, non-secret deviceId and
 * returns a JWT scoped to that device. The deviceId is NOT a credential —
 * it is a stable identifier for per-device rate limiting.
 *
 * Endpoint contract:
 *   POST /auth/token
 *   Body:     { deviceId: string }
 *   Response: { token: string; expiresAt: number }
 *
 * Throws on network errors or unexpected response shapes.
 * Callers should catch errors and treat them as "auth unavailable".
 */
export async function fetchDeviceToken(
  baseUrl: string,
  deviceId: string,
): Promise<DeviceTokenResult> {
  const url = `${baseUrl.replace(/\/$/, '')}/auth/token`;
  const data = await httpPost<{ deviceId: string }, unknown>(url, { deviceId });

  if (!isTokenResponseDto(data)) {
    throw new Error('Respuesta de autenticación con formato inesperado del servidor.');
  }

  return { token: data.token, expiresAt: data.expiresAt };
}
