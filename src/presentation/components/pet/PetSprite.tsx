import React from 'react';
import Svg, { G } from 'react-native-svg';
import { type PetSpeciesId, type EquipSlot, EQUIP_SLOTS } from '@/domain/entities/Pet';
import { SPRITE_VIEWBOX, getEquipOffset } from './petSpriteTheme';
import { PetBody, GroundShadow } from './bodies';
import { EquipmentLayer } from './equipment';

interface PetSpriteProps {
  speciesId: PetSpeciesId;
  /** Item id per slot (null/undefined = nothing equipped). */
  equipped?: Partial<Record<EquipSlot, string | null>>;
  size: number;
}

/** Render order: back to front, so hats always cover glasses etc. */
const LAYER_ORDER: EquipSlot[] = ['shoes', 'coat', 'glasses', 'hat'];

/**
 * Static composed pet: species body + equipped cosmetic layers (paper doll).
 * Animation is applied by AnimatedPet on the whole sprite, so clothes move
 * together with the body.
 */
export function PetSprite({ speciesId, equipped = {}, size }: PetSpriteProps) {
  return (
    <Svg width={size} height={size} viewBox={SPRITE_VIEWBOX}>
      <GroundShadow />
      <PetBody speciesId={speciesId} />
      {LAYER_ORDER.filter(slot => EQUIP_SLOTS.includes(slot)).map(slot => {
        const itemId = equipped[slot];
        if (!itemId) return null;
        const { dx, dy } = getEquipOffset(speciesId, slot);
        return (
          <G key={slot} transform={`translate(${dx}, ${dy})`}>
            <EquipmentLayer itemId={itemId} />
          </G>
        );
      })}
    </Svg>
  );
}
