import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors, Radii, Spacing } from '@/presentation/theme/tokens';

interface SkeletonCardProps {
  height?: number;
  borderRadius?: number;
}

/**
 * Animated skeleton loading placeholder.
 * Used while content is being fetched.
 */
export function SkeletonCard({ height = 88, borderRadius = Radii.md }: SkeletonCardProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { height, borderRadius, opacity },
      ]}
    />
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.borderSubtle,
    width: '100%',
  },
  list: {
    gap: Spacing.sm,
  },
});
