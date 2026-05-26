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
      {/* Statement with blank slot */}
      <View style={styles.statementContainer}>
        <Text style={styles.statementText}>
          {parts[0]}
          <View style={styles.blankSlot}>
            {selectedId ? (
              <Text style={styles.blankFilled}>
                {options.find(o => o.id === selectedId)?.text ?? '___'}
              </Text>
            ) : (
              <Text style={styles.blankPlaceholder}>{'___'}</Text>
            )}
          </View>
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
  container: {
    gap: Spacing.xl,
  },
  statementContainer: {
    paddingHorizontal: Spacing.lg,
  },
  statementText: {
    fontSize: Typography.scale.h2.size,
    fontFamily: nunitoFamily('700'),
    color: Colors.textPrimary,
    lineHeight: Typography.scale.h2.lineHeight,
    flexWrap: 'wrap',
  },
  blankSlot: {
    borderBottomWidth: 2,
    borderColor: Colors.brandPrimary,
    minWidth: 80,
    display: 'flex',
  },
  blankFilled: {
    fontSize: Typography.scale.h2.size,
    fontFamily: nunitoFamily('800'),
    color: Colors.brandPrimary,
  },
  blankPlaceholder: {
    fontSize: Typography.scale.h2.size,
    fontFamily: nunitoFamily('700'),
    color: Colors.textDisabled,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.surfaceHighlight,
    borderColor: Colors.brandPrimary,
  },
  chipDisabled: {
    opacity: 0.6,
  },
  chipText: {
    fontSize: Typography.scale.bodyStrong.size,
    fontFamily: nunitoFamily('600'),
    color: Colors.textPrimary,
  },
  chipTextSelected: {
    color: Colors.brandPrimary,
    fontFamily: nunitoFamily('700'),
  },
});
