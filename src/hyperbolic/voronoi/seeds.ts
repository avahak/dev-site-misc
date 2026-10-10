import * as THREE from 'three';
import { Complex, FundamentalPolygon, GroupElement } from '../types';
import { MobiusTransform } from '../math/mobius';
import { PoincareGeometry } from '../math/poincare';

export interface BaseSeed {
    id: number;
    point: Complex;
    color: THREE.Color;
}

export interface ExpandedSeed {
    point: Complex;
    color: THREE.Color;
}

export interface SeedDataResult {
    dataTexture: THREE.DataTexture;
    seedCount: number;
    R_tex: number;
    margin: number;
}

/**
 * Samples N points uniformly with respect to hyperbolic area inside B(0, a),
 * rejecting candidate points that fall outside fundamental polygon P_0.
 */
export function generateBaseSeeds(
    polygon: FundamentalPolygon,
    count: number,
    prominence: number = 0.7
): BaseSeed[] {
    const seeds: BaseSeed[] = [];
    const a = polygon.metrics.circumradiusH;
    const coshA = Math.cosh(a);

    let attempts = 0;
    const maxAttempts = count * 1000;

    // Map prominence (0.0 to 1.0) to saturation and lightness
    // Prominence 0.0 -> Grayscale (sat 0.0) & Dark (lightness 0.15)
    // Prominence 1.0 -> Colorful (sat 0.85) & Light/Vibrant (lightness 0.6)
    const saturation = prominence * 0.85;
    const lightness = 0.15 + prominence * 0.45;

    while (seeds.length < count && attempts < maxAttempts) {
        attempts++;

        const u = Math.random();
        const v = Math.random();
        const rho = Math.acosh(1 + u * (coshA - 1));
        const r = Math.tanh(rho / 2);
        const theta = 2 * Math.PI * v;

        const candidate: Complex = {
            re: r * Math.cos(theta),
            im: r * Math.sin(theta),
        };

        let inside = true;
        for (let i = 0; i < polygon.sideTests.length; i++) {
            const Tz = MobiusTransform.apply(polygon.sideTests[i], candidate);
            if (Tz.im <= 0) {
                inside = false;
                break;
            }
        }

        if (inside) {
            const hue = seeds.length / count;
            const color = new THREE.Color().setHSL(hue, saturation, lightness);
            seeds.push({
                id: seeds.length,
                point: candidate,
                color,
            });
        }
    }

    console.log("attempts/seed", attempts / count);

    return seeds;
}

/**
 * Filters and expands subgroup orbits S = { h(p_i) } using the cutoff bound:
 * d_H(0, s) <= 3a + 2r_0
 */
export function filterAndExpandSeeds(
    baseSeeds: BaseSeed[],
    subgroup: GroupElement[],
    polygon: FundamentalPolygon,
    margin = 0.25
): { expandedSeeds: ExpandedSeed[]; R_tex: number } {
    const a = polygon.metrics.circumradiusH;
    const R_cutoff = 3 * a + 2 * margin;

    // Euclidean boundary limit for the base texture square frame
    const R_frame_hyp = a + margin;
    const R_tex = Math.tanh(R_frame_hyp / 2);

    const expandedSeeds: ExpandedSeed[] = [];

    for (const seed of baseSeeds) {
        for (const element of subgroup) {
            const transformed = MobiusTransform.apply(element.matrix, seed.point);
            const distFromOrigin = PoincareGeometry.distance({ re: 0, im: 0 }, transformed);

            if (distFromOrigin <= R_cutoff) {
                expandedSeeds.push({
                    point: transformed,
                    color: seed.color,
                });
            }
        }
    }

    console.log("|expandedSeeds|", expandedSeeds.length);
    console.log("R_tex", R_tex);

    return { expandedSeeds, R_tex };
}

/**
 * Packs expanded seed data into a Float32 DataTexture with 2 rows:
 * Row 0 (y=0): Seed position (x, y, 0, 0)
 * Row 1 (y=1): Seed color (r, g, b, 1)
 */
export function createSeedDataTexture(
    expandedSeeds: ExpandedSeed[],
    R_tex: number,
    margin: number
): SeedDataResult {
    const count = expandedSeeds.length;
    const data = new Float32Array(count * 2 * 4);

    for (let i = 0; i < count; i++) {
        const seed = expandedSeeds[i];

        // Row 0: Position
        const posIndex = i * 4;
        data[posIndex + 0] = seed.point.re;
        data[posIndex + 1] = seed.point.im;
        data[posIndex + 2] = 0.0;
        data[posIndex + 3] = 0.0;

        // Row 1: Color
        const colIndex = (count + i) * 4;
        data[colIndex + 0] = seed.color.r;
        data[colIndex + 1] = seed.color.g;
        data[colIndex + 2] = seed.color.b;
        data[colIndex + 3] = 1.0;
    }

    const texture = new THREE.DataTexture(
        data,
        count,
        2,
        THREE.RGBAFormat,
        THREE.FloatType
    );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;

    return {
        dataTexture: texture,
        seedCount: count,
        R_tex,
        margin,
    };
}