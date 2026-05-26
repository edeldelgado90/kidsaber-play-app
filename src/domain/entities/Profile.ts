/**
 * Domain entity representing a child's profile.
 * Stored locally via AsyncStorage — no remote account in v1.
 */
export interface Profile {
  id: string; // UUID v4
  name: string; // 2–20 characters, trimmed
  grade: 1 | 2 | 3 | 4 | 5 | 6; // Primary school year (Spain)
  createdAt: string; // ISO 8601
}

export type Grade = Profile['grade'];

export const GRADE_LABELS: Record<Grade, string> = {
  1: '1.º Primaria',
  2: '2.º Primaria',
  3: '3.º Primaria',
  4: '4.º Primaria',
  5: '5.º Primaria',
  6: '6.º Primaria',
};

export const GRADE_SHORT_LABELS: Record<Grade, string> = {
  1: '1.º',
  2: '2.º',
  3: '3.º',
  4: '4.º',
  5: '5.º',
  6: '6.º',
};

export const ALL_GRADES: Grade[] = [1, 2, 3, 4, 5, 6];

/** Validates a profile name: 2–20 non-empty trimmed characters. */
export function validateProfileName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
  if (trimmed.length > 20) return 'El nombre no puede tener más de 20 caracteres.';
  return null;
}

/** Validates a grade value is a valid Primary school year. */
export function validateGrade(grade: number): string | null {
  if (!Number.isInteger(grade) || grade < 1 || grade > 6) {
    return 'El curso debe estar entre 1.º y 6.º de Primaria.';
  }
  return null;
}
