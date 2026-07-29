import { useGLTF as useDreiGLTF, useAnimations } from '@react-three/drei/native';

/**
 * Native side of the GLTF helpers platform split (expo-asset backed).
 */

export { useAnimations };

export function useGLTF(source: number | string): ReturnType<typeof useDreiGLTF> {
  return useDreiGLTF(source as never);
}
