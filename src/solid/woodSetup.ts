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


interface WoodConfig {
    name: string;                           // wood name
    zRange: number;                         // range for z-tiling

    whorlSizes: [number, number][];         // [number of branches within a whorl, probability][]
    whorlNum: number;                       // number of whorls within the tiling range
    whorlOffsetDispersion: number;          // standard deviation for z-offsets in log-scale
    verticalSlopeRange: [number, number];   // range for vertical slope at stem
    radiusRange: [number, number],          // range for radii
    deathRange: [number, number];           // range for knot deaths
    alternateAngle?: number;                // (only for whorlSize=1) angular offset between consecutive branches, should be (1/2, 1/3, 2/5, or 3/8) of full circle or just 1/\phi^2=(3-sqrt(5))*pi ~ 2.4 radians

    knotColor: [number, number, number];
}

interface Branch {
    zStart: number;                         // z for branch start at stem
    xyAngle: number;                        // angular direction around the stem
    initialSlope: number;                   // slope at the stem
    death: number;                          // time of death
    radius: number;                         // radius of the branch
}

interface WoodProfileParams {
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
    noiseAmplitude: number;        // amplitude of per-channel colour noise
}

const testWoodWhorl4: WoodConfig = {
    name: "Test_tree_whorl4",
    zRange: 10,
    whorlSizes: [[4, 0.65], [3, 0.35]],
    whorlNum: 8,
    whorlOffsetDispersion: 0.1,       // TODO needs testing
    verticalSlopeRange: [0.2, 0.5],
    radiusRange: [0.2, 0.25],
    deathRange: [0.2, 1.0],

    knotColor: [0.2, 0.2, 0.15],
};

const testWoodAlternate: WoodConfig = {
    name: "Test_tree_alternate",
    zRange: 8,
    whorlSizes: [[1, 1]],
    whorlNum: 20,
    whorlOffsetDispersion: 0.15,
    verticalSlopeRange: [1.0, 1.5],
    radiusRange: [0.2, 0.3],
    deathRange: [0.2, 1.0],
    alternateAngle: 2.4,

    knotColor: [0.2, 0.2, 0.15],
};

const testProfileParams: WoodProfileParams = {
    heartwoodColor: { x: 0.6, y: 0.4, z: 0.3 },
    sapwoodColor: { x: 0.7, y: 0.5, z: 0.3 },
    heartwoodRadius: 0.4,
    transitionWidth: 0.1,
    ageAtOne: 60,
    ringWidthDispersion: 0.1,
    ringWidthNoiseAlpha: 0.1,
    ringShapeExponent: 0.1,
    earlywoodLighten: 0.1,
    latewoodDarken: 0.8,
    noiseAmplitude: 0.02,
};

class WoodSetup {
    woodConfig: WoodConfig;
    branches: Branch[];
    profile: Float32Array;

    constructor() {
        this.woodConfig = testWoodAlternate;
        this.branches = this.generateBranches();
        this.profile = this.generateRadialProfile(testProfileParams, 1024);
    }

    /**
     * Generates branch configuration following woodConfig. Samples are generated until 
     * there is no overlap.
     */
    generateBranches(): Branch[] {
        const config = this.woodConfig;
        const branches: Branch[] = [];
        const isAlternatePattern = (config.whorlSizes.length == 1) && (config.whorlSizes[0][0] == 1);
        const zOffsets = generateRandomWeights(config.whorlNum, config.whorlOffsetDispersion);
        let z = Math.random() * config.zRange;
        let previousXYAngle = Math.random() * 2 * Math.PI;
        for (let whorl = 0; whorl < config.whorlNum; whorl++) {
            const xyAngle = isAlternatePattern ? previousXYAngle + config.alternateAngle! : Math.random() * 2 * Math.PI;

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

            previousXYAngle = xyAngle;
            z += config.zRange * zOffsets[whorl];
        }

        return branches;
    }

