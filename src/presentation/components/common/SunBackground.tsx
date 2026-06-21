import React from 'react';
import { View, StyleSheet, Image, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import BACKGROUND_SOURCE from '../../../../assets/brand/background_capi.png';

/**
 * The "sun + green floor" background pattern.
 * Used on Subjects, Games, and Evolution screens.
 *
 * Design:
 * - Warm base background
 * - Full-screen SVG with radialGradient glow emanating from the sun
 * - Large sun partially off-screen at top-right corner
 * - Dramatic rays sweeping into the visible screen area
 * - Green floor strip pinned to bottom
 */
export function SunBackground({
  children,
  showSun = true,
  showFloor = true,
  patternOpacity = 0.3,
}: {
  children: React.ReactNode;
  showSun?: boolean;
  showFloor?: boolean;
  patternOpacity?: number;
}) {
  return (
    <View style={styles.container}>
      {/* Warm base color */}
      <View style={styles.baseBg} />

      {/* Repeating capybara pattern */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <TiledPattern opacity={patternOpacity} />
      </View>

      {/* Full-screen SVG: radial gradient + sun */}
      {showSun && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SunSvg />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Green floor strip */}
      {showFloor && (
        <View style={styles.floorStrip} pointerEvents="none">
          <View style={styles.floorHighlight} />
        </View>
      )}
    </View>
  );
}

const TILE_SIZE = 150;

function TiledPattern({ opacity }: { opacity: number }) {
  const { width, height } = useWindowDimensions();
  const cols = Math.ceil(width / TILE_SIZE) + 1;
  const rows = Math.ceil(height / TILE_SIZE) + 1;

  return (
    <View style={styles.tiledContainer}>
      {Array.from({ length: rows }, (_, row) => (
        <View key={row} style={styles.tiledRow}>
          {Array.from({ length: cols }, (_, col) => (
            <Image
              key={col}
              source={BACKGROUND_SOURCE}
              style={[styles.tile, { opacity }]}
              resizeMode="cover"
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function SunSvg() {
  // Sun center: top-right corner, partially off-screen
  const cx = 358;
  const cy = -48;
  const vw = 390;
  const vh = 780;

  // 14 rays sweeping from 100° to 250° (downward-left arc from top-right corner)
  const numRays = 14;
  const startAngle = 100;
  const endAngle = 250;
  const rays = Array.from({ length: numRays }, (_, i) => {
    const angleDeg = startAngle + (i / (numRays - 1)) * (endAngle - startAngle);
    const angle = (angleDeg * Math.PI) / 180;
    const inner = 90;
    // Alternate lengths for an organic feel
    const outer = i % 3 === 1 ? 210 : i % 3 === 2 ? 175 : 190;
    return {
      x1: cx + Math.cos(angle) * inner,
      y1: cy + Math.sin(angle) * inner,
      x2: cx + Math.cos(angle) * outer,
      y2: cy + Math.sin(angle) * outer,
    };
  });

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${vw} ${vh}`}>
      <Defs>
        {/* Warm radial glow spreading from the sun across the screen */}
        <RadialGradient
          id="bgGlow"
          cx={cx}
          cy={cy}
          rx={560}
          ry={560}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#fce46a" stopOpacity={0.28} />
          <Stop offset="0.18" stopColor="#fdf0a0" stopOpacity={0.2} />
          <Stop offset="0.38" stopColor="#fffbe8" stopOpacity={0.12} />
          <Stop offset="0.62" stopColor="#fffef8" stopOpacity={0.05} />
          <Stop offset="1" stopColor="#f4f9ff" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* Full-screen warm glow from the sun */}
      <Rect x={0} y={0} width={vw} height={vh} fill="url(#bgGlow)" />

      {/* Halo rings — decreasing opacity outward */}
      <Circle cx={cx} cy={cy} r={280} fill="#f5c400" fillOpacity={0.03} />
      <Circle cx={cx} cy={cy} r={210} fill="#f5c400" fillOpacity={0.06} />
      <Circle cx={cx} cy={cy} r={155} fill="#f5c400" fillOpacity={0.12} />
      <Circle cx={cx} cy={cy} r={115} fill="#f5c400" fillOpacity={0.22} />
      <Circle cx={cx} cy={cy} r={90} fill="#f5c400" fillOpacity={0.35} />

      {/* Rays */}
      {rays.map((ray, i) => (
        <Line
          key={i}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          stroke="#fde046"
          strokeWidth={i % 3 === 1 ? 13 : 10}
          strokeLinecap="round"
          opacity={0.48}
        />
      ))}

      {/* Sun body */}
      <Circle cx={cx} cy={cy} r={78} fill="#f5c400" fillOpacity={0.97} />
      {/* Subtle rim */}
      <Circle
        cx={cx}
        cy={cy}
        r={78}
        stroke="#e8b400"
        strokeWidth={2.5}
        strokeOpacity={0.35}
        fill="none"
      />
      {/* Soft inner highlight */}
      <Circle cx={cx - 20} cy={cy + 20} r={26} fill="white" fillOpacity={0.18} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  baseBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fefcf6',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  floorHighlight: {
    backgroundColor: '#a8d96a',
    height: 8,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  floorStrip: {
    backgroundColor: '#7ec442',
    bottom: 0,
    height: 64,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 0,
  },
  tile: {
    height: TILE_SIZE,
    opacity: 0.3,
    width: TILE_SIZE,
  },
  tiledContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  tiledRow: {
    flexDirection: 'row',
  },
});
