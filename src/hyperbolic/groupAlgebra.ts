/* 
The transformations 1,2,3 refer to r_1,r_2,r_3 in 
\Delta(p,q,2) = \langle r_1, r_2, r_3 \mid r_1^2 = r_2^2 = r_3^2 = (r_1 r_2)^p = (r_2 r_3)^q = (r_3 r_1)^2 = 1 \rangle
*/

import { Complex, GroupElement, MobiusMatrix, Point2D, EdgeClass } from './types';
import { ComplexMath, MobiusTransform } from './hyperbolic';

export class TriangleGroup {
    p: number;
    q: number;

    // Full Group Reflections r1, r2, r3 across edges of base right triangle
    refR1!: MobiusMatrix; // Reflection across v0-v1 (real axis)
    refR2!: MobiusMatrix; // Reflection across v0-v2 (line at pi/p)
    refR3!: MobiusMatrix; // Reflection across v1-v2 (outer geodesic arc)

    r1!: number;
    rP!: number;

    baseTriangleVertices!: Point2D[];
    basePolygonVertices!: Point2D[];

    constructor(p: number = 6, q: number = 4) {
        this.p = p;
        this.q = q;
        this.initGeometry();
    }

    private initGeometry(): void {
        const sinP = Math.sin(Math.PI / this.p);
        const cosP = Math.cos(Math.PI / this.p);
        const sinQ = Math.sin(Math.PI / this.q);
        const cosQ = Math.cos(Math.PI / this.q);

        const coshS = cosQ / sinP;
        const sinhS = Math.sqrt(Math.max(0, coshS * coshS - 1));
        this.r1 = sinhS / (coshS + 1);

        const coshR = (cosP / sinP) * (cosQ / sinQ);
        const sinhR = Math.sqrt(Math.max(0, coshR * coshR - 1));
        this.rP = sinhR / (coshR + 1);

        // r1: Reflection across real axis z -> z_bar
        this.refR1 = {
            a: { re: 1, im: 0 },
            b: { re: 0, im: 0 },
            c: { re: 0, im: 0 },
            d: { re: 1, im: 0 },
            isReflected: true
        };

        // r2: Reflection across line at angle pi/p: z -> e^(i*2pi/p) * z_bar
        const expP: Complex = { re: Math.cos(Math.PI / this.p), im: Math.sin(Math.PI / this.p) };
        this.refR2 = {
            a: expP,
            b: { re: 0, im: 0 },
            c: { re: 0, im: 0 },
            d: ComplexMath.conj(expP),
            isReflected: true
        };

        // r3: Reflection across geodesic arc v1-v2 = a * r1
        const genA: MobiusMatrix = {
            a: { re: 0, im: coshS },
            b: { re: 0, im: -sinhS },
            c: { re: 0, im: sinhS },
            d: { re: 0, im: -coshS },
            isReflected: false
        };
        this.refR3 = MobiusTransform.multiply(genA, this.refR1);

        const v0: Point2D = { x: 0, y: 0 };
        const v1: Point2D = { x: this.r1, y: 0 };
        const angleP = Math.PI / this.p;
        const v2: Point2D = { x: this.rP * Math.cos(angleP), y: this.rP * Math.sin(angleP) };
        this.baseTriangleVertices = [v0, v1, v2];

        this.basePolygonVertices = [];
        for (let i = 0; i < this.p; i++) {
            const angle = ((2 * i + 1) * Math.PI) / this.p;
            this.basePolygonVertices.push({
                x: this.rP * Math.cos(angle),
                y: this.rP * Math.sin(angle)
            });
        }
    }

    generateDeltaK(maxRadius: number = 0.90, maxWordLength: number = 14): GroupElement[] {
        const elements: GroupElement[] = [];
        const identity: GroupElement = {
            id: '1',
            word: { letters: [], canonicalString: '1' },
            matrix: MobiusTransform.identity(),
            length: 0
        };
        elements.push(identity);

        const gridMap = new Map<string, GroupElement[]>();
        const getGridKey = (m: MobiusMatrix) => {
            const orig = MobiusTransform.apply(m, { re: 0, im: 0 });
            const gx = Math.round(orig.re * 40);
            const gy = Math.round(orig.im * 40);
            return `${m.isReflected ? 1 : 0}_${gx}_${gy}`;
        };

        gridMap.set(getGridKey(identity.matrix), [identity]);
        let queue: GroupElement[] = [identity];

        const reflections = [
            { letter: '1', matrix: this.refR1 },
            { letter: '2', matrix: this.refR2 },
            { letter: '3', matrix: this.refR3 }
        ];

        for (let depth = 1; depth <= maxWordLength; depth++) {
            const nextQueue: GroupElement[] = [];

            for (const item of queue) {
                const lastLetter = item.word.letters.length > 0 ? item.word.letters[item.word.letters.length - 1] : null;

                for (const ref of reflections) {
                    if (ref.letter === lastLetter) continue; // r_i^2 = 1 identity reduction

                    const newLetters = [...item.word.letters, ref.letter];
                    const canonicalString = newLetters.join('');
                    const newMatrix = MobiusTransform.multiply(item.matrix, ref.matrix);

                    const originImg = MobiusTransform.apply(newMatrix, { re: 0, im: 0 });
                    const radius = ComplexMath.abs(originImg);

                    if (radius <= maxRadius) {
                        const key = getGridKey(newMatrix);
                        const candidates = gridMap.get(key) || [];
                        const duplicate = candidates.some(e => MobiusTransform.distance(e.matrix, newMatrix) < 1e-4);

                        if (!duplicate) {
                            const newEl: GroupElement = {
                                id: canonicalString,
                                word: { letters: newLetters, canonicalString },
                                matrix: newMatrix,
                                length: newLetters.length
                            };
                            elements.push(newEl);
                            nextQueue.push(newEl);

                            if (!gridMap.has(key)) gridMap.set(key, []);
                            gridMap.get(key)!.push(newEl);
                        }
                    }
                }
            }
            queue = nextQueue;
        }

        elements.sort((a, b) => {
            const rA = ComplexMath.abs(MobiusTransform.apply(a.matrix, { re: 0, im: 0 }));
            const rB = ComplexMath.abs(MobiusTransform.apply(b.matrix, { re: 0, im: 0 }));
            if (Math.abs(rA - rB) > 1e-4) return rA - rB;
            return a.length - b.length;
        });

        return elements;
    }

