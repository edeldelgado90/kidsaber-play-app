import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import { useProgressStore } from '@/infrastructure/store/progressStore';
import { Colors } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { useContentWidth } from '@/infrastructure/platform/useBreakpoint';

import LOGO from '../../../assets/brand/logo-full.png';
const MIN_SPLASH_DURATION = 1800;

/**
 * Loading / Splash screen.
 *
 * Design spec:
 * - Blue #0071da full-screen background
 * - Logo logo-full.png 160×160 with pulse animation (scale 1↔1.06, 1200ms)
 * - "KidSaber Play" text 28px weight 800 white
 * - Yellow progress bar 200×6px
 * - Min 1800ms, then branch to onboarding or subjects
 */
export function LoadingScreen() {
  const loadProfiles = useProfileStore(s => s.loadProfiles);
  const loadProgress = useProgressStore(s => s.loadProgress);

  const contentWidth = useContentWidth();
  const logoSize = Math.min(160, Math.round(contentWidth * 0.42));

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const isNavigated = useRef(false);

  // Pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.06,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [scaleAnim]);

  // Progress bar animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0.7,
      duration: MIN_SPLASH_DURATION * 0.8,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  // Load data + navigate
  useEffect(() => {
    const startTime = Date.now();

    const loadData = async () => {
      await Promise.all([loadProfiles(), loadProgress()]);
    };

    loadData().then(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_SPLASH_DURATION - elapsed);

      setTimeout(() => {
        if (!isNavigated.current) {
          isNavigated.current = true;
          const hasProfiles = useProfileStore.getState().profiles.length > 0;
          if (hasProfiles) {
            router.replace('/(main)/subjects');
          } else {
            router.replace('/(onboarding)/setup');
          }
        }
      }, remaining);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Image
          source={LOGO}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
          accessibilityLabel="KidSaber Play"
        />
      </Animated.View>

      <Text style={styles.appName}>{'KidSaber Play'}</Text>

      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: Colors.textOnPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: 28,
    letterSpacing: -0.28,
  },
  container: {
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    flex: 1,
    gap: 24,
    justifyContent: 'center',
  },
  logo: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
  progressBar: {
    backgroundColor: Colors.brandSecondary,
    borderRadius: 3,
    height: 6,
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    height: 6,
    marginTop: 8,
    overflow: 'hidden',
    width: 200,
  },
});
