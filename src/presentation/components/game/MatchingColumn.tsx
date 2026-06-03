import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { type QuestionOption, type MatchingAnswer } from '@/domain/entities/Question';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface MatchingColumnProps {
  leftItems: QuestionOption[];
  rightItems: QuestionOption[];
  userAnswers: MatchingAnswer[];
  onAnswersChange: (answers: MatchingAnswer[]) => void;
  disabled?: boolean;
}

/**
 * Matching game type UI.
 * Two columns — user selects one from the left, then one from the right to create a pair.
 */
export function MatchingColumn({
  leftItems,
  rightItems,
  userAnswers,
  onAnswersChange,
  disabled = false,
}: MatchingColumnProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const getMatchedRight = (leftId: string) =>
    userAnswers.find(a => a.leftId === leftId)?.rightId ?? null;

  const getMatchedLeft = (rightId: string) =>
    userAnswers.find(a => a.rightId === rightId)?.leftId ?? null;

  const handleLeftPress = (id: string) => {
    if (disabled) return;
    setSelectedLeft(prev => (prev === id ? null : id));
  };

  const handleRightPress = (rightId: string) => {
    if (disabled || !selectedLeft) return;

    // Remove any existing pair for this left or right item
    const cleaned = userAnswers.filter(a => a.leftId !== selectedLeft && a.rightId !== rightId);
    const newAnswers: MatchingAnswer[] = [...cleaned, { leftId: selectedLeft, rightId }];
    onAnswersChange(newAnswers);
    setSelectedLeft(null);
  };

  const pairIndex = (leftId: string) => {
    const idx = userAnswers.findIndex(a => a.leftId === leftId);
    return idx >= 0 ? idx + 1 : null;
  };

  return (
    <View style={styles.container}>
      {/* Left column */}
      <View style={styles.column}>
        <Text style={styles.columnLabel}>{'Columna A'}</Text>
        {leftItems.map(item => {
          const matchedRight = getMatchedRight(item.id);
          const isSelected = selectedLeft === item.id;
          const pairNum = pairIndex(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                isSelected && styles.itemSelected,
                matchedRight && styles.itemMatched,
              ]}
              onPress={() => handleLeftPress(item.id)}
              disabled={disabled}
              accessibilityLabel={`Columna A: ${item.text}${matchedRight ? ', emparejado' : ''}`}
              accessibilityRole="button"
            >
              {pairNum && (
                <View style={styles.pairBadge}>
                  <Text style={styles.pairBadgeText}>{pairNum}</Text>
                </View>
              )}
              <Text style={styles.itemText}>{item.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Connector */}
      <View style={styles.connector} />

      {/* Right column */}
      <View style={styles.column}>
        <Text style={styles.columnLabel}>{'Columna B'}</Text>
        {rightItems.map(item => {
          const matchedLeft = getMatchedLeft(item.id);
          const isTarget = selectedLeft !== null;
          const pairNum = matchedLeft ? pairIndex(matchedLeft) : null;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                isTarget && !matchedLeft && styles.itemTarget,
                matchedLeft && styles.itemMatched,
              ]}
              onPress={() => handleRightPress(item.id)}
              disabled={disabled || !selectedLeft}
              accessibilityLabel={`Columna B: ${item.text}${matchedLeft ? ', emparejado' : ''}`}
              accessibilityRole="button"
            >
              {pairNum && (
                <View style={styles.pairBadge}>
                  <Text style={styles.pairBadgeText}>{pairNum}</Text>
                </View>
              )}
              <Text style={styles.itemText}>{item.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    gap: Spacing.sm,
  },
  columnLabel: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.caption.size,
    letterSpacing: 0.44,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  connector: {
    alignSelf: 'stretch',
    backgroundColor: Colors.borderSubtle,
    marginVertical: 30,
    width: 2,
  },
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  item: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.sm,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: Spacing.xs,
    minHeight: 44,
    padding: Spacing.md,
  },
  itemMatched: {
    backgroundColor: Colors.successSurface,
    borderColor: Colors.success,
  },
  itemSelected: {
    backgroundColor: Colors.surfaceHighlight,
    borderColor: Colors.brandPrimary,
  },
  itemTarget: {
    borderColor: Colors.brandPrimary,
    borderStyle: 'dashed',
  },
  itemText: {
    color: Colors.textPrimary,
    flex: 1,
    fontSize: Typography.scale.body.size,
    fontFamily: nunitoFamily('600'),
    fontSize: Typography.scale.body.size,
  },
  pairBadge: {
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  pairBadgeText: {
    color: 'white',
    fontFamily: nunitoFamily('800'),
    fontSize: 10,
  },
});
