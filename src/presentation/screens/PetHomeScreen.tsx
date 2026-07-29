import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import { usePetStore } from '@/infrastructure/store/petStore';
import { useEconomyStore } from '@/infrastructure/store/economyStore';
import { getSpecies } from '@/domain/entities/PetCatalog';
import { NoFoodError } from '@/domain/usecases/pet/FeedPet';
import { SunBackground } from '@/presentation/components/common/SunBackground';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { AnimatedPet, type PetAction } from '@/presentation/components/pet/AnimatedPet';
import { ItemSprite } from '@/presentation/components/pet/ItemSprite';
import { WalletChip } from '@/presentation/components/pet/WalletChip';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { useContentWidth, useHorizontalPadding } from '@/infrastructure/platform/useBreakpoint';

/**
 * Pet home ("casa") screen — v1.5.
 *
 * - Animated pet composed of paper-doll layers (body + equipped cosmetics)
 * - Actions: feed (consumes purchased food) and affection (free, hearts)
 * - Wallet balance + clear access to the shop
 * - Profiles without a pet are sent to the selection flow
 */
export function PetHomeScreen() {
  const activeProfileId = useProfileStore(s => s.activeProfileId);
  const pet = usePetStore(s => s.pet);
  const petProfileId = usePetStore(s => s.profileId);
  const isLoading = usePetStore(s => s.isLoading);
  const loadPet = usePetStore(s => s.loadPet);
  const feed = usePetStore(s => s.feed);
  const getWalletBalance = useEconomyStore(s => s.getWalletBalance);

  const [action, setAction] = useState<PetAction | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const hPad = useHorizontalPadding();
  const contentWidth = useContentWidth();
  const petSize = Math.min(280, Math.round(contentWidth * 0.68));

  useEffect(() => {
    if (activeProfileId) void loadPet(activeProfileId);
  }, [activeProfileId, loadPet]);

  // No pet yet → go choose one (soft-mandatory selection flow)
  useFocusEffect(
    React.useCallback(() => {
      if (activeProfileId && !isLoading && petProfileId === activeProfileId && !pet) {
        router.replace('/(main)/pet/select');
      }
    }, [activeProfileId, isLoading, petProfileId, pet]),
  );

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  const balance = activeProfileId ? getWalletBalance(activeProfileId) : 0;

  const handleFeed = async (itemId: string) => {
    try {
      await feed(itemId);
      setAction({ type: 'feed', key: Date.now(), foodId: itemId });
    } catch (err) {
      setMessage(
        err instanceof NoFoodError ? err.message : 'No se pudo dar de comer. Inténtalo otra vez.',
      );
    }
  };

  const handleLove = () => {
    setAction({ type: 'love', key: Date.now() });
  };

  const handleShop = () => router.push('/(main)/pet/shop');
  const handleBack = () => router.back();

  if (!pet || petProfileId !== activeProfileId) {
    return (
      <View style={styles.root}>
        <AppHeader title="Mi mascota" onBack={handleBack} />
        <SunBackground>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={Colors.brandPrimary} />
          </View>
        </SunBackground>
      </View>
    );
  }

  const species = getSpecies(pet.speciesId);
  const foodStacks = pet.inventory.food;

  return (
    <View style={styles.root}>
      <AppHeader
        title="Mi mascota"
        onBack={handleBack}
        rightSlot={<WalletChip balance={balance} />}
      />

      <SunBackground>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: hPad }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Pet name */}
          <Text style={styles.petName}>{species.name}</Text>

          {/* The pet itself */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleLove}
            accessibilityLabel={`Acariciar a ${species.name}`}
            accessibilityRole="button"
            style={styles.petArea}
          >
            <AnimatedPet
              speciesId={pet.speciesId}
              equipped={pet.equipped}
              size={petSize}
              action={action}
            />
          </TouchableOpacity>

          {message ? (
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          ) : null}

          {/* Food tray */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{'Dar de comer'}</Text>
            {foodStacks.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.foodRow}>
                  {foodStacks.map(stack => (
                    <TouchableOpacity
                      key={stack.itemId}
                      style={styles.foodItem}
                      onPress={() => void handleFeed(stack.itemId)}
                      accessibilityLabel={`Dar de comer (quedan ${stack.qty})`}
                      accessibilityRole="button"
                    >
                      <ItemSprite itemId={stack.itemId} size={44} />
                      <View style={styles.qtyBadge}>
                        <Text style={styles.qtyText}>{stack.qty}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.emptyFood}>
                {'No tienes comida. ¡Compra algo rico en la tienda!'}
              </Text>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.loveButton]}
              onPress={handleLove}
              accessibilityLabel="Dar cariño"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="heart" size={22} color="#ffffff" />
              <Text style={styles.actionText}>{'Cariño'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.shopButton]}
              onPress={handleShop}
              accessibilityLabel="Ir a la tienda"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="storefront" size={22} color={Colors.textOnSecondary} />
              <Text style={[styles.actionText, styles.shopButtonText]}>{'Tienda'}</Text>
            </TouchableOpacity>
          </View>

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
  actionButton: {
    alignItems: 'center',
    borderRadius: Radii.lg,
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  actionText: {
    color: '#ffffff',
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    zIndex: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: '#eaf0f7',
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: Spacing.sm,
    padding: Spacing.lg,
    zIndex: 1,
    ...cardShadow,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  emptyFood: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('600'),
    fontSize: Typography.scale.body.size - 2,
  },
  foodItem: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.md,
    padding: Spacing.sm,
  },
  foodRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  loadingContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loveButton: {
    backgroundColor: '#e5484d',
  },
  messageCard: {
    backgroundColor: Colors.errorSurface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    zIndex: 1,
  },
  messageText: {
    color: Colors.error,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.body.size - 2,
    textAlign: 'center',
  },
  petArea: {
    alignItems: 'center',
    zIndex: 1,
  },
  petName: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h2.size,
    textAlign: 'center',
    zIndex: 1,
  },
  qtyBadge: {
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radii.full,
    minWidth: 20,
    paddingHorizontal: 4,
    position: 'absolute',
    right: -4,
    top: -4,
  },
  qtyText: {
    color: '#ffffff',
    fontFamily: nunitoFamily('800'),
    fontSize: 12,
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
  shopButton: {
    backgroundColor: Colors.brandSecondary,
  },
  shopButtonText: {
    color: Colors.textOnSecondary,
  },
  spacer: {
    height: 40,
  },
});
