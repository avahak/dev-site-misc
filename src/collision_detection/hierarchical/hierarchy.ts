/*
- mostly implemented by AI
- Set vs array for objects, children? These are very small so likely Set is inefficient
*/

/*
## Loose spherical hierarchy for moving objects

Let S>1 be a scaling factor.

The structure stores a set of objects represented by balls (O = B(c,r)) with 
fixed radius (r) and time-varying center (c). The tree indexes them using a hierarchy 
of spherical regions. Every non-root node is a region (R = B(q, S^k)), 
where (k \in \mathbb{Z}) is the level of the region. The root is not geometric; 
it is only the top-level organizer. Regions of level (k_0) are the only children 
of the root, and there are no regions above level (k_0).

The algorithm is stated for an abstract metric space. No coordinate system is required. 
The implementation must provide containment and intersection tests for balls, and must 
also provide a way to compare the distance between centers when a tie-break is needed.

A fixed parameter (a > 1) controls looseness. For an object (B(c,r)), its admissible 
level is the unique integer (k) such that
[
S^{k-1} \le a r < S^k.
]
If (a r \ge S^{k_0}), the object is too large for any region level and is stored 
directly under the root.

The tree satisfies the following invariants. Every non-root node is a region whose 
radius is exactly (S^k) for its level (k). Each region may store any number of objects 
and may have any number of child regions. Every object is stored in exactly one region, 
or directly in the root, and stores a reference to that node. Every child region 
and every stored object must be fully contained in its parent region. A region must 
not be empty: each region has at least one stored object or at least one child region. 
The parent of a level-(k) region is either a level-((k+1)) region or the root if (k = k_0).

Note that every region is a bounding ball for its entire subtree and all objects
stored within that subtree.

When a new region must be created, its center is chosen to be the center of the child 
it will contain.

## Intersection query

An intersection query takes three inputs: a query ball (B), a minimum radius (r_0 > 0), 
and a boolean flag `group_by_level`.

The output is every region in the tree that intersects (B) and whose radius is 
at least (r_0). If `group_by_level = true`, the result is returned as a map from 
level to the list of matching regions at that level.

The query is performed top-down. Start from the children of the root. For each visited 
region, test intersection with (B). If the region intersects (B) and its radius is 
at least (r_0), include it in the output. Then recurse only into children that 
intersect (B). If a region’s radius is smaller than (r_0), do not report it and do not 
descend below it.

The query returns regions, not objects.

## Insertion of an object

To insert an object (O = B(c,r)), first compute its admissible level (k).

If (a r \ge S^{k_0}), store the object directly under the root and stop.

Otherwise, perform an intersection query with query ball (O), threshold (r_0 = a r), 
and `group_by_level = true`.

Search the returned regions at level (k). If one or more of them fully contain (O), 
choose one of those regions, preferring the one whose center is closest to (c), and 
store the object there. Then stop.

If no suitable level-(k) region exists, create a new region (R_k = B(c, S^k)) 
centered at (c), store the object in (R_k), and then connect (R_k) upward.

To connect (R_k) upward, let (j := k) and repeat the following step. Search the query 
results at level (j+1) for a region that fully contains (R_j). If one exists, choose 
one of those regions, preferring the one whose center is closest to the center of (R_j), 
and make it the parent of (R_j). If none exists, and if (j+1 \le k_0), create 
a new region (R_{j+1} = B(c, S^{j+1})) centered at (c), make (R_j) its child, 
set (j := j+1), and continue. If (j = k_0) is reached without finding a parent, 
attach the resulting level-(k_0) region directly to the root.

This procedure always reuses an existing valid region when possible and otherwise 
creates the shortest necessary chain of new ancestors.

## Deletion of an object

To delete an object, start from the region that currently stores it.

Remove the object from that region. If the region is now empty, remove it from its parent. 
Then apply the same test to the parent: if the parent is empty, remove it as well; 
otherwise stop. Continue upward until a nonempty region is encountered or the root 
is reached.

## Updating after an object moves

Let an object (O) move to a new center but keep the same radius. Let (H) be the node 
that currently stores (O). This node is either a region or the root.

If (H) is the root, no tree change is needed. Stop.

If (O) is still fully contained in (H), no tree change is needed. Stop.

Otherwise, remove (O) from (H), then insert (O) using the normal insertion procedure.

After the reinsertion completes, clean up the old path. If (H) is now empty, 
remove (H) from its parent. Then apply the same test to the parent of (H): 
if it is empty, remove it too; otherwise stop. Continue upward only as long as regions 
become empty. Stop immediately when a region is nonempty or when the root is reached.

This order is important. Reinsertion happens before pruning, so any ancestor of (H) 
that can still be reused by the moved object remains available during insertion. 
Only the part of the old chain that is no longer needed is deleted.

## Notes on behavior

The object radius never changes during updates, so the admissible level of an object
is determined entirely by its radius and does not need to be recomputed for movement 
updates. The update operation is therefore a localized relocation: preserve the current 
storage node when possible, otherwise move the object to the smallest valid existing 
region or create only the minimum new structure needed to restore the invariants.

This tree is intended as the broad-phase spatial index for later collision detection, 
but the structure defined here only covers storage, queries, insertion, deletion, 
and movement updates.
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
    public center: THREE.Vector3;
    public level: number;
    public radius: number;
    public children: Region[] = [];
    public objects: SphereObject[] = [];
    public parentNode: Region | Root | null = null;

    constructor(center: THREE.Vector3, level: number, scalingFactor: number) {
        this.center = center.clone();
        this.level = level;
        this.radius = Math.pow(scalingFactor, level);
    }
}

export class LooseSphericalHierarchy {
    public root: Root;
    public a: number;
    public k0: number;
    public scalingFactor: number;

    constructor(k0: number, a: number, scalingFactor: number = 2) {
        if (a <= 1 || scalingFactor <= 1)
            throw Error("Invalid parameter.");
        this.a = a;
        this.k0 = k0;
        this.scalingFactor = scalingFactor;
        this.root = new Root();
    }

    // Overloads for the query method based on the `groupByLevel` flag
    public intersectionQuery(
        queryCenter: THREE.Vector3,
        queryRadius: number,
        r0: number,
        groupByLevel: true
    ): Map<number, Region[]>;

    public intersectionQuery(
        queryCenter: THREE.Vector3,
        queryRadius: number,
        r0: number,
        groupByLevel: false
    ): Region[];

    public intersectionQuery(
        queryCenter: THREE.Vector3,
        queryRadius: number,
        r0: number,
        groupByLevel: boolean
    ): Region[] | Map<number, Region[]> {

        const resultsArray: Region[] = [];
        const resultsMap = new Map<number, Region[]>();

        // Recursively walk the hierarchy
        const traverse = (regions: Region[]) => {
            for (const region of regions) {
                // Stop descending if the region's radius is smaller than the threshold
                if (region.radius < r0)
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

    public insert(obj: SphereObject): void {
        // Calculate the admissible level k
        // S^(k-1) <= a * r < S^k  =>  k = floor(log_S(a * r)) + 1
        const ar = this.a * obj.radius;
        const k = Math.floor(Math.log(ar) / Math.log(this.scalingFactor)) + 1;

        // If too large for any region, store directly in root
        if (ar >= Math.pow(this.scalingFactor, this.k0)) {
            this.root.objects.push(obj);
            obj.parentNode = this.root;
            return;
        }

        // Query the tree for potential parent regions
        const queryResults = this.intersectionQuery(obj.center, obj.radius, ar, true);
        const levelKRegions = queryResults.get(k) || [];

        // Attempt to find an existing level-k region that fully contains the object
        const bestRegion = this.findBestContainingRegion(levelKRegions, obj.center, obj.radius);

        if (bestRegion) {
            bestRegion.objects.push(obj);
            obj.parentNode = bestRegion;
            return;
        }

        // No suitable level-k region found, create a new one centered at the object
        let currentRegion = new Region(obj.center, k, this.scalingFactor);
        currentRegion.objects.push(obj);
        obj.parentNode = currentRegion;

        // Connect the new region upward
        let j = k;
        while (true) {
            if (j === this.k0) {
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

            // Reinsert
            this.insert(obj);

            // Clean up the old path now that insertion is complete and might have reused nodes
            this.prune(H);
        }
    }

    // --- Private Helper Methods ---

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
        // Optimization opportunity: we can avoid square root here by checking:
        // parentRadius >= childRadius && centerDistSq <= (parentRadius - childRadius)^2
        const dist = parentCenter.distanceTo(childCenter);
        return dist + childRadius <= parentRadius;
    }

    private intersects(center1: THREE.Vector3, r1: number, center2: THREE.Vector3, r2: number): boolean {
        // Optimization opportunity: Using squared distance avoids Math.sqrt().
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
    public findCollisions(): [number, number][] {
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
                const regions = this.intersectionQuery(obj.center, obj.radius, 0, false);

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
            const regions = this.intersectionQuery(obj.center, obj.radius, 0, false);

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
}