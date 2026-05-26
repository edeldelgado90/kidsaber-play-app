import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Colors, Spacing, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface QuestionProgressBarProps {
  current: number; // 1-based current question index
  total: number;
}

/**
 * Progress bar showing the current question position in the game session.
 * Displayed in the white game header: "Pregunta X/Y"
 */
export function QuestionProgressBar({ current, total }: QuestionProgressBarProps) {
  const progress = total > 0 ? current / total : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {`Pregunta ${current}/${total}`}
      </Text>
      <ProgressBar
        progress={progress}
        color={Colors.brandPrimary}
        style={styles.bar}
        accessibilityLabel={`Pregunta ${current} de ${total}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  label: {
    fontSize: Typography.scale.caption.size,
    fontFamily: nunitoFamily('700'),
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderSubtle,
  },
});
