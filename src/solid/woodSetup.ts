/**
 * Tree Branching Model 
 * 
 * Geometric Growth Rules
 * ---------------------- 
 * - Alternate Pattern (n = 1): 
 * Single branches emerge sequentially. Consecutive heights shift the starting angle 
 * by a fixed fraction (1/2, 1/3, 2/5, or 3/8) of full circle. Height steps between 
 * branches are short and highly uniform.
 * 
 * - Whorled Pattern (n >= 2): 
 * Multiple branches emerge at a single height. Branches within the same whorl are 
 * spaced uniformly (360 deg / n). The starting angle between consecutive whorl 
 * heights is random. Height steps between whorls are long and roughly constant.
 * 
 * Species Categorization
 * ---------------------- 
 * Alternate (n = 1)
 * Oaks, Elms, Beeches, Birches, Willows, and Fruit trees.
 * 
 * Opposite (n = 2)
 * Maples, Ashes, Dogwoods, and Horse Chestnuts.
 * 
 * True Whorled (n >= 3)
 * Pines, Spruces, Firs, and Douglas-firs.
 */

import { FFT } from "./utils/fft";
import { clamp, generateRandomWeights, lerp, Point3D, sample, scale, smoothstep } from "./utils/misc";


export interface Branch {
    zStart: number;                         // z for branch start at stem
    xyAngle: number;                        // angular direction around the stem
    initialSlope: number;                   // slope at the stem
    death: number;                          // time of death
    radius: number;                         // radius of the branch
}

export interface WoodConfig {
    name: string;                           // wood name
    zRange: number;                         // range for z-tiling

    whorlSizes: [number, number][];         // [number of branches within a whorl, probability][]
    whorlNum: number;                       // number of whorls within the tiling range
    whorlOffsetDispersion: number;          // standard deviation for z-offsets in log-scale
    verticalSlopeRange: [number, number];   // range for vertical slope at stem
    radiusRange: [number, number],          // range for radii
    deathRange: [number, number];           // range for knot deaths
    medullaryRayFrequency: number;          // frequency of medullary rays
    alternateAngle?: number;                // (only for whorlSize=1) angular offset between consecutive branches, should be (1/2, 1/3, 2/5, or 3/8) of full circle or just 1/\phi^2=(3-sqrt(5))*pi ~ 2.4 radians

    knotColor: [number, number, number];

    // Parameters for the profile:

    heartwoodColor: Point3D;
    sapwoodColor: Point3D;
    heartwoodRadius: number;       // fraction of radius where transition centers, e.g. 0.4
    transitionWidth: number;       // width of transition zone (0 = sharp), e.g. 0.1
    ageAtOne: number;              // number of complete rings from r=0 to r=1 (>=1)
    ringWidthDispersion: number;   // scales variation in ring widths
    ringWidthNoiseAlpha: number;   // alpha for noise generation for ring widths
    ringShapeExponent: number;     // >=1, higher = wider earlywood and sharper latewood boundary
    earlywoodLighten: number;      // >1 multiplier that lightens base colour for earlywood
    latewoodDarken: number;        // <1 multiplier that darkens base colour for latewood
    yearlyNoiseAmplitude: number;  // amplitude of yearly noise
    grainNoiseAmplitude: number;   // amplitude of grain noise
}


export class WoodSetup {
    woodConfig: WoodConfig;
    branches: Branch[];
    profile: Float32Array;

    constructor(profileWidth: number, woodConfig: WoodConfig) {
        this.woodConfig = woodConfig;
        this.branches = this.generateBranches();
        this.profile = this.generateRadialProfile(profileWidth);
    }

