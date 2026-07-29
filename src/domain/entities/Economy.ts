/**
 * Star economy for the pet shop (v1.5).
 *
 * Two counters per profile, deliberately separate
 * (see 1.Analysis/v1.5/implementation-notes-mascota.md):
 * - `lifetimeStarsEarned`: historic total, shown in Evolution. Never decreases.
 * - `starWalletBalance`: spendable balance for the shop. Decreases on purchase.
 *
 * Earning a star in a game session increments both by 1 in the same transaction.
 */

export interface ProfileEconomy {
  lifetimeStarsEarned: number;
  starWalletBalance: number;
}

export interface Economy {
  byProfileId: Record<string, ProfileEconomy>;
}

export function createEmptyProfileEconomy(): ProfileEconomy {
  return { lifetimeStarsEarned: 0, starWalletBalance: 0 };
}

/**
 * Seed for profiles that earned stars before the pet update existed:
 * historic stars become both the lifetime total and the initial spendable balance.
 */
export function seedProfileEconomy(historicStars: number): ProfileEconomy {
  const stars = Math.max(0, historicStars);
  return { lifetimeStarsEarned: stars, starWalletBalance: stars };
}
