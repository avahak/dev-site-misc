/*
Split/collapse scheme using (close to)
    w(R)=\sum_{Q:lvl(Q)=lvl(R),R overlaps Q}n(Q).
Computing w(R) is only done once per frame and split/collapse decision based on this.
*/

// Efficient for small arrays.
function removeFromArray<T>(array: T[], item: T): boolean {
    const index = array.indexOf(item);
    if (index > -1) {
        array[index] = array[array.length - 1];
        array.pop();
        return true;
    }
    return false;
}

export interface SpatialAdapter<T> {
    distance(a: T, b: T): number;
    clone(point: T): T;
}

export const NodeType = {
    Root: 0,
    Internal: 1,
    Leaf: 2,
} as const;

export type NodeType = typeof NodeType[keyof typeof NodeType];

export interface SphereObject<T> {
    center: T;
    radius: number;
    margin: number;
    parentNode: RegionNode<T> | Root<T> | null;
    nativeLevel: number;
    readonly id: number;
}

export class Root<T> {
    public type = NodeType.Root;
    public children: RegionNode<T>[] = [];
    public objects: SphereObject<T>[] = [];
}

export class RegionNode<T> {
    private static nextId = 0;
    public readonly id: number = RegionNode.nextId++;

    public type: typeof NodeType.Leaf | typeof NodeType.Internal;
    public center: T;
    public level: number;
    public radius: number;
    public children: RegionNode<T>[] = [];
    public deferred: SphereObject<T>[] = [];
    public native: SphereObject<T>[] = [];
    public parentNode: RegionNode<T> | Root<T> | null = null;

    // For tree balancing:
    /** Number of objects in the whole subtree */
    public subtreeCount: number = 0;
    /** 2*n(R) + \sum_{Q overlaps R, Q\ne R, lvl(Q)=lvl(R)}n(Q) */
    public overlapSum: number = 0;

    constructor(tree: LazyTree<T>, center: T, level: number) {
        this.type = NodeType.Leaf;
        this.center = tree.params.adapter.clone(center);
        this.level = level;
        this.radius = Math.pow(tree.params.S, level);
    }
}

export interface LazyTreeParameters<T> {
    adapter: SpatialAdapter<T>;
    /** Ratio of radii between parent region and the region */
    S: number;
    /** Maximum region level */
    maxLevel: number;
    tCollapse: number;
    tSplit: number;
}

export class LazyTree<T> {
    public root: Root<T>;
    params: LazyTreeParameters<T>;
    populatedRegions: Set<RegionNode<T>> = new Set();

    constructor(params: LazyTreeParameters<T>) {
        this.params = params;
        if (params.S <= 1)
            throw Error("Invalid S.");
        this.root = new Root();
    }

    public createObject(center: T, radius: number, margin: number, id: number) {
        const obj: SphereObject<T> = {
            center: this.params.adapter.clone(center),
            radius: radius,
            margin: margin,
            parentNode: null,
            id: id,
            nativeLevel: Math.floor(Math.log(radius + margin) / Math.log(this.params.S)) + 1,
        }
        return obj;
    }

    private encloses(outer: SphereObject<T> | RegionNode<T>, inner: SphereObject<T> | RegionNode<T>): boolean {
        const d = this.params.adapter.distance(inner.center, outer.center);
        return d + inner.radius <= outer.radius;
    }

    private enclosesVerbose(outerCenter: T, outerRadius: number, innerCenter: T, innerRadius: number): boolean {
        const d = this.params.adapter.distance(innerCenter, outerCenter);
        return d + innerRadius <= outerRadius;
    }

    private overlaps(ball1: SphereObject<T> | RegionNode<T>, ball2: SphereObject<T> | RegionNode<T>): boolean {
        const d = this.params.adapter.distance(ball1.center, ball2.center);
        return d < ball1.radius + ball2.radius;
    }

    private overlapsVerbose(ball1Center: T, ball1Radius: number, ball2Center: T, ball2Radius: number): boolean {
        const d = this.params.adapter.distance(ball1Center, ball2Center);
        return d < ball1Radius + ball2Radius;
    }

    private isEmpty(node: RegionNode<T>): boolean {
        return node.native.length === 0 && node.deferred.length === 0 && node.children.length === 0;
    }

