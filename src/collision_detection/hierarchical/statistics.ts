import { LooseSphericalHierarchy, Region, Root } from "./tree";

export interface Stats {
    min: number;
    max: number;
    mean: number;
    std: number;
    percentiles: {
        p10: number;
        p50: number;
        p90: number;
    };
}

export interface TreeSnapshot {
    totalRegions: number;
    populatedPercentage: number;
    childrenStats: Stats;
    objectStats: Stats;
    neighborStats: Stats;
    nCounts: Stats;
    dCounts: Stats;
    eCounts: Stats;
    fCounts: Stats;
    aCounts: Stats;
    regionsByLevel: Map<number, number>;
    objectsByLevel: Map<number, number>;
    historicalMaxChildren: number;
    /** min_k min_{R≠R'} d(cR,cR') / S^k */
    normalizedRegionSeparation: number;
    /** Mean fraction of neighboring-region objects surviving the one-sided clearance filter. */
    clearanceSurvivalFraction: number;
}

function computeStats(originalArray: Float32Array | number[]): Stats {
    if (originalArray.length === 0) {
        return {
            min: 0,
            max: 0,
            mean: 0,
            std: 0,
            percentiles: {
                p10: 0,
                p50: 0,
                p90: 0
            }
        };
    }

    const array = [...originalArray].sort((a, b) => a - b);

    const n = array.length;

    let sum = 0;
    let min = Infinity;
    let max = -Infinity;

    for (const value of array) {
        sum += value;
        min = Math.min(min, value);
        max = Math.max(max, value);
    }

    const mean = sum / n;

    let variance = 0;

    for (const value of array) {
        const d = value - mean;
        variance += d * d;
    }

    return {
        min,
        max,
        mean,
        std: Math.sqrt(variance / n),
        percentiles: {
            p10: array[Math.floor(0.10 * n)],
            p50: array[Math.floor(0.50 * n)],
            p90: array[Math.floor(0.90 * n)]
        }
    };
}

export class LooseSphericalHierarchyStatistics<T> {

    public tree: LooseSphericalHierarchy<T>;
    public historicalMaxChildren = 0;

    constructor(tree: LooseSphericalHierarchy<T>) {
        this.tree = tree;
    }

    public collectRegions(
        node: Region<T> | Root<T>,
        out: Region<T>[]
    ): Region<T>[] {

        if (node instanceof Region) {
            out.push(node);
        }

        for (const child of node.children) {
            this.collectRegions(child, out);
        }

        return out;
    }

    /**
     * Computes the counts |D(R)| and |E'(R)| for every region R in the tree.
     */
    public computeRelationStatistics(): {
        nCounts: number[];
        dCounts: number[];
        eCounts: number[];
        fCounts: number[];
        aCounts: number[];
    } {
        const allRegions: Region<T>[] = [];
        this.collectRegions(this.tree.root, allRegions);

        const nCounts: number[] = [];
        const dCounts: number[] = [];
        const eCounts: number[] = [];
        const fCounts: number[] = [];
        const aCounts: number[] = [];

        const S = this.tree.scalingFactor;
        const adapter = this.tree.adapter;

        for (const region of allRegions) {
            const k = region.level;
            const center = region.center;
            const radius = region.radius;

            // Calculate Delta_k = (S - 1) * S^(k - 1)
            const deltaK = (S - 1) * Math.pow(S, k - 1);

            // Find level k regions overlapping R -> N(R)
            const nQueryResults = this.tree.overlapQuery(center, radius, true, k);
            const nRegions = nQueryResults.get(k) || [];
            nCounts.push(nRegions.length);

            // Find level k regions overlapping B(q, Delta_k) -> D(R)
            const dQueryResults = this.tree.overlapQuery(center, deltaK, true, k);
            const dRegions = dQueryResults.get(k) || [];
            dCounts.push(dRegions.length);

            // Find level k+1 regions overlapping B(q, S^k) -> F(R)
            const fQueryResults = this.tree.overlapQuery(center, radius, true, k + 1);
            const fRegions = fQueryResults.get(k + 1) || [];
            fCounts.push(fRegions.length);

            // Find all regions overlapping R -> A(R)
            const aQueryResults = this.tree.overlapQuery(center, radius, false);
            aCounts.push(aQueryResults.length);

            // Find level k - 1 regions whose centers lie inside R = B(q, S^k) -> E'(R)
            const eQueryResults = this.tree.overlapQuery(center, radius, true, k - 1);
            const candidateRegions = eQueryResults.get(k - 1) || [];

            let ePrimeCount = 0;
            for (const candidate of candidateRegions) {
                const dist = adapter.distance(center, candidate.center);
                if (dist < radius)
                    ePrimeCount++;
            }
            eCounts.push(ePrimeCount);
        }

        return { nCounts, dCounts, eCounts, fCounts, aCounts };
    }

