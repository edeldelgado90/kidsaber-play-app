import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { type QuestionOption } from '@/domain/entities/Question';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface FillBlankStatementProps {
  statement: string; // contains "____" as the blank placeholder
  options: QuestionOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

/**
 * fill_in_the_blanks game type UI.
 * Renders the statement with a blank, and option chips to select from.
 */
export function FillBlankStatement({
  statement,
  options,
  selectedId,
  onSelect,
  disabled = false,
}: FillBlankStatementProps) {
  const parts = statement.split('____');

  return (
    <View style={styles.container}>
      {/* Statement with inline blank slot */}
      <View style={styles.statementContainer}>
        <Text style={styles.statementText}>
          {parts[0]}
          <Text style={selectedId ? styles.blankFilled : styles.blankPlaceholder}>
            {selectedId
              ? ` ${options.find(o => o.id === selectedId)?.text ?? '___'} `
              : ' _______ '}
          </Text>
          {parts[1] ?? ''}
        </Text>
      </View>

      {/* Option chips */}
      <View style={styles.optionsGrid}>
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.chip,
              selectedId === option.id && styles.chipSelected,
              disabled && styles.chipDisabled,
            ]}
            onPress={() => !disabled && onSelect(option.id)}
            disabled={disabled}
            accessibilityLabel={`Opción: ${option.text}`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedId === option.id }}
          >
            <Text style={[styles.chipText, selectedId === option.id && styles.chipTextSelected]}>
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  blankFilled: {
    color: Colors.brandPrimary,
    fontFamily: nunitoFamily('800'),
    textDecorationColor: Colors.brandPrimary,
    textDecorationLine: 'underline',
  },
  blankPlaceholder: {
    color: Colors.textDisabled,
    fontFamily: nunitoFamily('700'),
    textDecorationColor: Colors.borderSubtle,
    textDecorationLine: 'underline',
  },
  chip: {
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  chipDisabled: {
    opacity: 0.6,
  },
  chipSelected: {
    backgroundColor: Colors.surfaceHighlight,
    borderColor: Colors.brandPrimary,
  },
  chipText: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('600'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  chipTextSelected: {
    color: Colors.brandPrimary,
    fontFamily: nunitoFamily('700'),
  },
  container: {
    gap: Spacing.xl,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  statementContainer: {
    paddingHorizontal: Spacing.lg,
  },
  statementText: {
    color: Colors.textPrimary,
    flexWrap: 'wrap',
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.h2.size,
    lineHeight: Typography.scale.h2.lineHeight,
  },
});
