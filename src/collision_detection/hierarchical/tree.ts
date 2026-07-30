/*
- mostly implemented by AI
- Set vs array for objects, children? These are very small so likely Set is inefficient
*/


import * as THREE from 'three';

export class SphereObject {
    public center: THREE.Vector3;
    public radius: number;
    public parentNode: Region | Root | null = null;
    public readonly id: number;

    constructor(center: THREE.Vector3, radius: number, id: number) {
        this.center = center.clone();
        this.radius = radius;
        this.id = id;
    }
}

export class Root {
    public children: Region[] = [];
    public objects: SphereObject[] = [];
}

export class Region {
    private static nextId = 0;
    public readonly id: number = Region.nextId++;

    public center: THREE.Vector3;
    public level: number;
    public radius: number;
    public children: Region[] = [];
    public objects: SphereObject[] = [];
    public parentNode: Region | Root | null = null;

    // Valid only while this region is populated.
    // Contains every populated region intersecting this region, excluding itself.
    public neighbors: Region[] = [];

    constructor(center: THREE.Vector3, level: number, scalingFactor: number) {
        this.center = center.clone();
        this.level = level;
        this.radius = Math.pow(scalingFactor, level);
    }
}


/**
 * See tree.md for technical description.
 */
export class LooseSphericalHierarchy {
    public root: Root;
    /** Minimum allwed parent region radius to object radius */
    public marginRatio: number;
    /** Maximum region level */
    public maxLevel: number;
    /** Ratio of radii between parent region and the region */
    public scalingFactor: number;

    constructor(maxLevel: number, marginRatio: number, scalingFactor: number = 2) {
        if (marginRatio <= 1 || scalingFactor <= 1)
            throw Error("Invalid parameter.");
        this.marginRatio = marginRatio;
        this.maxLevel = maxLevel;
        this.scalingFactor = scalingFactor;
        this.root = new Root();
    }

    // Overloads for the query method based on the `groupByLevel` flag
    public intersectionQuery(
        queryCenter: THREE.Vector3,
        queryRadius: number,
        groupByLevel: true,
        minLevel?: number
    ): Map<number, Region[]>;

    public intersectionQuery(
        queryCenter: THREE.Vector3,
        queryRadius: number,
        groupByLevel: false,
        minLevel?: number
    ): Region[];

    public intersectionQuery(
        queryCenter: THREE.Vector3,
        queryRadius: number,
        groupByLevel: boolean,
        minLevel: number = -Infinity
    ): Region[] | Map<number, Region[]> {

        const resultsArray: Region[] = [];
        const resultsMap = new Map<number, Region[]>();

        const traverse = (regions: Region[]) => {
            for (const region of regions) {

                // Stop descending once regions become smaller than the minimum level.
                if (region.level < minLevel)
                    continue;

                if (this.intersects(queryCenter, queryRadius, region.center, region.radius)) {
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

                    traverse(region.children);
                }
            }
        };

        traverse(this.root.children);

        return groupByLevel ? resultsMap : resultsArray;
    }

    // Overloads for the query method based on the `groupByLevel` flag
    public containmentQuery(
        queryCenter: THREE.Vector3,
        queryRadius: number,
        groupByLevel: true,
        minLevel?: number
    ): Map<number, Region[]>;

    public containmentQuery(
        queryCenter: THREE.Vector3,
        queryRadius: number,
        groupByLevel: false,
        minLevel?: number
    ): Region[];

    public containmentQuery(
        queryCenter: THREE.Vector3,
        queryRadius: number,
        groupByLevel: boolean,
        minLevel: number = -Infinity
    ): Region[] | Map<number, Region[]> {

        const resultsArray: Region[] = [];
        const resultsMap = new Map<number, Region[]>();

        const traverse = (regions: Region[]) => {
            for (const region of regions) {

                // Stop descending once regions become smaller than the minimum level.
                if (region.level < minLevel)
                    continue;

                if (this.fullyContains(region.center, region.radius, queryCenter, queryRadius)) {
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

                    traverse(region.children);
                }
            }
        };

        traverse(this.root.children);

        return groupByLevel ? resultsMap : resultsArray;
    }

