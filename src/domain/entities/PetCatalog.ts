import { type PetSpeciesId, type ShopCategory, type EquipSlot } from './Pet';

/**
 * Embedded pet catalog (v1.5): species and shop items ship with the app so the
 * shop and inventory work fully offline. Item ids double as sprite keys in the
 * presentation layer. Prices are in stars (1 star ≈ one good game session).
 */

export interface PetSpecies {
  id: PetSpeciesId;
  name: string; // visible copy (Spanish)
  description: string;
}

export interface ShopItem {
  id: string;
  category: ShopCategory;
  name: string; // visible copy (Spanish)
  price: number; // stars, integer >= 0
}

export const PET_SPECIES: PetSpecies[] = [
  { id: 'capybara', name: 'Capi', description: 'Un capibara bebé muy tranquilo' },
  { id: 'shiba', name: 'Toby', description: 'Un perrito shiba fiel y juguetón' },
  { id: 'dragon', name: 'Chispa', description: 'Un dragoncito pequeño y valiente' },
];

export const SHOP_ITEMS: ShopItem[] = [
  // Food (consumable)
  { id: 'food_apple', category: 'food', name: 'Manzana', price: 1 },
  { id: 'food_carrot', category: 'food', name: 'Zanahoria', price: 1 },
  { id: 'food_cookie', category: 'food', name: 'Galleta', price: 2 },
  { id: 'food_watermelon', category: 'food', name: 'Sandía', price: 3 },

  // Hats
  { id: 'hat_wool', category: 'hat', name: 'Gorro de lana', price: 5 },
  { id: 'hat_cap', category: 'hat', name: 'Gorra', price: 4 },
  { id: 'hat_party', category: 'hat', name: 'Gorro de fiesta', price: 6 },

  // Coats
  { id: 'coat_scarf', category: 'coat', name: 'Bufanda', price: 4 },
  { id: 'coat_rain', category: 'coat', name: 'Chubasquero', price: 7 },

  // Shoes
  { id: 'shoes_sneakers', category: 'shoes', name: 'Zapatillas', price: 5 },
  { id: 'shoes_boots', category: 'shoes', name: 'Botas', price: 6 },

  // Glasses
  { id: 'glasses_round', category: 'glasses', name: 'Gafas redondas', price: 3 },
  { id: 'glasses_sun', category: 'glasses', name: 'Gafas de sol', price: 5 },
];

export const SHOP_CATEGORIES: { id: ShopCategory; name: string }[] = [
  { id: 'food', name: 'Comida' },
  { id: 'hat', name: 'Gorros' },
  { id: 'coat', name: 'Abrigos' },
  { id: 'shoes', name: 'Zapatos' },
  { id: 'glasses', name: 'Gafas' },
];

export function getSpecies(id: PetSpeciesId): PetSpecies {
  const species = PET_SPECIES.find(s => s.id === id);
  if (!species) throw new Error(`Especie desconocida: ${id}`);
  return species;
}

export function getShopItem(itemId: string): ShopItem | null {
  return SHOP_ITEMS.find(i => i.id === itemId) ?? null;
}

export function getItemsByCategory(category: ShopCategory): ShopItem[] {
  return SHOP_ITEMS.filter(i => i.category === category);
}

export function isCosmeticCategory(category: ShopCategory): category is EquipSlot {
  return category !== 'food';
}
