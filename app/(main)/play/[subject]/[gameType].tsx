import { GameSessionScreen } from '@/presentation/screens/GameSessionScreen';
import { SUBJECTS_ORDER, SUBJECT_GAME_TYPES } from '@/domain/entities/Question';

/**
 * Route: /(main)/play/[subject]/[gameType]
 * Game session screen — renders one question at a time.
 */
export default GameSessionScreen;

/**
 * Enumerates every valid subject/game-type pair so static web export prerenders
 * them. Driven by SUBJECT_GAME_TYPES rather than the cartesian product, so
 * combinations the domain does not offer (quick_calculation outside mathematics)
 * produce no route.
 */
export function generateStaticParams(): { subject: string; gameType: string }[] {
  return SUBJECTS_ORDER.flatMap((subject) =>
    SUBJECT_GAME_TYPES[subject].map((gameType) => ({ subject, gameType })),
  );
}
