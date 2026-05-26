/**
 * DTOs that mirror the JSON structure returned by the KidSaber questions API.
 * Keep these in sync with the API contract in 05-seleccion-juegos.md.
 */

import { type Question, type Subject, type GameType } from '../../../domain/entities/Question';

export interface QuestionOptionDto {
  id: string;
  text: string;
}

export interface MatchingPairsDto {
  left: QuestionOptionDto[];
  right: QuestionOptionDto[];
}

export interface QuestionMetaDto {
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimitMs: number;
  tags: string[];
}

export interface QuestionDto {
  id: string;
  type: string;
  subject: string;
  grade: number;
  topic: string;
  statement: string;
  expression?: string;
  options?: QuestionOptionDto[];
  pairs?: MatchingPairsDto;
  correctAnswers: unknown[];
  meta: QuestionMetaDto;
}

export interface QuestionsResponseDto {
  questions: QuestionDto[];
}

// --- Type guards ---

const VALID_GAME_TYPES: string[] = [
  'option_multiple',
  'fill_in_the_blanks',
  'matching',
  'quick_calculation',
];
const VALID_SUBJECTS: string[] = ['mathematics', 'language', 'english', 'science'];

function isQuestionOptionDto(val: unknown): val is QuestionOptionDto {
  return (
    typeof val === 'object' &&
    val !== null &&
    typeof (val as QuestionOptionDto).id === 'string' &&
    typeof (val as QuestionOptionDto).text === 'string'
  );
}

function isQuestionMetaDto(val: unknown): val is QuestionMetaDto {
  if (typeof val !== 'object' || val === null) return false;
  const meta = val as QuestionMetaDto;
  return (
    ['easy', 'medium', 'hard'].includes(meta.difficulty) &&
    typeof meta.timeLimitMs === 'number' &&
    Array.isArray(meta.tags)
  );
}

export function isQuestionDto(val: unknown): val is QuestionDto {
  if (typeof val !== 'object' || val === null) return false;
  const q = val as QuestionDto;
  return (
    typeof q.id === 'string' &&
    VALID_GAME_TYPES.includes(q.type) &&
    VALID_SUBJECTS.includes(q.subject) &&
    typeof q.grade === 'number' &&
    typeof q.topic === 'string' &&
    typeof q.statement === 'string' &&
    Array.isArray(q.correctAnswers) &&
    q.correctAnswers.length > 0 &&
    isQuestionMetaDto(q.meta)
  );
}

export function isQuestionsResponseDto(val: unknown): val is QuestionsResponseDto {
  return (
    typeof val === 'object' &&
    val !== null &&
    Array.isArray((val as QuestionsResponseDto).questions)
  );
}

/**
 * Maps a QuestionDto from the API to the domain Question entity.
 * Throws if the DTO is invalid.
 */
export function mapQuestionDtoToDomain(dto: QuestionDto): Question {
  if (!isQuestionDto(dto)) {
    throw new Error(`Invalid question DTO: ${JSON.stringify(dto)}`);
  }

  return {
    id: dto.id,
    type: dto.type as GameType,
    subject: dto.subject as Subject,
    grade: dto.grade,
    topic: dto.topic,
    statement: dto.statement,
    expression: dto.expression,
    options: dto.options?.filter(isQuestionOptionDto),
    pairs: dto.pairs,
    correctAnswers: dto.correctAnswers as Question['correctAnswers'],
    meta: {
      difficulty: dto.meta.difficulty,
      timeLimitMs: dto.meta.timeLimitMs,
      tags: dto.meta.tags,
    },
  };
}
