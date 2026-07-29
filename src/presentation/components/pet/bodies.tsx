import React from 'react';
import { G, Ellipse, Circle, Path, Rect } from 'react-native-svg';
import { type PetSpeciesId } from '@/domain/entities/Pet';
import { SPECIES_PALETTES } from './petSpriteTheme';

/**
 * Species body layers (paper-doll base). Drawn inside the shared 200×200
 * viewBox — see petSpriteTheme.ts for the anchor layout.
 */

/** Shared face: eyes with highlights, blush and a small smile. */
function Face({ blush, mouthColor = '#5a4632' }: { blush: string; mouthColor?: string }) {
  return (
    <G>
      <Circle cx={82} cy={70} r={6.5} fill="#2b2b2b" />
      <Circle cx={118} cy={70} r={6.5} fill="#2b2b2b" />
      <Circle cx={84.4} cy={67.6} r={2.2} fill="#ffffff" />
      <Circle cx={120.4} cy={67.6} r={2.2} fill="#ffffff" />
      <Circle cx={72} cy={84} r={6} fill={blush} opacity={0.55} />
      <Circle cx={128} cy={84} r={6} fill={blush} opacity={0.55} />
      <Path
        d="M 93 88 Q 100 94 107 88"
        stroke={mouthColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
    </G>
  );
}

function CapybaraBody() {
  const p = SPECIES_PALETTES.capybara;
  return (
    <G>
      {/* Body */}
      <Ellipse cx={100} cy={138} rx={56} ry={48} fill={p.body} />
      <Ellipse cx={100} cy={152} rx={36} ry={28} fill={p.belly} />
      {/* Feet */}
      <Ellipse cx={72} cy={182} rx={14} ry={8} fill={p.bodyDark} />
      <Ellipse cx={128} cy={182} rx={14} ry={8} fill={p.bodyDark} />
      {/* Head (boxy capybara muzzle) */}
      <Path
        d="M 55 75
           Q 55 32 100 32
           Q 145 32 145 75
           Q 145 102 100 102
           Q 55 102 55 75 Z"
        fill={p.body}
      />
      {/* Small round ears */}
      <Circle cx={68} cy={38} r={9} fill={p.bodyDark} />
      <Circle cx={132} cy={38} r={9} fill={p.bodyDark} />
      {/* Muzzle */}
      <Ellipse cx={100} cy={88} rx={20} ry={13} fill={p.belly} />
      <Ellipse cx={94} cy={85} rx={2.4} ry={3} fill="#5a4632" />
      <Ellipse cx={106} cy={85} rx={2.4} ry={3} fill="#5a4632" />
      <Face blush={p.blush} />
    </G>
  );
}

function KittenBody() {
  const p = SPECIES_PALETTES.kitten;
  return (
    <G>
      {/* Tail */}
      <Path
        d="M 152 150 Q 180 140 176 112"
        stroke={p.body}
        strokeWidth={14}
        strokeLinecap="round"
        fill="none"
      />
      {/* Body */}
      <Ellipse cx={100} cy={140} rx={52} ry={46} fill={p.body} />
      <Ellipse cx={100} cy={154} rx={32} ry={26} fill={p.belly} />
      {/* Feet */}
      <Ellipse cx={74} cy={182} rx={13} ry={8} fill={p.bodyDark} />
      <Ellipse cx={126} cy={182} rx={13} ry={8} fill={p.bodyDark} />
      {/* Triangle ears */}
      <Path d="M 60 52 L 68 16 L 92 40 Z" fill={p.body} />
      <Path d="M 140 52 L 132 16 L 108 40 Z" fill={p.body} />
      <Path d="M 67 45 L 71 26 L 84 39 Z" fill={p.blush} opacity={0.6} />
      <Path d="M 133 45 L 129 26 L 116 39 Z" fill={p.blush} opacity={0.6} />
      {/* Head */}
      <Circle cx={100} cy={72} r={42} fill={p.body} />
      {/* Stripes */}
      <Path d="M 92 31 Q 100 26 108 31 L 104 40 L 96 40 Z" fill={p.bodyDark} />
      {/* Nose + whiskers */}
      <Path d="M 96 82 L 104 82 L 100 88 Z" fill="#e0707e" />
      <Path
        d="M 62 80 L 84 84 M 62 90 L 84 88 M 138 80 L 116 84 M 138 90 L 116 88"
        stroke={p.bodyDark}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Face blush={p.blush} />
    </G>
  );
}

function DragonBody() {
  const p = SPECIES_PALETTES.dragon;
  return (
    <G>
      {/* Wings */}
      <Path d="M 46 120 Q 18 100 28 76 Q 52 88 58 108 Z" fill={p.bodyDark} />
      <Path d="M 154 120 Q 182 100 172 76 Q 148 88 142 108 Z" fill={p.bodyDark} />
      {/* Tail */}
      <Path
        d="M 150 160 Q 180 168 186 148"
        stroke={p.body}
        strokeWidth={13}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M 182 138 L 196 144 L 184 156 Z" fill={p.bodyDark} />
      {/* Body */}
      <Ellipse cx={100} cy={140} rx={52} ry={46} fill={p.body} />
      {/* Belly plates */}
      <Ellipse cx={100} cy={154} rx={30} ry={26} fill={p.belly} />
      <Path d="M 78 144 Q 100 152 122 144" stroke={p.body} strokeWidth={2} fill="none" />
      <Path d="M 80 160 Q 100 168 120 160" stroke={p.body} strokeWidth={2} fill="none" />
      {/* Feet */}
      <Ellipse cx={74} cy={182} rx={13} ry={8} fill={p.bodyDark} />
      <Ellipse cx={126} cy={182} rx={13} ry={8} fill={p.bodyDark} />
      {/* Head */}
      <Circle cx={100} cy={74} r={42} fill={p.body} />
      {/* Horns */}
      <Path d="M 76 40 Q 70 18 84 22 Q 88 32 84 42 Z" fill="#f5e9c8" />
      <Path d="M 124 40 Q 130 18 116 22 Q 112 32 116 42 Z" fill="#f5e9c8" />
      {/* Head crest */}
      <Path d="M 94 32 L 100 20 L 106 32 Z" fill={p.bodyDark} />
      {/* Snout nostrils */}
      <Ellipse cx={94} cy={84} rx={2.4} ry={3} fill="#3f6d22" />
      <Ellipse cx={106} cy={84} rx={2.4} ry={3} fill="#3f6d22" />
      <Face blush={p.blush} mouthColor="#3f6d22" />
    </G>
  );
}

const BODIES: Record<PetSpeciesId, React.ComponentType> = {
  capybara: CapybaraBody,
  kitten: KittenBody,
  dragon: DragonBody,
};

export function PetBody({ speciesId }: { speciesId: PetSpeciesId }) {
  const Body = BODIES[speciesId];
  return <Body />;
}

/** Simple ground shadow shared by all species. */
export function GroundShadow() {
  return <Rect x={54} y={186} width={92} height={8} rx={4} fill="#000000" opacity={0.12} />;
}
