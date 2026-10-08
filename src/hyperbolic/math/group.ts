// See: Poincaré Side-Pairing Theorem

import { Complex, EdgeClass, FundamentalPolygon, GroupElement, MobiusMatrix, SidePairing } from '../types';
import { ComplexMath } from './complex';
import { MobiusTransform } from './mobius';
import { FundamentalPolygonBuilder } from './polygon';

export interface GroupGeneratorOptions {
    maxRadius?: number;     // Maximum Euclidean radius in Poincaré disk (default 0.95)
    maxWordLength?: number; // Safety depth limit (default 20)
    trackWords?: boolean;   // Whether to build word strings (default false)
}

export class TriangleGroup {
    static generateDeltaK(
        polygon: FundamentalPolygon,
        options: GroupGeneratorOptions = {}
    ): GroupElement[] {
        const maxRadius = options.maxRadius ?? 0.95;
        const maxWordLength = options.maxWordLength ?? 20;
        const trackWords = options.trackWords ?? false;

        const { r1, r2, r3 } = polygon.reflections;
        const reflections = [
            { letter: '1', matrix: r1 },
            { letter: '2', matrix: r2 },
            { letter: '3', matrix: r3 }
        ];

        const identityMatrix = MobiusTransform.identity();
        const identity: GroupElement = {
            id: '1',
            matrix: identityMatrix,
            distanceFromOrigin: 0,
            word: trackWords ? { letters: [], canonicalString: '1' } : undefined,
            length: 0
        };

        const elements: GroupElement[] = [identity];
        let queue: GroupElement[] = [identity];

        const gridMap = new Map<string, GroupElement[]>();
        const getGridKey = (m: MobiusMatrix) => {
            const orig = MobiusTransform.apply(m, ComplexMath.zero());
            const gx = Math.round(orig.re * 50);
            const gy = Math.round(orig.im * 50);
            return `${m.isReflected ? 1 : 0}_${gx}_${gy}`;
        };

        gridMap.set(getGridKey(identityMatrix), [identity]);

        for (let depth = 1; depth <= maxWordLength; depth++) {
            const nextQueue: GroupElement[] = [];

            for (const item of queue) {
                const lastLetter = item.word?.letters.length
                    ? item.word.letters[item.word.letters.length - 1]
                    : null;

                for (const ref of reflections) {
                    if (trackWords && ref.letter === lastLetter) continue;

                    const newMatrix = MobiusTransform.multiply(item.matrix, ref.matrix);
                    const originImg = MobiusTransform.apply(newMatrix, ComplexMath.zero());
                    const radius = ComplexMath.abs(originImg);

                    if (radius <= maxRadius) {
                        const key = getGridKey(newMatrix);
                        const candidates = gridMap.get(key) || [];
                        const isDuplicate = candidates.some(e => MobiusTransform.areTransformsEqual(e.matrix, newMatrix));

                        if (!isDuplicate) {
                            const newLetters = trackWords ? [...(item.word?.letters || []), ref.letter] : undefined;
                            const canonicalString = trackWords ? newLetters!.join('') : `${elements.length + 1}`;

                            const newEl: GroupElement = {
                                id: canonicalString,
                                matrix: newMatrix,
                                distanceFromOrigin: radius,
                                word: trackWords ? { letters: newLetters!, canonicalString } : undefined,
                                length: depth
                            };

                            elements.push(newEl);
                            nextQueue.push(newEl);

                            if (!gridMap.has(key)) gridMap.set(key, []);
                            gridMap.get(key)!.push(newEl);
                        }
                    }
                }
            }

            if (nextQueue.length === 0) break;
            queue = nextQueue;
        }

        elements.sort((a, b) => a.distanceFromOrigin - b.distanceFromOrigin);
        return elements;
    }

