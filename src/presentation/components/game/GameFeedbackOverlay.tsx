import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Motion } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface GameFeedbackOverlayProps {
  visible: boolean;
  isCorrect: boolean;
  correctAnswerText?: string; // shown when incorrect
  onHide: () => void;
}

/**
 * Full-screen feedback overlay shown after answering a question.
 * - Correct: green, checkmark, 1100ms
 * - Incorrect: red, correct answer text, 1600ms
 */
export function GameFeedbackOverlay({
  visible,
  isCorrect,
  correctAnswerText,
  onHide,
}: GameFeedbackOverlayProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const duration = isCorrect ? 1100 : 1600;

  useEffect(() => {
    if (!visible) return;

    // Fade in
    Animated.timing(opacity, {
      toValue: 0.95,
      duration: Motion.durationFast,
      useNativeDriver: true,
    }).start();

    // Auto-hide after duration
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: Motion.durationFast,
        useNativeDriver: true,
      }).start(() => onHide());
    }, duration - Motion.durationFast);

    return () => clearTimeout(timer);
  }, [visible, isCorrect, duration, opacity, onHide]);

  if (!visible) return null;

  const bgColor = isCorrect ? Colors.success : Colors.error;

  return (
    <Animated.View
      style={[styles.overlay, { backgroundColor: bgColor, opacity }]}
      pointerEvents="none"
    >
      {isCorrect ? (
        <>
          <MaterialCommunityIcons name="check-circle" size={80} color="white" />
          <Text style={styles.text}>{'¡Correcto! 🎉'}</Text>
        </>
      ) : (
        <>
          <MaterialCommunityIcons name="close-circle" size={80} color="white" />
          <Text style={styles.text}>{'¡Casi! 💪'}</Text>
          {correctAnswerText ? (
            <Text style={styles.subtext}>{`Respuesta correcta: ${correctAnswerText}`}</Text>
          ) : null}
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    gap: Spacing.lg,
    justifyContent: 'center',
    zIndex: 150,
  },
  subtext: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: nunitoFamily('600'),
    fontSize: Typography.scale.body.size,
    paddingHorizontal: Spacing.xl,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h1.size,
    textAlign: 'center',
  },
});
