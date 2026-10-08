export interface Complex {
    re: number;
    im: number;
}

export interface MobiusMatrix {
    a: Complex;
    b: Complex;
    c: Complex;
    d: Complex;
    isReflected?: boolean; // false = conformal, true = anti-conformal
}

export interface Vector3D {
    x: number;
    y: number;
    t: number; // Time-like coordinate for Minkowski 2+1 space
}

export interface PolygonMetrics {
    inradiusH: number;     // Hyperbolic distance to edge midpoint
    circumradiusH: number; // Hyperbolic distance to vertex
    inradiusE: number;     // Euclidean disk radius for edge midpoint
    circumradiusE: number; // Euclidean disk radius for vertex
    cothA: number;         // Center location of side geodesic circle on real axis
}

export interface GroupWord {
    letters: string[];
    canonicalString: string;
}

export interface GroupElement {
    id: string;
    matrix: MobiusMatrix;
    distanceFromOrigin: number; // Euclidean radius |h(0)| in Poincare disk
    word?: GroupWord;           // Optional word representation
    length?: number;
}

export interface EdgeClass {
    id: string;
    edgeIndices: number[];
}

export interface SideData {
    test: MobiusMatrix; // T_i (half-plane test map)
    fold: MobiusMatrix; // g_i (folding isometry mapping e_i -> e_k)
}

export interface FundamentalPolygon {
    metrics: PolygonMetrics;
    vertices: Complex[];
    midpoints: Complex[];
    sideTests: MobiusMatrix[];       // T_i
    edgeReflections: MobiusMatrix[]; // \sigma_i
    reflections: TriangleReflections; // r1, r2, r3
}

export interface SubgroupState {
    generators: GroupElement[];
    explorationDepth: number;
    exploredElements: GroupElement[];
    stabilizerElements: GroupElement[];
    edgeClasses: EdgeClass[];
}

export interface SidePairing {
    edgeIndex: number;       // 0 to p-1 (representing e_1 to e_p)
    targetEdgeIndex: number; // 0 to p-1 (representing e_1 to e_p)
    sign: 1 | -1;            // +1 = orientation-preserving, -1 = orientation-reversing
}

export interface TriangleReflections {
    r1: MobiusMatrix;
    r2: MobiusMatrix;
    r3: MobiusMatrix;
}