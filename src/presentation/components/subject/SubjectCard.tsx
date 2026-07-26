import React from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Subject, SUBJECT_META } from '@/domain/entities/Question';
import { Colors, Spacing, Radii, Typography, Elevation } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { usePressAnimation } from '@/presentation/hooks/usePressAnimation';

const DARK_ACCENT: Record<string, string> = {
  '#ef4444': '#f3b1b1',
  '#0071da': '#99c3eb',
  '#22c55e': '#a5e3bc',
  '#8b5cf6': '#cdbbfa',
};

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
  const darkAccent = DARK_ACCENT[meta.accent] ?? meta.accent;
  const { handlePressIn, handlePressOut, animatedStyle } = usePressAnimation();

  return (
    <Animated.View style={[styles.card, { borderBottomColor: darkAccent }, animatedStyle]}>
      <Pressable
        style={styles.pressable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={`${meta.label}: ${stars} estrella${stars !== 1 ? 's' : ''}`}
        accessibilityRole="button"
      >
        {/* Left accent stripe */}
        <View style={[styles.accentStripe, { backgroundColor: meta.accent }]} />

        {/* Icon block with asymmetric border radius */}
        <View style={[styles.iconBlock, { backgroundColor: meta.pastel }]}>
          <Text style={styles.emoji} accessibilityElementsHidden>
            {meta.emoji}
          </Text>
        </View>

        {/* Text content */}
        <View style={styles.textContent}>
          <Text style={styles.label}>{meta.label}</Text>
          <Text style={styles.stars}>
            {'⭐'.repeat(Math.min(stars, 5))} {stars > 0 ? `${stars}` : 'Sin estrellas'}
          </Text>
        </View>

        {/* Chevron */}
        <View style={styles.chevronContainer}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={meta.accent}
            style={styles.chevronIcon}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  accentStripe: {
    flexShrink: 0,
    width: 5,
  },
  card: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 4,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.md,
    borderWidth: 1,
    minHeight: 88,
    overflow: 'hidden',
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
  chevronContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 14,
  },
  chevronIcon: {
    opacity: 0.85,
  },
  emoji: {
    fontSize: 32,
    lineHeight: 40,
  },
  iconBlock: {
    alignItems: 'center',
    // Asymmetric border radius: organic right edge
    // CSS equivalent: borderRadius '0 65% 45% 0 / 0 55% 80% 0'
    // In RN: approximate with per-corner radii
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 56,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 45,
    flexShrink: 0,
    justifyContent: 'center',
    width: 70,
  },
  label: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h3.size,
    lineHeight: Typography.scale.h3.lineHeight,
  },
  pressable: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'row',
    minHeight: 88,
  },
  stars: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: 12,
  },
  textContent: {
    flex: 1,
    gap: 2,
    justifyContent: 'center',
    paddingLeft: Spacing.sm,
  },
});
