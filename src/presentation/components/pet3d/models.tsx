import React from 'react';
import { type PetSpeciesId } from '@/domain/entities/Pet';
import { SPECIES_PALETTES } from '../pet/petSpriteTheme';
import { ANCHORS_3D } from './anchors3d';

/**
 * Procedural toy-style models with real animal anatomy: distinct head,
 * torso, legs and species silhouettes (no external GLB assets). All meshes
 * reuse the shared anchor layout (anchors3d.ts) so equipment fits.
 */

const EYE_COLOR = '#2f2013';

function Eye({ x, y, z, r = 0.09 }: { x: number; y: number; z: number; r?: number }) {
  return (
    <group>
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[r, 24, 24]} />
        <meshToonMaterial color={EYE_COLOR} />
      </mesh>
      <mesh position={[x - r * 0.35, y + r * 0.4, z + r * 0.75]}>
        <sphereGeometry args={[r * 0.3, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Blush({ x, y, z, color }: { x: number; y: number; z: number; color: string }) {
  return (
    <mesh position={[x, y, z]} scale={[1, 0.7, 0.35]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshToonMaterial color={color} transparent opacity={0.75} />
    </mesh>
  );
}

function Leg({
  x,
  z,
  color,
  footColor,
  r = 0.14,
  h = 0.55,
}: {
  x: number;
  z: number;
  color: string;
  footColor: string;
  r?: number;
  h?: number;
}) {
  return (
    <group>
      <mesh position={[x, h / 2 + 0.05, z]}>
        <cylinderGeometry args={[r, r * 1.05, h, 16]} />
        <meshToonMaterial color={color} />
      </mesh>
      <mesh position={[x, 0.08, z + 0.05]} scale={[1, 0.5, 1.3]}>
        <sphereGeometry args={[r * 1.15, 16, 16]} />
        <meshToonMaterial color={footColor} />
      </mesh>
    </group>
  );
}

export function CapybaraModel() {
  const p = SPECIES_PALETTES.capybara;
  const a = ANCHORS_3D.capybara;
  return (
    <group>
      {/* Long barrel body (higher at the rump, like the real animal) */}
      <mesh position={[0, 0.98, -0.12]} scale={[0.82, 0.78, 1.32]} rotation={[-0.06, 0, 0]}>
        <sphereGeometry args={[0.78, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Chest, blending body into neck */}
      <mesh position={[0, 1.05, 0.42]} scale={[0.7, 0.72, 0.7]}>
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Boxy head */}
      <mesh position={a.head} scale={[0.78, 0.82, 0.92]}>
        <sphereGeometry args={[a.headR, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Tall blunt snout — the capybara profile */}
      <mesh position={[0, 1.34, 1.12]} scale={[0.64, 0.8, 0.72]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Nose on top of the snout tip */}
      <mesh position={[0, 1.56, 1.34]} scale={[1.3, 0.55, 0.55]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshToonMaterial color="#5b3d22" />
      </mesh>
      {/* Mouth hint under the snout */}
      <mesh position={[0, 1.1, 1.36]} scale={[1.3, 0.3, 0.3]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshToonMaterial color="#7a5732" />
      </mesh>
      {/* Small ears toward the back of the head */}
      <mesh position={[-0.28, 1.94, 0.5]} scale={[1, 1, 0.6]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={[0.28, 1.94, 0.5]} scale={[1, 1, 0.6]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Face */}
      <Eye x={-a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Eye x={a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Blush x={-0.4} y={1.4} z={0.98} color={p.blush} />
      <Blush x={0.4} y={1.4} z={0.98} color={p.blush} />
      {/* Four sturdy legs */}
      <Leg x={-0.3} z={0.55} color={p.body} footColor={p.bodyDark} />
      <Leg x={0.3} z={0.55} color={p.body} footColor={p.bodyDark} />
      <Leg x={-0.34} z={-0.68} color={p.body} footColor={p.bodyDark} />
      <Leg x={0.34} z={-0.68} color={p.body} footColor={p.bodyDark} />
    </group>
  );
}

export function KittenModel() {
  const p = SPECIES_PALETTES.kitten;
  const a = ANCHORS_3D.kitten;
  return (
    <group>
      {/* Haunches (wide, low) */}
      <mesh position={[0, 0.55, -0.15]} scale={[1.15, 0.8, 1]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Upright torso, narrower at the shoulders */}
      <mesh position={[0, 1.05, 0.12]} scale={[0.8, 1.05, 0.75]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Chest bib */}
      <mesh position={[0, 0.95, 0.45]} scale={[0.65, 0.85, 0.45]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      {/* Straight front legs */}
      <mesh position={[-0.2, 0.5, 0.45]}>
        <cylinderGeometry args={[0.1, 0.11, 0.8, 16]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      <mesh position={[0.2, 0.5, 0.45]}>
        <cylinderGeometry args={[0.1, 0.11, 0.8, 16]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      <mesh position={[-0.2, 0.1, 0.52]} scale={[1, 0.55, 1.3]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      <mesh position={[0.2, 0.1, 0.52]} scale={[1, 0.55, 1.3]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      {/* Head */}
      <mesh position={a.head} scale={[1, 0.95, 0.95]}>
        <sphereGeometry args={[a.headR, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Muzzle */}
      <mesh position={[0, 1.64, 0.62]} scale={[0.95, 0.68, 0.7]}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      {/* Pink nose */}
      <mesh position={[0, 1.73, 0.8]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.06, 0.08, 12]} />
        <meshToonMaterial color="#e0707e" />
      </mesh>
      {/* Ears with inner */}
      <mesh position={[-0.28, 2.28, 0.12]} rotation={[0, 0, 0.28]}>
        <coneGeometry args={[0.18, 0.42, 4]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      <mesh position={[0.28, 2.28, 0.12]} rotation={[0, 0, -0.28]}>
        <coneGeometry args={[0.18, 0.42, 4]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      <mesh position={[-0.27, 2.26, 0.18]} rotation={[0, 0, 0.28]}>
        <coneGeometry args={[0.1, 0.24, 4]} />
        <meshToonMaterial color="#e8949c" />
      </mesh>
      <mesh position={[0.27, 2.26, 0.18]} rotation={[0, 0, -0.28]}>
        <coneGeometry args={[0.1, 0.24, 4]} />
        <meshToonMaterial color="#e8949c" />
      </mesh>
      {/* Tail wrapped around the front, like a sitting cat */}
      <mesh position={[0.45, 0.16, 0.3]} rotation={[Math.PI / 2, 0, 1.9]}>
        <torusGeometry args={[0.42, 0.08, 12, 24, 3.6]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      <mesh position={[0.02, 0.16, 0.72]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Face */}
      <Eye x={-a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Eye x={a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Blush x={-0.36} y={1.66} z={0.58} color={p.blush} />
      <Blush x={0.36} y={1.66} z={0.58} color={p.blush} />
    </group>
  );
}

export function DragonModel() {
  const p = SPECIES_PALETTES.dragon;
  const a = ANCHORS_3D.dragon;
  return (
    <group>
      {/* Haunches */}
      <mesh position={[0, 0.5, -0.1]} scale={[1.1, 0.75, 0.95]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Upright torso */}
      <mesh position={[0, 1.08, 0.08]} scale={[0.85, 1.1, 0.78]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Belly plates */}
      <mesh position={[0, 1.0, 0.44]} scale={[0.68, 0.95, 0.45]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      {/* Little arms */}
      <mesh position={[-0.44, 1.15, 0.28]} rotation={[0.3, 0, 0.5]}>
        <cylinderGeometry args={[0.08, 0.09, 0.42, 12]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      <mesh position={[0.44, 1.15, 0.28]} rotation={[0.3, 0, -0.5]}>
        <cylinderGeometry args={[0.08, 0.09, 0.42, 12]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.32, 0.12, 0.5]} scale={[1, 0.55, 1.35]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={[0.32, 0.12, 0.5]} scale={[1, 0.55, 1.35]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Head */}
      <mesh position={a.head} scale={[1, 0.9, 0.95]}>
        <sphereGeometry args={[a.headR, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Snout with nostrils */}
      <mesh position={[0, 1.76, 0.6]} scale={[0.9, 0.62, 0.85]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      <mesh position={[-0.09, 1.85, 0.84]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshToonMaterial color="#3f6d22" />
      </mesh>
      <mesh position={[0.09, 1.85, 0.84]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshToonMaterial color="#3f6d22" />
      </mesh>
      {/* Horns */}
      <mesh position={[-0.2, 2.38, 0.08]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.09, 0.34, 12]} />
        <meshToonMaterial color="#f5e9c8" />
      </mesh>
      <mesh position={[0.2, 2.38, 0.08]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.09, 0.34, 12]} />
        <meshToonMaterial color="#f5e9c8" />
      </mesh>
      {/* Crest spikes down the spine */}
      <mesh position={[0, 2.32, -0.12]} rotation={[-0.4, 0, 0]}>
        <coneGeometry args={[0.1, 0.28, 4]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={[0, 1.75, -0.48]} rotation={[-0.9, 0, 0]}>
        <coneGeometry args={[0.09, 0.24, 4]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={[0, 1.1, -0.62]} rotation={[-1.2, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.78, 1.35, -0.32]} rotation={[0.15, 0, 1.15]} scale={[1, 1, 0.2]}>
        <coneGeometry args={[0.42, 0.9, 6]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={[0.78, 1.35, -0.32]} rotation={[0.15, 0, -1.15]} scale={[1, 1, 0.2]}>
        <coneGeometry args={[0.42, 0.9, 6]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Tail with spade tip */}
      <mesh position={[0.55, 0.28, -0.4]} rotation={[Math.PI / 2, 0, 2.1]}>
        <torusGeometry args={[0.45, 0.09, 12, 24, 3]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      <mesh position={[0.1, 0.28, 0.28]} rotation={[0, 0, 3.4]}>
        <coneGeometry args={[0.12, 0.26, 4]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Face */}
      <Eye x={-a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Eye x={a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Blush x={-0.36} y={1.72} z={0.52} color={p.blush} />
      <Blush x={0.36} y={1.72} z={0.52} color={p.blush} />
    </group>
  );
}

const MODELS: Record<PetSpeciesId, React.ComponentType> = {
  capybara: CapybaraModel,
  kitten: KittenModel,
  dragon: DragonModel,
};

export function PetModel({ speciesId }: { speciesId: PetSpeciesId }) {
  const Model = MODELS[speciesId];
  return <Model />;
}
