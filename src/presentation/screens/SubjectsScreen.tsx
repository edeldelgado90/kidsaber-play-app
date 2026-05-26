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

const CAPYBARA_MATE = require('../../../assets/brand/capybara-mate.png');

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
  const { getActiveProfile, profiles } = useProfileStore();
  const getStarsForSubject = useProgressStore(s => s.getStarsForSubject);
  const getTotalStars = useProgressStore(s => s.getTotalStars);

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
        {/* Capybara (behind content, z-index 0) */}
        <Image
          source={CAPYBARA_MATE}
          style={styles.capybara}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting card */}
          <View style={styles.greetingCard}>
            <Text style={styles.greetingTitle}>
              {`Hola, ${activeProfile?.name ?? 'amigo/a'} 👋`}
            </Text>
            <Text style={styles.greetingSubtitle}>
              {'¿Qué asignatura practicamos hoy?'}
            </Text>
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
          <View style={{ height: 60 }} />
        </ScrollView>
      </SunBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.brandPrimary,
  },
  capybara: {
    position: 'absolute',
    right: -20,
    bottom: -10,
    width: 320,
    height: 220,
    zIndex: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing['3xl'],
    zIndex: 1,
  },
  greetingCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: '#eaf0f7',
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
  greetingTitle: {
    fontSize: 24,
    fontFamily: nunitoFamily('800'),
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  greetingSubtitle: {
    fontSize: Typography.scale.body.size - 2,
    fontFamily: nunitoFamily('600'),
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  subjectList: {
    gap: Spacing.sm,
    zIndex: 1,
  },
  starsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#eaf0f7',
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
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  starIcon: {
    fontSize: 20,
  },
  starsLabel: {
    fontSize: Typography.scale.bodyStrong.size,
    fontFamily: nunitoFamily('700'),
    color: Colors.textPrimary,
    flex: 1,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderSubtle,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: Colors.brandSecondary,
    borderRadius: 4,
  },
  starsCaption: {
    fontSize: Typography.scale.caption.size,
    fontFamily: nunitoFamily('400'),
    color: Colors.textSecondary,
  },
});
