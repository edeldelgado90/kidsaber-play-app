import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import { usePetStore } from '@/infrastructure/store/petStore';
import { type PetSpeciesId } from '@/domain/entities/Pet';
import { PET_SPECIES } from '@/domain/entities/PetCatalog';
import { SunBackground } from '@/presentation/components/common/SunBackground';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { PetSprite } from '@/presentation/components/pet/PetSprite';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { useContentWidth, useHorizontalPadding } from '@/infrastructure/platform/useBreakpoint';

/**
 * Pet selection screen — first entry to the pet feature (per profile).
 * Shows the available species; confirming assigns the pet and opens the house.
 */
export function PetSelectScreen() {
  const activeProfileId = useProfileStore(s => s.activeProfileId);
  const chooseSpecies = usePetStore(s => s.chooseSpecies);

  const [selected, setSelected] = useState<PetSpeciesId | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const hPad = useHorizontalPadding();
  const contentWidth = useContentWidth();
  const cardSprite = Math.min(120, Math.round(contentWidth * 0.26));

  const handleConfirm = async () => {
    if (!selected || !activeProfileId || isSaving) return;
    setIsSaving(true);
    try {
      await chooseSpecies(activeProfileId, selected);
      router.replace('/(main)/pet');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <AppHeader title="Elige tu mascota" onBack={() => router.back()} />

      <SunBackground>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: hPad }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>{'¡Ha llegado tu mascota! 🎉'}</Text>
            <Text style={styles.introText}>
              {
                'Elige un amigo para cuidarlo: dale de comer, mímalo y cómprale cosas con tus estrellas.'
              }
            </Text>
          </View>

          <View style={styles.speciesList}>
            {PET_SPECIES.map(species => {
              const isSelected = selected === species.id;
              return (
                <TouchableOpacity
                  key={species.id}
                  style={[styles.speciesCard, isSelected && styles.speciesCardSelected]}
                  onPress={() => setSelected(species.id)}
                  accessibilityLabel={`Elegir a ${species.name}: ${species.description}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <PetSprite speciesId={species.id} size={cardSprite} />
                  <View style={styles.speciesInfo}>
                    <Text style={styles.speciesName}>{species.name}</Text>
                    <Text style={styles.speciesDescription}>{species.description}</Text>
                  </View>
                  {isSelected ? <Text style={styles.check}>{'✔'}</Text> : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.confirmButton, (!selected || isSaving) && styles.confirmDisabled]}
            onPress={() => void handleConfirm()}
            disabled={!selected || isSaving}
            accessibilityLabel="Confirmar mascota"
            accessibilityRole="button"
          >
            <Text style={styles.confirmText}>
              {selected ? '¡Este quiero!' : 'Elige una mascota'}
            </Text>
          </TouchableOpacity>

          <View style={styles.spacer} />
        </ScrollView>
      </SunBackground>
    </View>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#0050b4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  android: { elevation: 3 },
  web: { boxShadow: '0 4px 12px rgba(0, 80, 180, 0.10)' } as Record<string, unknown>,
});

const styles = StyleSheet.create({
  check: {
    color: Colors.brandPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: 24,
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radii.lg,
    justifyContent: 'center',
    minHeight: 56,
    paddingVertical: Spacing.md,
    zIndex: 1,
  },
  confirmDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    color: Colors.textOnPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.bodyStrong.size + 2,
  },
  introCard: {
    backgroundColor: Colors.surface,
    borderColor: '#eaf0f7',
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: Spacing.xs,
    padding: Spacing.lg,
    zIndex: 1,
    ...cardShadow,
  },
  introText: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('600'),
    fontSize: Typography.scale.body.size - 2,
    lineHeight: 20,
  },
  introTitle: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h3.size,
  },
  root: {
    backgroundColor: Colors.brandPrimary,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.md,
    paddingBottom: Spacing['3xl'],
    paddingVertical: Spacing.lg,
  },
  spacer: {
    height: 40,
  },
  speciesCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: '#eaf0f7',
    borderRadius: Radii.lg,
    borderWidth: 2,
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    ...cardShadow,
  },
  speciesCardSelected: {
    borderColor: Colors.brandPrimary,
  },
  speciesDescription: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('600'),
    fontSize: Typography.scale.body.size - 2,
  },
  speciesInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  speciesList: {
    gap: Spacing.sm,
    zIndex: 1,
  },
  speciesName: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h3.size,
  },
});