    exploreSubgroup(generators: GroupElement[], depthL: number): GroupElement[] {
        if (generators.length === 0) {
            return [{
                id: '1',
                word: { letters: [], canonicalString: '1' },
                matrix: MobiusTransform.identity(),
                length: 0
            }];
        }

        const explored: GroupElement[] = [];
        const identity: GroupElement = {
            id: '1',
            word: { letters: [], canonicalString: '1' },
            matrix: MobiusTransform.identity(),
            length: 0
        };
        explored.push(identity);

        const genPool: { label: string; matrix: MobiusMatrix }[] = [];
        generators.forEach((g, idx) => {
            genPool.push({ label: `h${idx + 1}`, matrix: g.matrix });
            const invMat = MobiusTransform.inverse(g.matrix);
            if (MobiusTransform.distance(g.matrix, invMat) > 1e-4) {
                genPool.push({ label: `h${idx + 1}⁻¹`, matrix: invMat });
            }
        });

        let currentLevel = [identity];

        for (let d = 1; d <= depthL; d++) {
            const nextLevel: GroupElement[] = [];
            for (const parent of currentLevel) {
                for (const gen of genPool) {
                    const newMatrix = MobiusTransform.multiply(parent.matrix, gen.matrix);
                    const isDup = explored.some(e => MobiusTransform.distance(e.matrix, newMatrix) < 1e-4);
                    if (!isDup) {
                        const newStr = parent.word.canonicalString === '1' ? gen.label : `${parent.word.canonicalString}${gen.label}`;
                        const newEl: GroupElement = {
                            id: newStr,
                            word: { letters: [], canonicalString: newStr },
                            matrix: newMatrix,
                            length: d
                        };
                        explored.push(newEl);
                        nextLevel.push(newEl);
                    }
                }
            }
            currentLevel = nextLevel;
        }

        return explored;
    }

    findBasePolygonStabilizer(exploredSubgroup: GroupElement[]): GroupElement[] {
        const origin: Complex = { re: 0, im: 0 };
        return exploredSubgroup.filter(h => {
            const hOrigin = MobiusTransform.apply(h.matrix, origin);
            return ComplexMath.abs(hOrigin) < 1e-4;
        });
    }

    computeEdgeClasses(pCount: number, stabilizer: GroupElement[]): EdgeClass[] {
        const parent = Array.from({ length: pCount }, (_, i) => i);

        const find = (i: number): number => {
            if (parent[i] === i) return i;
            parent[i] = find(parent[i]);
            return parent[i];
        };

        const union = (i: number, j: number) => {
            const rootI = find(i);
            const rootJ = find(j);
            if (rootI !== rootJ) parent[rootI] = rootJ;
        };

        const testPoint: Complex = { re: 0.2, im: 0.1 };
        for (const h of stabilizer) {
            const transformed = MobiusTransform.apply(h.matrix, testPoint);
            const angle0 = Math.atan2(testPoint.im, testPoint.re);
            const angle1 = Math.atan2(transformed.im, transformed.re);
            let dAngle = angle1 - angle0;
            while (dAngle < 0) dAngle += 2 * Math.PI;

            const shift = Math.round((dAngle / (2 * Math.PI)) * pCount) % pCount;
            for (let e = 0; e < pCount; e++) {
                union(e, (e + shift) % pCount);
            }
        }

        const classMap = new Map<number, number[]>();
        for (let e = 0; e < pCount; e++) {
            const root = find(e);
            if (!classMap.has(root)) classMap.set(root, []);
            classMap.get(root)!.push(e);
        }

        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#e84393'];
        const edgeClasses: EdgeClass[] = [];
        let colorIdx = 0;

        classMap.forEach((indices) => {
            edgeClasses.push({
                id: `C${edgeClasses.length + 1}`,
                edgeIndices: indices,
                color: colors[colorIdx % colors.length]
            });
            colorIdx++;
        });

        return edgeClasses;
    }
}