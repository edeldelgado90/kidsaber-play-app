import React from 'react';
import { G, Ellipse, Circle, Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { type PetSpeciesId } from '@/domain/entities/Pet';
import { SPECIES_PALETTES } from './petSpriteTheme';

/**
 * Species body layers (paper-doll base). Drawn inside the shared 200×200
 * viewBox — see petSpriteTheme.ts for the anchor layout.
 *
 * Anchor constraints (equipment alignment): eyes at (82,70)/(118,70),
 * neck ≈ y 102–114, feet centered near x 72/128 on the ground line y ≈ 185.
 * Gradient ids are unique per species: several sprites can share one page.
 */

interface EyeProps {
  r?: number;
}

/** Shared eyes with highlight (positions fixed by the glasses layer). */
function Eyes({ r = 6.5 }: EyeProps) {
  return (
    <G>
      <Circle cx={82} cy={70} r={r} fill="#2b2b2b" />
      <Circle cx={118} cy={70} r={r} fill="#2b2b2b" />
      <Circle cx={82 + r * 0.35} cy={70 - r * 0.35} r={r * 0.32} fill="#ffffff" />
      <Circle cx={118 + r * 0.35} cy={70 - r * 0.35} r={r * 0.32} fill="#ffffff" />
    </G>
  );
}

function CapybaraBody() {
  const p = SPECIES_PALETTES.capybara;
  return (
    <G>
      <Defs>
        <LinearGradient id="capyBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={p.body} />
          <Stop offset="1" stopColor={p.bodyDark} />
        </LinearGradient>
      </Defs>

      {/* Loaf-shaped body (capybaras sit like a bread loaf, no visible tail) */}
      <Path
        d="M 42 152
           Q 42 108 100 106
           Q 158 108 158 152
           Q 158 182 128 184
           L 72 184
           Q 42 182 42 152 Z"
        fill="url(#capyBody)"
      />
      {/* Fur texture: short strokes on the flanks */}
      <Path
        d="M 56 132 L 52 142 M 66 122 L 62 132 M 144 132 L 148 142 M 134 122 L 138 132 M 96 114 L 94 122 M 108 114 L 110 122"
        stroke={p.bodyDark}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.45}
      />
      {/* Four stubby legs with toe lines */}
      <Rect x={62} y={166} width={20} height={20} rx={8} fill={p.bodyDark} />
      <Rect x={118} y={166} width={20} height={20} rx={8} fill={p.bodyDark} />
      <Path
        d="M 69 184 L 69 178 M 75 184 L 75 178 M 125 184 L 125 178 M 131 184 L 131 178"
        stroke="#7a5732"
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Hind feet peeking at the sides */}
      <Ellipse cx={50} cy={178} rx={10} ry={7} fill={p.bodyDark} />
      <Ellipse cx={150} cy={178} rx={10} ry={7} fill={p.bodyDark} />

      {/* Head: flat-topped, boxy muzzle — the capybara silhouette */}
      <Path
        d="M 56 64
           Q 56 38 78 35
           Q 100 32 122 35
           Q 144 38 144 64
           L 144 80
           Q 144 104 100 104
           Q 56 104 56 80 Z"
        fill={p.body}
      />
      {/* Small rounded ears set toward the back corners of the head */}
      <Path d="M 61 46 Q 56 31 70 31 Q 79 33 74 47 Z" fill={p.bodyDark} />
      <Path d="M 139 46 Q 144 31 130 31 Q 121 33 126 47 Z" fill={p.bodyDark} />
      <Path d="M 65 44 Q 63 35 70 35 Q 74 37 71 45 Z" fill="#7a5732" />
      <Path d="M 135 44 Q 137 35 130 35 Q 126 37 129 45 Z" fill="#7a5732" />

      {/* Big blunt muzzle covering the lower half of the face */}
      <Path
        d="M 74 88
           Q 74 74 100 74
           Q 126 74 126 88
           Q 126 103 100 103
           Q 74 103 74 88 Z"
        fill={p.belly}
      />
      {/* Nostrils high on the snout */}
      <Ellipse cx={91} cy={83} rx={2.6} ry={4} fill="#5a4632" transform="rotate(-12 91 83)" />
      <Ellipse cx={109} cy={83} rx={2.6} ry={4} fill="#5a4632" transform="rotate(12 109 83)" />
      {/* Split upper lip + mouth */}
      <Path
        d="M 100 90 L 100 95 M 94 98 Q 100 102 106 98"
        stroke="#5a4632"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      {/* Vibrissae (whisker dots) */}
      <G fill="#5a4632" opacity={0.5}>
        <Circle cx={83} cy={90} r={1.1} />
        <Circle cx={80} cy={94} r={1.1} />
        <Circle cx={85} cy={95} r={1.1} />
        <Circle cx={117} cy={90} r={1.1} />
        <Circle cx={120} cy={94} r={1.1} />
        <Circle cx={115} cy={95} r={1.1} />
      </G>

      {/* Small lateral eyes (capybaras have them high on the head) */}
      <Eyes r={5} />
      <Circle cx={72} cy={82} r={5} fill={p.blush} opacity={0.4} />
      <Circle cx={128} cy={82} r={5} fill={p.blush} opacity={0.4} />
    </G>
  );
}

