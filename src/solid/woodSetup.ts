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

import { generateRandomWeights, sample } from "./utils/misc";


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
}

interface Branch {
    zStart: number;                         // z for branch start at stem
    xyAngle: number;                        // angular direction around the stem
    initialSlope: number;                   // slope at the stem
    death: number;                          // time of death
    radius: number;                         // radius of the branch
}

const testWoodConfig: WoodConfig = {
    name: "Test_tree",
    zRange: 10,
    whorlSizes: [[4, 0.65], [3, 0.35]],
    whorlNum: 8,
    whorlOffsetDispersion: 0.1,       // TODO needs testing
    verticalSlopeRange: [0.2, 0.5],
    radiusRange: [0.2, 0.25],
    deathRange: [0.2, 1.0],
};


class WoodSetup {
    woodConfig: WoodConfig;
    branches: Branch[];

    constructor() {
        this.woodConfig = testWoodConfig;
        this.branches = this.generateBranches();
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
}

export type { Branch };
export { WoodSetup };