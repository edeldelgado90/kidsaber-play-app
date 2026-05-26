import { Stack } from 'expo-router';

/**
 * Main app stack layout.
 * No tab bar in v1 — stack navigation only.
 */
export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
