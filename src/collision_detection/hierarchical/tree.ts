/*
- includes AI code
- Set vs array for objects, children? These are very small so likely Set is inefficient
*/

export interface SpatialAdapter<T> {
    distance(a: T, b: T): number;
    clone(point: T): T;
}

export class SphereObject<T> {
    public center: T;
    public radius: number;
    public margin: number;
    public parentNode: Region<T> | Root<T> | null = null;
    public readonly id: number;

    constructor(center: T, radius: number, margin: number, id: number) {
        this.center = center;
        this.radius = radius;
        this.margin = margin;
        this.id = id;
    }
}

export class Root<T> {
    public children: Region<T>[] = [];
    public objects: SphereObject<T>[] = [];
}

export class Region<T> {
    private static nextId = 0;
    public readonly id: number = Region.nextId++;

    public center: T;
    public level: number;
    public radius: number;
    public children: Region<T>[] = [];
    public objects: SphereObject<T>[] = [];
    public parentNode: Region<T> | Root<T> | null = null;

    /** Empty if unpopulated, otherwise contains every populated region overlapping this region, excluding itself. */
    public neighbors: Region<T>[] = [];

    constructor(center: T, level: number, scalingFactor: number) {
        this.center = center;
        this.level = level;
        this.radius = Math.pow(scalingFactor, level);
    }
}


/**
 * See tree.md for technical description.
 */
export class LooseSphericalHierarchy<T> {
    public root: Root<T>;
    public adapter: SpatialAdapter<T>;
    /** Maximum region level */
    public maxLevel: number;
    /** Ratio of radii between parent region and the region */
    public scalingFactor: number;
    public populatedRegions: Region<T>[] = [];     // Just an optimization

    constructor(adapter: SpatialAdapter<T>, maxLevel: number, scalingFactor: number = 2) {
        if (scalingFactor <= 1)
            throw Error("Invalid scalingFactor.");
        this.adapter = adapter;
        this.maxLevel = maxLevel;
        this.scalingFactor = scalingFactor;
        this.root = new Root();
    }

    // Overloads for the query method based on the `groupByLevel` flag
    public overlapQuery(
        queryCenter: T,
        queryRadius: number,
        groupByLevel: true,
        minLevel?: number
    ): Map<number, Region<T>[]>;

    public overlapQuery(
        queryCenter: T,
        queryRadius: number,
        groupByLevel: false,
        minLevel?: number
    ): Region<T>[];

    public overlapQuery(
        queryCenter: T,
        queryRadius: number,
        groupByLevel: boolean,
        minLevel: number = -Infinity
    ): Region<T>[] | Map<number, Region<T>[]> {

        const resultsArray: Region<T>[] = [];
        const resultsMap = new Map<number, Region<T>[]>();

        const traverse = (regions: Region<T>[]) => {
            for (const region of regions) {

                if (this.overlaps(queryCenter, queryRadius, region.center, region.radius)) {
                    if (groupByLevel) {
                        let levelArr = resultsMap.get(region.level);
                        if (!levelArr) {
                            levelArr = [];
                            resultsMap.set(region.level, levelArr);
                        }
                        levelArr.push(region);
                    } else {
                        resultsArray.push(region);
                    }

                    if (region.level > minLevel)
                        traverse(region.children);
                }
            }
        };

        if (this.maxLevel >= minLevel)
            traverse(this.root.children);

        return groupByLevel ? resultsMap : resultsArray;
    }

    // Overloads for the query method based on the `groupByLevel` flag
    public enclosureQuery(
        queryCenter: T,
        queryRadius: number,
        groupByLevel: true,
        minLevel?: number
    ): Map<number, Region<T>[]>;

    public enclosureQuery(
        queryCenter: T,
        queryRadius: number,
        groupByLevel: false,
        minLevel?: number
    ): Region<T>[];

    public enclosureQuery(
        queryCenter: T,
        queryRadius: number,
        groupByLevel: boolean,
        minLevel: number = -Infinity
    ): Region<T>[] | Map<number, Region<T>[]> {

        const resultsArray: Region<T>[] = [];
        const resultsMap = new Map<number, Region<T>[]>();

        const traverse = (regions: Region<T>[]) => {
            for (const region of regions) {

                if (this.encloses(region.center, region.radius, queryCenter, queryRadius)) {
                    if (groupByLevel) {
                        let levelArr = resultsMap.get(region.level);
                        if (!levelArr) {
                            levelArr = [];
                            resultsMap.set(region.level, levelArr);
                        }
                        levelArr.push(region);
                    } else {
                        resultsArray.push(region);
                    }

                    if (region.level > minLevel)
                        traverse(region.children);
                }
            }
        };

        if (this.maxLevel >= minLevel)
            traverse(this.root.children);

        return groupByLevel ? resultsMap : resultsArray;
    }

