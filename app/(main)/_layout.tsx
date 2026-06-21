import { Stack } from 'expo-router';
import { useBackgroundMusic } from '@/infrastructure/hooks/useBackgroundMusic';

/**
 * Main app stack layout.
 * No tab bar in v1 — stack navigation only.
 * Background music starts here, once the loader has finished.
 */
export default function MainLayout() {
  useBackgroundMusic();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
