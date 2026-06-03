import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { useBreakpoint } from '@/infrastructure/platform/useBreakpoint';

/**
 * On non-phone breakpoints (tablet, web, wide), centers the app shell at
 * APP_MAX_WIDTH (480px) with a dark-navy background on the sides.
 * On phone, renders children directly with no wrapper.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const bp = useBreakpoint();
  if (bp === 'phone') return <>{children}</>;
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    maxWidth: 480,
    overflow: 'hidden',
    width: '100%',
    ...Platform.select({
      web: { boxShadow: '0 0 60px rgba(0,0,0,0.4)' } as Record<string, unknown>,
    }),
  },
  outer: {
    alignItems: 'center',
    backgroundColor: '#1a3a5c',
    flex: 1,
  },
});