    public insert(obj: SphereObject<T>): void {
        // Calculate the admissible level k
        // S^(k-1) <= r + margin < S^k  =>  k = floor(log_S(r + margin)) + 1
        const rm = obj.radius + obj.margin;
        const k = Math.floor(Math.log(rm) / Math.log(this.scalingFactor)) + 1;

        // If too large for any region, store directly in root
        if (rm >= Math.pow(this.scalingFactor, this.maxLevel)) {
            this.root.objects.push(obj);
            obj.parentNode = this.root;
            return;
        }

        // Query the tree for potential parent regions
        const queryResults = this.enclosureQuery(obj.center, obj.radius, true, k);
        const levelKRegions = queryResults.get(k) || [];

        // Attempt to find an existing level-k region that encloses the object
        const bestRegion = this.findBestEnclosingRegion(levelKRegions, obj.center, obj.radius);

        if (bestRegion) {
            const wasEmpty = bestRegion.objects.length === 0;

            bestRegion.objects.push(obj);
            obj.parentNode = bestRegion;

            if (wasEmpty) {
                this.populate(bestRegion);
            }

            return;
        }

        // No suitable level-k region found, create a new one centered at the object
        let currentRegion = new Region(this.adapter.clone(obj.center), k, this.scalingFactor);
        currentRegion.objects.push(obj);
        obj.parentNode = currentRegion;

        // Populate newly created region immediately after receiving its object
        this.populate(currentRegion);

        // Connect the new region upward
        let j = k;
        while (true) {
            if (j === this.maxLevel) {
                // Reached the maximum level, attach directly to root
                this.root.children.push(currentRegion);
                currentRegion.parentNode = this.root;
                break;
            }

            const levelJPlus1Regions = queryResults.get(j + 1) || [];
            const bestParent = this.findBestEnclosingRegion(
                levelJPlus1Regions,
                currentRegion.center,
                currentRegion.radius
            );

            if (bestParent) {
                bestParent.children.push(currentRegion);
                currentRegion.parentNode = bestParent;
                break; // Found an existing path to the root, stop connecting
            } else {
                // Create the missing ancestor
                const parentRegion = new Region(this.adapter.clone(obj.center), j + 1, this.scalingFactor);
                parentRegion.children.push(currentRegion);
                currentRegion.parentNode = parentRegion;

                currentRegion = parentRegion;
                j++;
            }
        }
    }

    public delete(obj: SphereObject<T>): void {
        const node = obj.parentNode;
        if (!node)
            return;

        if (node instanceof Root) {
            this.removeFromArray(node.objects, obj);
        } else if (node instanceof Region) {
            this.removeFromArray(node.objects, obj);

            // Transition from populated to unpopulated before tree pruning
            if (node.objects.length === 0) {
                this.unpopulate(node);
            }

            this.prune(node);
        }
        obj.parentNode = null;
    }

    public update(obj: SphereObject<T>): void {
        const H = obj.parentNode;

        // If stored in the root, it's always valid. Just update position.
        if (H instanceof Root) {
            return;
        }

        if (H instanceof Region) {
            if (this.encloses(H.center, H.radius, obj.center, obj.radius)) {
                return;
            }

            // Remove from current region, but DO NOT prune yet
            this.removeFromArray(H.objects, obj);

            if (H.objects.length === 0) {
                this.unpopulate(H);
            }

            // Reinsert
            this.insert(obj);

            // Clean up the old path now that insertion is complete and might have reused nodes
            this.prune(H);
        }
    }

    // --- Private Helper Methods ---

    /**
     * Called whenever a region changes from unpopulated to populated.
     * The region builds its neighbor list and simultaneously inserts itself
     * into the neighbor lists of all overlapping populated regions.
     */
    private populate(region: Region<T>): void {
        this.populatedRegions.push(region);

        const overlapping = this.overlapQuery(region.center, region.radius, false);

        for (const other of overlapping) {
            if (other === region)
                continue;

            // Only populated regions maintain neighbor relations
            if (other.objects.length === 0)
                continue;

            // Neighbor lists are intentionally stored symmetrically so either region
            // can immediately enumerate the other during collision testing.

            region.neighbors.push(other);
            other.neighbors.push(region);
        }
    }