    /**
     * Generates branch configuration following woodConfig. 
     */
    generateBranches(): Branch[] {
        const config = this.woodConfig;
        const branches: Branch[] = [];
        const isAlternatePattern = (config.whorlSizes.length == 1) && (config.whorlSizes[0][0] == 1);
        const zOffsets = generateRandomWeights(config.whorlNum, config.whorlOffsetDispersion);
        let z = Math.random() * config.zRange;
        let xyAngle = Math.random() * 2 * Math.PI;
        for (let whorl = 0; whorl < config.whorlNum; whorl++) {
            xyAngle = isAlternatePattern ? xyAngle + config.alternateAngle! : Math.random() * 2 * Math.PI;

            const whorlSize = sample(config.whorlSizes);
            for (let k = 0; k < whorlSize; k++) {

                const initialSlope = config.verticalSlopeRange[0] + Math.random() * (config.verticalSlopeRange[1] - config.verticalSlopeRange[0]);
                const death = config.deathRange[0] + Math.random() * (config.deathRange[1] - config.deathRange[0]);
                const radius = config.radiusRange[0] + Math.random() * (config.radiusRange[1] - config.radiusRange[0]);
                const angleOffset = k / whorlSize * 2 * Math.PI;

                const branch: Branch = {
                    zStart: z % config.zRange,
                    xyAngle: (xyAngle + angleOffset) % (2 * Math.PI),
                    initialSlope: initialSlope,
                    death: death,
                    radius: radius,
                };
                branches.push(branch);
            }

            z += config.zRange * zOffsets[whorl];
        }

        return branches;
    }


    /** 
     * Returns `Float32Array` corresponding to RGBA texture of size `width*2`
     */
    generateRadialProfile(width: number): Float32Array {
        const config = this.woodConfig;

        // 1. Ring boundaries for r in [0,1]
        const N = Math.max(1, Math.round(config.ageAtOne));
        const z = FFT.generateNoise1D(N, config.ringWidthNoiseAlpha);
        const weights = z.map((v) => Math.exp(config.ringWidthDispersion * v));
        const wSum = weights.reduce((s, v) => s + v, 0);
        for (let k = 0; k < N; k++)
            weights[k] /= wSum;
        const boundaries: number[] = [0];
        let cum = 0;
        for (let i = 0; i < N; i++) {
            cum += weights[i];
            boundaries.push(cum);
        }
        boundaries[N] = 1; // guard exact endpoint

        // 2. Heartwood transition limits
        const hwStart = config.heartwoodRadius - config.transitionWidth / 2;
        const hwEnd = config.heartwoodRadius + config.transitionWidth / 2;

        // 3. Generate 2*width color samples (two rows)
        const total = 2 * width;
        const profile: Float32Array = new Float32Array(4 * total);

        const noiseYearly = FFT.generateNoise1D(N, 1.0);
        const noiseGrain = FFT.generateNoise1D(width, 1.0);
        let i = 1;
        for (let x = 0; x < total; x++) {
            const r = x / width;

            // Base colour (heartwood/sapwood blend or pure sapwood)
            let base = config.sapwoodColor;
            if (r <= 1) {
                const t = smoothstep(hwStart, hwEnd, r);
                base = lerp(config.heartwoodColor, config.sapwoodColor, t);
            }

            // Ring modulation
            let age = 0;
            let u = 0;
            if (x === width)
                i = 1;
            if (x < width) {
                while (i < N && r >= boundaries[i]) i++;
                age = i;
                u = (r - boundaries[i - 1]) / (boundaries[i] - boundaries[i - 1]);
            } else {
                while (i < N && r - 1 >= boundaries[i]) i++;
                age = i + N;
                u = (r - 1 - boundaries[i - 1]) / (boundaries[i] - boundaries[i - 1]);
            }
            const t = Math.pow(u, config.ringShapeExponent);
            const ringColor = lerp(scale(base, config.earlywoodLighten), scale(base, config.latewoodDarken), t);

            // Fine grain noise
            const grain = noiseYearly[age % N] * config.yearlyNoiseAmplitude + noiseGrain[x % width] * config.grainNoiseAmplitude;
            profile[4 * x + 0] = clamp(ringColor.x + grain);
            profile[4 * x + 1] = clamp(ringColor.y + grain);
            profile[4 * x + 2] = clamp(ringColor.z + grain);
            profile[4 * x + 3] = 1;
        }

        return profile;
    }
}