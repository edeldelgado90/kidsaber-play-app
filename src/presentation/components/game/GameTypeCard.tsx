import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type GameType, GAME_TYPE_META } from '@/domain/entities/Question';
import { Colors, Spacing, Radii, Typography, Elevation } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface GameTypeCardProps {
  gameType: GameType;
  stars: number;
  onPress: () => void;
}

/**
 * Card for a game type on the Games screen.
 * Same icon-block treatment as SubjectCard but slightly smaller.
 *
 * Design spec:
 * - Left accent stripe (4px — slightly narrower than SubjectCard's 5px)
 * - Left icon block: asymmetric border radius, pastel background, emoji 40px
 * - Game type name 16px weight 800 + subtitle 12px text-secondary
 * - Chevron in accent color
 * - Min height 84
 */
export function GameTypeCard({ gameType, stars, onPress }: GameTypeCardProps) {
  const meta = GAME_TYPE_META[gameType];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={`${meta.label}: ${stars} estrella${stars !== 1 ? 's' : ''}. ${meta.description}`}
      accessibilityRole="button"
      activeOpacity={0.85}
    >
      {/* Left accent stripe */}
      <View style={[styles.accentStripe, { backgroundColor: meta.accent }]} />

      {/* Icon block */}
      <View style={[styles.iconBlock, { backgroundColor: meta.pastel }]}>
        <Text style={styles.emoji} accessibilityElementsHidden>
          {meta.emoji}
        </Text>
      </View>

      {/* Text content */}
      <View style={styles.textContent}>
        <Text style={styles.label}>{meta.label}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {meta.description}
        </Text>
        {stars > 0 && <Text style={styles.stars}>{'⭐'.repeat(Math.min(stars, 5))}</Text>}
      </View>

      {/* Chevron */}
      <View style={styles.chevronContainer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={meta.accent}
          style={styles.chevronIcon}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  accentStripe: {
    flexShrink: 0,
    width: 4,
  },
  card: {
    alignItems: 'stretch',
    backgroundColor: Colors.surface,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 84,
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
    paddingRight: 12,
  },
  chevronIcon: {
    opacity: 0.85,
  },
  description: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.caption.size,
    lineHeight: 16,
  },
  emoji: {
    fontSize: 26,
    lineHeight: 34,
  },
  iconBlock: {
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 56,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 45,
    flexShrink: 0,
    justifyContent: 'center',
    width: 60,
  },
  label: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.bodyStrong.size,
    lineHeight: 20,
  },
  stars: {
    fontSize: 11,
    marginTop: 2,
  },
  textContent: {
    flex: 1,
    gap: 1,
    justifyContent: 'center',
    paddingLeft: Spacing.sm,
  },
});
