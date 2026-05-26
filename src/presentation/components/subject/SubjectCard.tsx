import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Subject, SUBJECT_META } from '@/domain/entities/Question';
import { Colors, Spacing, Radii, Typography, Elevation } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface SubjectCardProps {
  subject: Subject;
  stars: number;
  onPress: () => void;
}

/**
 * Card for a single subject on the Home screen.
 *
 * Design spec:
 * - Left accent stripe (5px, subject accent color)
 * - Left icon block: asymmetric border radius (organic right edge), pastel background, emoji 46px
 * - Subject name 18px weight 800
 * - Chevron right in accent color
 * - Min height 88
 */
export function SubjectCard({ subject, stars, onPress }: SubjectCardProps) {
  const meta = SUBJECT_META[subject];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={`${meta.label}: ${stars} estrella${stars !== 1 ? 's' : ''}`}
      accessibilityRole="button"
      activeOpacity={0.85}
    >
      {/* Left accent stripe */}
      <View style={[styles.accentStripe, { backgroundColor: meta.accent }]} />

      {/* Icon block with asymmetric border radius */}
      <View
        style={[
          styles.iconBlock,
          { backgroundColor: meta.pastel },
        ]}
      >
        <Text style={styles.emoji} accessibilityElementsHidden>
          {meta.emoji}
        </Text>
      </View>

      {/* Text content */}
      <View style={styles.textContent}>
        <Text style={styles.label}>{meta.label}</Text>
        <Text style={styles.stars}>{'⭐'.repeat(Math.min(stars, 5))} {stars > 0 ? `${stars}` : 'Sin estrellas'}</Text>
      </View>

      {/* Chevron */}
      <View style={styles.chevronContainer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={meta.accent}
          style={{ opacity: 0.85 }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 88,
    borderRadius: Radii.md,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    ...Platform.select({
      ios: {
        ...Elevation.card,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      } as Record<string, unknown>,
    }),
  },
  accentStripe: {
    width: 5,
    flexShrink: 0,
  },
  iconBlock: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    // Asymmetric border radius: organic right edge
    // CSS equivalent: borderRadius '0 65% 45% 0 / 0 55% 80% 0'
    // In RN: approximate with per-corner radii
    borderTopRightRadius: 45,
    borderBottomRightRadius: 56,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  emoji: {
    fontSize: 32,
    lineHeight: 40,
  },
  textContent: {
    flex: 1,
    paddingLeft: Spacing.sm,
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: Typography.scale.h3.size,
    fontFamily: nunitoFamily('800'),
    color: Colors.textPrimary,
    lineHeight: Typography.scale.h3.lineHeight,
  },
  stars: {
    fontSize: 12,
    fontFamily: nunitoFamily('400'),
    color: Colors.textSecondary,
  },
  chevronContainer: {
    paddingRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
