
import { LooseSphericalHierarchy, Region, Root, SphereObject } from "./tree";

export class LooseSphericalHierarchyStatistics<T> {
    public tree: LooseSphericalHierarchy<T>;

    constructor(tree: LooseSphericalHierarchy<T>) {
        this.tree = tree;
    }

    collectRegions(node: Region<T> | Root<T>, regions: Region<T>[]): Region<T>[] {
        if (node instanceof Region)
            regions.push(node);
        for (const child of node.children)
            this.collectRegions(child, regions);
        return regions;
    }

    countRegionsByLevel(): Map<number, number> {
        const regions: Region<T>[] = [];
        this.collectRegions(this.tree.root, regions);

        const levelCounts = new Map<number, number>();
        for (const region of regions) {
            const count = levelCounts.get(region.level) || 0;
            levelCounts.set(region.level, count + 1);
        }
        return levelCounts;
    }
}