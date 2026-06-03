import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

export type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'disabled';

interface OptionCardProps {
  label: string; // "A", "B", "C", "D"
  text: string;
  state: OptionState;
  onPress?: () => void;
}

/**
 * Answer option card for multiple-choice and quick_calculation game types.
 *
 * States (per design spec):
 * - idle: white background, subtle border
 * - selected: surface-highlight background, brand-primary 2px border
 * - correct: success-surface background, success 2px border
 * - incorrect: error-surface background, error 2px border + shake animation
 * - disabled: opacity 0.6
 */
export function OptionCard({ label, text, state, onPress }: OptionCardProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Shake animation on incorrect answer
  useEffect(() => {
    if (state === 'incorrect') {
      const shakeSequence = Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 3, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]);
      shakeSequence.start();
    }
  }, [state, shakeAnim]);

  const stateStyles = getStateStyles(state);
  const isDisabled = state === 'disabled' || state === 'correct' || state === 'incorrect';

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          stateStyles.card,
          state === 'disabled' && styles.cardDisabled,
        ]}
        onPress={onPress}
        disabled={isDisabled || !onPress}
        accessibilityLabel={`Opción ${label}: ${text}`}
        accessibilityRole="button"
        accessibilityState={{ selected: state === 'selected', disabled: isDisabled }}
        activeOpacity={0.8}
      >
        {/* Badge: A, B, C, D */}
        <View style={[styles.badge, stateStyles.badge]}>
          <Text style={[styles.badgeText, stateStyles.badgeText]}>{label}</Text>
        </View>

        {/* Option text */}
        <Text
          style={[styles.optionText, stateStyles.text, state === 'disabled' && styles.textDisabled]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface StateStyle {
  card: object;
  badge: object;
  badgeText: object;
  text: object;
}

function getStateStyles(state: OptionState): StateStyle {
  switch (state) {
    case 'selected':
      return {
        card: { backgroundColor: Colors.surfaceHighlight, borderColor: Colors.brandPrimary, borderWidth: 2 },
        badge: { backgroundColor: Colors.brandPrimary },
        badgeText: { color: Colors.textOnPrimary },
        text: { color: Colors.brandPrimary },
      };
    case 'correct':
      return {
        card: { backgroundColor: Colors.successSurface, borderColor: Colors.success, borderWidth: 2 },
        badge: { backgroundColor: Colors.success },
        badgeText: { color: Colors.textOnPrimary },
        text: { color: Colors.textPrimary },
      };
    case 'incorrect':
      return {
        card: { backgroundColor: Colors.errorSurface, borderColor: Colors.error, borderWidth: 2 },
        badge: { backgroundColor: Colors.error },
        badgeText: { color: Colors.textOnPrimary },
        text: { color: Colors.textPrimary },
      };
    default:
      return {
        card: {},
        badge: { backgroundColor: Colors.surfaceMuted },
        badgeText: { color: Colors.textSecondary },
        text: { color: Colors.textPrimary },
      };
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.md,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    minHeight: 64,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
      web: {
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      } as Record<string, unknown>,
    }),
  },
  cardDisabled: {
    opacity: 0.6,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeText: {
    fontSize: Typography.scale.button.size,
    fontFamily: nunitoFamily('800'),
    lineHeight: 20,
  },
  optionText: {
    flex: 1,
    fontSize: Typography.scale.body.size,
    fontFamily: nunitoFamily('400'),
    lineHeight: Typography.scale.body.lineHeight,
  },
  textDisabled: {
    color: Colors.textDisabled,
  },
});
