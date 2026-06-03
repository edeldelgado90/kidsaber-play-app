import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Subject, SUBJECT_META } from '@/domain/entities/Question';
import { Colors, Spacing, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface SubjectProgressRowProps {
  subject: Subject;
  stars: number;
  maxStars?: number;
  onPress?: () => void;
}

/**
 * A single row in the Evolution screen showing stars per subject.
 */
export function SubjectProgressRow({
  subject,
  stars,
  maxStars = 5,
  onPress,
}: SubjectProgressRowProps) {
  const meta = SUBJECT_META[subject];
  const displayStars = Math.min(stars, 99); // cap display

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && onPress && styles.rowPressed]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={onPress ? `Jugar ${meta.label}` : undefined}
    >
      {/* Subject icon circle */}
      <View style={[styles.iconCircle, { backgroundColor: meta.pastel }]}>
        <Text style={styles.emoji} accessibilityElementsHidden>
          {meta.emoji}
        </Text>
      </View>

      {/* Name + star row */}
      <View style={styles.content}>
        <Text style={styles.label}>{meta.label}</Text>
        <View style={styles.starsRow}>
          {Array.from({ length: maxStars }).map((_, i) => (
            <Text key={i} style={[styles.star, i >= stars && styles.starEmpty]}>
              {i < stars ? '⭐' : '☆'}
            </Text>
          ))}
        </View>
      </View>

      {/* Star count */}
      <Text style={styles.count}>{displayStars}</Text>

      {/* Navigation affordance */}
      {onPress && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={Colors.textSecondary}
          style={styles.chevron}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevron: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  count: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h3.size,
    minWidth: 28,
    textAlign: 'right',
  },
  emoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 18,
    flexShrink: 0,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  count: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h3.size,
    minWidth: 28,
    textAlign: 'right',
  },
  emoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 18,
    flexShrink: 0,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  label: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.bodyStrong.size,
    lineHeight: 20,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  rowPressed: {
    backgroundColor: Colors.borderSubtle,
  },
  star: {
    fontSize: 14,
    lineHeight: 18,
  },
  starEmpty: {
    opacity: 0.3,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
});
