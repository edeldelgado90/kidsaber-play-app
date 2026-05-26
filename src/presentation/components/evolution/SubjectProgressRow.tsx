import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { type Subject, SUBJECT_META } from '@/domain/entities/Question';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface SubjectProgressRowProps {
  subject: Subject;
  stars: number;
  maxStars?: number;
}

/**
 * A single row in the Evolution screen showing stars per subject.
 */
export function SubjectProgressRow({ subject, stars, maxStars = 5 }: SubjectProgressRowProps) {
  const meta = SUBJECT_META[subject];
  const displayStars = Math.min(stars, 99); // cap display

  return (
    <View style={styles.row}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: Typography.scale.bodyStrong.size,
    fontFamily: nunitoFamily('700'),
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 14,
    lineHeight: 18,
  },
  starEmpty: {
    opacity: 0.3,
  },
  count: {
    fontSize: Typography.scale.h3.size,
    fontFamily: nunitoFamily('800'),
    color: Colors.textPrimary,
    minWidth: 28,
    textAlign: 'right',
  },
});
