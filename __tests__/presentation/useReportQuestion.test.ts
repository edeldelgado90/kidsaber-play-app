import { renderHook, act, waitFor } from '@testing-library/react-native';

const mockReportQuestion = jest.fn();

jest.mock('@/infrastructure/di/container', () => ({
  questionsService: {
    reportQuestion: (id: string) => mockReportQuestion(id),
  },
}));

import { useReportQuestion } from '@/presentation/hooks/useReportQuestion';

describe('useReportQuestion', () => {
  beforeEach(() => jest.clearAllMocks());

  it('starts idle for every question', () => {
    const { result } = renderHook(() => useReportQuestion());

    expect(result.current.getReportState('q1')).toBe('idle');
  });

  it('marks the question as sent once the API accepts the report', async () => {
    mockReportQuestion.mockResolvedValue(undefined);
    const { result } = renderHook(() => useReportQuestion());

    await act(async () => {
      await result.current.reportQuestion('q1');
    });

    expect(mockReportQuestion).toHaveBeenCalledWith('q1');
    expect(result.current.getReportState('q1')).toBe('sent');
  });

  // A failed report must leave the game playable and offer another try.
  it('marks the question as failed without throwing', async () => {
    mockReportQuestion.mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useReportQuestion());

    await act(async () => {
      await result.current.reportQuestion('q1');
    });

    expect(result.current.getReportState('q1')).toBe('failed');
  });

  it('tracks each question independently', async () => {
    mockReportQuestion.mockResolvedValue(undefined);
    const { result } = renderHook(() => useReportQuestion());

    await act(async () => {
      await result.current.reportQuestion('q1');
    });

    expect(result.current.getReportState('q1')).toBe('sent');
    expect(result.current.getReportState('q2')).toBe('idle');
  });

  it('reports sending while the call is in flight', async () => {
    let resolveCall: (() => void) | undefined;
    mockReportQuestion.mockReturnValue(
      new Promise<void>(resolve => {
        resolveCall = resolve;
      }),
    );
    const { result } = renderHook(() => useReportQuestion());

    act(() => {
      void result.current.reportQuestion('q1');
    });

    await waitFor(() => expect(result.current.getReportState('q1')).toBe('sending'));

    await act(async () => {
      resolveCall?.();
    });

    await waitFor(() => expect(result.current.getReportState('q1')).toBe('sent'));
  });
});
