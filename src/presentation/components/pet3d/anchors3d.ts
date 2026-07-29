import { type PetSpeciesId } from '@/domain/entities/Pet';

/**
 * 3D anchor points per species, in scene units (pet stands ~2.2 tall on y=0).
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
  capybara: {
    head: [0, 1.62, 0.28],
    headR: 0.62,
    headTop: [0, 2.08, 0.22],
    eyes: { y: 1.74, z: 0.78, sep: 0.3 },
    neck: [0, 1.18, 0.12],
    feet: [
      [-0.45, 0.13, 0.55],
      [0.45, 0.13, 0.55],
    ],
  },
  kitten: {
    head: [0, 1.64, 0.2],
    headR: 0.6,
    headTop: [0, 2.1, 0.15],
    eyes: { y: 1.76, z: 0.72, sep: 0.28 },
    neck: [0, 1.2, 0.08],
    feet: [
      [-0.42, 0.13, 0.55],
      [0.42, 0.13, 0.55],
    ],
  },
  dragon: {
    head: [0, 1.66, 0.15],
    headR: 0.62,
    headTop: [0, 2.14, 0.1],
    eyes: { y: 1.78, z: 0.7, sep: 0.28 },
    neck: [0, 1.2, 0.05],
    feet: [
      [-0.44, 0.13, 0.55],
      [0.44, 0.13, 0.55],
    ],
  },
};
