import { useGLTF as useDreiGLTF, useAnimations } from '@react-three/drei/native';
import { type ObjectMap } from '@react-three/fiber';
import { type GLTF } from 'three-stdlib';

/**
 * Native side of the GLTF helpers platform split (expo-asset backed).
 */

export { useAnimations };

export function useGLTF(source: number | string): GLTF & ObjectMap {
  return useDreiGLTF(source as never) as GLTF & ObjectMap;
}
