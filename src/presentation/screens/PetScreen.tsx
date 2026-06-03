import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SunBackground } from '@/presentation/components/common/SunBackground';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { Colors, Spacing, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

/**
 * Pet home teaser screen (v1 placeholder).
 *
 * Design spec:
 * - AppHeader: blue, back button, "Mi mascota"
 * - "sun + green floor" background (NO capybara)
 * - Centered: help icon 120px, "¡Próximamente!" 24px weight 800
 * - Subtitle: "Gana estrellas para desbloquear tu mascota."
 *
 * Full pet feature: see 1.Analysis/v1.5/ (post-v1 scope)
 */
export function PetScreen() {
  const handleBack = () => router.back();

  return (
    <View style={styles.root}>
      <AppHeader title="Mi mascota" onBack={handleBack} />

      <SunBackground>
        <View style={styles.content}>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={120}
            color={Colors.brandPrimary}
          />
          <Text style={styles.title}>{'¡Próximamente!'}</Text>
          <Text style={styles.subtitle}>{'Gana estrellas para desbloquear tu mascota.'}</Text>
        </View>
      </SunBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.lg,
    justifyContent: 'center',
    padding: Spacing['2xl'],
    zIndex: 1,
  },
  root: {
    backgroundColor: Colors.brandPrimary,
    flex: 1,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.body.size,
    lineHeight: Typography.scale.body.lineHeight,
    textAlign: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h2.size,
    lineHeight: Typography.scale.h2.lineHeight,
    textAlign: 'center',
  },
});
