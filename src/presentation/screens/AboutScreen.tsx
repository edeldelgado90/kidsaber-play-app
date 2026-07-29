import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SunBackground } from '@/presentation/components/common/SunBackground';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { AppInfo } from '@/infrastructure/config/appInfo';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { useHorizontalPadding } from '@/infrastructure/platform/useBreakpoint';

import LOGO_MARK from '../../../assets/brand/logo-mark-KS.png';

/**
 * "Acerca de" screen — reachable from the version line at the bottom of Perfiles.
 *
 * Shows only what helps diagnose a bug report (version + build number) plus a
 * contact address and the copyright notice. Nothing about the backend,
 * the Firebase project or the source revision belongs here.
 */
export function AboutScreen() {
  const hPad = useHorizontalPadding();

  const handleBack = () => router.back();

  const handleContact = () => {
    // A device with no mail client rejects the intent; there is nothing useful
    // to show the user in that case, so swallow it rather than crash.
    void Linking.openURL(`mailto:${AppInfo.supportEmail}`).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <AppHeader title="Acerca de" onBack={handleBack} />

      <SunBackground>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: hPad }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.identity}>
            <Image
              source={LOGO_MARK}
              style={styles.logo}
              resizeMode="contain"
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
            <Text style={styles.appName}>{AppInfo.name}</Text>
            <Text style={styles.version}>{`Versión ${AppInfo.versionLabel}`}</Text>
          </View>

          {AppInfo.supportEmail ? (
            <View style={styles.card}>
              <Pressable
                onPress={handleContact}
                style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}
                accessibilityRole="button"
                accessibilityLabel={`Escribir a ${AppInfo.supportEmail}`}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color={Colors.brandPrimary}
                />
                <View style={styles.rowText}>
                  <Text style={styles.rowLabel}>{'Contacto'}</Text>
                  <Text style={styles.rowValue}>{AppInfo.supportEmail}</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={Colors.textDisabled}
                />
              </Pressable>
            </View>
          ) : null}

          {/* CC-BY attribution required by the capybara model license */}
          <Text style={styles.legal}>
            {
              'Modelos 3D: "Capybara" de Poly by Google (CC-BY 3.0) · "Cat" y "Dragon" de Quaternius (CC0), vía poly.pizza'
            }
          </Text>

          <Text style={styles.legal}>{`${AppInfo.copyright} · Licencia ${AppInfo.license}`}</Text>
        </ScrollView>
      </SunBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h2.size,
    lineHeight: Typography.scale.h2.lineHeight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: '#eaf0f7',
    borderRadius: Radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0050b4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 12px rgba(0, 80, 180, 0.10)' } as Record<string, unknown>,
    }),
  },
  identity: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xl,
  },
  legal: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.badge.size,
    lineHeight: Typography.scale.badge.lineHeight,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  logo: {
    height: 96,
    marginBottom: Spacing.sm,
    width: 96,
  },
  root: {
    backgroundColor: Colors.brandPrimary,
    flex: 1,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
    minHeight: 44,
    padding: Spacing.lg,
  },
  rowLabel: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  rowPressed: {
    backgroundColor: Colors.surfaceHighlight,
  },
  rowText: {
    flex: 1,
  },
  rowValue: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.caption.size,
    lineHeight: Typography.scale.caption.lineHeight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.md,
    paddingBottom: Spacing['3xl'],
    paddingVertical: Spacing.lg,
    zIndex: 1,
  },
  version: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.caption.size,
    lineHeight: Typography.scale.caption.lineHeight,
    textAlign: 'center',
  },
});