    /**
     * Removes empty regions checking ancestor nodes also if needed.
     */
    private prune(node: RegionNode<T>) {
        // Remove empty regions.
        while (this.isEmpty(node)) {
            const parent = node.parentNode;
            if (!parent)
                return;
            removeFromArray(parent.children, node);
            node.parentNode = null;
            if (parent.type === NodeType.Root)
                return;
            node = parent;
        }
    }

    private split(node: RegionNode<T>, allowBatchInsert: boolean) {
        // Only leaves can be split.
        if (node.type !== NodeType.Leaf)
            return;

        // Start accepting children
        node.type = NodeType.Internal;

        // Insert the old deferred objects back into the tree.
        if (allowBatchInsert)
            this.batchInsert(node.deferred, node.center, node.radius);
        else {
            for (const obj of node.deferred)
                this.insert(obj);
        }

        node.deferred.length = 0;
        this.prune(node);
    }

    /** 
     * Given enclosing regions at level k+1, derive the level-k regions that enclose O, 
     * while simultaneously identifying the closest one that generously encloses O.
     */
    private enclosingChildRegions(
        regionList: (RegionNode<T> | Root<T>)[],
        center: T,
        radius: number,
        requiredChildRadius: number,
        outRegions: (RegionNode<T> | Root<T>)[],
    ): RegionNode<T> | null {
        outRegions.length = 0;
        let bestDistance = Number.POSITIVE_INFINITY;
        let bestGenerousRegion = null;
        for (const parent of regionList) {
            for (const child of parent.children) {
                const d = this.params.adapter.distance(child.center, center);
                if (d + radius <= child.radius) {
                    outRegions.push(child);
                    if (d + requiredChildRadius <= child.radius && d < bestDistance) {
                        bestGenerousRegion = child;
                        bestDistance = d;
                    }
                }
            }
        }
        return bestGenerousRegion;
    }

    private insertWithPrefix(obj: SphereObject<T>, overlappingRegions: (RegionNode<T> | Root<T>)[], possibleParent: Root<T> | RegionNode<T>, startLevel: number) {
        let enclosingRegions: (RegionNode<T> | Root<T>)[] = [];
        for (const region of overlappingRegions)
            if (region.type === NodeType.Root || this.encloses(region, obj))
                enclosingRegions.push(region);

        let nextEnclosingRegions: (RegionNode<T> | Root<T>)[] = [];

        for (let level = startLevel; level >= obj.nativeLevel; level--) {
            // Above native level, require enough room for a hypothetical child
            // region centered at obj.center; at native level, require enclosure.
            const requiredChildRadius = (level > obj.nativeLevel) ? this.params.S ** (level - 1) : obj.radius;
            const bestGenerousRegion = this.enclosingChildRegions(enclosingRegions, obj.center, obj.radius, requiredChildRadius, nextEnclosingRegions);

            if (!bestGenerousRegion) {
                // No generously enclosing region found, so create new leaf at this level 
                // under possibleParent and store object there.
                const newLeaf = new RegionNode<T>(this, obj.center, level);
                if (level === obj.nativeLevel)
                    newLeaf.native.push(obj);
                else
                    newLeaf.deferred.push(obj);
                obj.parentNode = newLeaf;
                possibleParent.children.push(newLeaf);
                newLeaf.parentNode = possibleParent;
                return;
            }
            if (bestGenerousRegion.type === NodeType.Leaf) {
                // Add object to the objects of the found leaf.
                obj.parentNode = bestGenerousRegion;
                if (level === obj.nativeLevel)
                    bestGenerousRegion.native.push(obj);
                else
                    bestGenerousRegion.deferred.push(obj);

                // Check if the leaf is very full already and if yes, do emergency split.
                // This can happen when all the objects are inserted at once during initialization.
                const msLow = 2 * bestGenerousRegion.deferred.length * (bestGenerousRegion.native.length + bestGenerousRegion.deferred.length);
                if (msLow > this.params.tSplit)
                    this.split(bestGenerousRegion, false);
                return;
            }
            if (bestGenerousRegion.type === NodeType.Internal && level === obj.nativeLevel) {
                // Internal node at native level.
                bestGenerousRegion.native.push(obj);
                obj.parentNode = bestGenerousRegion;
                return;
            }
            // The case remaining is that bestGenerousRegion is internal node and 
            // level > obj.nativeLevel and in this case we can descend.
            possibleParent = bestGenerousRegion;
            [enclosingRegions, nextEnclosingRegions] = [nextEnclosingRegions, enclosingRegions];
        }
        // We should never reach here:
        throw new Error("Insertion failed: no parent region found.");
    }

