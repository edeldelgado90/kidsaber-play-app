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

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
