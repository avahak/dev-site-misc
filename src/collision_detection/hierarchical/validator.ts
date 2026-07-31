import { LooseSphericalHierarchy, Region, Root, SphereObject } from "./tree";

export class LooseSphericalHierarchyValidator<T> {
    public tree: LooseSphericalHierarchy<T>;

    constructor(tree: LooseSphericalHierarchy<T>) {
        this.tree = tree;
    }

    /**
     * Comprehensively validates the spatial tree against its core structural invariants.
     * Throws an error immediately if any invariant is violated, aiding in debugging.
     * 
     * Invariants validated:
     * 1. Object storage: Every object is stored in exactly one region at its admissible level (or root).
     * 2. Enclosure: Every parent region encloses each of its child regions and stored objects.
     * 3. Topology: The parent of a level-k region is either level-(k+1), or the root if k = maxLevel.
     * 4. Pruning: Every region contains at least one stored object or at least one child region.
     * 5. Neighbors: Populated regions track overlapping populated regions. Unpopulated track none.
     */
    public validateInvariants(): void {
        const seenObjects = new Set<SphereObject<T>>();
        const allRegions: Region<T>[] = [];

        // Helper function to recursively walk the tree
        const traverse = (node: Root<T> | Region<T>) => {

            if (node instanceof Region) {
                allRegions.push(node);

                // --- 4. Pruning ---
                if (node.objects.length === 0 && node.children.length === 0) {
                    throw new Error(`Pruning violation: Region at level ${node.level} is completely empty.`);
                }

                // --- 3. Topology ---
                if (node.parentNode instanceof Root) {
                    if (node.level !== this.tree.maxLevel) {
                        throw new Error(`Topology violation: Region attached to root has level ${node.level}, expected ${this.tree.maxLevel}.`);
                    }
                } else if (node.parentNode instanceof Region) {
                    if (node.parentNode.level !== node.level + 1) {
                        throw new Error(`Topology violation: Region at level ${node.level} has parent at level ${node.parentNode.level}.`);
                    }
                } else {
                    throw new Error(`Topology violation: Region has no valid parentNode.`);
                }
            }

            // --- 1. Object Storage & 2. Enclosure (Objects) ---
            for (const obj of node.objects) {
                // Object must be stored exactly once
                if (seenObjects.has(obj)) {
                    throw new Error(`Object Storage violation: Object ${obj.id} found in multiple regions.`);
                }
                seenObjects.add(obj);

                // Object must maintain a reference to its parent
                if (obj.parentNode !== node) {
                    throw new Error(`Object Storage violation: Object ${obj.id} parentNode does not point to current region.`);
                }

                // Calculate where it *should* be
                const rm = obj.radius + obj.margin;
                const admissibleLevel = Math.floor(Math.log(rm) / Math.log(this.tree.scalingFactor)) + 1;
                const rootThreshold = Math.pow(this.tree.scalingFactor, this.tree.maxLevel);

                if (node instanceof Root) {
                    if (rm < rootThreshold) {
                        throw new Error(`Object Storage violation: Object ${obj.id} is in Root but its rm (${rm}) is < root threshold (${rootThreshold}).`);
                    }
                } else if (node instanceof Region) {
                    // Check admissible level
                    if (node.level !== admissibleLevel) {
                        throw new Error(`Object Storage violation: Object ${obj.id} at level ${node.level}, expected admissible level ${admissibleLevel}.`);
                    }

                    // Enclosure (Objects)
                    if (!this.tree.encloses(node.center, node.radius, obj.center, obj.radius)) {
                        throw new Error(`Enclosure violation: Region at level ${node.level} does not enclose object ${obj.id}.`);
                    }
                }
            }

            // --- 2. Enclosure (Children) ---
            for (const child of node.children) {
                if (node instanceof Region) {
                    if (!this.tree.encloses(node.center, node.radius, child.center, child.radius)) {
                        throw new Error(`Enclosure violation: Parent region at level ${node.level} does not enclose child at level ${child.level}.`);
                    }
                }
                traverse(child);
            }
        };

        // Start validation from the root
        traverse(this.tree.root);

        // --- 5. Neighbors ---
        // Verify the neighbor lists using the flat collection of all regions.
        const populatedSet = new Set(allRegions.filter(r => r.objects.length > 0));

        for (const region of allRegions) {
            const isPopulated = populatedSet.has(region);

            if (!isPopulated) {
                if (region.neighbors.length > 0) {
                    throw new Error(`Neighbor violation: Unpopulated region has non-empty neighbor list.`);
                }
                continue;
            }

            // For populated regions, build a strict list of what the neighbors *should* be
            const expectedNeighbors = new Set<Region<T>>();
            for (const otherRegion of allRegions) {
                if (region === otherRegion) continue; // Exclude itself

                if (populatedSet.has(otherRegion) && this.tree.overlaps(region.center, region.radius, otherRegion.center, otherRegion.radius)) {
                    expectedNeighbors.add(otherRegion);
                }
            }

            // Check if lengths match
            if (region.neighbors.length !== expectedNeighbors.size) {
                throw new Error(`Neighbor violation: Region expected ${expectedNeighbors.size} neighbors, but has ${region.neighbors.length}.`);
            }

            // Check if the actual neighbors exactly match the expected ones
            for (const neighbor of region.neighbors) {
                if (!expectedNeighbors.has(neighbor)) {
                    throw new Error(`Neighbor violation: Region contains invalid, unpopulated, or non-overlapping neighbor.`);
                }
            }
        }
    }