    public insert(obj: SphereObject<T>) {
        if (obj.nativeLevel > this.params.maxLevel) {
            obj.parentNode = this.root;
            this.root.objects.push(obj);
            return;
        }
        if (!this.insertGreedyAttempt(obj))
            this.insertWithPrefix(obj, [this.root], this.root, this.params.maxLevel);
    }

    /**
     * Try to just descend into child region with closest center and insert 
     * if we end up in leaf or native level region.
     */
    private insertGreedyAttempt(obj: SphereObject<T>): boolean {
        let parent: RegionNode<T> | Root<T> = this.root;
        while (true) {
            let bestDistance = Number.POSITIVE_INFINITY;
            let bestChild: RegionNode<T> | null = null;
            const children: RegionNode<T>[] = parent.children;
            for (const child of children) {
                const d = this.params.adapter.distance(child.center, obj.center);
                if (d + obj.radius <= child.radius && d < bestDistance) {
                    bestChild = child;
                    bestDistance = d;
                }
            }
            if (!bestChild)
                return false;
            if (bestChild.level === obj.nativeLevel) {
                bestChild.native.push(obj);
                obj.parentNode = bestChild;
                return true;
            }
            if (bestChild.type === NodeType.Leaf) {
                bestChild.deferred.push(obj);
                obj.parentNode = bestChild;
                // Check if the leaf is very full already and if yes, do emergency split.
                // This can happen when all the objects are inserted at once during initialization.
                const msLow = 2 * bestChild.deferred.length * (bestChild.native.length + bestChild.deferred.length);
                if (msLow > this.params.tSplit)
                    this.split(bestChild, false);
                return true;
            }
            parent = bestChild;
        }
    }

    /**
     * Insert all objects that are enclosed by a common ball.
     */
    public batchInsert(objs: SphereObject<T>[], enclosingCenter: T, enclosingRadius: number) {
        // Find prefix
        let overlappingRegions: (RegionNode<T> | Root<T>)[] = [this.root];
        let possibleParent: RegionNode<T> | Root<T> = this.root;
        let nextOverlappingRegions: (RegionNode<T> | Root<T>)[] = [];

        let level = this.params.maxLevel;
        for (; true; level--) {
            const generousRadius = enclosingRadius + this.params.S ** (level - 1);
            let bestDistance = Number.POSITIVE_INFINITY;
            let bestGenerousRegion = null;
            nextOverlappingRegions.length = 0;
            for (const parent of overlappingRegions) {
                for (const child of parent.children) {
                    const d = this.params.adapter.distance(child.center, enclosingCenter);
                    if (d < enclosingRadius + child.radius) {
                        nextOverlappingRegions.push(child);
                        if (d + generousRadius <= child.radius && d < bestDistance) {
                            bestGenerousRegion = child;
                            bestDistance = d;
                        }
                    }
                }
            }

            if (!bestGenerousRegion)
                break;
            [overlappingRegions, nextOverlappingRegions] = [nextOverlappingRegions, overlappingRegions];
            possibleParent = bestGenerousRegion;
        }

        // Insert all with prefix
        for (const obj of objs) {
            // if (!this.insertGreedyAttempt(obj))
            this.insertWithPrefix(obj, overlappingRegions, possibleParent, level);
        }
    }

    public delete(obj: SphereObject<T>) {
        const parent = obj.parentNode;
        if (!parent)
            return;
        obj.parentNode = null;
        if (parent.type === NodeType.Root) {
            removeFromArray(parent.objects, obj);
            return;
        }
        if (obj.nativeLevel === parent.level)
            removeFromArray(parent.native, obj);
        else
            removeFromArray(parent.deferred, obj);
        this.prune(parent);
    }

