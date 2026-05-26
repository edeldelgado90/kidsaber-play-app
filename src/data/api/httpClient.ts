/**
 * HTTP client with timeout and retry logic.
 * All API calls go through this module — never use raw fetch() in services.
 *
 * Policy (per implementation-notes.md):
 * - Timeout: 10s per request
 * - Retries: up to 2 on 5xx or network errors, with 1s and 2s backoff
 * - No HTTP fallback — HTTPS only (enforced by API_URL env var)
 */

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const REQUEST_TIMEOUT_MS = 10_000;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new NetworkError('La solicitud tardó demasiado. Comprueba tu red.')), ms),
    ),
  ]);
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
): Promise<Response> {
  try {
    const response = await withTimeout(
      fetch(url, options),
      REQUEST_TIMEOUT_MS,
    );

    if (!response.ok && response.status >= 500 && retries > 0) {
      await sleep(retries === 2 ? 1000 : 2000);
      return fetchWithRetry(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    if (error instanceof NetworkError) {
      if (retries > 0) {
        await sleep(retries === 2 ? 1000 : 2000);
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }

    // Network failure (no internet, DNS error, etc.)
    if (retries > 0) {
      await sleep(retries === 2 ? 1000 : 2000);
      return fetchWithRetry(url, options, retries - 1);
    }

    throw new NetworkError('No hay conexión. Comprueba tu red e inténtalo de nuevo.');
  }
}

export interface HttpGetOptions {
  headers?: Record<string, string>;
}

/**
 * Performs a typed GET request with retry and timeout.
 * Validates the response status before returning.
 */
export async function httpGet<T>(
  url: string,
  options?: HttpGetOptions,
): Promise<T> {
  const response = await fetchWithRetry(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    // Only log status code in production — never the full body (PII risk)
    throw new ApiError(
      `Error del servidor (${response.status}). Inténtalo de nuevo.`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}