function KittenBody() {
  const p = SPECIES_PALETTES.kitten;
  return (
    <G>
      <Defs>
        <LinearGradient id="kittyBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={p.body} />
          <Stop offset="1" stopColor={p.bodyDark} />
        </LinearGradient>
      </Defs>

      {/* Striped tail curling up */}
      <Path
        d="M 152 150 Q 182 142 178 110"
        stroke={p.body}
        strokeWidth={14}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 168 141 Q 175 137 179 128 M 173 125 Q 177 121 178 113"
        stroke={p.bodyDark}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Body */}
      <Ellipse cx={100} cy={140} rx={52} ry={46} fill="url(#kittyBody)" />
      {/* Back stripes */}
      <Path
        d="M 58 118 Q 70 124 74 136 L 64 140 Q 58 130 54 126 Z"
        fill={p.bodyDark}
        opacity={0.7}
      />
      <Path
        d="M 142 118 Q 130 124 126 136 L 136 140 Q 142 130 146 126 Z"
        fill={p.bodyDark}
        opacity={0.7}
      />
      {/* Chest fluff */}
      <Path
        d="M 74 132 L 80 142 L 86 132 L 92 142 L 100 130 L 108 142 L 114 132 L 120 142 L 126 132
           Q 128 168 100 172 Q 72 168 74 132 Z"
        fill={p.belly}
      />
      {/* Front paws with toe lines */}
      <Ellipse cx={78} cy={178} rx={15} ry={10} fill={p.body} />
      <Ellipse cx={122} cy={178} rx={15} ry={10} fill={p.body} />
      <Path
        d="M 73 184 L 73 176 M 79 185 L 79 177 M 117 185 L 117 177 M 123 184 L 123 176"
        stroke={p.bodyDark}
        strokeWidth={1.8}
        strokeLinecap="round"
      />

      {/* Triangle ears with inner ear */}
      <Path d="M 58 54 L 66 14 L 93 38 Z" fill={p.body} />
      <Path d="M 142 54 L 134 14 L 107 38 Z" fill={p.body} />
      <Path d="M 66 45 L 70 24 L 84 38 Z" fill="#e8949c" />
      <Path d="M 134 45 L 130 24 L 116 38 Z" fill="#e8949c" />
      {/* Ear tips */}
      <Path d="M 66 14 L 70 22 L 62 24 Z" fill={p.bodyDark} />
      <Path d="M 134 14 L 130 22 L 138 24 Z" fill={p.bodyDark} />

      {/* Head */}
      <Circle cx={100} cy={72} r={42} fill={p.body} />
      {/* Cheek fluff tufts */}
      <Path d="M 58 78 L 48 74 L 58 86 L 50 86 L 60 93 Z" fill={p.body} />
      <Path d="M 142 78 L 152 74 L 142 86 L 150 86 L 140 93 Z" fill={p.body} />
      {/* Forehead stripes */}
      <Path d="M 92 31 L 94 43 L 89 43 Z" fill={p.bodyDark} opacity={0.8} />
      <Path d="M 100 29 L 102 43 L 97 43 Z" fill={p.bodyDark} opacity={0.8} />
      <Path d="M 108 31 L 111 43 L 105 43 Z" fill={p.bodyDark} opacity={0.8} />

      {/* Muzzle area */}
      <Ellipse cx={91} cy={87} rx={11} ry={8} fill={p.belly} />
      <Ellipse cx={109} cy={87} rx={11} ry={8} fill={p.belly} />
      {/* Nose + mouth in "w" */}
      <Path d="M 95 80 L 105 80 L 100 87 Z" fill="#e0707e" />
      <Path
        d="M 100 87 L 100 91 M 100 91 Q 95 96 90 91 M 100 91 Q 105 96 110 91"
        stroke={p.bodyDark}
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
      {/* Whiskers */}
      <Path
        d="M 60 80 L 82 85 M 59 89 L 82 89 M 62 97 L 83 93 M 140 80 L 118 85 M 141 89 L 118 89 M 138 97 L 117 93"
        stroke={p.bodyDark}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.8}
      />

      <Eyes r={6.5} />
      <Circle cx={72} cy={84} r={6} fill={p.blush} opacity={0.5} />
      <Circle cx={128} cy={84} r={6} fill={p.blush} opacity={0.5} />
    </G>
  );
}

