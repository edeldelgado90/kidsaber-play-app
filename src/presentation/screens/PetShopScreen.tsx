import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import { usePetStore } from '@/infrastructure/store/petStore';
import { useEconomyStore } from '@/infrastructure/store/economyStore';
import { type ShopCategory, getFoodQty, ownsCosmetic } from '@/domain/entities/Pet';
import {
  SHOP_CATEGORIES,
  getItemsByCategory,
  isCosmeticCategory,
  type ShopItem,
} from '@/domain/entities/PetCatalog';
import { InsufficientStarsError } from '@/domain/usecases/shop/PurchaseItem';
import { SunBackground } from '@/presentation/components/common/SunBackground';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { ItemSprite } from '@/presentation/components/pet/ItemSprite';
import { WalletChip } from '@/presentation/components/pet/WalletChip';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { useHorizontalPadding } from '@/infrastructure/platform/useBreakpoint';

/**
 * Pet shop screen — v1.5.
 *
 * Embedded offline catalog: food (consumable, stacks) and cosmetics
 * (one-time purchase, then equip/unequip in their paper-doll slot).
 * Purchases spend `starWalletBalance` only; Evolution totals never decrease.
 */
export function PetShopScreen() {
  const activeProfileId = useProfileStore(s => s.activeProfileId);
  const pet = usePetStore(s => s.pet);
  const petProfileId = usePetStore(s => s.profileId);
  const loadPet = usePetStore(s => s.loadPet);
  const purchase = usePetStore(s => s.purchase);
  const equip = usePetStore(s => s.equip);
  const getWalletBalance = useEconomyStore(s => s.getWalletBalance);

  const [category, setCategory] = useState<ShopCategory>('food');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const hPad = useHorizontalPadding();

  useEffect(() => {
    if (activeProfileId && petProfileId !== activeProfileId) void loadPet(activeProfileId);
  }, [activeProfileId, petProfileId, loadPet]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  const balance = activeProfileId ? getWalletBalance(activeProfileId) : 0;
  const items = getItemsByCategory(category);

  const handleBuy = async (item: ShopItem) => {
    try {
      await purchase(item.id);
      setMessage({ text: `¡${item.name} comprado! 🎉`, isError: false });
    } catch (err) {
      setMessage({
        text:
          err instanceof InsufficientStarsError
            ? err.message
            : 'No se pudo comprar. Inténtalo otra vez.',
        isError: true,
      });
    }
  };

  const handleToggleEquip = async (item: ShopItem) => {
    if (!pet || !isCosmeticCategory(item.category)) return;
    const isEquipped = pet.equipped[item.category] === item.id;
    await equip(item.category, isEquipped ? null : item.id);
  };

  return (
    <View style={styles.root}>
      <AppHeader
        title="Tienda"
        onBack={() => router.back()}
        rightSlot={<WalletChip balance={balance} />}
      />

      <SunBackground showFloor={false}>
        <View style={styles.content}>
          {/* Category chips */}
          <View style={styles.categoriesWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={[styles.categoriesRow, { paddingHorizontal: hPad }]}>
                {SHOP_CATEGORIES.map(cat => {
                  const isActive = cat.id === category;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                      onPress={() => setCategory(cat.id)}
                      accessibilityLabel={`Categoría ${cat.name}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isActive }}
                    >
                      <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {message ? (
            <View
              style={[
                styles.messageCard,
                { backgroundColor: message.isError ? Colors.errorSurface : Colors.successSurface },
                { marginHorizontal: hPad },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: message.isError ? Colors.error : Colors.success },
                ]}
              >
                {message.text}
              </Text>
            </View>
          ) : null}

          {/* Item grid */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.grid, { paddingHorizontal: hPad }]}
            showsVerticalScrollIndicator={false}
          >
            {items.map(item => {
              const owned = pet ? ownsCosmetic(pet, item.id) : false;
              const foodQty = pet ? getFoodQty(pet, item.id) : 0;
              const isEquipped =
                pet && isCosmeticCategory(item.category)
                  ? pet.equipped[item.category] === item.id
                  : false;
              const canAfford = balance >= item.price;
              const isCosmetic = isCosmeticCategory(item.category);

              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemPreview}>
                    <ItemSprite itemId={item.id} size={64} />
                    {item.category === 'food' && foodQty > 0 ? (
                      <View style={styles.qtyBadge}>
                        <Text style={styles.qtyText}>{foodQty}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>{`⭐ ${item.price}`}</Text>

                  {isCosmetic && owned ? (
                    <TouchableOpacity
                      style={[
                        styles.itemButton,
                        isEquipped ? styles.unequipButton : styles.equipButton,
                      ]}
                      onPress={() => void handleToggleEquip(item)}
                      accessibilityLabel={
                        isEquipped ? `Quitar ${item.name}` : `Ponerle ${item.name}`
                      }
                      accessibilityRole="button"
                    >
                      <Text style={styles.itemButtonText}>
                        {isEquipped ? 'Quitar' : 'Ponérselo'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.itemButton,
                        styles.buyButton,
                        !canAfford && styles.buyDisabled,
                      ]}
                      onPress={() => void handleBuy(item)}
                      disabled={!canAfford}
                      accessibilityLabel={`Comprar ${item.name} por ${item.price} estrellas`}
                      accessibilityRole="button"
                    >
                      <Text style={styles.itemButtonText}>{'Comprar'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
            <View style={styles.spacer} />
          </ScrollView>
        </View>
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
  buyButton: {
    backgroundColor: Colors.brandPrimary,
  },
  buyDisabled: {
    opacity: 0.4,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  categoriesWrap: {
    paddingVertical: Spacing.md,
    zIndex: 1,
  },
  categoryChip: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.full,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  categoryText: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.body.size - 2,
  },
  categoryTextActive: {
    color: Colors.textOnPrimary,
  },
  content: {
    flex: 1,
  },
  equipButton: {
    backgroundColor: Colors.success,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },
  itemButton: {
    alignItems: 'center',
    borderRadius: Radii.md,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    width: '100%',
  },
  itemButtonText: {
    color: '#ffffff',
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.body.size - 2,
  },
  itemCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: '#eaf0f7',
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: Spacing.xs,
    padding: Spacing.md,
    width: 150,
    ...cardShadow,
  },
  itemName: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.body.size - 2,
  },
  itemPreview: {
    alignItems: 'center',
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  itemPrice: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.body.size - 2,
  },
  messageCard: {
    borderRadius: Radii.md,
    padding: Spacing.md,
    zIndex: 1,
  },
  messageText: {
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.body.size - 2,
    textAlign: 'center',
  },
  qtyBadge: {
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radii.full,
    minWidth: 22,
    paddingHorizontal: 5,
    position: 'absolute',
    right: 0,
    top: 0,
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
    zIndex: 1,
  },
  spacer: {
    height: 40,
    width: '100%',
  },
  unequipButton: {
    backgroundColor: Colors.textDisabled,
  },
});
