import { GamesScreen } from '@/presentation/screens/GamesScreen';
import { SUBJECTS_ORDER } from '@/domain/entities/Question';

/**
 * Route: /(main)/games/[subject]
 * Game type selection for a given subject.
 */
export default GamesScreen;

/**
 * Enumerates the subject segment so static web export prerenders one HTML file
 * per subject. Without this the route is only reachable through client-side
 * navigation, and a reload or a directly entered URL 404s on a static host.
 */
export function generateStaticParams(): { subject: string }[] {
  return SUBJECTS_ORDER.map((subject) => ({ subject }));
}
