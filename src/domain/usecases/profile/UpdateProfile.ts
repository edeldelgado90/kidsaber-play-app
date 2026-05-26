import { type Profile, validateProfileName, validateGrade } from '../../entities/Profile';
import { type IProfileRepository } from '../../ports/IProfileRepository';

interface UpdateProfileInput {
  id: string;
  name?: string;
  grade?: number;
}

/**
 * Updates an existing child profile's name and/or grade.
 */
export async function updateProfile(
  repository: IProfileRepository,
  input: UpdateProfileInput,
): Promise<void> {
  const updates: Partial<Pick<Profile, 'name' | 'grade'>> = {};

  if (input.name !== undefined) {
    const trimmedName = input.name.trim();
    const nameError = validateProfileName(trimmedName);
    if (nameError) throw new Error(nameError);
    updates.name = trimmedName;
  }

  if (input.grade !== undefined) {
    const gradeError = validateGrade(input.grade);
    if (gradeError) throw new Error(gradeError);
    updates.grade = input.grade as Profile['grade'];
  }

  if (Object.keys(updates).length === 0) {
    return; // nothing to update
  }

  await repository.update(input.id, updates);
}
