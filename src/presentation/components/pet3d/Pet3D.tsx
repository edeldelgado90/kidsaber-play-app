import React, { useRef, Suspense } from 'react';
import { View } from 'react-native';
import { useFrame } from '@react-three/fiber';
import { type Group } from 'three';
import { type PetSpeciesId, type EquipSlot } from '@/domain/entities/Pet';
import { Canvas } from './PetCanvas';
import { PetModel } from './models';
import { Equipment3D } from './equipment3d';

/**
 * 3D pet viewport (three.js via react-three-fiber; expo-gl on native,
 * WebGL on web). The pet gently sways in-scene; one-shot reactions
 * (feed/love/happy) are applied by AnimatedPet to the whole viewport.
 */

interface SceneProps {
  speciesId: PetSpeciesId;
  equipped: Partial<Record<EquipSlot, string | null>>;
}

function SwayingPet({ speciesId, equipped }: SceneProps) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    // Rest at a 3/4 angle (shows the snout/side volume) and sway around it
    group.current.rotation.y = 0.35 + Math.sin(t * 0.6) * 0.25;
    group.current.position.y = Math.sin(t * 1.4) * 0.03;
  });

  return (
    <group ref={group}>
      <PetModel speciesId={speciesId} />
      <Equipment3D speciesId={speciesId} equipped={equipped} />
    </group>
  );
}

interface Pet3DProps extends SceneProps {
  size: number;
}

// Canvas is a DOM element on web and a GLView on native, so it takes a plain
// style object rather than a StyleSheet entry.
const canvasStyle = { width: '100%', height: '100%', backgroundColor: 'transparent' };

export function Pet3D({ speciesId, equipped, size }: Pet3DProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        style={canvasStyle}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 5, 4]} intensity={1.3} />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} />
        {/* Pet spans y 0..~2.4; shift it down so its center faces the camera */}
        <group position={[0, -1.15, 0]}>
          <Suspense fallback={null}>
            <SwayingPet speciesId={speciesId} equipped={equipped} />
          </Suspense>
          {/* Soft ground disc so the pet doesn't float */}
          <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.5, 32]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.08} />
          </mesh>
        </group>
      </Canvas>
    </View>
  );
}
