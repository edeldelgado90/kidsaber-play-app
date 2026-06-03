/**
 * HTTP client with timeout and retry logic.
 * All API calls go through this module — never use raw fetch() in services.
 *
 * Policy (per implementation-notes.md):
 * - Timeout: 10s per request
 * - Retries: up to 2 on 5xx or network errors, with 1s and 2s backoff
 * - Retries: up to 2 on 429 (rate limit), with 4s backoff
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
      setTimeout(
        () => reject(new NetworkError('La solicitud tardó demasiado. Comprueba tu red.')),
        ms,
      ),
    ),
  ]);
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  try {
    const response = await withTimeout(fetch(url, options), REQUEST_TIMEOUT_MS);

    // 429 Too Many Requests — retry with a longer delay (rate limit backoff)
    if (response.status === 429 && retries > 0) {
      await sleep(4000);
      return fetchWithRetry(url, options, retries - 1);
    }

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

export interface HttpRequestOptions {
  headers?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Tries to extract a human-readable message from a structured API error body.
 * The API returns { "error": "short_code", "message": "human readable" }.
 * Falls back to the supplied default if parsing fails or the field is absent.
 */
async function extractErrorMessage(response: Response, defaultMessage: string): Promise<string> {
  try {
    const body = (await response.clone().json()) as { message?: string };
    if (typeof body?.message === 'string' && body.message.length > 0) {
      return body.message;
    }
  } catch {
    // Body is not JSON or is empty — keep the default
  }
  return defaultMessage;
}

async function throwApiError(response: Response): Promise<never> {
  if (response.status === 429) {
    throw new ApiError(
      'Demasiadas peticiones. Espera un momento y vuelve a intentarlo.',
      response.status,
    );
  }
  const message = await extractErrorMessage(
    response,
    `Error del servidor (${response.status}). Inténtalo de nuevo.`,
  );
  throw new ApiError(message, response.status);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Performs a typed GET request with retry and timeout.
 * Validates the response status before returning.
 * On error responses, tries to extract a human-readable message from the API error body.
 */
export async function httpGet<T>(url: string, options?: HttpRequestOptions): Promise<T> {
  const response = await fetchWithRetry(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  return response.json() as Promise<T>;
}

/**
 * Performs a typed POST request with retry and timeout.
 * Validates the response status before returning.
 *
 * Note: retries are safe here because all POST endpoints in this app are
 * idempotent (e.g. token issuance by deviceId). Do not reuse for write
 * endpoints that are not idempotent.
 */
export async function httpPost<TBody, TResponse>(
  url: string,
  body: TBody,
  options?: HttpRequestOptions,
): Promise<TResponse> {
  const response = await fetchWithRetry(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options?.headers ?? {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  return response.json() as Promise<TResponse>;
}
