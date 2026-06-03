import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useGameSession } from '@/presentation/hooks/useGameSession';
import { type SessionStatus } from '@/infrastructure/store/sessionStore';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import { type Subject, type GameType, SUBJECT_META, GAME_TYPE_META } from '@/domain/entities/Question';
import { type MatchingAnswer } from '@/domain/entities/Question';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { QuestionProgressBar } from '@/presentation/components/game/QuestionProgressBar';
import { OptionCard, type OptionState } from '@/presentation/components/game/OptionCard';
import { GameFeedbackOverlay } from '@/presentation/components/game/GameFeedbackOverlay';
import { StarCelebrationOverlay } from '@/presentation/components/game/StarCelebrationOverlay';
import { FillBlankStatement } from '@/presentation/components/game/FillBlankStatement';
import { MatchingColumn } from '@/presentation/components/game/MatchingColumn';
import { ErrorRetry } from '@/presentation/components/common/ErrorRetry';
import { SkeletonList } from '@/presentation/components/common/SkeletonCard';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { useHorizontalPadding } from '@/infrastructure/platform/useBreakpoint';

type AnswerState = 'idle' | 'selected' | 'revealed';

/**
 * Game Session screen — renders one question at a time for all game types.
 *
 * Design spec:
 * - White header with back button + "Pregunta X/Y" + LinearProgress
 * - Question text 22px weight 700
 * - 4 OptionCards with idle/selected/correct/incorrect/disabled states
 * - "Comprobar" button, disabled until option selected
 * - Feedback overlay (green 1100ms / red 1600ms)
 * - After last question: navigate to evolution
 */
