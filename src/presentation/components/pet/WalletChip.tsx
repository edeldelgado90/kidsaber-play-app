import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

/**
 * Spendable star balance pill (shop wallet).
 * Shows `starWalletBalance` — not the lifetime total shown in Evolution.
 */
export function WalletChip({ balance }: { balance: number }) {
  return (
    <View
      style={styles.chip}
      accessibilityLabel={`Tienes ${balance} estrella${balance !== 1 ? 's' : ''} para gastar`}
    >
      <Text style={styles.star}>{'⭐'}</Text>
      <Text style={styles.balance}>{balance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  balance: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.brandSecondary,
    borderRadius: Radii.full,
    borderWidth: 2,
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  star: {
    fontSize: 16,
  },
});
