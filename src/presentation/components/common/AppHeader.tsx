import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface AppHeaderProps {
  title?: string;
  onBack?: () => void;
  onEvolution?: () => void;
  onPet?: () => void;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  /** Override background color (default: brand primary blue) */
  backgroundColor?: string;
  /** If true, use white background (for game session header) */
  white?: boolean;
  /** Show the mute/unmute sound toggle button */
  showSoundToggle?: boolean;
  isMuted?: boolean;
  onSoundToggle?: () => void;
}

/**
 * Consistent app header component.
 * - Blue background by default (brand primary)
 * - White mode for game session screen
 * - Respects safe area top inset
 * - Min touch targets: 44×44
 */
export function AppHeader({
  title,
  onBack,
  onEvolution,
  onPet,
  rightSlot,
  leftSlot,
  backgroundColor,
  white = false,
  showSoundToggle = false,
  isMuted = false,
  onSoundToggle,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  const bgColor = backgroundColor ?? (white ? Colors.surface : Colors.brandPrimary);
  const textColor = white ? Colors.textPrimary : Colors.textOnPrimary;
  const iconColor = white ? Colors.brandPrimary : Colors.textOnPrimary;

  return (
    <View
      style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top + Spacing.sm }]}
    >
      {/* Left slot — back button or custom content */}
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.iconButton}
            accessibilityLabel="Volver atrás"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={iconColor} />
          </TouchableOpacity>
        ) : leftSlot ? (
          leftSlot
        ) : null}
      </View>

      {/* Center — title */}
      <View style={styles.center}>
        {title ? (
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      {/* Right slot — evolution + pet icons, or custom content */}
      <View style={[styles.side, styles.rightSide]}>
        {rightSlot ?? (
          <>
            {onEvolution && (
              <TouchableOpacity
                onPress={onEvolution}
                style={styles.iconButton}
                accessibilityLabel="Ver mi evolución"
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons name="star-outline" size={24} color={iconColor} />
              </TouchableOpacity>
            )}
            {onPet && (
              <TouchableOpacity
                onPress={onPet}
                style={styles.iconButton}
                accessibilityLabel="Ver mascota"
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons name="paw" size={24} color={iconColor} />
              </TouchableOpacity>
            )}
            {showSoundToggle && (
              <TouchableOpacity
                onPress={onSoundToggle}
                style={styles.iconButton}
                accessibilityLabel={isMuted ? 'Activar sonido' : 'Silenciar'}
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons
                  name={isMuted ? 'volume-off' : 'volume-high'}
                  size={24}
                  color={iconColor}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 56,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.12)' } as Record<string, unknown>,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 3,
      },
    }),
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  rightSide: {
    justifyContent: 'flex-end',
  },
  side: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 44,
  },
  title: {
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.h3.size,
    lineHeight: Typography.scale.h3.lineHeight,
  },
});
