import { Asset } from 'expo-asset';
import { useGLTF as useDreiGLTF, useAnimations } from '@react-three/drei';
import { type ObjectMap } from '@react-three/fiber';
import { type GLTF } from 'three-stdlib';

/**
 * Platform split for GLTF helpers:
 * - web (this file): Metro asset module ids must be resolved to URLs
 *   before drei's DOM loader can fetch them
 * - native (gltf.native.ts): drei/native handles module ids directly
 */

export { useAnimations };

export function useGLTF(source: number | string): GLTF & ObjectMap {
  const uri = typeof source === 'number' ? Asset.fromModule(source).uri : source;
  return useDreiGLTF(uri) as GLTF & ObjectMap;
}
