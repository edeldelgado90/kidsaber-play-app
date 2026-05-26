import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useBreakpoint } from '@/infrastructure/platform/useBreakpoint';

interface ContentContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Centers content horizontally with a max-width on larger screens.
 * Used as the root container for screen content in web/tablet layouts.
 */
export function ContentContainer({ children, style }: ContentContainerProps) {
  const bp = useBreakpoint();
  const isWeb = bp === 'web' || bp === 'wide';
  const maxWidth = bp === 'wide' ? 1200 : 960;

  return (
    <View
      style={[
        { flex: 1 },
        isWeb && { maxWidth, alignSelf: 'center', width: '100%' },
        style,
      ]}
    >
      {children}
    </View>
  );
}