    /**
     * Called whenever a region changes from populated to unpopulated.
     * Removes all symmetric neighbor links before the region is pruned or reused.
     */
    private unpopulate(region: Region<T>): void {
        this.removeFromArray(this.populatedRegions, region);

        for (const other of region.neighbors) {
            if (other === region)
                continue;

            this.removeFromArray(other.neighbors, region);
        }

        region.neighbors.length = 0;
    }

    private prune(region: Region<T>): void {
        let current: Region<T> = region;

        // Ascend the tree and remove empty regions
        while (current.objects.length === 0 && current.children.length === 0) {
            const parent = current.parentNode;
            if (!parent)
                break;

            if (parent instanceof Root) {
                this.removeFromArray(parent.children, current);
                current.parentNode = null;
                break;
            } else {
                this.removeFromArray(parent.children, current);
                current.parentNode = null;
                current = parent;
            }
        }
    }

    /**
     * Finds region that encloses the target and minimizes distance between centers.
     */
    private findBestEnclosingRegion(regions: Region<T>[], targetCenter: T, targetRadius: number): Region<T> | null {
        let bestRegion: Region<T> | null = null;
        let bestDist = Infinity;

        for (const region of regions) {
            if (this.encloses(region.center, region.radius, targetCenter, targetRadius)) {
                const dist = this.adapter.distance(region.center, targetCenter);
                if (dist < bestDist) {
                    bestRegion = region;
                    bestDist = dist;
                }
            }
        }

        return bestRegion;
    }

    public encloses(parentCenter: T, parentRadius: number, childCenter: T, childRadius: number): boolean {
        const dist = this.adapter.distance(parentCenter, childCenter);
        return dist + childRadius <= parentRadius;
    }

    public overlaps(center1: T, r1: number, center2: T, r2: number): boolean {
        const dist = this.adapter.distance(center1, center2);
        return dist < r1 + r2;
    }

    public removeFromArray<T>(array: T[], item: T): void {
        const index = array.indexOf(item);      // TODO rethink?
        if (index > -1) {
            const lastIndex = array.length - 1;

            // If the item isn't already the last element, overwrite it with the last element
            if (index !== lastIndex) {
                array[index] = array[lastIndex];
            }

            // Pop the array to remove the tail (which is now either the original item 
            // if it was at the end, or a duplicate of the element we just swapped)
            array.pop();
        }
    }

    /**
     * Collision testing using neighbors (no duplicates).
     */
    public findCollisions(): [number, number][] {
        const collisions: [number, number][] = [];

        const testAndPush = (obj1: SphereObject<T>, obj2: SphereObject<T>) => {
            const radiusSum = obj1.radius + obj2.radius;
            if (this.adapter.distance(obj1.center, obj2.center) < radiusSum) {
                collisions.push([obj1.id, obj2.id]);
            }
        };

        // 2. Root objects vs Root objects
        const rootObjects = this.root.objects;
        for (let i = 0; i < rootObjects.length; i++) {
            for (let j = i + 1; j < rootObjects.length; j++) {
                testAndPush(rootObjects[i], rootObjects[j]);
            }
        }

        // 3. Root objects vs objects in overlapping populated regions
        for (const rObj of rootObjects) {
            for (const popReg of this.populatedRegions) {
                if (this.overlaps(rObj.center, rObj.radius, popReg.center, popReg.radius)) {
                    for (const pObj of popReg.objects) {
                        testAndPush(rObj, pObj);
                    }
                }
            }
        }

        // 4. Populated Regions
        for (const region of this.populatedRegions) {
            // 4a. Intra-region collisions
            const regObjects = region.objects;
            for (let i = 0; i < regObjects.length; i++) {
                for (let j = i + 1; j < regObjects.length; j++) {
                    testAndPush(regObjects[i], regObjects[j]);
                }
            }

            // 4b. Inter-region collisions
            // ID check breaks the symmetry of the neighbor lists dynamically
            for (const neighbor of region.neighbors) {
                if (region.id < neighbor.id) {
                    for (const obj1 of regObjects) {
                        for (const obj2 of neighbor.objects) {
                            testAndPush(obj1, obj2);
                        }
                    }
                }
            }
        }

        return collisions;
    }
}