    /**
     * Checks if the influences of branches overlap in the unit radius cylinder.
     * TODO: Rethink the approach
     */
    static hasOverlap(config: WoodConfig, branches: Branch[]): boolean {
        const n = branches.length;
        const deltaR = 0.01;
        const branchPoints: [number, number, number][] = Array.from({ length: n }, () => [0, 0, 0]);
        for (let r = 0; r < 1; r += deltaR) {
            for (let k = 0; k < n; k++) {
                const branch = branches[k];
                branchPoints[k][0] = r * Math.cos(branch.xyAngle);
                branchPoints[k][1] = r * Math.sin(branch.xyAngle);
                branchPoints[k][2] = (branch.zStart + branch.initialSlope * (r < 1 ? r - 0.5 * r * r : 0.5)) % config.zRange;
            }

            for (let k1 = 0; k1 < n; k1++) {
                for (let k2 = 0; k2 < n; k2++) {
                    // NOTE! these have to match shader implementation!
                    const rStemMin = 1.8 / 3;
                    const rBranchMax = 0.22;
                    const c = 5 * rBranchMax / rStemMin;
                    // Branch has no influence if t1 > 5*t0. If dBranch >= c*dStem then
                    // t1 >= dBranch/rBranchMax >= c*dStem/rBranchMax = 5*dStem/rStemMin >= 5*t0
                    // So: if dBranch >= c*dStem then branch has no influence.

                    //...
                }
            }
        }

        return false;
    }


    generateRadialProfile(params: WoodProfileParams, width: number): Float32Array {
        // 1. Ring boundaries for r in [0,1]
        const N = Math.max(1, Math.round(params.ageAtOne));
        const z = FFT.generateNoise1D(N, params.ringWidthNoiseAlpha);
        const weights = Array.from({ length: N }, (_v, k) =>
            Math.exp(params.ringWidthDispersion * (2 * z[k] - 1))
        );
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
        const hwStart = params.heartwoodRadius - params.transitionWidth / 2;
        const hwEnd = params.heartwoodRadius + params.transitionWidth / 2;

        // 3. Generate 2*width colour samples
        const total = 2 * width;
        const profile: Float32Array = new Float32Array(4 * total);

        const noise = FFT.generateNoise1D(N, 1.0);

        for (let x = 0; x < total; x++) {
            const r = (x < width) ? (x / (width - 1)) : (1 + (x - width) / (width - 1));

            // Base colour (heartwood/sapwood blend or pure sapwood)
            let base: Point3D;
            if (r <= 1) {
                const t = smoothstep(hwStart, hwEnd, r);
                base = lerp(params.heartwoodColor, params.sapwoodColor, t);
            } else {
                base = params.sapwoodColor;
            }

            // Ring modulation
            let ringColor: Point3D;
            let age = 0;
            if (r <= 1) {
                let i = 1;
                while (i < N && r >= boundaries[i]) i++;
                age = i;
                const u = (r - boundaries[i - 1]) / (boundaries[i] - boundaries[i - 1]);
                const t = Math.pow(u, params.ringShapeExponent);
                ringColor = lerp(scale(base, params.earlywoodLighten), scale(base, params.latewoodDarken), t);
            } else {
                let i = 1;
                while (i < N && r - 1 >= boundaries[i]) i++;
                age = i + N;
                const u = (r - 1 - boundaries[i - 1]) / (boundaries[i] - boundaries[i - 1]);
                const t = Math.pow(u, params.ringShapeExponent);
                ringColor = lerp(scale(base, params.earlywoodLighten), scale(base, params.latewoodDarken), t);
            }

            // Fine grain noise
            const grain = noise[age % N] * params.noiseAmplitude;
            profile[4 * x + 0] = clamp(ringColor.x + grain);
            profile[4 * x + 1] = clamp(ringColor.y + grain);
            profile[4 * x + 2] = clamp(ringColor.z + grain);
            profile[4 * x + 3] = 1;
        }

        return profile;
    }
}

export type { Branch };
export { WoodSetup };