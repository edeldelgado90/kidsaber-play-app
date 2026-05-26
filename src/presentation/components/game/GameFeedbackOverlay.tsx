import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
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
    if (visible) {
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
    }
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
    justifyContent: 'center',
    gap: Spacing.lg,
    zIndex: 150,
  },
  text: {
    fontSize: Typography.scale.h1.size,
    fontFamily: nunitoFamily('800'),
    color: 'white',
    textAlign: 'center',
  },
  subtext: {
    fontSize: Typography.scale.body.size,
    fontFamily: nunitoFamily('600'),
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
