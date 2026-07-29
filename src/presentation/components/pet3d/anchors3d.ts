import { type PetSpeciesId } from '@/domain/entities/Pet';

/**
 * 3D anchor points per species, in scene units (pets stand ~2.4 tall on y=0).
 * Equipment meshes attach to these so one item fits every species.
 */

export type Vec3 = [number, number, number];

export interface Anchors3D {
  /** Center of the head sphere. */
  head: Vec3;
  /** Head radius (equipment scales off this). */
  headR: number;
  /** Top of the head (hats). */
  headTop: Vec3;
  /** Eye line: y, z (front surface) and half-separation on x. */
  eyes: { y: number; z: number; sep: number };
  /** Neck ring center (scarves / coats). */
  neck: Vec3;
  /** Front feet centers (shoes). */
  feet: [Vec3, Vec3];
}

export const ANCHORS_3D: Record<PetSpeciesId, Anchors3D> = {
  // Standing quadruped: long barrel body, boxy head forward
  capybara: {
    head: [0, 1.5, 0.78],
    headR: 0.58,
    headTop: [0, 1.96, 0.66],
    eyes: { y: 1.62, z: 1.1, sep: 0.3 },
    neck: [0, 1.2, 0.42],
    feet: [
      [-0.3, 0.1, 0.6],
      [0.3, 0.1, 0.6],
    ],
  },
  // Sitting cat: haunches + upright torso, round head on top
  kitten: {
    head: [0, 1.78, 0.25],
    headR: 0.52,
    headTop: [0, 2.22, 0.2],
    eyes: { y: 1.86, z: 0.72, sep: 0.26 },
    neck: [0, 1.42, 0.25],
    feet: [
      [-0.2, 0.1, 0.55],
      [0.2, 0.1, 0.55],
    ],
  },
  // Sitting upright dragon
  dragon: {
    head: [0, 1.85, 0.2],
    headR: 0.55,
    headTop: [0, 2.3, 0.14],
    eyes: { y: 1.95, z: 0.66, sep: 0.26 },
    neck: [0, 1.48, 0.18],
    feet: [
      [-0.32, 0.1, 0.55],
      [0.32, 0.1, 0.55],
    ],
  },
};