function DragonBody() {
  const p = SPECIES_PALETTES.dragon;
  return (
    <G>
      <Defs>
        <LinearGradient id="dragBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={p.body} />
          <Stop offset="1" stopColor={p.bodyDark} />
        </LinearGradient>
      </Defs>

      {/* Wings with membrane ribs */}
      <Path d="M 46 122 Q 12 100 24 70 Q 54 84 60 108 Z" fill={p.bodyDark} />
      <Path d="M 154 122 Q 188 100 176 70 Q 146 84 140 108 Z" fill={p.bodyDark} />
      <Path
        d="M 30 76 Q 44 94 52 114 M 24 88 Q 38 100 46 118 M 170 76 Q 156 94 148 114 M 176 88 Q 162 100 154 118"
        stroke="#3f6d22"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.7}
      />

      {/* Tail with spade tip */}
      <Path
        d="M 150 160 Q 182 168 188 146"
        stroke={p.body}
        strokeWidth={13}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M 182 134 L 198 142 L 186 156 Z" fill={p.bodyDark} />

      {/* Body */}
      <Ellipse cx={100} cy={140} rx={52} ry={46} fill="url(#dragBody)" />
      {/* Shoulder spikes */}
      <Path d="M 56 112 L 46 100 L 62 102 Z" fill="#f5e9c8" />
      <Path d="M 144 112 L 154 100 L 138 102 Z" fill="#f5e9c8" />
      {/* Scale hints on the flanks */}
      <Path
        d="M 60 138 Q 64 134 68 138 M 64 150 Q 68 146 72 150 M 132 138 Q 136 134 140 138 M 128 150 Q 132 146 136 150"
        stroke="#3f6d22"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
      {/* Belly plates */}
      <Path d="M 72 128 Q 100 120 128 128 L 130 158 Q 100 180 70 158 Z" fill={p.belly} />
      <Path
        d="M 74 136 Q 100 144 126 136 M 74 148 Q 100 156 126 148 M 78 160 Q 100 168 122 160"
        stroke="#b8d68a"
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      {/* Feet with claws */}
      <Ellipse cx={74} cy={180} rx={14} ry={9} fill={p.bodyDark} />
      <Ellipse cx={126} cy={180} rx={14} ry={9} fill={p.bodyDark} />
      <Path
        d="M 66 186 L 66 179 M 73 187 L 73 180 M 120 187 L 120 180 M 127 186 L 127 179"
        stroke="#f5e9c8"
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Head */}
      <Circle cx={100} cy={74} r={42} fill={p.body} />
      {/* Horns (ridged) */}
      <Path d="M 74 42 Q 66 16 82 20 Q 88 32 84 44 Z" fill="#f5e9c8" />
      <Path d="M 126 42 Q 134 16 118 20 Q 112 32 116 44 Z" fill="#f5e9c8" />
      <Path
        d="M 74 32 L 82 34 M 72 26 L 80 27"
        stroke="#d9c79a"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M 126 32 L 118 34 M 128 26 L 120 27"
        stroke="#d9c79a"
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Head crest spikes */}
      <Path d="M 90 34 L 95 20 L 100 33 Z" fill={p.bodyDark} />
      <Path d="M 101 33 L 108 22 L 111 35 Z" fill={p.bodyDark} />

      {/* Protruding snout */}
      <Path
        d="M 78 88
           Q 78 76 100 76
           Q 122 76 122 88
           Q 122 100 100 100
           Q 78 100 78 88 Z"
        fill={p.belly}
      />
      {/* Big nostrils with a wisp of smoke */}
      <Ellipse cx={92} cy={84} rx={3} ry={4} fill="#3f6d22" />
      <Ellipse cx={108} cy={84} rx={3} ry={4} fill="#3f6d22" />
      <Path
        d="M 88 76 Q 84 72 87 68"
        stroke="#b9c7d4"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.8}
      />
      {/* Mouth with tiny fangs */}
      <Path
        d="M 92 93 Q 100 98 108 93"
        stroke="#3f6d22"
        strokeWidth={2.2}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M 93 93 L 95 97 L 97 93 Z" fill="#ffffff" />
      <Path d="M 103 93 L 105 97 L 107 93 Z" fill="#ffffff" />

      {/* Brow ridges over the eyes */}
      <Path
        d="M 74 61 Q 82 57 90 61"
        stroke={p.bodyDark}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 110 61 Q 118 57 126 61"
        stroke={p.bodyDark}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />

      <Eyes r={6} />
      <Circle cx={74} cy={84} r={5.5} fill={p.blush} opacity={0.45} />
      <Circle cx={126} cy={84} r={5.5} fill={p.blush} opacity={0.45} />
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
