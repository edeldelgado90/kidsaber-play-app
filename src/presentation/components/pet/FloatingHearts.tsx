import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const HEART_PATH =
  'M50 88 Q10 58 10 32 Q10 10 30 10 Q44 10 50 24 Q56 10 70 10 Q90 10 90 32 Q90 58 50 88 Z';

function Heart({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d={HEART_PATH} fill={color} />
    </Svg>
  );
}

interface HeartSpec {
  dx: number; // horizontal offset from center, as fraction of container width
  size: number;
  delay: number;
  color: string;
}

const HEARTS: HeartSpec[] = [
  { dx: -0.22, size: 18, delay: 0, color: '#f4586a' },
  { dx: 0.1, size: 26, delay: 120, color: '#e5484d' },
  { dx: 0.3, size: 16, delay: 240, color: '#f4586a' },
  { dx: -0.05, size: 20, delay: 360, color: '#f27d8d' },
  { dx: 0.2, size: 14, delay: 480, color: '#e5484d' },
];

function FloatingHeart({
  spec,
  burstKey,
  height,
}: {
  spec: HeartSpec;
  burstKey: number;
  height: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (burstKey === 0) return;
    progress.value = 0;
    progress.value = withDelay(
      spec.delay,
      withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }),
    );
  }, [burstKey, progress, spec.delay]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value === 0 ? 0 : 1 - progress.value,
    transform: [
      { translateY: -progress.value * height * 0.7 },
      { scale: 0.6 + progress.value * 0.6 },
    ],
  }));

  return (
    <Animated.View style={[styles.heart, { marginLeft: spec.dx * height }, style]}>
      <Heart size={spec.size} color={spec.color} />
    </Animated.View>
  );
}

/**
 * Burst of hearts floating up from the pet (affection feedback).
 * Re-triggers every time `burstKey` increments; renders nothing until first burst.
 */
export function FloatingHearts({ burstKey, height }: { burstKey: number; height: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.origin}>
        {HEARTS.map((spec, i) => (
          <FloatingHeart key={i} spec={spec} burstKey={burstKey} height={height} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heart: {
    position: 'absolute',
  },
  origin: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
