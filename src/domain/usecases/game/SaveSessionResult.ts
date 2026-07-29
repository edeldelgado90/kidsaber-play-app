import { type IProgressRepository } from '../../ports/IProgressRepository';
import { type IEconomyRepository } from '../../ports/IEconomyRepository';
import { type Subject, type GameType } from '../../entities/Question';

interface SaveSessionResultInput {
  profileId: string;
  subject: Subject;
  gameType: GameType;
  starEarned: boolean;
}

/**
 * Saves the result of a completed game session.
 * If a star was earned, increments the star count for the subject and game type,
 * plus the pet economy counters (lifetime + spendable wallet) in the same flow.
 */
export async function saveSessionResult(
  repository: IProgressRepository,
  economyRepository: IEconomyRepository,
  input: SaveSessionResultInput,
): Promise<void> {
  const now = new Date().toISOString();

  // Always save the last session info
  await repository.saveLastSession(input.profileId, input.subject, input.gameType, now);

  // Only add a star if earned (>80% correct)
  if (input.starEarned) {
    await repository.addStar(input.profileId, input.subject, input.gameType);
    await economyRepository.creditStar(input.profileId);
  }
}
