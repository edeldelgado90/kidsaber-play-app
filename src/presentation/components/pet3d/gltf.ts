import { Asset } from 'expo-asset';
import { useGLTF as useDreiGLTF, useAnimations } from '@react-three/drei';

/**
 * Platform split for GLTF helpers:
 * - web (this file): Metro asset module ids must be resolved to URLs
 *   before drei's DOM loader can fetch them
 * - native (gltf.native.ts): drei/native handles module ids directly
 */

export { useAnimations };

export function useGLTF(source: number | string): ReturnType<typeof useDreiGLTF> {
  const uri = typeof source === 'number' ? Asset.fromModule(source).uri : source;
  return useDreiGLTF(uri);
}
