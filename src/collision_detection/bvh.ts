// Mostly AI code
// heuristic: margin = maxVelocity * 3 ?

const MARGIN = 0.1;

export class AABB {
    constructor(
        public minX: number,
        public minY: number,
        public minZ: number,
        public maxX: number,
        public maxY: number,
        public maxZ: number
    ) { }

    public set(
        minX: number, minY: number, minZ: number,
        maxX: number, maxY: number, maxZ: number
    ): this {
        this.minX = minX;
        this.minY = minY;
        this.minZ = minZ;
        this.maxX = maxX;
        this.maxY = maxY;
        this.maxZ = maxZ;
        return this;
    }

    public copy(other: AABB): this {
        this.minX = other.minX;
        this.minY = other.minY;
        this.minZ = other.minZ;
        this.maxX = other.maxX;
        this.maxY = other.maxY;
        this.maxZ = other.maxZ;
        return this;
    }

    public getSurfaceArea(): number {
        const dX = this.maxX - this.minX;
        const dY = this.maxY - this.minY;
        const dZ = this.maxZ - this.minZ;
        return 2.0 * (dX * dY + dX * dZ + dY * dZ);
    }

    public union(other: AABB, target: AABB = new AABB(0, 0, 0, 0, 0, 0)): AABB {
        return target.set(
            Math.min(this.minX, other.minX),
            Math.min(this.minY, other.minY),
            Math.min(this.minZ, other.minZ),
            Math.max(this.maxX, other.maxX),
            Math.max(this.maxY, other.maxY),
            Math.max(this.maxZ, other.maxZ)
        );
    }

    public contains(other: AABB): boolean {
        return (
            this.minX <= other.minX &&
            this.minY <= other.minY &&
            this.minZ <= other.minZ &&
            this.maxX >= other.maxX &&
            this.maxY >= other.maxY &&
            this.maxZ >= other.maxZ
        );
    }

    public overlaps(other: AABB): boolean {
        if (this.maxX < other.minX || this.minX > other.maxX) return false;
        if (this.maxY < other.minY || this.minY > other.maxY) return false;
        if (this.maxZ < other.minZ || this.minZ > other.maxZ) return false;
        return true;
    }

    public fatten(margin: number, target: AABB = new AABB(0, 0, 0, 0, 0, 0)): AABB {
        return target.set(
            this.minX - margin,
            this.minY - margin,
            this.minZ - margin,
            this.maxX + margin,
            this.maxY + margin,
            this.maxZ + margin
        );
    }
}

export class TreeNode<T> {
    public aabb: AABB;
    public parent: TreeNode<T> | null = null;
    public left: TreeNode<T> | null = null;
    public right: TreeNode<T> | null = null;
    public isLeaf: boolean = false;
    public data: T | null = null;

    constructor(aabb: AABB) {
        this.aabb = aabb;
    }
}

export class DynamicBVH<T> {
    private root: TreeNode<T> | null = null;
    private margin: number = MARGIN;

    // Pre-allocated reusable structures to avoid per-frame GC pressure
    private queryStack: TreeNode<T>[] = new Array(256);
    private traversalStack: TreeNode<T>[] = new Array(256);
    private unionCache: AABB = new AABB(0, 0, 0, 0, 0, 0);

    public updateLeaf(leaf: TreeNode<T>, tightAABB: AABB): void {
        if (leaf.aabb.contains(tightAABB)) {
            return;
        }

        this.removeLeaf(leaf);
        tightAABB.fatten(this.margin, leaf.aabb);
        this.insertLeaf(leaf);
    }