    public insert(obj: SphereObject): void {
        // Calculate the admissible level k
        // S^(k-1) <= a * r < S^k  =>  k = floor(log_S(a * r)) + 1
        const mr = this.marginRatio * obj.radius;
        const k = Math.floor(Math.log(mr) / Math.log(this.scalingFactor)) + 1;

        // If too large for any region, store directly in root
        if (mr >= Math.pow(this.scalingFactor, this.maxLevel)) {
            this.root.objects.push(obj);
            obj.parentNode = this.root;
            return;
        }

        // Query the tree for potential parent regions
        const queryResults = this.containmentQuery(obj.center, -obj.radius, true, k);
        const levelKRegions = queryResults.get(k) || [];

        // Attempt to find an existing level-k region that fully contains the object
        const bestRegion = this.findBestContainingRegion(levelKRegions, obj.center, obj.radius);

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
        let currentRegion = new Region(obj.center, k, this.scalingFactor);
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
            const bestParent = this.findBestContainingRegion(
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
                const parentRegion = new Region(obj.center, j + 1, this.scalingFactor);
                parentRegion.children.push(currentRegion);
                currentRegion.parentNode = parentRegion;

                currentRegion = parentRegion;
                j++;
            }
        }
    }

    public delete(obj: SphereObject): void {
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

    public update(obj: SphereObject): void {
        const H = obj.parentNode;

        // If stored in the root, it's always valid. Just update position.
        if (H instanceof Root) {
            return;
        }

        if (H instanceof Region) {
            if (this.fullyContains(H.center, H.radius, obj.center, obj.radius)) {
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
     * into the neighbor lists of all intersecting populated regions.
     */
    private populate(region: Region): void {
        const intersecting = this.intersectionQuery(
            region.center,
            region.radius,
            false
        );

        // A populated region is always its own neighbor
        // region.neighbors.push(region);

        for (const other of intersecting) {
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
    private unpopulate(region: Region): void {
        for (const other of region.neighbors) {
            if (other === region)
                continue;

            this.removeFromArray(other.neighbors, region);
        }

        region.neighbors.length = 0;
    }

    private prune(region: Region): void {
        let current: Region = region;

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
     * Finds region that contains the target and minimizes distance between centers.
     */
    private findBestContainingRegion(regions: Region[], targetCenter: THREE.Vector3, targetRadius: number): Region | null {
        let bestRegion: Region | null = null;
        let bestDistSq = Infinity;

        for (const region of regions) {
            if (this.fullyContains(region.center, region.radius, targetCenter, targetRadius)) {
                const distSq = region.center.distanceToSquared(targetCenter);
                if (distSq < bestDistSq) {
                    bestRegion = region;
                    bestDistSq = distSq;
                }
            }
        }

        return bestRegion;
    }

    private fullyContains(parentCenter: THREE.Vector3, parentRadius: number, childCenter: THREE.Vector3, childRadius: number): boolean {
        // A parent fully contains a child if the distance between their centers + the child's radius <= parent's radius.
        const distSq = parentCenter.distanceToSquared(childCenter);
        const radiusSum = parentRadius - childRadius;
        return distSq <= radiusSum * radiusSum;
    }

    private intersects(center1: THREE.Vector3, r1: number, center2: THREE.Vector3, r2: number): boolean {
        const distSq = center1.distanceToSquared(center2);
        const radiusSum = r1 + r2;
        return distSq <= radiusSum * radiusSum;
    }

    private removeFromArray<T>(array: T[], item: T): void {
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

        const testAndPush = (obj1: SphereObject, obj2: SphereObject) => {
            const radiusSum = obj1.radius + obj2.radius;
            if (obj1.center.distanceToSquared(obj2.center) <= radiusSum * radiusSum) {
                collisions.push([obj1.id, obj2.id]);
            }
        };

        // 1. Collect all populated regions
        const populatedRegions: Region[] = [];
        const collectPopulated = (regions: Region[]) => {
            for (const r of regions) {
                if (r.objects.length > 0) {
                    populatedRegions.push(r);
                }
                collectPopulated(r.children);
            }
        };
        collectPopulated(this.root.children);

        // 2. Root objects vs Root objects
        const rootObjects = this.root.objects;
        for (let i = 0; i < rootObjects.length; i++) {
            for (let j = i + 1; j < rootObjects.length; j++) {
                testAndPush(rootObjects[i], rootObjects[j]);
            }
        }

        // 3. Root objects vs objects in intersecting populated regions
        for (const rObj of rootObjects) {
            for (const popReg of populatedRegions) {
                if (this.intersects(rObj.center, rObj.radius, popReg.center, popReg.radius)) {
                    for (const pObj of popReg.objects) {
                        testAndPush(rObj, pObj);
                    }
                }
            }
        }

        // 4. Populated Regions
        for (const region of populatedRegions) {
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


    // -----------------------------------------
    // Collision testing (recursive, all in one)
    // -----------------------------------------



    /**
     * Finds all intersecting object pairs using a recursive traversal of the hierarchy.
     * The traversal is expressed through three mutually recursive routines operating on
     * a region, an object-region pair, and a region-region pair, respectively.
     *
     * Region processing handles collisions within a subtree, object-region processing
     * compares one object against an entire subtree, and region-region processing
     * compares two sibling subtrees. Whenever an object or subtree cannot intersect a
     * region, that branch of the recursion is discarded.
     *
     * The method returns the list of intersecting pairs produced by this traversal.
     */
    public findCollisionsRecursive(): [number, number][] {
        const collisions: [number, number][] = [];

        // Root objects against each other
        for (let i = 0; i < this.root.objects.length; i++) {
            for (let j = i + 1; j < this.root.objects.length; j++) {
                if (this.intersects(
                    this.root.objects[i].center, this.root.objects[i].radius,
                    this.root.objects[j].center, this.root.objects[j].radius
                )) {
                    collisions.push([this.root.objects[i].id, this.root.objects[j].id]);
                }
            }
        }

        // Root objects against top-level regions
        for (const obj of this.root.objects) {
            for (const child of this.root.children) {
                this.processObjectRegion(obj, child, collisions);
            }
        }

        // Within each top-level subtree
        for (const child of this.root.children) {
            this.processRegion(child, collisions);
        }

        // Between different top-level subtrees
        for (let i = 0; i < this.root.children.length; i++) {
            for (let j = i + 1; j < this.root.children.length; j++) {
                this.processRegionPair(
                    this.root.children[i],
                    this.root.children[j],
                    collisions
                );
            }
        }

        return collisions;
    }

    private processRegion(region: Region, collisions: [number, number][]): void {

        // Objects stored directly in this region.
        for (let i = 0; i < region.objects.length; i++) {
            for (let j = i + 1; j < region.objects.length; j++) {
                if (this.intersects(
                    region.objects[i].center, region.objects[i].radius,
                    region.objects[j].center, region.objects[j].radius
                )) {
                    collisions.push([region.objects[i].id, region.objects[j].id]);
                }
            }
        }

        // Objects vs descendants.
        for (const obj of region.objects) {
            for (const child of region.children) {
                this.processObjectRegion(obj, child, collisions);
            }
        }

        // Between child subtrees.
        for (let i = 0; i < region.children.length; i++) {
            for (let j = i + 1; j < region.children.length; j++) {
                this.processRegionPair(
                    region.children[i],
                    region.children[j],
                    collisions
                );
            }
        }

        // Recurse into children.
        for (const child of region.children) {
            this.processRegion(child, collisions);
        }
    }

    private processRegionPair(a: Region, b: Region, collisions: [number, number][]): void {
        if (!this.intersects(a.center, a.radius, b.center, b.radius))
            return;

        // Direct objects.
        for (const objA of a.objects) {
            for (const objB of b.objects) {
                if (this.intersects(
                    objA.center, objA.radius,
                    objB.center, objB.radius
                )) {
                    collisions.push([objA.id, objB.id]);
                }
            }
        }

        // Objects in A vs descendants of B.
        for (const objA of a.objects) {
            for (const childB of b.children) {
                this.processObjectRegion(objA, childB, collisions);
            }
        }

        // Objects in B vs descendants of A.
        for (const objB of b.objects) {
            for (const childA of a.children) {
                this.processObjectRegion(objB, childA, collisions);
            }
        }

        // Descendants vs descendants.
        for (const childA of a.children) {
            for (const childB of b.children) {
                this.processRegionPair(childA, childB, collisions);
            }
        }
    }

    private processObjectRegion(
        obj: SphereObject,
        region: Region,
        collisions: [number, number][]
    ): void {
        if (!this.intersects(obj.center, obj.radius, region.center, region.radius))
            return;

        for (const other of region.objects) {
            if (this.intersects(
                obj.center, obj.radius,
                other.center, other.radius
            )) {
                collisions.push([obj.id, other.id]);
            }
        }

        for (const child of region.children) {
            this.processObjectRegion(obj, child, collisions);
        }
    }


    // -----------------------------------------
    // Trivial collision counting using intersection query for each object
    // -----------------------------------------

    /**
     * Counts intersecting object pairs by querying the tree once for every object.
     *
     * Each unordered pair is reported twice: once when querying from each object.
     * Self-pairs are skipped.
     */
    public findCollisionsByQuery(): [number, number][] {
        const collisions: [number, number][] = [];

        const processRegion = (region: Region) => {
            for (const obj of region.objects) {

                // Test against root objects
                for (const other of this.root.objects) {
                    if (this.intersects(
                        obj.center, obj.radius,
                        other.center, other.radius
                    )) {
                        collisions.push([obj.id, other.id]);
                    }
                }

                // Query all intersecting regions
                const regions = this.intersectionQuery(obj.center, obj.radius, false);

                for (const candidate of regions) {
                    for (const other of candidate.objects) {

                        if (other === obj)
                            continue;

                        if (this.intersects(
                            obj.center, obj.radius,
                            other.center, other.radius
                        )) {
                            collisions.push([obj.id, other.id]);
                        }
                    }
                }
            }

            for (const child of region.children) {
                processRegion(child);
            }
        };

        // Root objects
        for (const obj of this.root.objects) {

            // Root vs root
            for (const other of this.root.objects) {
                if (other === obj)
                    continue;

                if (this.intersects(
                    obj.center, obj.radius,
                    other.center, other.radius
                )) {
                    collisions.push([obj.id, other.id]);
                }
            }

            // Root vs tree
            const regions = this.intersectionQuery(obj.center, obj.radius, false);

            for (const region of regions) {
                for (const other of region.objects) {
                    if (this.intersects(
                        obj.center, obj.radius,
                        other.center, other.radius
                    )) {
                        collisions.push([obj.id, other.id]);
                    }
                }
            }
        }

        // Objects stored in regions
        for (const child of this.root.children) {
            processRegion(child);
        }

        return collisions;
    }



    // -----------------------------------------
    // Just for DEBUGGING!!! Do not use these for actual implementation.
    // -----------------------------------------

    /**
     * Brute-force collision detection.
     *
     * Returns every unordered intersecting pair exactly once.
     * If (id1, id2) is included, then (id2, id1) is not.
     */
    public static debug_findCollisionsBruteForce(objects: SphereObject[]): [number, number][] {
        const collisions: [number, number][] = [];

        for (let i = 0; i < objects.length; i++) {
            const obj1 = objects[i];

            for (let j = i + 1; j < objects.length; j++) {
                const obj2 = objects[j];

                const radiusSum = obj1.radius + obj2.radius;
                if (obj1.center.distanceToSquared(obj2.center) <= radiusSum * radiusSum) {
                    collisions.push([obj1.id, obj2.id]);
                }
            }
        }

        return collisions;
    }

    debug_collectRegions(node: Region | Root, regions: Region[]): Region[] {
        if (node instanceof Region)
            regions.push(node);
        for (const child of node.children)
            this.debug_collectRegions(child, regions);
        return regions;
    }

    debug_countRegionsByLevel(): Map<number, number> {
        const regions: Region[] = [];
        this.debug_collectRegions(this.root, regions);

        const levelCounts = new Map<number, number>();
        for (const region of regions) {
            const count = levelCounts.get(region.level) || 0;
            levelCounts.set(region.level, count + 1);
        }
        return levelCounts;
    }

    /**
     * Checks the following properties:
     * 
     * - Every unpopulated regions neighbors list is empty.
     * - Every populated regions neighbors list contains exactly all the populated 
     * regions that intersect it other than itself.
     */
    public debug_validateNeighbors(): void {
        // Collect all regions in the tree (excluding the root)
        const allRegions: Region[] = [];
        const traverse = (regions: Region[]) => {
            for (const r of regions) {
                allRegions.push(r);
                traverse(r.children);
            }
        };
        traverse(this.root.children);

        const populatedRegions = allRegions.filter(r => r.objects.length > 0);
        const unpopulatedRegions = allRegions.filter(r => r.objects.length === 0);
        const populatedSet = new Set(populatedRegions);

        // 1. Verify unpopulated regions have exactly 0 neighbors
        for (const r of unpopulatedRegions) {
            if (r.neighbors.length !== 0) {
                throw new Error("Validation failed: Unpopulated region has a non-empty neighbors array.");
            }
        }

        // 2. Local sanity checks per populated region: purity, duplicates, self-references, and intersection
        for (const r of populatedRegions) {
            const seen = new Set<Region>();

            for (const neighbor of r.neighbors) {
                if (!populatedSet.has(neighbor)) {
                    throw new Error("Validation failed: Neighbors list contains an unpopulated or detached region.");
                }
                if (neighbor === r) {
                    throw new Error("Validation failed: Region contains itself in its neighbors list.");
                }
                if (seen.has(neighbor)) {
                    throw new Error("Validation failed: Populated region contains duplicate neighbor entries.");
                }
                seen.add(neighbor);

                if (!this.intersects(r.center, r.radius, neighbor.center, neighbor.radius)) {
                    throw new Error("Validation failed: Region has a neighbor that it does not geometrically intersect.");
                }
            }
        }

        // 3. Global pairwise check: verify strict symmetry and completeness for all distinct populated pairs
        for (let i = 0; i < populatedRegions.length; i++) {
            const r1 = populatedRegions[i];

            for (let j = i + 1; j < populatedRegions.length; j++) {
                const r2 = populatedRegions[j];

                const r1HasR2 = r1.neighbors.includes(r2);
                const r2HasR1 = r2.neighbors.includes(r1);

                if (this.intersects(r1.center, r1.radius, r2.center, r2.radius)) {
                    // Both must list each other (Symmetry)
                    if (!r1HasR2 || !r2HasR1) {
                        throw new Error("Validation failed: Intersecting populated region pair is missing from one or both neighbor lists.");
                    }
                } else {
                    // Neither must list the other
                    if (r1HasR2 || r2HasR1) {
                        throw new Error("Validation failed: Non-intersecting region pair found in neighbor list.");
                    }
                }
            }
        }
    }
}