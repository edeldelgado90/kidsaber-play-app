import { type Profile, validateProfileName, validateGrade } from '../../entities/Profile';
import { type IProfileRepository } from '../../ports/IProfileRepository';

interface CreateProfileInput {
  name: string;
  grade: number;
}

interface CreateProfileResult {
  profile: Profile;
}

/**
 * Creates a new child profile and persists it locally.
 * Generates a UUID and timestamps the creation.
 */
export async function createProfile(
  repository: IProfileRepository,
  input: CreateProfileInput,
): Promise<CreateProfileResult> {
  const trimmedName = input.name.trim();

  const nameError = validateProfileName(trimmedName);
  if (nameError) throw new Error(nameError);

  const gradeError = validateGrade(input.grade);
  if (gradeError) throw new Error(gradeError);

  const profile: Profile = {
    id: generateUuid(),
    name: trimmedName,
    grade: input.grade as Profile['grade'],
    createdAt: new Date().toISOString(),
  };

  await repository.save(profile);
  await repository.setActiveProfileId(profile.id);

  return { profile };
}

// Simple UUID v4 generator (no external deps required)
function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
