export interface Complex {
    re: number;
    im: number;
}

export interface Point2D {
    x: number;
    y: number;
}

export interface MobiusMatrix {
    a: Complex;
    b: Complex;
    c: Complex;
    d: Complex;
    isReflected?: boolean; // false = conformal (preserves orientation), true = anti-conformal (reflection)
}

export interface GroupWord {
    letters: string[];
    canonicalString: string;
}

export interface GroupElement {
    id: string;
    word: GroupWord;
    matrix: MobiusMatrix;
    length: number;
}

export interface EdgeClass {
    id: string;
    edgeIndices: number[];
    color: string;
}

export interface SubgroupState {
    generators: GroupElement[];
    explorationDepth: number;
    exploredElements: GroupElement[];
    stabilizerElements: GroupElement[];
    edgeClasses: EdgeClass[];
}