export function GameSessionScreen() {
  const { subject: subjectParam, gameType: gameTypeParam } =
    useLocalSearchParams<{ subject: string; gameType: string }>();

  const subject = subjectParam as Subject;
  const gameType = gameTypeParam as GameType;

  const activeProfileId = useProfileStore(s => s.activeProfileId);
  const getActiveProfile = useProfileStore(s => s.getActiveProfile);
  const activeProfile = getActiveProfile();

  const {
    status,
    questions,
    currentIndex,
    currentQuestion,
    error,
    starEarned,
    startSession,
    submitAnswer,
    advanceQuestion,
    finishAndSave,
    resetSession,
  } = useGameSession();

  const [showStarCelebration, setShowStarCelebration] = useState(false);
  // Tracks the status from the previous render to detect the 'playing' → 'finished'
  // transition for THIS session. Guards against stale Zustand state on mount.
  const prevStatusRef = useRef<SessionStatus>('idle');

  // Local answer state for the current question
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [matchingAnswers, setMatchingAnswers] = useState<MatchingAnswer[]>([]);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Question fade animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const subjectMeta = SUBJECT_META[subject];
  const gameTypeMeta = GAME_TYPE_META[gameType];
  const hPad = useHorizontalPadding();

  const initSession = useCallback(async () => {
    if (!activeProfileId || !activeProfile) return;
    resetSession();
    setSelectedOptionId(null);
    setMatchingAnswers([]);
    setAnswerState('idle');
    setLastAnswerCorrect(false);
    await startSession(activeProfileId, subject, gameType, activeProfile.grade);
  }, [activeProfileId, activeProfile, subject, gameType]); // eslint-disable-line

  useEffect(() => {
    initSession();
  }, [initSession]);

  // When session finishes: show star celebration if earned, otherwise go straight to evolution.
  // Guard: only act if the session actually went through 'playing' in this component instance,
  // to avoid reacting to stale 'finished' state left in the store from a previous session.
  useEffect(() => {
    if (status === 'finished' && prevStatusRef.current === 'playing' && activeProfileId) {
      if (starEarned) {
        setShowStarCelebration(true);
      } else {
        finishAndSave(activeProfileId).then(() => {
          router.replace('/(main)/evolution');
        });
      }
    }
    prevStatusRef.current = status;
  }, [status]); // eslint-disable-line

  const handleStarCelebrationHide = () => {
    setShowStarCelebration(false);
    if (activeProfileId) {
      finishAndSave(activeProfileId).then(() => {
        router.replace('/(main)/evolution');
      });
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (answerState !== 'idle') return;
    setSelectedOptionId(optionId);
  };

  const handleCheck = () => {
    if (!currentQuestion || answerState !== 'idle') return;

    let userAnswer: unknown;
    if (gameType === 'matching') {
      userAnswer = matchingAnswers;
    } else {
      userAnswer = selectedOptionId;
    }

    const isCorrect = submitAnswer(userAnswer);
    setLastAnswerCorrect(isCorrect);
    setAnswerState('revealed');
    setShowFeedback(true);
  };

  const handleFeedbackHide = () => {
    setSelectedOptionId(null);
    setMatchingAnswers([]);
    setAnswerState('idle');
    setShowFeedback(false);
    // Advance session index now that the overlay has dismissed, so the next
    // question never bleeds through behind the overlay while it was visible.
    advanceQuestion();
    // Animate next question in
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(translateAnim, { toValue: 8, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleBack = () => {
    resetSession();
    router.back();
  };

  // Render guard for each option card's state
  const getOptionState = (optionId: string): OptionState => {
    if (answerState === 'idle') {
      return selectedOptionId === optionId ? 'selected' : 'idle';
    }
    if (answerState === 'revealed') {
      const isCorrect =
        Array.isArray(currentQuestion?.correctAnswers) &&
        currentQuestion!.correctAnswers.includes(optionId as never);

      if (selectedOptionId === optionId) {
        return isCorrect ? 'correct' : 'incorrect';
      }
      if (isCorrect) return 'correct';
      return 'disabled';
    }
    return 'idle';
  };

  if (status === 'loading') {
    return (
      <View style={styles.root}>
        <AppHeader
          white
          title={`${subjectMeta?.label ?? ''} · ${gameTypeMeta?.label ?? ''}`}
          onBack={handleBack}
        />
        <View style={styles.loadingContainer}>
          <SkeletonList count={4} />
        </View>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.root}>
        <AppHeader white onBack={handleBack} />
        <ErrorRetry message={error ?? undefined} onRetry={initSession} />
      </View>
    );
  }

  if (!currentQuestion || status === 'idle') {
    return null;
  }

  const isMatchingType = gameType === 'matching';
  const isFillBlankType = gameType === 'fill_in_the_blanks';

  const canSubmit = isMatchingType
    ? matchingAnswers.length === (currentQuestion.pairs?.left.length ?? 0)
    : selectedOptionId !== null;

  // Find the correct answer text for the feedback overlay
  const correctAnswerText =
    !lastAnswerCorrect && currentQuestion.options
      ? currentQuestion.options.find(o =>
          (currentQuestion.correctAnswers as string[]).includes(o.id),
        )?.text
      : undefined;

  return (
    <View style={styles.root}>
      {/* White header with progress */}
      <View style={styles.header}>
        <AppHeader
          white
          title={`${subjectMeta?.label ?? ''} · ${gameTypeMeta?.label ?? ''}`}
          onBack={handleBack}
        />
        <QuestionProgressBar
          current={currentIndex + 1}
          total={questions.length}
        />
      </View>

      {/* Question content */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: hPad }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!showFeedback}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
          }}
        >
          {/* Question statement — FillBlankStatement renders its own statement */}
          {!isFillBlankType && (
            <Text style={styles.statement}>
              {currentQuestion.expression ?? currentQuestion.statement}
            </Text>
          )}

          {/* Render appropriate question UI by type */}
          {isMatchingType && currentQuestion.pairs ? (
            <MatchingColumn
              leftItems={currentQuestion.pairs.left}
              rightItems={currentQuestion.pairs.right}
              userAnswers={matchingAnswers}
              onAnswersChange={setMatchingAnswers}
              disabled={answerState !== 'idle'}
            />
          ) : isFillBlankType && currentQuestion.options ? (
            <FillBlankStatement
              statement={currentQuestion.statement}
              options={currentQuestion.options}
              selectedId={selectedOptionId}
              onSelect={handleOptionSelect}
              disabled={answerState !== 'idle'}
            />
          ) : (
            // option_multiple and quick_calculation
            <View style={styles.optionList}>
              {(currentQuestion.options ?? []).map((opt, i) => (
                <OptionCard
                  key={opt.id}
                  label={String.fromCharCode(65 + i)} // A, B, C, D
                  text={opt.text}
                  state={getOptionState(opt.id)}
                  onPress={() => handleOptionSelect(opt.id)}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>

      {/* Comprobar button */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleCheck}
          disabled={!canSubmit || answerState !== 'idle'}
          style={styles.checkButton}
          labelStyle={styles.checkButtonLabel}
          contentStyle={styles.checkButtonContent}
          accessibilityLabel="Comprobar respuesta"
        >
          {'Comprobar'}
        </Button>
      </View>

      {/* Feedback overlay */}
      <GameFeedbackOverlay
        visible={showFeedback}
        isCorrect={lastAnswerCorrect}
        correctAnswerText={correctAnswerText}
        onHide={handleFeedbackHide}
      />

      {/* Star celebration shown when the session ends with a star earned */}
      <StarCelebrationOverlay
        visible={showStarCelebration}
        onHide={handleStarCelebrationHide}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  loadingContainer: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing['3xl'],
    gap: Spacing.xl,
  },
  statement: {
    fontSize: Typography.scale.h2.size,
    fontFamily: nunitoFamily('700'),
    color: Colors.textPrimary,
    lineHeight: 30,
    marginBottom: Spacing.xl,
  },
  optionList: {
    gap: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    backgroundColor: Colors.surface,
  },
  checkButton: {
    borderRadius: Radii.md,
  },
  checkButtonLabel: {
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.button.size,
  },
  checkButtonContent: {
    paddingVertical: 6,
  },
});
