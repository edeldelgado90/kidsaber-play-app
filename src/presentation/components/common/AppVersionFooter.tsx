import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { AppInfo } from '@/infrastructure/config/appInfo';
import { Colors, Spacing, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface AppVersionFooterProps {
  /** When set, the footer acts as a button — used to open the "Acerca de" screen. */
  onPress?: () => void;
}

/**
 * Discreet version line for the bottom of adult-facing screens.
 *
 * Deliberately quiet: caption size, secondary colour, centred. hitSlop rather
 * than padding gets it past the 44 minimum touch target without turning a
 * footnote into a visual block.
 */
export function AppVersionFooter({ onPress }: AppVersionFooterProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.container, pressed && onPress ? styles.pressed : null]}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={onPress ? 'Acerca de KidSaber Play' : undefined}
    >
      <Text style={styles.text}>{`${AppInfo.name} v${AppInfo.versionLabel}`}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.caption.size,
    lineHeight: Typography.scale.caption.lineHeight,
    textAlign: 'center',
  },
});
