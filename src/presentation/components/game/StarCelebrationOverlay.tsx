import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Colors, Spacing, Typography, Motion } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface StarCelebrationOverlayProps {
  visible: boolean;
  onHide: () => void;
}

const MIN_DISPLAY_MS = 2500;
const SPIN_DURATION_MS = 1100;

export function StarCelebrationOverlay({ visible, onHide }: StarCelebrationOverlayProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.8)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);
  const glowLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(0);
    scale.setValue(0);
    rotation.setValue(0);
    glowScale.setValue(0.8);

    Animated.timing(opacity, {
      toValue: 1,
      duration: Motion.durationFast,
      useNativeDriver: true,
    }).start();

    Animated.spring(scale, {
      toValue: 1,
      tension: 70,
      friction: 5,
      useNativeDriver: true,
    }).start();

    const spinLoop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: SPIN_DURATION_MS,
        useNativeDriver: true,
      }),
    );
    loopRef.current = spinLoop;
    spinLoop.start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowScale, {
          toValue: 1.15,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 0.85,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    glowLoopRef.current = glowLoop;
    glowLoop.start();

    const timer = setTimeout(() => {
      loopRef.current?.stop();
      glowLoopRef.current?.stop();
      Animated.timing(opacity, {
        toValue: 0,
        duration: Motion.durationSlow,
        useNativeDriver: true,
      }).start(() => onHide());
    }, MIN_DISPLAY_MS);

    return () => {
      clearTimeout(timer);
      loopRef.current?.stop();
      glowLoopRef.current?.stop();
    };
  }, [visible]); // eslint-disable-line

  if (!visible) return null;

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      {/* Pulsing glow behind star */}
      <Animated.View style={[styles.glow, { transform: [{ scale: glowScale }] }]} />

      {/* Spinning star */}
      <Animated.View style={[styles.starWrapper, { transform: [{ scale }, { rotate: spin }] }]}>
        <Text style={styles.star} accessibilityLabel="Estrella ganada">
          {'⭐'}
        </Text>
      </Animated.View>

      {/* Messages */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>{'¡Enhorabuena!'}</Text>
        <Text style={styles.subtitle}>{'¡Has ganado una estrella!'}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glow: {
    backgroundColor: 'rgba(245, 196, 0, 0.18)',
    borderRadius: 130,
    height: 260,
    position: 'absolute',
    width: 260,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: Colors.textPrimary,
    gap: Spacing.xl,
    justifyContent: 'center',
    zIndex: 200,
  },
  star: {
    fontSize: 110,
    lineHeight: 130,
    textAlign: 'center',
  },
  starWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: nunitoFamily('600'),
    fontSize: Typography.scale.h3.size,
    textAlign: 'center',
  },
  textBlock: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  title: {
    color: Colors.surface,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.display.size,
    textAlign: 'center',
  },
});
