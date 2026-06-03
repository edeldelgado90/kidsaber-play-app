import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import { useProgressStore } from '@/infrastructure/store/progressStore';
import { SUBJECTS_ORDER, type Subject } from '@/domain/entities/Question';
import { SunBackground } from '@/presentation/components/common/SunBackground';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { SubjectCard } from '@/presentation/components/subject/SubjectCard';
import { ProfileChip } from '@/presentation/components/profile/ProfileChip';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { useContentWidth, useHorizontalPadding } from '@/infrastructure/platform/useBreakpoint';

import CAPYBARA_MATE from '../../../assets/brand/capybara-mate.png';

/**
 * Home / Subject Selection screen.
 *
 * Design spec:
 * - AppHeader: blue, ProfileChip left, title center, evolution + pet icons right
 * - "sun + green floor" background
 * - capybara-mate bottom-right (absolute, behind content)
 * - Greeting card + subject list (4 cards) + total stars card
 */
export function SubjectsScreen() {
  const { getActiveProfile } = useProfileStore();
  const getStarsForSubject = useProgressStore(s => s.getStarsForSubject);
  const getTotalStars = useProgressStore(s => s.getTotalStars);

  const hPad = useHorizontalPadding();
  const contentWidth = useContentWidth();
  const capybaraWidth = Math.min(320, Math.round(contentWidth * 0.82));
  const capybaraHeight = Math.round(capybaraWidth * (220 / 320));

  const activeProfile = getActiveProfile();
  const activeProfileId = useProfileStore(s => s.activeProfileId);

  const totalStars = activeProfileId ? getTotalStars(activeProfileId) : 0;
  const maxStars = SUBJECTS_ORDER.length * 5; // rough display cap

  const handleSubjectPress = (subject: Subject) => {
    router.push(`/(main)/games/${subject}`);
  };

  const handleProfilesPress = () => {
    router.push('/profiles');
  };

  const handleEvolutionPress = () => {
    router.push('/(main)/evolution');
  };

  const handlePetPress = () => {
    router.push('/(main)/pet');
  };

  return (
    <View style={styles.root}>
      <AppHeader
        title="KidSaber Play"
        leftSlot={
          activeProfile ? (
            <ProfileChip profile={activeProfile} onPress={handleProfilesPress} />
          ) : undefined
        }
        onEvolution={handleEvolutionPress}
        onPet={handlePetPress}
      />

      <SunBackground>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: hPad }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting card */}
          <View style={styles.greetingCard}>
            <Text style={styles.greetingTitle}>
              {`Hola, ${activeProfile?.name ?? 'amigo/a'} 👋`}
            </Text>
            <Text style={styles.greetingSubtitle}>{'¿Qué asignatura practicamos hoy?'}</Text>
          </View>

          {/* Subject cards */}
          <View style={styles.subjectList}>
            {SUBJECTS_ORDER.map(subject => (
              <SubjectCard
                key={subject}
                subject={subject}
                stars={activeProfileId ? getStarsForSubject(activeProfileId, subject) : 0}
                onPress={() => handleSubjectPress(subject)}
              />
            ))}
          </View>

          {/* Total stars card */}
          <View style={styles.starsCard}>
            <View style={styles.starsRow}>
              <Text style={styles.starIcon}>{'⭐'}</Text>
              <Text style={styles.starsLabel}>
                {`Total: ${totalStars} estrella${totalStars !== 1 ? 's' : ''} ganada${totalStars !== 1 ? 's' : ''}`}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(100, (totalStars / maxStars) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.starsCaption}>{'Sigue jugando para ganar más ✨'}</Text>
          </View>

          {/* Bottom padding for capybara */}
          <View style={styles.spacer} />
        </ScrollView>

        {/* Capybara (above content, z-index 10) */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Image
            source={CAPYBARA_MATE}
            style={[styles.capybara, { width: capybaraWidth, height: capybaraHeight }]}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </View>
      </SunBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  capybara: {
    bottom: -10,
    position: 'absolute',
    right: -60,
    zIndex: 10,
  },
  greetingCard: {
    backgroundColor: Colors.surface,
    borderColor: '#eaf0f7',
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: Spacing.xs,
    padding: Spacing.lg,
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
    zIndex: 1,
  },
  greetingSubtitle: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('600'),
    fontSize: Typography.scale.body.size - 2,
    lineHeight: 20,
  },
  greetingTitle: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: 24,
    lineHeight: 30,
  },
  progressBar: {
    backgroundColor: Colors.borderSubtle,
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: Colors.brandSecondary,
    borderRadius: 4,
    height: 8,
  },
  root: {
    backgroundColor: Colors.brandPrimary,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.md,
    paddingBottom: Spacing['3xl'],
    paddingVertical: Spacing.lg,
    zIndex: 1,
  },
  spacer: {
    height: 60,
  },
  starIcon: {
    fontSize: 20,
  },
  starsCaption: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.caption.size,
  },
  starsCard: {
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
  starsLabel: {
    color: Colors.textPrimary,
    flex: 1,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  starsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  subjectList: {
    gap: Spacing.sm,
    zIndex: 1,
  },
});
