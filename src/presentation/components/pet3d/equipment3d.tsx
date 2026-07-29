import React from 'react';
import { DoubleSide } from 'three';
import { type PetSpeciesId, type EquipSlot } from '@/domain/entities/Pet';
import { Colors } from '@/presentation/theme/tokens';
import { ANCHORS_3D, type Anchors3D } from './anchors3d';

/**
 * 3D cosmetic meshes. Each item builds off the species anchors so a single
 * item definition fits every pet (the 3D paper-doll equivalent).
 */

function HatWool({ a }: { a: Anchors3D }) {
  const [x, y, z] = a.headTop;
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.08, 0]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[a.headR * 0.86, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshToonMaterial color={Colors.brandPrimary} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[a.headR * 0.82, 0.08, 12, 32]} />
        <meshToonMaterial color={Colors.brandPrimaryDark} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshToonMaterial color={Colors.brandSecondary} />
      </mesh>
    </group>
  );
}

function HatCap({ a }: { a: Anchors3D }) {
  const [x, y, z] = a.headTop;
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.06, 0]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[a.headR * 0.84, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshToonMaterial color={Colors.error} />
      </mesh>
      <mesh position={[0, 0.09, a.headR * 0.78]} rotation={[-0.2, 0, 0]} scale={[1, 0.12, 1]}>
        <cylinderGeometry args={[0.3, 0.34, 1, 20]} />
        <meshToonMaterial color="#b91c1c" />
      </mesh>
    </group>
  );
}

function HatParty({ a }: { a: Anchors3D }) {
  const [x, y, z] = a.headTop;
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.32, 0.62, 20]} />
        <meshToonMaterial color={Colors.brandSecondary} />
      </mesh>
      <mesh position={[0, 0.64, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshToonMaterial color={Colors.error} />
      </mesh>
    </group>
  );
}

function GlassesRound({ a }: { a: Anchors3D }) {
  const { y, z, sep } = a.eyes;
  return (
    <group position={[0, y, z + 0.08]}>
      <mesh position={[-sep, 0, 0]}>
        <torusGeometry args={[0.15, 0.025, 10, 24]} />
        <meshToonMaterial color="#2b2b2b" />
      </mesh>
      <mesh position={[sep, 0, 0]}>
        <torusGeometry args={[0.15, 0.025, 10, 24]} />
        <meshToonMaterial color="#2b2b2b" />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, sep * 2 - 0.28, 8]} />
        <meshToonMaterial color="#2b2b2b" />
      </mesh>
    </group>
  );
}

function GlassesSun({ a }: { a: Anchors3D }) {
  const { y, z, sep } = a.eyes;
  return (
    <group position={[0, y, z + 0.08]}>
      <mesh position={[-sep, 0, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshToonMaterial color="#1f2937" />
      </mesh>
      <mesh position={[sep, 0, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshToonMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, sep * 2 - 0.24, 8]} />
        <meshToonMaterial color="#1f2937" />
      </mesh>
    </group>
  );
}

function CoatScarf({ a }: { a: Anchors3D }) {
  const [x, y, z] = a.neck;
  return (
    <group position={[x, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.14, 14, 32]} />
        <meshToonMaterial color={Colors.error} />
      </mesh>
      <mesh position={[0.28, -0.32, 0.48]} rotation={[0.15, 0, 0.1]}>
        <boxGeometry args={[0.18, 0.5, 0.09]} />
        <meshToonMaterial color="#b91c1c" />
      </mesh>
    </group>
  );
}

function CoatRain() {
  return (
    <mesh position={[0, 0.72, 0]}>
      <cylinderGeometry args={[0.78, 1.12, 1.05, 24, 1, true]} />
      <meshToonMaterial color={Colors.brandSecondary} side={DoubleSide} />
    </mesh>
  );
}

function Shoe({ pos, color }: { pos: [number, number, number]; color: string }) {
  const [x, y, z] = pos;
  return (
    <group position={[x, y - 0.02, z]}>
      <mesh scale={[1, 0.62, 1.35]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshToonMaterial color={color} />
      </mesh>
      <mesh position={[0, -0.1, 0.02]} scale={[1, 0.25, 1.45]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Boot({ pos }: { pos: [number, number, number] }) {
  const [x, y, z] = pos;
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.14, -0.04]}>
        <cylinderGeometry args={[0.19, 0.21, 0.34, 16]} />
        <meshToonMaterial color="#8a5a2b" />
      </mesh>
      <mesh position={[0, -0.03, 0.08]} scale={[1, 0.55, 1.35]}>
        <sphereGeometry args={[0.21, 16, 16]} />
        <meshToonMaterial color="#6d4520" />
      </mesh>
    </group>
  );
}

interface Equipment3DProps {
  speciesId: PetSpeciesId;
  equipped: Partial<Record<EquipSlot, string | null>>;
}

export function Equipment3D({ speciesId, equipped }: Equipment3DProps) {
  const a = ANCHORS_3D[speciesId];
  return (
    <group>
      {equipped.hat === 'hat_wool' && <HatWool a={a} />}
      {equipped.hat === 'hat_cap' && <HatCap a={a} />}
      {equipped.hat === 'hat_party' && <HatParty a={a} />}
      {equipped.glasses === 'glasses_round' && <GlassesRound a={a} />}
      {equipped.glasses === 'glasses_sun' && <GlassesSun a={a} />}
      {equipped.coat === 'coat_scarf' && <CoatScarf a={a} />}
      {equipped.coat === 'coat_rain' && <CoatRain />}
      {equipped.shoes === 'shoes_sneakers' && (
        <group>
          <Shoe pos={a.feet[0]} color={Colors.brandPrimary} />
          <Shoe pos={a.feet[1]} color={Colors.brandPrimary} />
        </group>
      )}
      {equipped.shoes === 'shoes_boots' && (
        <group>
          <Boot pos={a.feet[0]} />
          <Boot pos={a.feet[1]} />
        </group>
      )}
    </group>
  );
}