    public updateObject(obj: SphereObject<T>) {
        const parent = obj.parentNode;
        if (!parent || parent.type === NodeType.Root)
            return;

        // Check if parent still encloses object.
        if (this.encloses(parent, obj))
            return;

        // Remove from parent.
        if (obj.nativeLevel === parent.level)
            removeFromArray(parent.native, obj);
        else
            removeFromArray(parent.deferred, obj);
        obj.parentNode = null;

        this.insert(obj);
        this.prune(parent);
    }

    // public enclosureQuery(
    //     queryCenter: T,
    //     queryRadius: number,
    //     minLevel: number = -Infinity
    // ): Map<number, RegionNode<T>[]> {
    //     const resultsMap = new Map<number, RegionNode<T>[]>();

    //     const traverse = (regions: RegionNode<T>[]) => {
    //         for (const region of regions) {
    //             if (this.enclosesVerbose(region.center, region.radius, queryCenter, queryRadius)) {
    //                 let levelArr = resultsMap.get(region.level);
    //                 if (!levelArr) {
    //                     levelArr = [];
    //                     resultsMap.set(region.level, levelArr);
    //                 }
    //                 levelArr.push(region);

    //                 if (region.level > minLevel)
    //                     traverse(region.children);
    //             }
    //         }
    //     };

    //     if (this.params.maxLevel >= minLevel)
    //         traverse(this.root.children);

    //     return resultsMap;
    // }

    public overlapQuery(
        queryCenter: T,
        queryRadius: number,
        minLevel: number = -Infinity
    ): RegionNode<T>[] {
        const resultsArray: RegionNode<T>[] = [];

        const traverse = (regions: RegionNode<T>[]) => {
            for (const region of regions) {
                if (this.overlapsVerbose(region.center, region.radius, queryCenter, queryRadius)) {
                    resultsArray.push(region);

                    if (region.level > minLevel)
                        traverse(region.children);
                }
            }
        };

        if (this.params.maxLevel >= minLevel)
            traverse(this.root.children);

        return resultsArray;
    }

    /**
     * Runs collision detection and also performs split/collapse when needed.
     */
    public processCollisionFrame(rebalance: boolean): [number, number][] {
        const pairs: [number, number][] = [];

        this.initMetrics();

        const rootObjs = this.root.objects;
        const rootChildren = this.root.children;

        // Root objects against each other
        for (let i = 0; i < rootObjs.length; i++)
            for (let j = i + 1; j < rootObjs.length; j++) {
                if (this.overlaps(rootObjs[i], rootObjs[j]))
                    pairs.push([rootObjs[i].id, rootObjs[j].id]);
            }

        // Root objects against top-level region trees
        for (const obj of rootObjs)
            for (const child of rootChildren)
                this.processObjectRegion(obj, child, pairs);

        // Within each top-level subtree
        for (const child of rootChildren)
            this.processRegion(child, pairs);

        // Between different top-level subtrees
        for (let i = 0; i < rootChildren.length; i++)
            for (let j = i + 1; j < rootChildren.length; j++)
                this.processRegionPair(rootChildren[i], rootChildren[j], pairs);

        if (rebalance)
            this.rebalance();

        return pairs;
    }

    // Test every object in listA against every object in listB
    private processObjectListPair(
        listA: SphereObject<T>[],
        listB: SphereObject<T>[],
        pairs: [number, number][]
    ): void {
        if (listA.length === 0 || listB.length === 0)
            return;
        for (const objA of listA)
            for (const objB of listB) {
                if (this.overlaps(objA, objB))
                    pairs.push([objA.id, objB.id]);
            }
    }

    // Test all direct objects within a single region against each other
    private processRegionDirectSelf(
        region: RegionNode<T>,
        pairs: [number, number][]
    ): void {
        // Native vs Native
        for (let i = 0; i < region.native.length; i++)
            for (let j = i + 1; j < region.native.length; j++) {
                if (this.overlaps(region.native[i], region.native[j]))
                    pairs.push([region.native[i].id, region.native[j].id]);
            }

        // Deferred vs Deferred
        for (let i = 0; i < region.deferred.length; i++)
            for (let j = i + 1; j < region.deferred.length; j++) {
                if (this.overlaps(region.deferred[i], region.deferred[j]))
                    pairs.push([region.deferred[i].id, region.deferred[j].id]);
            }

        // Native vs Deferred
        this.processObjectListPair(region.native, region.deferred, pairs);
    }

