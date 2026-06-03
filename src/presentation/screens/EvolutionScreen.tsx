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

import CAPYBARA_MUSCLE from '../../../assets/brand/capybara-muscle.png';

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
              <MaterialCommunityIcons name="account-circle" size={48} color={Colors.brandPrimary} />
              <View>
                <Text style={styles.profileName}>{activeProfile.name}</Text>
                <Text style={styles.profileGrade}>{GRADE_LABELS[activeProfile.grade]}</Text>
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
                  stars={activeProfileId ? getStarsForSubject(activeProfileId, subject) : 0}
                  onPress={() => router.push(`/(main)/games/${subject}`)}
                />
                {index < SUBJECTS_ORDER.length - 1 && <View style={styles.divider} />}
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
          <View style={styles.spacer} />
        </ScrollView>
      </SunBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  capybara: {
    bottom: -8,
    position: 'absolute',
    right: -20,
    zIndex: 0,
  },
  divider: {
    backgroundColor: Colors.borderSubtle,
    height: 1,
    marginHorizontal: Spacing.lg,
  },
  homeButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: '#eaf0f7',
    borderRadius: Radii.lg,
    borderWidth: 1,
    elevation: 3,
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    zIndex: 1,
  },
  profileGrade: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.body.size - 2,
    lineHeight: 20,
  },
  profileName: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h3.size,
    lineHeight: 24,
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
    paddingVertical: Spacing.lg,
    zIndex: 2,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('700'),
    fontSize: 13,
    letterSpacing: 0.52,
    paddingHorizontal: Spacing.xs,
    textTransform: 'uppercase',
  },
  spacer: {
    height: 80,
  },
  subjectCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.lg,
    borderWidth: 1,
    elevation: 3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    zIndex: 1,
  },
  totalCard: {
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    zIndex: 1,
  },
  totalText: {
    color: Colors.textOnPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h2.size,
    lineHeight: Typography.scale.h2.lineHeight,
  },
});
