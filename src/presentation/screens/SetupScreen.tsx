import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import {
  ALL_GRADES,
  GRADE_SHORT_LABELS,
  validateProfileName,
  type Grade,
} from '@/domain/entities/Profile';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { useContentWidth } from '@/infrastructure/platform/useBreakpoint';

import LOGO from '../../../assets/brand/logo-full.png';

/**
 * Onboarding / Setup screen — first time only.
 *
 * Design spec:
 * - Blue header with animated logo (falls from above + scales down)
 * - White card slides up from below with 450ms delay
 * - Name input (2–20 chars, trimmed)
 * - Course chip grid (1.º–6.º)
 * - Submit disabled until name ≥ 2 chars
 */
export function SetupScreen() {
  const addProfile = useProfileStore(s => s.addProfile);
  const isLoading = useProfileStore(s => s.isLoading);

  const insets = useSafeAreaInsets();
  const contentWidth = useContentWidth();
  const logoSize = Math.min(150, Math.round(contentWidth * 0.38));

  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Logo animation: falls from below + scales down
  const logoTranslateY = useRef(new Animated.Value(180)).current;
  const logoScale = useRef(new Animated.Value(1.55)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Card animation: slides up from below
  const cardTranslateY = useRef(new Animated.Value(300)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation (900ms)
    Animated.parallel([
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(0),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 180, // opacity reaches 1 at ~20% of animation
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Card animation (700ms, delay 450ms)
    Animated.sequence([
      Animated.delay(450),
      Animated.parallel([
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const canSubmit = name.trim().length >= 2 && grade !== null;

  const handleSubmit = async () => {
    const error = validateProfileName(name);
    if (error) {
      setNameError(error);
      return;
    }
    if (!grade) return;

    try {
      await addProfile(name.trim(), grade);
      router.replace('/(main)/subjects');
    } catch {
      setNameError('No se pudo guardar el perfil. Inténtalo de nuevo.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Blue header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xl }]}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [{ translateY: logoTranslateY }, { scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Image
            source={LOGO}
            style={[styles.logo, { width: logoSize, height: logoSize }]}
            resizeMode="contain"
            accessibilityLabel="KidSaber Play"
          />
        </Animated.View>
      </View>

      {/* White card overlaps header */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateY: cardTranslateY }],
              opacity: cardOpacity,
            },
          ]}
        >
          <Text style={styles.cardTitle}>{'Cuéntanos sobre ti'}</Text>
          <Text style={styles.cardSubtitle}>{'Personalizaremos la experiencia para ti.'}</Text>

          {/* Name input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{'¿Cómo te llamas?'}</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              value={name}
              onChangeText={text => {
                setName(text);
                if (nameError) setNameError(null);
              }}
              placeholder="Tu nombre"
              maxLength={20}
              autoCapitalize="words"
              returnKeyType="done"
              accessibilityLabel="Nombre del niño"
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          {/* Grade grid */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{'¿En qué curso estás?'}</Text>
            <View style={styles.gradeGrid}>
              {ALL_GRADES.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.gradeChip, grade === g && styles.gradeChipSelected]}
                  onPress={() => setGrade(g)}
                  accessibilityLabel={`${GRADE_SHORT_LABELS[g]} de Primaria`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: grade === g }}
                >
                  <Text style={[styles.gradeChipText, grade === g && styles.gradeChipTextSelected]}>
                    {GRADE_SHORT_LABELS[g]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!canSubmit || isLoading}
            loading={isLoading}
            style={styles.submitButton}
            labelStyle={styles.submitLabel}
            contentStyle={styles.submitContent}
            accessibilityLabel="Empezar a jugar"
          >
            {'¡Empezar a jugar!'}
          </Button>

          <Text style={styles.caption}>{'Podrás cambiar estos datos más adelante.'}</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.brandPrimary,
  },
  header: {
    paddingBottom: 44,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
  },
  logoWrapper: {
    // shadow for logo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  logo: {
    // width/height applied dynamically via useContentWidth()
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing['3xl'],
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    // elevation
    elevation: 12,
    gap: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginTop: -24,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
  cardSubtitle: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.body.size,
    lineHeight: Typography.scale.body.lineHeight,
    marginTop: -Spacing.md,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h2.size,
    lineHeight: Typography.scale.h2.lineHeight,
  },
  errorText: {
    color: Colors.error,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.caption.size,
    lineHeight: Typography.scale.caption.lineHeight,
  },
  fieldGroup: {
    gap: Spacing.sm,
  },
  fieldLabel: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  gradeChip: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.full,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 64,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  gradeChipSelected: {
    backgroundColor: Colors.surfaceHighlight,
    borderColor: Colors.brandPrimary,
  },
  gradeChipText: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  gradeChipTextSelected: {
    color: Colors.brandPrimary,
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    paddingBottom: 44,
    paddingHorizontal: Spacing.xl,
  },
  input: {
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.md,
    borderWidth: 2,
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.body.size,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  inputError: {
    borderColor: Colors.error,
  },
  logo: {
    // width/height applied dynamically via useContentWidth()
  },
  logoWrapper: {
    // shadow for logo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  root: {
    backgroundColor: Colors.brandPrimary,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing['3xl'],
  },
  scrollView: {
    flex: 1,
  },
  submitButton: {
    borderRadius: Radii.md,
    marginTop: Spacing.sm,
  },
  submitContent: {
    paddingVertical: 6,
  },
  submitLabel: {
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.button.size,
    lineHeight: Typography.scale.button.lineHeight,
  },
});
