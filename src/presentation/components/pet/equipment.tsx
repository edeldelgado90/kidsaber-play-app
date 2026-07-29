import React from 'react';
import { G, Circle, Path, Rect, Line } from 'react-native-svg';
import { Colors } from '@/presentation/theme/tokens';

/**
 * Cosmetic layers (paper-doll). Each item is drawn in the shared 200×200
 * sprite coordinate space (see petSpriteTheme.ts) so it overlays any species.
 * PREVIEW_BOXES defines the viewBox crop used to show an item on its own
 * (shop cards, inventory).
 */

function HatWool() {
  return (
    <G>
      <Path d="M 60 46 Q 62 12 100 10 Q 138 12 140 46 Q 100 34 60 46 Z" fill={Colors.brandPrimary} />
      <Path d="M 58 46 Q 100 32 142 46 L 142 54 Q 100 42 58 54 Z" fill={Colors.brandPrimaryDark} />
      <Circle cx={100} cy={10} r={8} fill={Colors.brandSecondary} />
    </G>
  );
}

function HatCap() {
  return (
    <G>
      <Path d="M 62 44 Q 64 14 100 14 Q 136 14 138 44 Q 100 34 62 44 Z" fill={Colors.error} />
      <Path d="M 96 14 L 104 14 L 102 24 L 98 24 Z" fill="#b91c1c" />
      {/* Visor */}
      <Path d="M 130 40 Q 162 42 164 52 Q 140 50 128 48 Z" fill="#b91c1c" />
    </G>
  );
}

function HatParty() {
  return (
    <G>
      <Path d="M 78 48 L 100 4 L 122 48 Q 100 40 78 48 Z" fill={Colors.brandSecondary} />
      <Path d="M 86 32 L 114 32 L 118 40 Q 100 34 82 40 Z" fill={Colors.brandPrimary} opacity={0.85} />
      <Circle cx={100} cy={6} r={6} fill={Colors.error} />
    </G>
  );
}

function GlassesRound() {
  return (
    <G>
      <Circle cx={82} cy={70} r={13} fill="none" stroke="#2b2b2b" strokeWidth={3.5} />
      <Circle cx={118} cy={70} r={13} fill="none" stroke="#2b2b2b" strokeWidth={3.5} />
      <Line x1={95} y1={70} x2={105} y2={70} stroke="#2b2b2b" strokeWidth={3.5} />
      <Line x1={69} y1={68} x2={58} y2={62} stroke="#2b2b2b" strokeWidth={3.5} strokeLinecap="round" />
      <Line x1={131} y1={68} x2={142} y2={62} stroke="#2b2b2b" strokeWidth={3.5} strokeLinecap="round" />
    </G>
  );
}

function GlassesSun() {
  return (
    <G>
      <Path d="M 68 62 L 96 62 L 94 80 Q 82 86 70 80 Z" fill="#1f2937" />
      <Path d="M 132 62 L 104 62 L 106 80 Q 118 86 130 80 Z" fill="#1f2937" />
      <Line x1={96} y1={66} x2={104} y2={66} stroke="#1f2937" strokeWidth={4} />
      <Line x1={68} y1={64} x2={58} y2={60} stroke="#1f2937" strokeWidth={4} strokeLinecap="round" />
      <Line x1={132} y1={64} x2={142} y2={60} stroke="#1f2937" strokeWidth={4} strokeLinecap="round" />
    </G>
  );
}

function CoatScarf() {
  return (
    <G>
      <Path
        d="M 66 102 Q 100 118 134 102 L 134 114 Q 100 130 66 114 Z"
        fill={Colors.error}
      />
      <Rect x={112} y={110} width={14} height={34} rx={6} fill={Colors.error} />
      <Rect x={112} y={136} width={14} height={8} rx={3} fill="#b91c1c" />
    </G>
  );
}

function CoatRain() {
  return (
    <G>
      <Path
        d="M 58 116 Q 60 104 74 102 Q 100 116 126 102 Q 140 104 142 116 L 138 168 Q 100 180 62 168 Z"
        fill={Colors.brandSecondary}
      />
      <Path d="M 100 112 L 100 172" stroke={Colors.brandSecondaryDark} strokeWidth={3} />
      <Circle cx={92} cy={128} r={3} fill={Colors.brandSecondaryDark} />
      <Circle cx={92} cy={146} r={3} fill={Colors.brandSecondaryDark} />
    </G>
  );
}

function ShoesSneakers() {
  return (
    <G>
      <Path d="M 58 176 Q 58 168 72 168 Q 86 168 86 176 L 86 184 L 58 184 Z" fill={Colors.brandPrimary} />
      <Rect x={58} y={182} width={28} height={6} rx={3} fill="#ffffff" />
      <Path d="M 114 176 Q 114 168 128 168 Q 142 168 142 176 L 142 184 L 114 184 Z" fill={Colors.brandPrimary} />
      <Rect x={114} y={182} width={28} height={6} rx={3} fill="#ffffff" />
    </G>
  );
}

function ShoesBoots() {
  return (
    <G>
      <Path d="M 58 160 L 84 160 L 86 182 Q 72 190 56 182 Z" fill="#8a5a2b" />
      <Rect x={56} y={158} width={30} height={7} rx={3} fill="#6d4520" />
      <Path d="M 116 160 L 142 160 L 144 182 Q 130 190 114 182 Z" fill="#8a5a2b" />
      <Rect x={114} y={158} width={30} height={7} rx={3} fill="#6d4520" />
    </G>
  );
}

const EQUIPMENT: Record<string, React.ComponentType> = {
  hat_wool: HatWool,
  hat_cap: HatCap,
  hat_party: HatParty,
  glasses_round: GlassesRound,
  glasses_sun: GlassesSun,
  coat_scarf: CoatScarf,
  coat_rain: CoatRain,
  shoes_sneakers: ShoesSneakers,
  shoes_boots: ShoesBoots,
};

/** viewBox crop used to preview each cosmetic on its own. */
export const PREVIEW_BOXES: Record<string, string> = {
  hat_wool: '52 0 96 62',
  hat_cap: '56 6 114 54',
  hat_party: '70 -2 60 58',
  glasses_round: '52 50 96 44',
  glasses_sun: '52 52 96 42',
  coat_scarf: '58 94 84 58',
  coat_rain: '50 96 100 90',
  shoes_sneakers: '50 160 100 36',
  shoes_boots: '48 150 104 48',
};

export function EquipmentLayer({ itemId }: { itemId: string }) {
  const Item = EQUIPMENT[itemId];
  return Item ? <Item /> : null;
}

export function hasEquipmentSprite(itemId: string): boolean {
  return itemId in EQUIPMENT;
}
