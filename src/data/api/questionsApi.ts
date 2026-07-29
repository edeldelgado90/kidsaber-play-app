import { httpGet, httpPost } from './httpClient';
import {
  isQuestionsResponseDto,
  mapQuestionDtoToDomain,
  type QuestionsResponseDto,
} from './dtos/QuestionDto';
import { type Question, type Subject, type GameType } from '../../domain/entities/Question';
import { DEFAULT_QUESTION_COUNT } from '../../domain/entities/GameSession';

export interface QuestionsApiParams {
  subject: Subject;
  grade: number;
  type: GameType;
  count?: number;
}

/**
 * Typed API client for the KidSaber questions endpoint.
 * Maps raw API DTOs to domain Question entities and validates the response shape.
 *
 * @param token - Optional Firebase ID token, sent as `Authorization: Bearer`.
 *                Required when the server runs with AUTH_ENABLED=true.
 *                Pass undefined (or null) for unauthenticated requests.
 * @param appCheckToken - Optional Firebase App Check token, sent as
 *                `X-Firebase-AppCheck`. Attests the request comes from a genuine
 *                app instance. The API accepts either credential on its own.
 */
export async function fetchQuestionsFromApi(
  baseUrl: string,
  params: QuestionsApiParams,
  token?: string | null,
  appCheckToken?: string | null,
): Promise<Question[]> {
  const url = buildUrl(baseUrl, params);

  const data = await httpGet<unknown>(url, { headers: buildAuthHeaders(token, appCheckToken) });

  if (!isQuestionsResponseDto(data)) {
    throw new Error('La respuesta del servidor tiene un formato inesperado.');
  }

  const response = data as QuestionsResponseDto;
  return response.questions.map(mapQuestionDtoToDomain);
}

/**
 * Reports a question as wrong.
 *
 * Sends no body: the API takes only the id and reads everything else from its
 * own database, so nothing the player sees or types reaches the review queue.
 *
 * The retry budget is trimmed to one attempt. The endpoint is rate limited far
 * more tightly than the read routes, and the default budget would sit through a
 * 4s backoff before failing — a long silence for a child who just tapped a link.
 * The call is idempotent (the API keys reports by question), so retrying once is
 * safe and a repeat report never double-counts.
 */
export async function reportQuestionToApi(
  baseUrl: string,
  questionId: string,
  token?: string | null,
  appCheckToken?: string | null,
): Promise<void> {
  const url = `${baseUrl.replace(/\/$/, '')}/questions/${encodeURIComponent(questionId)}/report`;

  await httpPost(url, undefined, {
    headers: buildAuthHeaders(token, appCheckToken),
    retries: 1,
  });
}

/**
 * Builds the auth headers shared by every call to the questions API.
 * Each header is omitted when its token is absent, which is what keeps the app
 * working against an auth-disabled backend and in tests.
 */
function buildAuthHeaders(
  token?: string | null,
  appCheckToken?: string | null,
): Record<string, string> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (appCheckToken) {
    headers['X-Firebase-AppCheck'] = appCheckToken;
  }
  return headers;
}

function buildUrl(baseUrl: string, params: QuestionsApiParams): string {
  const qs = new URLSearchParams({
    subject: params.subject,
    grade: String(params.grade),
    type: params.type,
    count: String(params.count ?? DEFAULT_QUESTION_COUNT),
  });

  // Ensure HTTPS in production
  const url = `${baseUrl.replace(/\/$/, '')}/questions?${qs.toString()}`;
  return url;
}
