import { TreeSnapshot } from './statistics';

export interface VisualizationState {
    objectsCount: number;
    totalRegions: number;
    maxLevel: number;
    scalingFactor: number;
    regionsByLevelString: string;
    objectsByLevelString: string;
    selectedObjectIndex: number | null;
    collisionsCount: number;
    collisionsText: string;
    treeStats: TreeSnapshot | null;
}

export interface LazyVisualizationState {
    objectsCount: number;
    totalRegions: number;
    maxLevel: number;
    scalingFactor: number;
    regionsByLevelString: string;
    objectsByLevelString: string;
    selectedObjectIndex: number | null;
    collisionsCount: number;
    collisionsText: string;
}