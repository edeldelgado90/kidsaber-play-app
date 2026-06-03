import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import { useProgressStore } from '@/infrastructure/store/progressStore';
import { SUBJECTS_ORDER } from '@/domain/entities/Question';
import { GRADE_LABELS } from '@/domain/entities/Profile';
import { SunBackground } from '@/presentation/components/common/SunBackground';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { SubjectProgressRow } from '@/presentation/components/evolution/SubjectProgressRow';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContentWidth, useHorizontalPadding } from '@/infrastructure/platform/useBreakpoint';

const CAPYBARA_MUSCLE = require('../../../assets/brand/capybara-muscle.png');

/**
 * Evolution / Progress screen.
 *
 * Design spec:
 * - AppHeader: blue with back button, "Mi progreso"
 * - "sun + green floor" background
 * - capybara-muscle bottom-right
 * - Profile card (account_circle + name + grade)
 * - "ESTRELLAS POR ASIGNATURA" label + list in white card with dividers
 * - Blue total stars card
 */
export function EvolutionScreen() {
  const getActiveProfile = useProfileStore(s => s.getActiveProfile);
  const activeProfileId = useProfileStore(s => s.activeProfileId);
  const getStarsForSubject = useProgressStore(s => s.getStarsForSubject);
  const getTotalStars = useProgressStore(s => s.getTotalStars);

  const activeProfile = getActiveProfile();
  const totalStars = activeProfileId ? getTotalStars(activeProfileId) : 0;

  const hPad = useHorizontalPadding();
  const contentWidth = useContentWidth();
  const capybaraWidth = Math.min(260, Math.round(contentWidth * 0.67));
  const capybaraHeight = Math.round(capybaraWidth * (180 / 260));

  const handleBack = () => router.back();
  const handleHome = () => router.replace('/(main)/subjects');

  return (
    <View style={styles.root}>
      <AppHeader
        title="Mi progreso"
        onBack={handleBack}
        rightSlot={
          <TouchableOpacity
            onPress={handleHome}
            style={styles.homeButton}
            accessibilityLabel="Ir a inicio"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="home-outline" size={24} color={Colors.textOnPrimary} />
          </TouchableOpacity>
        }
      />

      <SunBackground>
        {/* Capybara muscle bottom-right */}
        <Image
          source={CAPYBARA_MUSCLE}
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
          {/* Profile card */}
          {activeProfile && (
            <View style={styles.profileCard}>
              <MaterialCommunityIcons
                name="account-circle"
                size={48}
                color={Colors.brandPrimary}
              />
              <View>
                <Text style={styles.profileName}>{activeProfile.name}</Text>
                <Text style={styles.profileGrade}>
                  {GRADE_LABELS[activeProfile.grade]}
                </Text>
              </View>
            </View>
          )}

          {/* Section label */}
          <Text style={styles.sectionLabel}>{'ESTRELLAS POR ASIGNATURA'}</Text>

          {/* Subject rows in white card */}
          <View style={styles.subjectCard}>
            {SUBJECTS_ORDER.map((subject, index) => (
              <View key={subject}>
                <SubjectProgressRow
                  subject={subject}
                  stars={
                    activeProfileId ? getStarsForSubject(activeProfileId, subject) : 0
                  }
                  onPress={() => router.push(`/(main)/games/${subject}`)}
                />
                {index < SUBJECTS_ORDER.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>

          {/* Total stars blue card */}
          <View style={styles.totalCard}>
            <Text style={styles.totalText}>
              {`⭐ Total: ${totalStars} estrella${totalStars !== 1 ? 's' : ''}`}
            </Text>
          </View>

          {/* Bottom padding for capybara */}
          <View style={{ height: 80 }} />
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
  homeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capybara: {
    position: 'absolute',
    right: -20,
    bottom: -8,
    zIndex: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing['3xl'],
    gap: Spacing.lg,
    zIndex: 2,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#eaf0f7',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileName: {
    fontSize: Typography.scale.h3.size,
    fontFamily: nunitoFamily('800'),
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  profileGrade: {
    fontSize: Typography.scale.body.size - 2,
    fontFamily: nunitoFamily('400'),
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: nunitoFamily('700'),
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.52,
    paddingHorizontal: Spacing.xs,
  },
  subjectCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginHorizontal: Spacing.lg,
  },
  totalCard: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    zIndex: 1,
  },
  totalText: {
    fontSize: Typography.scale.h2.size,
    fontFamily: nunitoFamily('800'),
    color: Colors.textOnPrimary,
    lineHeight: Typography.scale.h2.lineHeight,
  },
});
