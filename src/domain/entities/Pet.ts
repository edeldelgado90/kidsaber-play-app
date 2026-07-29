/**
 * Domain entities for the virtual pet feature (v1.5).
 * Each child profile owns one pet: a species plus equipped cosmetics and an
 * inventory of purchased items. See 1.Analysis/v1.5/1.Screens/08-mascota-tienda.md.
 */

export type PetSpeciesId = 'capybara' | 'kitten' | 'dragon';

/** Paper-doll layers a cosmetic item can occupy (one item per slot). */
export type EquipSlot = 'hat' | 'coat' | 'shoes' | 'glasses';

export const EQUIP_SLOTS: EquipSlot[] = ['hat', 'coat', 'shoes', 'glasses'];

export type ShopCategory = 'food' | EquipSlot;

export interface FoodStack {
  itemId: string;
  qty: number;
}

export interface PetInventory {
  food: FoodStack[];
  cosmetics: string[]; // owned cosmetic item ids
}

export interface PetState {
  speciesId: PetSpeciesId;
  equipped: Record<EquipSlot, string | null>;
  inventory: PetInventory;
}

/** All pets keyed by profile id (a pet belongs to a single child profile). */
export interface Pets {
  byProfileId: Record<string, PetState>;
}

export function createPetState(speciesId: PetSpeciesId): PetState {
  return {
    speciesId,
    equipped: { hat: null, coat: null, shoes: null, glasses: null },
    inventory: { food: [], cosmetics: [] },
  };
}

/** Total units of food available across all food stacks. */
export function getTotalFoodCount(pet: PetState): number {
  return pet.inventory.food.reduce((sum, stack) => sum + stack.qty, 0);
}

export function getFoodQty(pet: PetState, itemId: string): number {
  return pet.inventory.food.find(s => s.itemId === itemId)?.qty ?? 0;
}

export function ownsCosmetic(pet: PetState, itemId: string): boolean {
  return pet.inventory.cosmetics.includes(itemId);
}

/** Returns a new inventory with `qty` units of a food item added (stacking). */
export function addFood(inventory: PetInventory, itemId: string, qty: number): PetInventory {
  const existing = inventory.food.find(s => s.itemId === itemId);
  const food = existing
    ? inventory.food.map(s => (s.itemId === itemId ? { ...s, qty: s.qty + qty } : s))
    : [...inventory.food, { itemId, qty }];
  return { ...inventory, food };
}

/** Returns a new inventory with one unit of a food item removed, or null if out of stock. */
export function consumeFood(inventory: PetInventory, itemId: string): PetInventory | null {
  const existing = inventory.food.find(s => s.itemId === itemId);
  if (!existing || existing.qty <= 0) return null;

  const food = inventory.food
    .map(s => (s.itemId === itemId ? { ...s, qty: s.qty - 1 } : s))
    .filter(s => s.qty > 0);
  return { ...inventory, food };
}