    /**
     * Finds all overlapping object pairs using a recursive traversal of the hierarchy.
     * The traversal is expressed through three mutually recursive routines operating on
     * a region, an object-region pair, and a region-region pair, respectively.
     *
     * Region processing handles collisions within a subtree, object-region processing
     * compares one object against an entire subtree, and region-region processing
     * compares two sibling subtrees. Whenever an object or subtree cannot ooverlap a
     * region, that branch of the recursion is discarded.
     *
     * The method returns the list of overlapping pairs produced by this traversal.
     */
    public findCollisionsRecursive(): [number, number][] {
        const collisions: [number, number][] = [];

        // Root objects against each other
        for (let i = 0; i < this.tree.root.objects.length; i++) {
            for (let j = i + 1; j < this.tree.root.objects.length; j++) {
                if (this.tree.overlaps(
                    this.tree.root.objects[i].center, this.tree.root.objects[i].radius,
                    this.tree.root.objects[j].center, this.tree.root.objects[j].radius
                )) {
                    collisions.push([this.tree.root.objects[i].id, this.tree.root.objects[j].id]);
                }
            }
        }

        // Root objects against top-level regions
        for (const obj of this.tree.root.objects) {
            for (const child of this.tree.root.children) {
                this.processObjectRegion(obj, child, collisions);
            }
        }

        // Within each top-level subtree
        for (const child of this.tree.root.children) {
            this.processRegion(child, collisions);
        }

        // Between different top-level subtrees
        for (let i = 0; i < this.tree.root.children.length; i++) {
            for (let j = i + 1; j < this.tree.root.children.length; j++) {
                this.processRegionPair(
                    this.tree.root.children[i],
                    this.tree.root.children[j],
                    collisions
                );
            }
        }

        return collisions;
    }

    private processRegion(region: Region<T>, collisions: [number, number][]): void {

        // Objects stored directly in this region.
        for (let i = 0; i < region.objects.length; i++) {
            for (let j = i + 1; j < region.objects.length; j++) {
                if (this.tree.overlaps(
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

    private processRegionPair(a: Region<T>, b: Region<T>, collisions: [number, number][]): void {
        if (!this.tree.overlaps(a.center, a.radius, b.center, b.radius))
            return;

        // Direct objects.
        for (const objA of a.objects) {
            for (const objB of b.objects) {
                if (this.tree.overlaps(
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
        obj: SphereObject<T>,
        region: Region<T>,
        collisions: [number, number][]
    ): void {
        if (!this.tree.overlaps(obj.center, obj.radius, region.center, region.radius))
            return;

        for (const other of region.objects) {
            if (this.tree.overlaps(
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


    /**
     * Counts overlapping object pairs by querying the tree once for every object.
     *
     * Each unordered pair is reported twice: once when querying from each object.
     * Self-pairs are skipped.
     */
    public findCollisionsByQuery(): [number, number][] {
        const collisions: [number, number][] = [];

        const processRegion = (region: Region<T>) => {
            for (const obj of region.objects) {

                // Test against root objects
                for (const other of this.tree.root.objects) {
                    if (this.tree.overlaps(
                        obj.center, obj.radius,
                        other.center, other.radius
                    )) {
                        collisions.push([obj.id, other.id]);
                    }
                }

                // Query all overlapping regions
                const regions = this.tree.overlapQuery(obj.center, obj.radius, false);

                for (const candidate of regions) {
                    for (const other of candidate.objects) {

                        if (other === obj)
                            continue;

                        if (this.tree.overlaps(
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
        for (const obj of this.tree.root.objects) {

            // Root vs root
            for (const other of this.tree.root.objects) {
                if (other === obj)
                    continue;

                if (this.tree.overlaps(
                    obj.center, obj.radius,
                    other.center, other.radius
                )) {
                    collisions.push([obj.id, other.id]);
                }
            }

            // Root vs tree
            const regions = this.tree.overlapQuery(obj.center, obj.radius, false);

            for (const region of regions) {
                for (const other of region.objects) {
                    if (this.tree.overlaps(
                        obj.center, obj.radius,
                        other.center, other.radius
                    )) {
                        collisions.push([obj.id, other.id]);
                    }
                }
            }
        }

        // Objects stored in regions
        for (const child of this.tree.root.children) {
            processRegion(child);
        }

        return collisions;
    }


    /**
     * Brute-force collision detection.
     *
     * Returns every unordered overlapping pair exactly once.
     * If (id1, id2) is included, then (id2, id1) is not.
     */
    public findCollisionsBruteForce(objects: SphereObject<T>[]): [number, number][] {
        const collisions: [number, number][] = [];

        for (let i = 0; i < objects.length; i++) {
            const obj1 = objects[i];

            for (let j = i + 1; j < objects.length; j++) {
                const obj2 = objects[j];

                const radiusSum = obj1.radius + obj2.radius;
                if (this.tree.adapter.distance(obj1.center, obj2.center) < radiusSum) {
                    collisions.push([obj1.id, obj2.id]);
                }
            }
        }

        return collisions;
    }

    collectRegions(node: Region<T> | Root<T>, regions: Region<T>[]): Region<T>[] {
        if (node instanceof Region)
            regions.push(node);
        for (const child of node.children)
            this.collectRegions(child, regions);
        return regions;
    }
}