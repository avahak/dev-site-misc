import { ComplexMath } from './math/complex';
import { MobiusTransform } from './math/mobius';
import { Complex, GroupElement, MobiusMatrix, EdgeClass, SidePairing } from './types';

export class TriangleGroup {
    p: number;
    q: number;

    refR1!: MobiusMatrix;
    refR2!: MobiusMatrix;
    refR3!: MobiusMatrix;

    r1!: number;
    rP!: number;

    baseTriangleVertices!: Complex[];
    basePolygonVertices!: Complex[];

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

        this.refR1 = {
            a: { re: 1, im: 0 },
            b: { re: 0, im: 0 },
            c: { re: 0, im: 0 },
            d: { re: 1, im: 0 },
            isReflected: true
        };

        const expP: Complex = { re: Math.cos(Math.PI / this.p), im: Math.sin(Math.PI / this.p) };
        this.refR2 = {
            a: expP,
            b: { re: 0, im: 0 },
            c: { re: 0, im: 0 },
            d: ComplexMath.conj(expP),
            isReflected: true
        };

        const genA: MobiusMatrix = {
            a: { re: 0, im: coshS },
            b: { re: 0, im: -sinhS },
            c: { re: 0, im: sinhS },
            d: { re: 0, im: -coshS },
            isReflected: false
        };
        this.refR3 = MobiusTransform.multiply(genA, this.refR1);

        const v0: Complex = { re: 0, im: 0 };
        const v1: Complex = { re: this.r1, im: 0 };
        const angleP = Math.PI / this.p;
        const v2: Complex = { re: this.rP * Math.cos(angleP), im: this.rP * Math.sin(angleP) };
        this.baseTriangleVertices = [v0, v1, v2];

        this.basePolygonVertices = [];
        for (let i = 0; i < this.p; i++) {
            const angle = ((2 * i - 1) * Math.PI) / this.p;
            this.basePolygonVertices.push({
                re: this.rP * Math.cos(angle),
                im: this.rP * Math.sin(angle)
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
                    if (ref.letter === lastLetter) continue;

                    const newLetters = [...item.word.letters, ref.letter];
                    const canonicalString = newLetters.join('');
                    const newMatrix = MobiusTransform.multiply(item.matrix, ref.matrix);

                    const originImg = MobiusTransform.apply(newMatrix, { re: 0, im: 0 });
                    const radius = ComplexMath.abs(originImg);

                    if (radius <= maxRadius) {
                        const key = getGridKey(newMatrix);
                        const candidates = gridMap.get(key) || [];
                        const duplicate = candidates.some(e => MobiusTransform.areTransformsEqual(e.matrix, newMatrix));

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
        const nonIdentityGenerators = generators.filter(g => g.word.canonicalString !== '1');

        if (nonIdentityGenerators.length === 0) {
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
        nonIdentityGenerators.forEach((g, idx) => {
            genPool.push({ label: `h${idx + 1}`, matrix: g.matrix });
            const invMat = MobiusTransform.inverse(g.matrix);
            if (!MobiusTransform.areTransformsEqual(g.matrix, invMat)) {
                genPool.push({ label: `h${idx + 1}⁻¹`, matrix: invMat });
            }
        });

        let currentLevel = [identity];

        for (let d = 1; d <= depthL; d++) {
            const nextLevel: GroupElement[] = [];
            for (const parent of currentLevel) {
                for (const gen of genPool) {
                    const newMatrix = MobiusTransform.multiply(parent.matrix, gen.matrix);
                    const isDup = explored.some(e => MobiusTransform.areTransformsEqual(e.matrix, newMatrix));
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

    computeGeneratorFromPairing(edgeIndex: number, targetEdgeIndex: number, sign: 1 | -1): GroupElement {
        const i = edgeIndex + 1;
        const k = targetEdgeIndex + 1;

        if (i === k && sign === 1) {
            return {
                id: `h_${i}_${k}_pos`,
                word: {
                    letters: [],
                    canonicalString: '1'
                },
                matrix: MobiusTransform.identity(),
                length: 0
            };
        }

        const letters: string[] = [];

        for (let idx = 0; idx < i - 1; idx++) {
            letters.push('2', '1');
        }

        if (sign === -1) {
            letters.push('3');
        } else {
            letters.push('3', '1');
        }

        for (let idx = 0; idx < k - 1; idx++) {
            letters.push('1', '2');
        }

        const simplifiedLetters: string[] = [];
        for (const l of letters) {
            if (simplifiedLetters.length > 0 && simplifiedLetters[simplifiedLetters.length - 1] === l) {
                simplifiedLetters.pop();
            } else {
                simplifiedLetters.push(l);
            }
        }

        const reflectionMap: Record<string, MobiusMatrix> = {
            '1': this.refR1,
            '2': this.refR2,
            '3': this.refR3
        };

        let matrix = MobiusTransform.identity();
        for (const l of simplifiedLetters) {
            matrix = MobiusTransform.multiply(matrix, reflectionMap[l]);
        }

        const canonicalString = simplifiedLetters.length > 0 ? simplifiedLetters.join('') : '1';

        return {
            id: `h_${i}_${k}_${sign > 0 ? 'pos' : 'neg'}`,
            word: {
                letters: simplifiedLetters,
                canonicalString
            },
            matrix,
            length: simplifiedLetters.length
        };
    }

    computeSidePairingGenerators(pairings: SidePairing[]): GroupElement[] {
        return pairings.map(p => this.computeGeneratorFromPairing(p.edgeIndex, p.targetEdgeIndex, p.sign));
    }
}