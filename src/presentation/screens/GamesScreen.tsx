import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import { useProgressStore } from '@/infrastructure/store/progressStore';
import {
  type Subject,
  type GameType,
  SUBJECT_GAME_TYPES,
  SUBJECT_META,
} from '@/domain/entities/Question';
import { SunBackground } from '@/presentation/components/common/SunBackground';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { GameTypeCard } from '@/presentation/components/game/GameTypeCard';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { useContentWidth, useHorizontalPadding } from '@/infrastructure/platform/useBreakpoint';

import CAPYBARA_BRAIN from '../../../assets/brand/capybara-brain.png';

/**
 * Game Type Selection screen.
 *
 * Design spec:
 * - AppHeader with subject title + emoji
 * - "sun + green floor" background
 * - capybara-brain centered bottom
 * - Back link + title + subtitle + 4 GameTypeCard rows + progress card
 */
export function GamesScreen() {
  const { subject: subjectParam } = useLocalSearchParams<{ subject: string }>();
  const subject = subjectParam as Subject;

  const activeProfileId = useProfileStore(s => s.activeProfileId);
  const getStarsForSubject = useProgressStore(s => s.getStarsForSubject);
  const getStarsForGameType = (gameType: GameType) => {
    const p = useProgressStore.getState();
    if (!activeProfileId) return 0;
    return p.getProfileProgress(activeProfileId).starsByGameType?.[gameType] ?? 0;
  };

  const subjectMeta = SUBJECT_META[subject];
  const subjectStars = activeProfileId ? getStarsForSubject(activeProfileId, subject) : 0;

  const hPad = useHorizontalPadding();
  const contentWidth = useContentWidth();
  const capybaraWidth = Math.min(290, Math.round(contentWidth * 0.74));
  const capybaraHeight = Math.round(capybaraWidth * (200 / 290));

  const handleGameTypePress = (gameType: GameType) => {
    router.push(`/(main)/play/${subject}/${gameType}`);
  };

  const handleEvolutionPress = () => router.push('/(main)/evolution');
  const handlePetPress = () => router.push('/(main)/pet');
  const handleBack = () => router.back();

  if (!subjectMeta) {
    return null;
  }

  return (
    <View style={styles.root}>
      <AppHeader
        title={`${subjectMeta.label} ${subjectMeta.emoji}`}
        onBack={handleBack}
        onEvolution={handleEvolutionPress}
        onPet={handlePetPress}
      />

      <SunBackground>
        {/* Capybara brain centered bottom */}
        <Image
          source={CAPYBARA_BRAIN}
          style={[styles.capybara, { width: capybaraWidth, height: capybaraHeight }]}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: hPad }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Page header text */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>{'¿Qué tipo de juego?'}</Text>
            <Text style={styles.pageSubtitle}>{'Elige cómo quieres practicar hoy'}</Text>
          </View>

          {/* Game type cards */}
          <View style={styles.gameList}>
            {SUBJECT_GAME_TYPES[subject].map(gameType => (
              <GameTypeCard
                key={gameType}
                gameType={gameType}
                stars={getStarsForGameType(gameType)}
                onPress={() => handleGameTypePress(gameType)}
              />
            ))}
          </View>

          {/* Progress card */}
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>{'⭐ Tu progreso'}</Text>
            <Text style={styles.progressSubtitle}>
              {`${subjectStars} estrella${subjectStars !== 1 ? 's' : ''} en ${subjectMeta.label} · Sigue jugando`}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(100, (subjectStars / 5) * 100)}%` },
                ]}
              />
            </View>
          </View>

          {/* Bottom padding for capybara */}
          <View style={styles.spacer} />
        </ScrollView>
      </SunBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  capybara: {
    alignSelf: 'center',
    zIndex: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing['3xl'],
    gap: Spacing.lg,
    zIndex: 2,
  },
  pageHeader: {
    gap: Spacing.xs,
    zIndex: 1,
  },
  pageSubtitle: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: 15,
    lineHeight: 22,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h1.size,
    lineHeight: Typography.scale.h1.lineHeight,
  },
  progressBar: {
    backgroundColor: Colors.borderSubtle,
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
  },
  progressCard: {
    backgroundColor: Colors.surface,
    borderColor: '#eaf0f7',
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: Spacing.sm,
    padding: Spacing.lg,
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#0050b4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 12px rgba(0, 80, 180, 0.10)' } as Record<string, unknown>,
    }),
  },
  progressFill: {
    backgroundColor: Colors.brandSecondary,
    borderRadius: 4,
    height: 8,
  },
  progressSubtitle: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.caption.size,
  },
  progressTitle: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  root: {
    backgroundColor: Colors.brandPrimary,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.lg,
    paddingBottom: Spacing['3xl'],
    paddingTop: Spacing.md,
    paddingVertical: Spacing.lg,
    zIndex: 2,
  },
  spacer: {
    height: 70,
  },
});