    public takeSnapshot(): TreeSnapshot {

        const allRegions: Region<T>[] = [];
        this.collectRegions(this.tree.root, allRegions);

        const childrenCounts: number[] = [];
        const objectCounts: number[] = [];
        const neighborCounts: number[] = [];

        const regionsByLevel = new Map<number, number>();
        const objectsByLevel = new Map<number, number>();

        let populatedCount = 0;

        for (const region of allRegions) {

            regionsByLevel.set(
                region.level,
                (regionsByLevel.get(region.level) ?? 0) + 1
            );

            objectsByLevel.set(
                region.level,
                (objectsByLevel.get(region.level) ?? 0) + region.objects.length
            );

            childrenCounts.push(region.children.length);

            this.historicalMaxChildren = Math.max(
                this.historicalMaxChildren,
                region.children.length
            );

            if (region.objects.length > 0) {
                populatedCount++;
                objectCounts.push(region.objects.length);
                neighborCounts.push(region.neighbors.length);
            }
        }

        const { nCounts, dCounts, eCounts, fCounts, aCounts } = this.computeRelationStatistics();

        return {
            totalRegions: allRegions.length,
            populatedPercentage:
                allRegions.length === 0
                    ? 0
                    : 100 * populatedCount / allRegions.length,

            childrenStats: computeStats(childrenCounts),
            objectStats: computeStats(objectCounts),
            neighborStats: computeStats(neighborCounts),

            nCounts: computeStats(nCounts),
            dCounts: computeStats(dCounts),
            eCounts: computeStats(eCounts),
            fCounts: computeStats(fCounts),
            aCounts: computeStats(aCounts),

            regionsByLevel,
            objectsByLevel,

            historicalMaxChildren: this.historicalMaxChildren,

            normalizedRegionSeparation:
                this.computeNormalizedRegionSeparation(allRegions),

            clearanceSurvivalFraction:
                this.computeClearanceSurvivalFraction()
        };
    }

    private computeNormalizedRegionSeparation(
        allRegions: Region<T>[]
    ): number {

        const byLevel = new Map<number, Region<T>[]>();

        for (const region of allRegions) {

            let list = byLevel.get(region.level);

            if (!list) {
                list = [];
                byLevel.set(region.level, list);
            }

            list.push(region);
        }

        let best = Infinity;

        for (const [level, regions] of byLevel) {

            if (regions.length < 2)
                continue;

            const radius = Math.pow(this.tree.scalingFactor, level);

            for (let i = 0; i < regions.length; i++) {

                let nearest = Infinity;

                for (let j = 0; j < regions.length; j++) {

                    if (i === j)
                        continue;

                    const d = this.tree.adapter.distance(
                        regions[i].center,
                        regions[j].center
                    );

                    nearest = Math.min(nearest, d);
                }

                best = Math.min(best, nearest / radius);
            }
        }

        return Number.isFinite(best) ? best : 0;
    }

    private computeClearanceSurvivalFraction(): number {

        let totalFraction = 0;
        let samples = 0;

        for (const region of this.tree.populatedRegions) {

            for (const neighbor of region.neighbors) {

                if (region.id > neighbor.id)
                    continue;

                totalFraction += this.computeOneSidedSurvival(region, neighbor);
                samples++;

                totalFraction += this.computeOneSidedSurvival(neighbor, region);
                samples++;
            }
        }

        return samples === 0 ? 0 : totalFraction / samples;
    }

    /**
     * Fraction of objects in target whose clearance is at most
     * the overlap amount between the two regions.
     */
    private computeOneSidedSurvival(
        source: Region<T>,
        target: Region<T>
    ): number {

        const overlap =
            source.radius +
            target.radius -
            this.tree.adapter.distance(source.center, target.center);

        if (overlap <= 0 || target.objects.length === 0)
            return 0;

        let survivors = 0;

        for (const obj of target.objects) {

            const clearance =
                target.radius -
                (
                    this.tree.adapter.distance(
                        target.center,
                        obj.center
                    ) + obj.radius
                );

            if (clearance <= overlap)
                survivors++;
        }

        return survivors / target.objects.length;
    }
}