import React, { useRef, useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface StarBadgeProps {
  earned: boolean;
  size?: number;
  animate?: boolean;
}

/**
 * Large star icon for the result screen.
 * Animates with a spring-pop effect when earned.
 */
export function StarBadge({ earned, size = 96, animate = false }: StarBadgeProps) {
  const scaleAnim = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (animate && earned) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }
  }, [animate, earned, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Text
        style={[
          styles.star,
          {
            fontSize: size,
            lineHeight: size + 8,
            opacity: earned ? 1 : 0.3,
          },
        ]}
        accessibilityLabel={earned ? 'Estrella ganada' : 'Sin estrella'}
      >
        {'⭐'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  star: {
    textAlign: 'center',
  },
});
