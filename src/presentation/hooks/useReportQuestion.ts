import { useCallback, useState } from 'react';
import { questionsService } from '@/infrastructure/di/container';

/** What the report link should show for the question on screen. */
export type ReportState = 'idle' | 'sending' | 'sent' | 'failed';

/**
 * Tracks question reports for the current session.
 *
 * Reported ids are remembered so the link cannot be tapped twice for the same
 * question — the API already collapses repeats, but a child tapping a link that
 * keeps responding has no way to tell whether it worked.
 *
 * Nothing is persisted: the memory lasts as long as the session, which is all
 * the "already reported" hint needs to cover.
 */
export function useReportQuestion() {
  const [reported, setReported] = useState<Record<string, ReportState>>({});

  const reportQuestion = useCallback(async (questionId: string) => {
    setReported(prev => ({ ...prev, [questionId]: 'sending' }));

    try {
      await questionsService.reportQuestion(questionId);
      setReported(prev => ({ ...prev, [questionId]: 'sent' }));
    } catch {
      // The specific reason is no use to a 6-year-old; the link just offers
      // another try. Nothing is thrown: a failed report must never interrupt
      // the game in progress.
      setReported(prev => ({ ...prev, [questionId]: 'failed' }));
    }
  }, []);

  const getReportState = useCallback(
    (questionId: string): ReportState => reported[questionId] ?? 'idle',
    [reported],
  );

  return { reportQuestion, getReportState };
}
