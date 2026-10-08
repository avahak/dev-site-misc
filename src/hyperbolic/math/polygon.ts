import { Complex, MobiusMatrix, PolygonMetrics, FundamentalPolygon, SidePairing } from '../types';
import { ComplexMath } from './complex';
import { MobiusTransform } from './mobius';

export class FundamentalPolygonBuilder {
    static computePolygonMetrics(p: number, q: number): PolygonMetrics {
        const coshA = Math.cos(Math.PI / q) / Math.sin(Math.PI / p);
        const sinhA = Math.sqrt(Math.max(0, coshA * coshA - 1));
        const inradiusH = Math.acosh(coshA);
        const inradiusE = Math.tanh(inradiusH / 2);
        const cothA = coshA / sinhA;

        const coshR = (1 / Math.tan(Math.PI / p)) * (1 / Math.tan(Math.PI / q));
        const circumradiusH = Math.acosh(coshR);
        const circumradiusE = Math.tanh(circumradiusH / 2);

        return { inradiusH, circumradiusH, inradiusE, circumradiusE, cothA };
    }

    static build(p: number, q: number): FundamentalPolygon {
        const metrics = FundamentalPolygonBuilder.computePolygonMetrics(p, q);
        const { inradiusE, circumradiusE, cothA } = metrics;

        const midpoints: Complex[] = [];
        const vertices: Complex[] = [];
        const phi: number[] = [];

        for (let i = 0; i < p; i++) {
            const angleMid = (2 * Math.PI * i) / p;
            phi.push(angleMid);
            midpoints.push(ComplexMath.fromPolar(inradiusE, angleMid));

            const angleVert = (2 * Math.PI * i + Math.PI) / p;
            vertices.push(ComplexMath.fromPolar(circumradiusE, angleVert));
        }

        // 1. Fundamental Triangle Reflections (r1, r2, r3)
        const r1: MobiusMatrix = MobiusTransform.normalize({
            a: ComplexMath.one(),
            b: ComplexMath.zero(),
            c: ComplexMath.zero(),
            d: ComplexMath.one(),
            isReflected: true
        });

        const angleR2 = (2 * Math.PI) / p;
        const r2: MobiusMatrix = MobiusTransform.normalize({
            a: { re: Math.cos(angleR2), im: Math.sin(angleR2) },
            b: ComplexMath.zero(),
            c: ComplexMath.zero(),
            d: ComplexMath.one(),
            isReflected: true
        });

        const r3: MobiusMatrix = MobiusTransform.normalize({
            a: { re: cothA, im: 0 },
            b: { re: -1, im: 0 },
            c: { re: 1, im: 0 },
            d: { re: -cothA, im: 0 },
            isReflected: true
        });

        // 2. Side Test Transformations T_i and Standalone Edge Reflections \sigma_i
        const sideTests: MobiusMatrix[] = [];
        const edgeReflections: MobiusMatrix[] = [];

        for (let i = 0; i < p; i++) {
            const m_i = midpoints[i];
            const phi_i = phi[i];

            // Test transformation T_i
            const rotAngle = -(phi_i + Math.PI / 2);
            const Ai = MobiusTransform.mapToOrigin(m_i);
            const Ri = MobiusTransform.rotation(rotAngle);
            sideTests.push(MobiusTransform.multiply(Ri, Ai));

            // Edge reflection \sigma_i = R(\phi_i) o r3 o R(-\phi_i)
            const rotPhi = MobiusTransform.rotation(phi_i);
            const rotPhiInv = MobiusTransform.rotation(-phi_i);
            const sigma_i = MobiusTransform.multiply(rotPhi, MobiusTransform.multiply(r3, rotPhiInv));
            edgeReflections.push(sigma_i);
        }

        return {
            metrics,
            vertices,
            midpoints,
            sideTests,
            edgeReflections,
            reflections: { r1, r2, r3 }
        };
    }

    static getTilingFolds(polygon: FundamentalPolygon, pairings: SidePairing[]): MobiusMatrix[] {
        const p = pairings.length;
        const { r1, r3 } = polygon.reflections;

        const gs: MobiusMatrix[] = [];

        for (let i = 0; i < p; i++) {
            // Compute folding isometry g_i on the spot from side pairing
            const pairing = pairings.find(p => p.edgeIndex === i);
            if (!pairing)
                throw new Error(`Missing side pairing for edge e_${i + 1}`);

            const phi_i = (2 * Math.PI * i) / p;
            const phi_k = (2 * Math.PI * pairing.targetEdgeIndex) / p;

            const rotK = MobiusTransform.rotation(phi_k);
            const rotI_inv = MobiusTransform.rotation(-phi_i);

            const mid = pairing.sign === -1
                ? MobiusTransform.multiply(r1, MobiusTransform.multiply(r3, rotI_inv))
                : MobiusTransform.multiply(r3, rotI_inv);

            const g = MobiusTransform.multiply(rotK, mid);

            gs.push(g);
        }
        return gs;
    }
}