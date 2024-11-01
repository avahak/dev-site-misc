// NOTE: this is too complicated - better to do with either trivial implementation like before
// or with O(n) median finding.

interface KDNode {
    point: number[];
    left: KDNode | null;
    right: KDNode | null;
}

class KDTree {
    private static DIM: number;

    constructor(points: number[][], dim: number) {
        KDTree.DIM = dim;
        const sortedIndices = this.initializeSortedIndices(points);
        this.root = this.buildTreeSorted(points, sortedIndices, 0);
    }

    private root: KDNode | null;

    private initializeSortedIndices(points: number[][]): { [key: number]: number[] } {
        const indices: { [key: number]: number[] } = {};
        for (let d = 0; d < KDTree.DIM; d++) {
            indices[d] = points
                .map((_, index) => index)
                .sort((a, b) => points[a][d] - points[b][d]);
        }
        return indices;
    }

    private buildTreeSorted(
        points: number[][], 
        sortedIndices: { [key: number]: number[] }, 
        depth: number
    ): KDNode | null {

        const axis = depth % KDTree.DIM;
        const n = sortedIndices[axis].length;
        if (n === 0) 
            return null;

        // Find the median index for the current axis
        const medianIndex = Math.floor(n / 2);
        const medianSortedIndex = sortedIndices[axis][medianIndex];

        // Prepare new sorted indices for left and right subtree
        const leftSortedIndices = sortedIndices[axis].slice(0, medianIndex);
        const rightSortedIndices = sortedIndices[axis].slice(medianIndex + 1);

        // Update sorted indices for other dimensions based on the current median
        const leftSortedIndicesMap: { [key: number]: number[] } = {};
        const rightSortedIndicesMap: { [key: number]: number[] } = {};
        for (let d = 0; d < KDTree.DIM; d++) {
            leftSortedIndicesMap[d] = this.getSortedSubset(sortedIndices[d], leftSortedIndices);
            rightSortedIndicesMap[d] = this.getSortedSubset(sortedIndices[d], rightSortedIndices);
        }

        const node: KDNode = {
            point: points[medianSortedIndex],
            left: null,
            right: null,
        };
        // Recursively build the left and right subtrees
        node.left = this.buildTreeSorted(points, leftSortedIndicesMap, depth+1);
        node.right = this.buildTreeSorted(points, rightSortedIndicesMap, depth+1);

        return node;
    }

    private getSortedSubset(originalIndices: number[], selectedIndices: number[]): number[] {
        const selectedSet = new Set(selectedIndices);
        return originalIndices.filter(index => selectedSet.has(index));
    }
}
