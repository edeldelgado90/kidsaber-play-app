import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

/**
 * The "sun + green floor" background pattern.
 * Used on Subjects, Games, and Evolution screens.
 *
 * Design spec from design_handoff_kidsaber_play/README.md:
 * - Radial gradient: warm yellow-to-white
 * - SVG sun in top-right corner with halo rings and rays
 * - Green floor strip pinned to bottom
 */
export function SunBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {/* Background radial gradient — approximated with solid warm tint */}
      <View style={styles.gradientBg} />

      {/* SVG Sun in top-right corner */}
      <View style={styles.sunContainer} pointerEvents="none">
        <SunSvg />
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Green floor strip */}
      <View style={styles.floorStrip} pointerEvents="none" />
    </View>
  );
}

function SunSvg() {
  // Sun positioned at top-right: center (345, 30) in a 390×900 viewBox
  const cx = 345;
  const cy = 30;

  // 10 rays emanating from the sun center
  const rays = Array.from({ length: 10 }, (_, i) => {
    const angle = (i * 36 * Math.PI) / 180;
    const inner = 46; // starts just outside halo
    const outer = 80;
    return {
      x1: cx + Math.cos(angle) * inner,
      y1: cy + Math.sin(angle) * inner,
      x2: cx + Math.cos(angle) * outer,
      y2: cy + Math.sin(angle) * outer,
    };
  });

  return (
    <Svg width="100%" height={160} viewBox="0 0 390 160">
      {/* Outer halo (r=62, 22% opacity) */}
      <Circle cx={cx} cy={cy} r={62} fill="#f5c400" fillOpacity={0.22} />
      {/* Inner halo (r=46, 32% opacity) */}
      <Circle cx={cx} cy={cy} r={46} fill="#f5c400" fillOpacity={0.32} />
      {/* Rays */}
      {rays.map((ray, i) => (
        <Line
          key={i}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          stroke="#fde889"
          strokeWidth={10}
          strokeLinecap="round"
          opacity={0.9}
        />
      ))}
      {/* Sun body */}
      <Circle cx={cx} cy={cy} r={32} fill="#f5c400" stroke="#e8b800" strokeWidth={1.5} strokeOpacity={0.5} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    // Approximate the radial gradient with a warm off-white/yellow tint
    backgroundColor: '#fffef5',
  },
  sunContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  floorStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#b3d894', // solid approximation of the gradient
    zIndex: 0,
  },
});