    private processRegion(region: RegionNode<T>, pairs: [number, number][]): void {
        region.overlapSum += 2 * region.subtreeCount;

        // Direct objects against each other
        this.processRegionDirectSelf(region, pairs);

        // Direct objects vs descendant subtrees
        for (const child of region.children) {
            for (const obj of region.native)
                this.processObjectRegion(obj, child, pairs);
            for (const obj of region.deferred)
                this.processObjectRegion(obj, child, pairs);
        }

        // Recurse down each child
        for (const child of region.children)
            this.processRegion(child, pairs);

        // Cross-interactions between child subtrees
        for (let i = 0; i < region.children.length; i++)
            for (let j = i + 1; j < region.children.length; j++)
                this.processRegionPair(region.children[i], region.children[j], pairs);
    }

    private processRegionPair(a: RegionNode<T>, b: RegionNode<T>, pairs: [number, number][]): void {
        if (!this.overlaps(a, b))
            return;

        if (a.level === b.level) {
            a.overlapSum += b.subtreeCount;
            b.overlapSum += a.subtreeCount;
        }

        // Direct objects in A vs direct objects in B
        this.processObjectListPair(a.native, b.native, pairs);
        this.processObjectListPair(a.native, b.deferred, pairs);
        this.processObjectListPair(a.deferred, b.native, pairs);
        this.processObjectListPair(a.deferred, b.deferred, pairs);

        // Direct objects in A vs descendants of B
        for (const childB of b.children) {
            for (const objA of a.native)
                this.processObjectRegion(objA, childB, pairs);
            for (const objA of a.deferred)
                this.processObjectRegion(objA, childB, pairs);
        }

        // Direct objects in B vs descendants of A
        for (const childA of a.children) {
            for (const objB of b.native)
                this.processObjectRegion(objB, childA, pairs);
            for (const objB of b.deferred)
                this.processObjectRegion(objB, childA, pairs);
        }

        // Descendants of A vs Descendants of B
        for (const childA of a.children)
            for (const childB of b.children)
                this.processRegionPair(childA, childB, pairs);
    }

    private processObjectRegion(obj: SphereObject<T>, region: RegionNode<T>, pairs: [number, number][]): void {
        if (!this.overlaps(obj, region))
            return;

        // Test object against direct objects in region
        for (const other of region.native) {
            if (this.overlaps(obj, other))
                pairs.push([obj.id, other.id]);
        }
        for (const other of region.deferred) {
            if (this.overlaps(obj, other))
                pairs.push([obj.id, other.id]);
        }

        // Recurse down child branches
        for (const child of region.children)
            this.processObjectRegion(obj, child, pairs);
    }

    public findCollisionsBruteForce(objs: SphereObject<T>[]): [number, number][] {
        const pairs: [number, number][] = [];
        for (let i = 0; i < objs.length; i++) {
            const obj1 = objs[i];
            for (let j = i + 1; j < objs.length; j++) {
                const obj2 = objs[j];
                const radiusSum = obj1.radius + obj2.radius;
                if (this.params.adapter.distance(obj1.center, obj2.center) < radiusSum)
                    pairs.push([obj1.id, obj2.id]);
            }
        }
        return pairs;
    }

    /**
     * Compute n(R)=(number of objects in the R subtree) for every region and reset w(R) to 0. 
     */
    private initMetrics() {
        for (const region of this.root.children)
            this.initMetricsTraverse(region);
    }

    private initMetricsTraverse(node: RegionNode<T>): number {
        let total = node.native.length + node.deferred.length;
        for (const child of node.children)
            total += this.initMetricsTraverse(child);
        node.subtreeCount = total;
        node.overlapSum = 0;
        return total;
    }

    private collapse(region: RegionNode<T>): void {
        // Only internal nodes can be collapsed
        if (region.type !== NodeType.Internal)
            return;
        region.type = NodeType.Leaf;

        const collectFromSubtree = (node: RegionNode<T>): void => {
            for (const child of node.children) {
                // Move native objects
                for (const obj of child.native) {
                    obj.parentNode = region;
                    region.deferred.push(obj);
                }
                child.native.length = 0;

                // Move deferred objects
                for (const obj of child.deferred) {
                    obj.parentNode = region;
                    region.deferred.push(obj);
                }
                child.deferred.length = 0;

                collectFromSubtree(child);
            }
            node.children.length = 0;
        };
        collectFromSubtree(region);
    }

