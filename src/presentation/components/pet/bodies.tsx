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
  /** Horizontal gaze shift: pupils and highlights move together so the
      eyes look toward the snout on 3/4-view heads (negative = left). */
  dx?: number;
  color?: string;
}

/** Shared eyes with highlight (anchor positions fixed by the glasses layer). */
function Eyes({ r = 6.5, dx = 0, color = '#2b2b2b' }: EyeProps) {
  const hx = dx === 0 ? r * 0.35 : Math.sign(dx) * r * 0.35;
  return (
    <G>
      <Circle cx={82 + dx} cy={70} r={r} fill={color} />
      <Circle cx={118 + dx} cy={70} r={r} fill={color} />
      <Circle cx={82 + dx + hx} cy={70 - r * 0.35} r={r * 0.32} fill="#ffffff" />
      <Circle cx={118 + dx + hx} cy={70 - r * 0.35} r={r * 0.32} fill="#ffffff" />
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

      {/* Chunky low body; the big head sits directly on it (capybaras have
          no visible neck — see assets/brand). The scarf layer draws on top
          of the junction, wrapping the base of the head. */}
      <Path
        d="M 48 146
           Q 48 96 100 92
           Q 152 96 152 146
           Q 152 180 126 184
           L 74 184
           Q 48 180 48 146 Z"
        fill="url(#capyBody)"
      />
      {/* Soft belly (same hue family, low contrast) */}
      <Ellipse cx={100} cy={150} rx={32} ry={27} fill={p.belly} opacity={0.5} />
      {/* Fur texture: short strokes on the flanks */}
      <Path
        d="M 58 134 L 54 144 M 66 120 L 62 130 M 142 134 L 146 144 M 134 120 L 138 130"
        stroke={p.bodyDark}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.4}
      />
      {/* Little arms curling onto the belly, like holding the mate cup */}
      <Path
        d="M 62 116 Q 54 140 78 148"
        stroke={p.bodyDark}
        strokeWidth={13}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 138 116 Q 146 140 122 148"
        stroke={p.bodyDark}
        strokeWidth={13}
        strokeLinecap="round"
        fill="none"
      />
      <Ellipse cx={82} cy={149} rx={9} ry={7} fill={p.bodyDark} />
      <Ellipse cx={118} cy={149} rx={9} ry={7} fill={p.bodyDark} />
      <Path
        d="M 79 154 L 79 146 M 84 154 L 84 147 M 116 154 L 116 147 M 121 154 L 121 146"
        stroke="#6d4a2c"
        strokeWidth={1.8}
        strokeLinecap="round"
      />

      {/* Feet splayed forward, soles facing the viewer (reference pose) */}
      <Ellipse cx={68} cy={179} rx={17} ry={11} fill={p.bodyDark} transform="rotate(-10 68 179)" />
      <Ellipse cx={132} cy={179} rx={17} ry={11} fill={p.bodyDark} transform="rotate(10 132 179)" />
      <Path
        d="M 61 186 L 63 176 M 68 188 L 69 177 M 75 186 L 75 177 M 125 186 L 125 177 M 132 188 L 131 177 M 139 186 L 137 176"
        stroke="#6d4a2c"
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Head in 3/4 view like the brand art: high dome at the back-right,
          snout sloping down-left into a blunt rounded tip */}
      <Defs>
        <LinearGradient id="capyHead" x1="0.1" y1="0" x2="0.4" y2="1">
          <Stop offset="0" stopColor="#cd9e69" />
          <Stop offset="1" stopColor={p.body} />
        </LinearGradient>
      </Defs>
      <Path
        d="M 150 72
           Q 150 33 112 29
           Q 84 26 64 40
           Q 50 50 44 66
           Q 40 74 41 84
           Q 42 93 54 97
           Q 72 102 96 100
           Q 130 102 143 92
           Q 150 86 150 72 Z"
        fill="url(#capyHead)"
      />
      {/* Bridge line hinting the snout slope (depth) */}
      <Path
        d="M 72 56 Q 58 58 50 64"
        stroke={p.bodyDark}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.3}
      />
      {/* Soft shading under the jaw (depth) */}
      <Path
        d="M 56 94 Q 76 101 100 99 Q 130 101 142 92 Q 132 98 100 97 Q 72 98 56 94 Z"
        fill={p.bodyDark}
        opacity={0.25}
      />
      {/* Highlight on the dome (depth) */}
      <Path
        d="M 94 36 Q 122 34 138 50"
        stroke="#e8c996"
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
        opacity={0.5}
      />

      {/* Small round ears sitting ON the dome outline */}
      <Circle cx={137} cy={37} r={9} fill={p.bodyDark} />
      <Circle cx={136} cy={38} r={4.5} fill="#7a5732" />
      <Circle cx={98} cy={28} r={8.5} fill={p.bodyDark} />
      <Circle cx={97} cy={29} r={4.2} fill="#7a5732" />
      {/* Crown fur strands between the ears */}
      <Path
        d="M 114 29 Q 117 22 123 23 M 122 30 Q 127 25 132 28"
        stroke={p.bodyDark}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />

      {/* Single eyebrow over the visible eye (profile view) */}
      <Path
        d="M 74 54 Q 83 50 92 54"
        stroke={p.bodyDark}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.7}
      />

      {/* Small nose patch tucked into the snout tip (inside the outline) */}
      <Path
        d="M 46 64
           Q 48 58 56 60
           Q 61 63 58 69
           Q 54 73 48 70
           Q 44 68 46 64 Z"
        fill="#6d4c2e"
      />
      <Ellipse cx={51} cy={65} rx={1.8} ry={2.5} fill="#4c3118" transform="rotate(-20 51 65)" />
      {/* Smile under the snout tip */}
      <Path
        d="M 45 86 Q 55 92 68 89"
        stroke="#6d4c2e"
        strokeWidth={2.2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Single big warm eye — profile heads show only one (the far eye
          would be on the other side of the face) */}
      <Circle cx={84} cy={66} r={8.5} fill="#3a2a1c" />
      <Circle cx={81.5} cy={63.5} r={2.9} fill="#ffffff" />
      <Circle cx={87} cy={70} r={1.4} fill="#ffffff" opacity={0.7} />
      <Circle cx={70} cy={86} r={6.5} fill={p.blush} opacity={0.55} />
      <Circle cx={125} cy={87} r={6} fill={p.blush} opacity={0.5} />
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
