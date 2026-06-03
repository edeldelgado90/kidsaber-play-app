/**
 * Domain entity for a question served by the KidSaber questions API.
 * The canonical answer validation field is `correctAnswers` (never `correctAnswer`).
 *
 * API contract: GET /questions?subject=&grade=&type=&count=
 * Response: { "questions": Question[] }
 */

export type Subject = 'mathematics' | 'language' | 'english' | 'science';

export type GameType =
  | 'option_multiple'
  | 'fill_in_the_blanks'
  | 'matching'
  | 'quick_calculation';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface MatchingPairs {
  left: QuestionOption[];
  right: QuestionOption[];
}

export type MatchingAnswer = { leftId: string; rightId: string };

export type CorrectAnswers = string[] | number[] | MatchingAnswer[];

export interface QuestionMeta {
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimitMs: number;
  tags: string[];
}

export interface Question {
  id: string;
  type: GameType;
  subject: Subject;
  grade: number;
  topic: string;
  statement: string;
  expression?: string; // quick_calculation: the displayable operation, e.g. "8 + 7"
  options?: QuestionOption[]; // option_multiple, fill_in_the_blanks, quick_calculation
  pairs?: MatchingPairs; // matching
  correctAnswers: CorrectAnswers; // canonical field — see API contract
  meta: QuestionMeta;
}

// Subject metadata for UI rendering
export interface SubjectMeta {
  id: Subject;
  label: string;
  emoji: string;
  accent: string;
  pastel: string;
  tint: string;
}

export const SUBJECT_META: Record<Subject, SubjectMeta> = {
  language: {
    id: 'language',
    label: 'Lengua',
    emoji: '📖',
    accent: '#ef4444',
    pastel: '#fbbcbc',
    tint: '#fde7e7',
  },
  mathematics: {
    id: 'mathematics',
    label: 'Matemáticas',
    emoji: '🧮',
    accent: '#0071da',
    pastel: '#bcd9f8',
    tint: '#dfeefd',
  },
  science: {
    id: 'science',
    label: 'Naturales',
    emoji: '🌍',
    accent: '#22c55e',
    pastel: '#b6efc8',
    tint: '#dffaea',
  },
  english: {
    id: 'english',
    label: 'Inglés',
    emoji: '🇬🇧',
    accent: '#8b5cf6',
    pastel: '#d2c4fb',
    tint: '#efe8fe',
  },
};

export const SUBJECTS_ORDER: Subject[] = ['language', 'mathematics', 'science', 'english'];

// Game type metadata for UI rendering
export interface GameTypeMeta {
  id: GameType;
  label: string;
  description: string;
  emoji: string;
  accent: string;
  pastel: string;
}

export const GAME_TYPE_META: Record<GameType, GameTypeMeta> = {
  option_multiple: {
    id: 'option_multiple',
    label: 'Opción múltiple',
    description: 'Elige la respuesta correcta entre varias opciones.',
    emoji: '🔵',
    accent: '#0071da',
    pastel: '#bcd9f8',
  },
  fill_in_the_blanks: {
    id: 'fill_in_the_blanks',
    label: 'Completar huecos',
    description: 'Completa la frase eligiendo la palabra que falta.',
    emoji: '✏️',
    accent: '#8b5cf6',
    pastel: '#d2c4fb',
  },
  matching: {
    id: 'matching',
    label: 'Emparejar',
    description: 'Une cada elemento de una columna con su pareja.',
    emoji: '🔗',
    accent: '#f59e0b',
    pastel: '#fde2b3',
  },
  quick_calculation: {
    id: 'quick_calculation',
    label: 'Cálculo rápido',
    description: 'Resuelve operaciones matemáticas rápidamente.',
    emoji: '⚡',
    accent: '#22c55e',
    pastel: '#b6efc8',
  },
};

export const GAME_TYPES_ORDER: GameType[] = [
  'option_multiple',
  'fill_in_the_blanks',
  'matching',
  'quick_calculation',
];

export const SUBJECT_GAME_TYPES: Record<Subject, GameType[]> = {
  mathematics: ['option_multiple', 'fill_in_the_blanks', 'matching', 'quick_calculation'],
  language:    ['option_multiple', 'fill_in_the_blanks', 'matching'],
  english:     ['option_multiple', 'fill_in_the_blanks', 'matching'],
  science:     ['option_multiple', 'fill_in_the_blanks', 'matching'],
};
