import React from 'react';
import Svg from 'react-native-svg';
import { EquipmentLayer, PREVIEW_BOXES, hasEquipmentSprite } from './equipment';
import { FoodDrawing, FOOD_VIEWBOX, hasFoodSprite } from './foods';

interface ItemSpriteProps {
  itemId: string;
  size: number;
}

/**
 * Standalone preview of a shop item (food drawing, or a cosmetic cropped
 * from the shared sprite coordinate space). Used in shop cards and inventory.
 */
export function ItemSprite({ itemId, size }: ItemSpriteProps) {
  if (hasFoodSprite(itemId)) {
    return (
      <Svg width={size} height={size} viewBox={FOOD_VIEWBOX}>
        <FoodDrawing itemId={itemId} />
      </Svg>
    );
  }

  if (hasEquipmentSprite(itemId)) {
    return (
      <Svg
        width={size}
        height={size}
        viewBox={PREVIEW_BOXES[itemId]}
        preserveAspectRatio="xMidYMid meet"
      >
        <EquipmentLayer itemId={itemId} />
      </Svg>
    );
  }

  return null;
}
