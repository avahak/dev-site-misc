interface KDNode {
    point: number[];
    left: KDNode | null;
    right: KDNode | null;
}

class KDTree {
    private static DIM: number;

    constructor(points: number[][], dim: number) {
        KDTree.DIM = dim;
        this.root = this.buildTree(points, 0);
    }

    private root: KDNode | null;

    private buildTree(points: number[][], depth: number): KDNode | null {
        const n = points.length;
        if (n === 0) 
            return null;

        const axis = depth % KDTree.DIM;

        const sortedPoints = [...points].sort((a, b) => a[axis]-b[axis]);
        const medianIndex = Math.floor(n/2);
        const medianPoint = sortedPoints[medianIndex];

        const node: KDNode = {
            point: medianPoint,
            left: null,
            right: null,
        };
        node.left = this.buildTree(sortedPoints.slice(0, medianIndex), depth+1);
        node.right = this.buildTree(sortedPoints.slice(medianIndex+1), depth+1);

        return node;
    }

    public query(min: number[], max: number[]): number[][] {
        const results: number[][] = [];
        this.queryNode(this.root, min, max, 0, results);
        return results;
    }

    private queryNode(node: KDNode | null, min: number[], max: number[], depth: number, results: number[][]) {
        if (node === null)
            return;

        if (this.isWithinBounds(node.point, min, max))
            results.push(node.point);

        const axis = depth % KDTree.DIM;

        // Decide which subtree(s) to explore
        if (node.point[axis] >= min[axis])
            this.queryNode(node.left, min, max, depth+1, results);
        if (node.point[axis] <= max[axis])
            this.queryNode(node.right, min, max, depth+1, results);
    }

    private isWithinBounds(point: number[], min: number[], max: number[]): boolean {
        for (let i = 0; i < KDTree.DIM; i++) {
            if (point[i] < (min[i] || -Infinity) || point[i] > (max[i] || Infinity)) 
                return false;
        }
        return true;
    }
}

export { KDTree };