    public insertLeaf(leaf: TreeNode<T>): void {
        if (!this.root) {
            this.root = leaf;
            this.root.parent = null;
            return;
        }

        const leafAABB = leaf.aabb;
        let bestSibling = this.root;
        let inheritedCost = 0;

        while (!bestSibling.isLeaf) {
            const left = bestSibling.left!;
            const right = bestSibling.right!;

            const areaBase = bestSibling.aabb.getSurfaceArea();
            const directCost = bestSibling.aabb.union(leafAABB, this.unionCache).getSurfaceArea();

            const costSibling = directCost + inheritedCost;
            const nextInheritedCost = inheritedCost + (directCost - areaBase);

            let costLeft: number;
            if (left.isLeaf) {
                costLeft = left.aabb.union(leafAABB, this.unionCache).getSurfaceArea() + nextInheritedCost;
            } else {
                const oldArea = left.aabb.getSurfaceArea();
                const newArea = left.aabb.union(leafAABB, this.unionCache).getSurfaceArea();
                costLeft = (newArea - oldArea) + nextInheritedCost;
            }

            let costRight: number;
            if (right.isLeaf) {
                costRight = right.aabb.union(leafAABB, this.unionCache).getSurfaceArea() + nextInheritedCost;
            } else {
                const oldArea = right.aabb.getSurfaceArea();
                const newArea = right.aabb.union(leafAABB, this.unionCache).getSurfaceArea();
                costRight = (newArea - oldArea) + nextInheritedCost;
            }

            if (costSibling < costLeft && costSibling < costRight) {
                break;
            }

            if (costLeft < costRight) {
                bestSibling = left;
                inheritedCost = nextInheritedCost;
            } else {
                bestSibling = right;
                inheritedCost = nextInheritedCost;
            }
        }

        const oldParent = bestSibling.parent;
        const newParentAABB = bestSibling.aabb.union(leafAABB, new AABB(0, 0, 0, 0, 0, 0));
        const newParent = new TreeNode<T>(newParentAABB);
        newParent.parent = oldParent;
        newParent.isLeaf = false;

        newParent.left = bestSibling;
        newParent.right = leaf;
        bestSibling.parent = newParent;
        leaf.parent = newParent;

        if (oldParent) {
            if (oldParent.left === bestSibling) {
                oldParent.left = newParent;
            } else {
                oldParent.right = newParent;
            }
        } else {
            this.root = newParent;
        }

        let index = leaf.parent;
        while (index) {
            index.left!.aabb.union(index.right!.aabb, index.aabb);
            index = index.parent!;
        }
    }

    public removeLeaf(leaf: TreeNode<T>): void {
        if (leaf === this.root) {
            this.root = null;
            return;
        }

        const parent = leaf.parent!;
        const grandParent = parent.parent;
        const sibling = parent.left === leaf ? parent.right! : parent.left!;

        if (grandParent) {
            if (grandParent.left === parent) {
                grandParent.left = sibling;
            } else {
                grandParent.right = sibling;
            }
            sibling.parent = grandParent;

            let index: TreeNode<T> | null = grandParent;
            while (index) {
                index.left!.aabb.union(index.right!.aabb, index.aabb);
                index = index.parent;
            }
        } else {
            this.root = sibling;
            sibling.parent = null;
        }
    }

    public query(aabb: AABB): T[] {
        const results: T[] = [];
        if (!this.root) return results;

        let stackPtr = 0;
        this.queryStack[stackPtr] = this.root;

        while (stackPtr >= 0) {
            const node = this.queryStack[stackPtr--];

            if (node.aabb.overlaps(aabb)) {
                if (node.isLeaf && node.data !== null) {
                    results.push(node.data);
                } else {
                    if (node.left) {
                        if (stackPtr + 1 >= this.queryStack.length) {
                            this.queryStack = this.queryStack.concat(new Array(256));
                        }
                        this.queryStack[++stackPtr] = node.left;
                    }
                    if (node.right) {
                        if (stackPtr + 1 >= this.queryStack.length) {
                            this.queryStack = this.queryStack.concat(new Array(256));
                        }
                        this.queryStack[++stackPtr] = node.right;
                    }
                }
            }
        }
        return results;
    }

    public getAllAABBs(): AABB[] {
        const results: AABB[] = [];
        if (!this.root) return results;

        let stackPtr = 0;
        this.traversalStack[stackPtr] = this.root;

        while (stackPtr >= 0) {
            const node = this.traversalStack[stackPtr--];
            results.push(node.aabb);

            if (node.left) {
                if (stackPtr + 1 >= this.traversalStack.length) {
                    this.traversalStack = this.traversalStack.concat(new Array(256));
                }
                this.traversalStack[++stackPtr] = node.left;
            }
            if (node.right) {
                if (stackPtr + 1 >= this.traversalStack.length) {
                    this.traversalStack = this.traversalStack.concat(new Array(256));
                }
                this.traversalStack[++stackPtr] = node.right;
            }
        }

        return results;
    }
}