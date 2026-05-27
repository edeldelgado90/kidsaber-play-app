import { httpGet } from './httpClient';
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
 * @param token - Optional short-lived bearer token obtained from DeviceTokenService.
 *                Required when the server runs with AUTH_ENABLED=true.
 *                Pass undefined (or null) for unauthenticated requests.
 */
export async function fetchQuestionsFromApi(
  baseUrl: string,
  params: QuestionsApiParams,
  token?: string | null,
): Promise<Question[]> {
  const url = buildUrl(baseUrl, params);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const data = await httpGet<unknown>(url, { headers });

  if (!isQuestionsResponseDto(data)) {
    throw new Error('La respuesta del servidor tiene un formato inesperado.');
  }

  const response = data as QuestionsResponseDto;
  return response.questions.map(mapQuestionDtoToDomain);
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
