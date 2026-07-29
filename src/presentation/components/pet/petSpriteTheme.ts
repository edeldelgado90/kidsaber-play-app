import { type PetSpeciesId, type EquipSlot } from '@/domain/entities/Pet';

/**
 * Shared sprite geometry (paper-doll model).
 *
 * All species bodies are drawn in the same 200×200 viewBox with a common
 * anchor layout, so cosmetic layers align across species:
 * - head center ≈ (100, 75), eyes at y ≈ 70
 * - body center ≈ (100, 138)
 * - feet on the ground line y ≈ 185
 * Equipment can be nudged per species via EQUIP_OFFSETS.
 */
export const SPRITE_VIEWBOX = '0 0 200 200';

export interface SpeciesPalette {
  body: string;
  bodyDark: string;
  belly: string;
  blush: string;
}

export const SPECIES_PALETTES: Record<PetSpeciesId, SpeciesPalette> = {
  capybara: {
    body: '#b98d5a',
    bodyDark: '#93683c',
    belly: '#d8b98a',
    blush: '#e8a17e',
  },
  kitten: {
    body: '#f2a95c',
    bodyDark: '#d07f33',
    belly: '#fbe3c4',
    blush: '#f08a8a',
  },
  dragon: {
    body: '#7ec850',
    bodyDark: '#569a2f',
    belly: '#dff2bd',
    blush: '#f08a8a',
  },
};

export interface EquipOffset {
  dx: number;
  dy: number;
}

/** Small per-species nudges so items sit naturally (e.g. above horns/ears). */
export const EQUIP_OFFSETS: Record<
  PetSpeciesId,
  Partial<Record<EquipSlot, EquipOffset>>
> = {
  capybara: {},
  kitten: { hat: { dx: 0, dy: -4 } },
  dragon: { hat: { dx: 0, dy: -6 }, glasses: { dx: 0, dy: 2 } },
};

export function getEquipOffset(speciesId: PetSpeciesId, slot: EquipSlot): EquipOffset {
  return EQUIP_OFFSETS[speciesId][slot] ?? { dx: 0, dy: 0 };
}