    static computeSidePairingGenerators(
        polygon: FundamentalPolygon,
        pairings: SidePairing[],
        trackWords: boolean = false
    ): GroupElement[] {
        const folds = FundamentalPolygonBuilder.getTilingFolds(polygon, pairings);

        return folds.map((matrix, idx) => {
            const pairing = pairings[idx];
            const i = pairing.edgeIndex;
            const k = pairing.targetEdgeIndex;
            const signLabel = pairing.sign > 0 ? 'pos' : 'neg';
            const id = `h_${i}_${k}_${signLabel}`;

            return {
                id,
                matrix,
                distanceFromOrigin: ComplexMath.abs(MobiusTransform.apply(matrix, ComplexMath.zero())),
                word: trackWords ? { letters: [id], canonicalString: id } : undefined,
                length: 1
            };
        });
    }

    static exploreSubgroupBounded(
        generators: GroupElement[],
        maxRadius: number = 0.95,
        maxDepth: number = 20,
        trackWords: boolean = false
    ): GroupElement[] {
        const nonIdentityGenerators = generators.filter(g => g.id !== '1');
        const identityMatrix = MobiusTransform.identity();

        const identity: GroupElement = {
            id: '1',
            matrix: identityMatrix,
            distanceFromOrigin: 0,
            word: trackWords ? { letters: [], canonicalString: '1' } : undefined,
            length: 0
        };

        if (nonIdentityGenerators.length === 0) {
            return [identity];
        }

        const genPool: { label: string; matrix: MobiusMatrix }[] = [];
        nonIdentityGenerators.forEach((g, idx) => {
            genPool.push({ label: `h${idx}`, matrix: g.matrix });
            const invMat = MobiusTransform.inverse(g.matrix);
            if (!MobiusTransform.areTransformsEqual(g.matrix, invMat)) {
                genPool.push({ label: `h${idx}⁻¹`, matrix: invMat });
            }
        });

        const explored: GroupElement[] = [identity];
        let currentLevel = [identity];

        for (let d = 1; d <= maxDepth; d++) {
            const nextLevel: GroupElement[] = [];

            for (const parent of currentLevel) {
                for (const gen of genPool) {
                    const newMatrix = MobiusTransform.multiply(parent.matrix, gen.matrix);
                    const radius = ComplexMath.abs(MobiusTransform.apply(newMatrix, ComplexMath.zero()));

                    if (radius <= maxRadius) {
                        const isDup = explored.some(e => MobiusTransform.areTransformsEqual(e.matrix, newMatrix));

                        if (!isDup) {
                            const newLabel = trackWords
                                ? (parent.id === '1' ? gen.label : `${parent.id}${gen.label}`)
                                : `${explored.length + 1}`;

                            const newEl: GroupElement = {
                                id: newLabel,
                                matrix: newMatrix,
                                distanceFromOrigin: radius,
                                word: trackWords ? { letters: [newLabel], canonicalString: newLabel } : undefined,
                                length: d
                            };

                            explored.push(newEl);
                            nextLevel.push(newEl);
                        }
                    }
                }
            }

            if (nextLevel.length === 0) break;
            currentLevel = nextLevel;
        }

        explored.sort((a, b) => a.distanceFromOrigin - b.distanceFromOrigin);
        return explored;
    }

    static findBasePolygonStabilizer(exploredSubgroup: GroupElement[], tol: number = 1e-4): GroupElement[] {
        const origin = ComplexMath.zero();
        return exploredSubgroup.filter(h => {
            const hOrigin = MobiusTransform.apply(h.matrix, origin);
            return ComplexMath.abs(hOrigin) < tol;
        });
    }

    static computeEdgeClasses(pCount: number, stabilizer: GroupElement[]): EdgeClass[] {
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

        const edgeClasses: EdgeClass[] = [];
        classMap.forEach((indices) => {
            edgeClasses.push({
                id: `C${edgeClasses.length}`,
                edgeIndices: indices
            });
        });

        return edgeClasses;
    }
}