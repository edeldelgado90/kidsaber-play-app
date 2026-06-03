import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useBreakpoint, APP_MAX_WIDTH } from '@/infrastructure/platform/useBreakpoint';

interface ContentContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Centers content horizontally with a max-width on tablet and wider screens.
 * The AppShell in _layout.tsx already constrains the app to APP_MAX_WIDTH on
 * non-phone breakpoints, so this component is mainly useful for inner sections
 * that need an additional centering constraint within a screen.
 */
export function ContentContainer({ children, style }: ContentContainerProps) {
  const bp = useBreakpoint();
  const isWide = bp !== 'phone';

  return <View style={[styles.base, isWide && styles.wide, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { flex: 1 },
  wide: { alignSelf: 'center', maxWidth: APP_MAX_WIDTH, width: '100%' },
});