    public rebalance() {
        for (const child of this.root.children)
            this.rebalanceTraverse(child);
    }

    private rebalanceTraverse(region: RegionNode<T>) {
        const m = region.subtreeCount - region.native.length;
        const ms = m * region.overlapSum;

        if (region.type === NodeType.Internal && ms < this.params.tCollapse) {
            this.collapse(region);
            return;
        }
        if (region.type === NodeType.Leaf && ms > this.params.tSplit) {
            this.split(region, true);
            return;
        }

        for (const child of region.children)
            this.rebalanceTraverse(child);
    }

    public validateCollisionMethods(objects: SphereObject<T>[]): void {
        const pairKey = (a: number, b: number) =>
            a < b ? `${a}:${b}` : `${b}:${a}`;

        const brute = this.findCollisionsBruteForce(objects).map(([a, b]) => pairKey(a, b)).sort();
        const recursive = this.processCollisionFrame(false).map(([a, b]) => pairKey(a, b)).sort();

        // Recursive dual-traversal must match brute force exactly (1:1)
        if (brute.length !== recursive.length || !brute.every((key, i) => key === recursive[i]))
            throw new Error("Recursive collision detection mismatch with brute force.");
    }

    public collectRegions(node: RegionNode<T> | Root<T>, regions: RegionNode<T>[]): RegionNode<T>[] {
        if (node instanceof RegionNode)
            regions.push(node);
        for (const child of node.children)
            this.collectRegions(child, regions);
        return regions;
    }

    /**
     * Testing tree invariants. Throws an error if an invariant fails.
     */
    public validate(objects: SphereObject<T>[]): void {
        const regions = this.collectRegions(this.root, []);
        const seenObjects: Set<SphereObject<T>> = new Set();

        for (const obj of this.root.objects)
            seenObjects.add(obj);

        for (const region of regions) {
            for (const obj of region.native) {
                if (seenObjects.has(obj))
                    throw Error("Objects stored twice");
                seenObjects.add(obj);
                if (obj.parentNode !== region)
                    throw Error("Incorrect object parentNode");
            }
            for (const obj of region.deferred) {
                if (seenObjects.has(obj))
                    throw Error("Objects stored twice");
                seenObjects.add(obj);
                if (obj.parentNode !== region)
                    throw Error("Incorrect object parentNode");
            }

            const parent = region.parentNode;
            if (!parent)
                throw Error("Region has no parent node");

            if (this.isEmpty(region))
                throw Error("Region is empty");

            if (region.type === NodeType.Internal && region.deferred.length > 0)
                throw Error("Internal node has deferred objects");

            if (region.type === NodeType.Leaf && region.children.length > 0)
                throw Error("Leaf node has children");

            if (region.deferred.length !== 0 && region.children.length !== 0)
                throw Error("Region has deferred objects and children.");

            if (parent.type !== NodeType.Root)
                if (!this.encloses(parent, region))
                    throw Error("Region is not enclosed by parent.");

            for (const obj of region.native)
                if (!this.encloses(region, obj))
                    throw Error("Object is not enclosed by its region.");
            for (const obj of region.deferred)
                if (!this.encloses(region, obj))
                    throw Error("Object is not enclosed by its region.");

            for (const obj of region.native)
                if (obj.nativeLevel !== region.level)
                    throw Error("Object stored in native but levels do not match");

            for (const obj of region.deferred)
                if (obj.nativeLevel >= region.level)
                    throw Error("Object stored in deferred but levels do not match");

            for (const obj1 of region.native)
                for (const obj2 of region.deferred)
                    if (obj1.id === obj2.id)
                        throw Error("Object stored in both native and deferred");

            if (parent.type === NodeType.Root && region.level !== this.params.maxLevel)
                throw Error("Root should only store regions of level maxLevel");

            if (parent.type !== NodeType.Root && parent.level !== region.level + 1)
                throw Error("Parent of a region should be one level higher");
        }

        this.validateCollisionMethods(objects);
    }
}