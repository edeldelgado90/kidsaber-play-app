import React, { useEffect, useMemo, useRef } from 'react';
import { Box3, Vector3, type Group } from 'three';
import { type PetSpeciesId } from '@/domain/entities/Pet';
import { useGLTF, useAnimations } from './gltf';

/**
 * Real 3D pet models (GLB assets, credits in the About screen):
 * - capybara: "Capybara" by Poly by Google (CC-BY 3.0), static
 * - kitten:   "Cat" by Quaternius (CC0), skeletal animations
 * - dragon:   "Dragon" by Quaternius (CC0), skeletal animations
 * Models are normalized at runtime (target height, feet on y=0, centered).
 */

import CAPYBARA_MODEL from '../../../../assets/models/capybara.glb';
import CAT_MODEL from '../../../../assets/models/cat.glb';
import DRAGON_MODEL from '../../../../assets/models/dragon.glb';

const MODEL_SOURCES: Record<PetSpeciesId, number> = {
  capybara: CAPYBARA_MODEL,
  kitten: CAT_MODEL,
  dragon: DRAGON_MODEL,
};

/** Idle clip per species (clip names ship inside the GLB files). */
const IDLE_CLIPS: Record<PetSpeciesId, string | null> = {
  capybara: null, // static model; the viewport sway keeps it alive
  kitten: 'CharacterArmature|Idle',
  dragon: 'CharacterArmature|Flying_Idle',
};

/** Target height in scene units (the capybara is long, keep it lower). */
const TARGET_HEIGHTS: Record<PetSpeciesId, number> = {
  capybara: 1.7,
  kitten: 2.2,
  dragon: 2.2,
};

export function PetModel({ speciesId }: { speciesId: PetSpeciesId }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_SOURCES[speciesId] as unknown as string);
  const { actions } = useAnimations(animations, group);

  // Play the species idle clip when available
  useEffect(() => {
    const clip = IDLE_CLIPS[speciesId];
    const action = clip ? actions?.[clip] : undefined;
    action?.reset().fadeIn(0.2).play();
    return () => {
      action?.fadeOut(0.2).stop();
    };
  }, [actions, speciesId]);

  // Skinned meshes can be culled wrongly while animating off-origin
  useEffect(() => {
    scene.traverse(obj => {
      obj.frustumCulled = false;
    });
  }, [scene]);

  // Normalize: scale to target height, feet on the ground, centered on x/z
  const { scale, position } = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const safeHeight = size.y > 0.001 ? size.y : 1;
    const s = TARGET_HEIGHTS[speciesId] / safeHeight;
    return {
      scale: s,
      position: [-center.x * s, -box.min.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene, speciesId]);

  return (
    <group ref={group} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}
