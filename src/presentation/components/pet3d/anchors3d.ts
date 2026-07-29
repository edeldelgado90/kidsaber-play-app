import { type PetSpeciesId } from '@/domain/entities/Pet';

/**
 * 3D anchor points per species, in scene units. Models are normalized by
 * PetModel (feet on y=0, centered, species target height), so anchors are
 * estimated against that normalized frame and tuned visually.
 */

export type Vec3 = [number, number, number];

export interface Anchors3D {
  /** Top of the head (hats). */
  headTop: Vec3;
  /** Approximate head radius (hats scale off this). */
  headR: number;
  /** Eye line: y, z (front surface) and half-separation on x. */
  eyes: { y: number; z: number; sep: number };
  /** Neck ring center (scarves / coats). */
  neck: Vec3;
  /** Front feet centers (shoes). */
  feet: [Vec3, Vec3];
}

export const ANCHORS_3D: Record<PetSpeciesId, Anchors3D> = {
  // Standing quadruped, long on z, head at the front
  capybara: {
    headTop: [0, 1.75, 0.72],
    headR: 0.42,
    eyes: { y: 1.38, z: 1.18, sep: 0.26 },
    neck: [0, 1.1, 0.45],
    feet: [
      [-0.38, 0.1, 0.85],
      [0.38, 0.1, 0.85],
    ],
  },
  // Quaternius Shiba Inu (standing quadruped, head at the front)
  shiba: {
    headTop: [0, 1.88, 0.5],
    headR: 0.45,
    eyes: { y: 1.55, z: 0.9, sep: 0.22 },
    neck: [0, 1.3, 0.28],
    feet: [
      [-0.24, 0.1, 0.55],
      [0.24, 0.1, 0.55],
    ],
  },
  // Quaternius toon dragon (bipedal chibi, hovers on Flying_Idle)
  dragon: {
    headTop: [0, 2.2, 0.05],
    headR: 0.5,
    eyes: { y: 1.85, z: 0.46, sep: 0.2 },
    neck: [0, 1.48, 0.02],
    feet: [
      [-0.26, 0.1, 0.12],
      [0.26, 0.1, 0.12],
    ],
  },
};
