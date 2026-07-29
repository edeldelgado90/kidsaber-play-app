import React from 'react';
import { type PetSpeciesId } from '@/domain/entities/Pet';
import { SPECIES_PALETTES } from '../pet/petSpriteTheme';
import { ANCHORS_3D } from './anchors3d';

/**
 * Procedural low-poly "toy" models built from spheres/cones with toon
 * materials — no external GLB assets. Each species reuses the shared
 * anchor layout (anchors3d.ts) so equipment fits all of them.
 */

const EYE_COLOR = '#2f2013';

function Eye({ x, y, z, r = 0.085 }: { x: number; y: number; z: number; r?: number }) {
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
      <sphereGeometry args={[0.11, 16, 16]} />
      <meshToonMaterial color={color} transparent opacity={0.75} />
    </mesh>
  );
}

export function CapybaraModel() {
  const p = SPECIES_PALETTES.capybara;
  const a = ANCHORS_3D.capybara;
  return (
    <group>
      {/* Loaf body */}
      <mesh position={[0, 0.74, 0]} scale={[1.05, 0.85, 0.92]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Belly patch */}
      <mesh position={[0, 0.6, 0.58]} scale={[0.85, 0.7, 0.55]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      {/* Head (slightly flattened) */}
      <mesh position={a.head} scale={[1, 0.85, 0.92]}>
        <sphereGeometry args={[a.headR, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Blunt boxy snout */}
      <mesh position={[0, 1.5, 0.82]} scale={[0.78, 0.62, 0.75]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 1.63, 1.1]} scale={[1.25, 0.7, 0.55]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshToonMaterial color="#5b3d22" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.36, 2.06, 0.1]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={[0.36, 2.06, 0.1]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Face */}
      <Eye x={-a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Eye x={a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Blush x={-0.42} y={1.52} z={0.68} color={p.blush} />
      <Blush x={0.42} y={1.52} z={0.68} color={p.blush} />
      {/* Front feet */}
      <mesh position={a.feet[0]} scale={[1, 0.55, 1.3]}>
        <sphereGeometry args={[0.19, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={a.feet[1]} scale={[1, 0.55, 1.3]}>
        <sphereGeometry args={[0.19, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Hind feet peeking at the sides */}
      <mesh position={[-0.78, 0.16, 0.05]} scale={[1, 0.6, 1.1]}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={[0.78, 0.16, 0.05]} scale={[1, 0.6, 1.1]}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
    </group>
  );
}

export function KittenModel() {
  const p = SPECIES_PALETTES.kitten;
  const a = ANCHORS_3D.kitten;
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.76, 0]} scale={[0.95, 0.9, 0.88]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Chest */}
      <mesh position={[0, 0.62, 0.55]} scale={[0.75, 0.72, 0.5]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      {/* Head */}
      <mesh position={a.head} scale={[1, 0.92, 0.92]}>
        <sphereGeometry args={[a.headR, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Muzzle */}
      <mesh position={[0, 1.52, 0.62]} scale={[0.8, 0.55, 0.6]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      {/* Pink nose */}
      <mesh position={[0, 1.63, 0.82]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.07, 0.09, 12]} />
        <meshToonMaterial color="#e0707e" />
      </mesh>
      {/* Ears (outer + inner) */}
      <mesh position={[-0.34, 2.22, 0.08]} rotation={[0, 0, 0.25]}>
        <coneGeometry args={[0.2, 0.42, 4]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      <mesh position={[0.34, 2.22, 0.08]} rotation={[0, 0, -0.25]}>
        <coneGeometry args={[0.2, 0.42, 4]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      <mesh position={[-0.33, 2.2, 0.14]} rotation={[0, 0, 0.25]}>
        <coneGeometry args={[0.11, 0.24, 4]} />
        <meshToonMaterial color="#e8949c" />
      </mesh>
      <mesh position={[0.33, 2.2, 0.14]} rotation={[0, 0, -0.25]}>
        <coneGeometry args={[0.11, 0.24, 4]} />
        <meshToonMaterial color="#e8949c" />
      </mesh>
      {/* Curled tail */}
      <mesh position={[0.85, 0.9, -0.25]} rotation={[0.4, 0, -0.6]}>
        <torusGeometry args={[0.4, 0.09, 12, 24, 3.6]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Face */}
      <Eye x={-a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Eye x={a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Blush x={-0.4} y={1.54} z={0.6} color={p.blush} />
      <Blush x={0.4} y={1.54} z={0.6} color={p.blush} />
      {/* Front paws */}
      <mesh position={a.feet[0]} scale={[1, 0.6, 1.25]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      <mesh position={a.feet[1]} scale={[1, 0.6, 1.25]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
    </group>
  );
}

export function DragonModel() {
  const p = SPECIES_PALETTES.dragon;
  const a = ANCHORS_3D.dragon;
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.76, 0]} scale={[0.98, 0.9, 0.9]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Belly plates */}
      <mesh position={[0, 0.6, 0.58]} scale={[0.75, 0.75, 0.5]}>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      {/* Head */}
      <mesh position={a.head} scale={[1, 0.9, 0.9]}>
        <sphereGeometry args={[a.headR, 32, 32]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 1.54, 0.62]} scale={[0.85, 0.6, 0.7]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshToonMaterial color={p.belly} />
      </mesh>
      {/* Horns */}
      <mesh position={[-0.24, 2.28, 0.02]} rotation={[0, 0, 0.18]}>
        <coneGeometry args={[0.1, 0.36, 12]} />
        <meshToonMaterial color="#f5e9c8" />
      </mesh>
      <mesh position={[0.24, 2.28, 0.02]} rotation={[0, 0, -0.18]}>
        <coneGeometry args={[0.1, 0.36, 12]} />
        <meshToonMaterial color="#f5e9c8" />
      </mesh>
      {/* Crest spikes */}
      <mesh position={[0, 2.24, -0.18]} rotation={[-0.5, 0, 0]}>
        <coneGeometry args={[0.11, 0.3, 4]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={[0, 1.9, -0.52]} rotation={[-0.9, 0, 0]}>
        <coneGeometry args={[0.1, 0.26, 4]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Wings (flattened cones pointing out) */}
      <mesh position={[-0.85, 1.25, -0.3]} rotation={[0.15, 0, 1.15]} scale={[1, 1, 0.22]}>
        <coneGeometry args={[0.45, 0.95, 6]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={[0.85, 1.25, -0.3]} rotation={[0.15, 0, -1.15]} scale={[1, 1, 0.22]}>
        <coneGeometry args={[0.45, 0.95, 6]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Tail with spade tip */}
      <mesh position={[0.8, 0.5, -0.5]} rotation={[1.2, 0.4, -0.5]}>
        <torusGeometry args={[0.45, 0.1, 12, 24, 3]} />
        <meshToonMaterial color={p.body} />
      </mesh>
      <mesh position={[1.25, 0.75, -0.6]} rotation={[0, 0, -0.8]}>
        <coneGeometry args={[0.14, 0.3, 4]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      {/* Face */}
      <Eye x={-a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Eye x={a.eyes.sep} y={a.eyes.y} z={a.eyes.z} />
      <Blush x={-0.4} y={1.56} z={0.58} color={p.blush} />
      <Blush x={0.4} y={1.56} z={0.58} color={p.blush} />
      {/* Feet */}
      <mesh position={a.feet[0]} scale={[1, 0.6, 1.3]}>
        <sphereGeometry args={[0.19, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
      <mesh position={a.feet[1]} scale={[1, 0.6, 1.3]}>
        <sphereGeometry args={[0.19, 16, 16]} />
        <meshToonMaterial color={p.bodyDark} />
      </mesh>
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
