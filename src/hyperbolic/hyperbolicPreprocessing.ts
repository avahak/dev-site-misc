import { Complex, MobiusMatrix, SidePairing } from './types';
import { ComplexMath } from './hyperbolic';

export interface SideData {
    test: MobiusMatrix; // T_i (half-plane test transformation)
    fold: MobiusMatrix; // g_i (folding isometry mapping e_i to e_k)
}

export interface PreprocessingResult {
    sideData: SideData[];
    rA: number;
    rV: number;
}

/**
 * Creates a Möbius transformation representing rotation around the origin by angle theta.
 */
export function createRotationTransform(angle: number): MobiusMatrix {
    return normalizeMatrix({
        a: { re: Math.cos(angle), im: Math.sin(angle) },
        b: { re: 0, im: 0 },
        c: { re: 0, im: 0 },
        d: { re: 1, im: 0 },
        isReflected: false
    });
}

/**
 * Normalizes matrix entries to ensure consistent scale.
 */
export function normalizeMatrix(m: MobiusMatrix): MobiusMatrix {
    const norm = Math.hypot(
        m.a.re, m.a.im,
        m.b.re, m.b.im,
        m.c.re, m.c.im,
        m.d.re, m.d.im
    ) || 1;

    return {
        a: ComplexMath.scale(m.a, 1 / norm),
        b: ComplexMath.scale(m.b, 1 / norm),
        c: ComplexMath.scale(m.c, 1 / norm),
        d: ComplexMath.scale(m.d, 1 / norm),
        isReflected: !!m.isReflected
    };
}

/**
 * Evaluates transformation M at point z.
 */
export function applyTransform(m: MobiusMatrix, z: Complex): Complex {
    const evalZ = m.isReflected ? ComplexMath.conj(z) : z;
    const num = ComplexMath.add(ComplexMath.mul(m.a, evalZ), m.b);
    const den = ComplexMath.add(ComplexMath.mul(m.c, evalZ), m.d);
    return ComplexMath.div(num, den);
}

/**
 * Composes two Möbius / Anti-Möbius transformations: (m1 o m2)(z) = m1(m2(z)).
 */
export function multiplyTransforms(m1: MobiusMatrix, m2: MobiusMatrix): MobiusMatrix {
    const r1 = !!m1.isReflected;
    const r2 = !!m2.isReflected;

    const effM2 = r1 ? ComplexMath.matrixConj(m2) : m2;

    const a = ComplexMath.add(ComplexMath.mul(m1.a, effM2.a), ComplexMath.mul(m1.b, effM2.c));
    const b = ComplexMath.add(ComplexMath.mul(m1.a, effM2.b), ComplexMath.mul(m1.b, effM2.d));
    const c = ComplexMath.add(ComplexMath.mul(m1.c, effM2.a), ComplexMath.mul(m1.d, effM2.c));
    const d = ComplexMath.add(ComplexMath.mul(m1.c, effM2.b), ComplexMath.mul(m1.d, effM2.d));

    return normalizeMatrix({ a, b, c, d, isReflected: r1 !== r2 });
}

/**
 * Computes inverse transformation.
 */
export function inverseTransform(m: MobiusMatrix): MobiusMatrix {
    const r = !!m.isReflected;
    const det = ComplexMath.sub(ComplexMath.mul(m.a, m.d), ComplexMath.mul(m.b, m.c));

    let inv: MobiusMatrix = {
        a: ComplexMath.div(m.d, det),
        b: ComplexMath.div(ComplexMath.scale(m.b, -1), det),
        c: ComplexMath.div(ComplexMath.scale(m.c, -1), det),
        d: ComplexMath.div(m.a, det),
        isReflected: r
    };

    if (r) {
        inv = ComplexMath.matrixConj(inv);
    }
    return normalizeMatrix(inv);
}

/**
 * Checks equality of two transforms across several test points inside the Poincaré disk.
 */
export function areTransformsEqual(m1: MobiusMatrix, m2: MobiusMatrix, tol: number = 1e-4): boolean {
    const testPoints: Complex[] = [
        { re: 0, im: 0 },
        { re: 0.2, im: 0.1 },
        { re: -0.3, im: 0.25 }
    ];

    for (const pt of testPoints) {
        const z1 = applyTransform(m1, pt);
        const z2 = applyTransform(m2, pt);
        const dist = ComplexMath.abs(ComplexMath.sub(z1, z2));
        if (dist > tol) return false;
    }
    return true;
}

export function computeSubgroupPreprocessing(
    p: number,
    q: number,
    pairings: SidePairing[]
): PreprocessingResult {
    // 1. Regular {p, q} Polygon Geometry
    // Inradius A (distance from origin to edge midpoint)
    const coshA = Math.cos(Math.PI / q) / Math.sin(Math.PI / p);
    const sinhA = Math.sqrt(coshA * coshA - 1);
    const cothA = coshA / sinhA; // Center of geodesic circle in Poincaré disk

    const A = Math.acosh(coshA);
    const rA = Math.tanh(A / 2);

    // Circumradius R (distance from origin to vertex)
    const coshR = (1 / Math.tan(Math.PI / p)) * (1 / Math.tan(Math.PI / q));
    const R = Math.acosh(coshR);
    const rV = Math.tanh(R / 2);

    const midpoints: Complex[] = [];
    const phi: number[] = [];

    for (let i = 1; i <= p; i++) {
        const angle = (2 * Math.PI * (i - 1)) / p;
        phi.push(angle);
        midpoints.push({
            re: rA * Math.cos(angle),
            im: rA * Math.sin(angle)
        });
    }

    // 2. Side Test Transformations T_i
    const T: MobiusMatrix[] = [];
    for (let i = 0; i < p; i++) {
        const m_i = midpoints[i];
        const phi_i = phi[i];
        const rotAngle = -(phi_i + Math.PI / 2);

        const Ai: MobiusMatrix = {
            a: { re: 1, im: 0 },
            b: ComplexMath.scale(m_i, -1),
            c: ComplexMath.scale(ComplexMath.conj(m_i), -1),
            d: { re: 1, im: 0 },
            isReflected: false
        };

        const Ri = createRotationTransform(rotAngle);
        const Ti = multiplyTransforms(Ri, Ai);
        T.push(Ti);

        // Verification: Im(T_i(0)) should be equal to rA > 0
        const T0 = applyTransform(Ti, { re: 0, im: 0 });
        if (Math.abs(T0.re) > 1e-4 || Math.abs(T0.im - rA) > 1e-4) {
            console.error(`Sanity check failed for T_${i + 1}(0): expected (0, ${rA.toFixed(4)}), got (${T0.re.toFixed(4)}, ${T0.im.toFixed(4)})`, Ti);
        }
    }

    // 3. Triangle Reflection Generators r_1, r_2, r_3
    // r1: Reflection across positive real axis: z -> conj(z)
    const r1: MobiusMatrix = normalizeMatrix({
        a: { re: 1, im: 0 },
        b: { re: 0, im: 0 },
        c: { re: 0, im: 0 },
        d: { re: 1, im: 0 },
        isReflected: true
    });

    // r2: Reflection across ray at angle pi/p: z -> exp(i*2*pi/p) * conj(z)
    const angleR2 = 2 * (Math.PI / p);
    const r2: MobiusMatrix = normalizeMatrix({
        a: { re: Math.cos(angleR2), im: Math.sin(angleR2) },
        b: { re: 0, im: 0 },
        c: { re: 0, im: 0 },
        d: { re: 1, im: 0 },
        isReflected: true
    });

    // r3: Reflection across geodesic circle for e_1 (centered at coth(A) on real axis)
    // Formula: z -> (coth(A) * conj(z) - 1) / (conj(z) - coth(A))
    const r3: MobiusMatrix = normalizeMatrix({
        a: { re: cothA, im: 0 },
        b: { re: -1, im: 0 },
        c: { re: 1, im: 0 },
        d: { re: -cothA, im: 0 },
        isReflected: true
    });

    // 4. Triangle Group Relations Numerical Sanity Checks
    const identity: MobiusMatrix = normalizeMatrix({
        a: { re: 1, im: 0 },
        b: { re: 0, im: 0 },
        c: { re: 0, im: 0 },
        d: { re: 1, im: 0 },
        isReflected: false
    });

    if (!areTransformsEqual(multiplyTransforms(r1, r1), identity)) {
        console.error("Sanity check failed: r1^2 != I", r1);
    }

    if (!areTransformsEqual(multiplyTransforms(r2, r2), identity)) {
        console.error("Sanity check failed: r2^2 != I", r2);
    }

    if (!areTransformsEqual(multiplyTransforms(r3, r3), identity)) {
        console.error("Sanity check failed: r3^2 != I", r3);
    }

    const rho = multiplyTransforms(r1, r2);
    let rho_p = identity;
    for (let k = 0; k < p; k++) rho_p = multiplyTransforms(rho_p, rho);
    if (!areTransformsEqual(rho_p, identity)) {
        console.error("Sanity check failed: (r1 * r2)^p != I", r1, r2);
    }

    const r2r3 = multiplyTransforms(r2, r3);
    let r2r3_q = identity;
    for (let k = 0; k < q; k++) r2r3_q = multiplyTransforms(r2r3_q, r2r3);
    if (!areTransformsEqual(r2r3_q, identity)) {
        console.error("Sanity check failed: (r2 * r3)^q != I", r2, r3);
    }

    const r3r1 = multiplyTransforms(r3, r1);
    if (!areTransformsEqual(multiplyTransforms(r3r1, r3r1), identity)) {
        console.error("Sanity check failed: (r3 * r1)^2 != I", r3, r1);
    }

    // 5. Folding Isometries g_i
    const sideData: SideData[] = [];
    const g: MobiusMatrix[] = [];

    for (let i = 0; i < p; i++) {
        const pairing = pairings.find(p => p.edgeIndex === i);
        if (!pairing) {
            throw new Error(`Missing side pairing for edge e_${i + 1}`);
        }
        const k_i = pairing.targetEdgeIndex;
        const sign = pairing.sign ?? -1;

        const rotK = createRotationTransform(phi[k_i]);
        const rotI_inv = createRotationTransform(-phi[i]);

        let g_i: MobiusMatrix;
        if (sign === -1) {
            // Orientation-reversing pairing: R_{k_i} o r1 o r3 o R_i^-1
            g_i = multiplyTransforms(rotK, multiplyTransforms(r1, multiplyTransforms(r3, rotI_inv)));
        } else {
            // Orientation-preserving pairing: R_{k_i} o r3 o R_i^-1
            g_i = multiplyTransforms(rotK, multiplyTransforms(r3, rotI_inv));
        }

        g.push(g_i);
    }

    // 6. Comprehensive Folding Sanity Checks
    // Sanity Check A: Edge Midpoint Mapping Test: g_i(m_i) == m_{k_i}
    for (let i = 0; i < p; i++) {
        const pairing = pairings.find(p => p.edgeIndex === i)!;
        const k_i = pairing.targetEdgeIndex;

        const g_mi = applyTransform(g[i], midpoints[i]);
        const dist = ComplexMath.abs(ComplexMath.sub(g_mi, midpoints[k_i]));

        if (dist > 1e-4) {
            console.error(
                `Sanity check failed: g_${i + 1}(m_${i + 1}) != m_${k_i + 1}. Expected (${midpoints[k_i].re.toFixed(4)}, ${midpoints[k_i].im.toFixed(4)}), got (${g_mi.re.toFixed(4)}, ${g_mi.im.toFixed(4)})`,
                g[i]
            );
        }
    }

    // Sanity Check B: Side Pairing Involution Test: g_{k_i} * g_i == I
    for (let i = 0; i < p; i++) {
        const pairing = pairings.find(p => p.edgeIndex === i)!;
        const k_i = pairing.targetEdgeIndex;

        if (pairings[k_i].targetEdgeIndex !== i) {
            console.error(`Side pairing non-involution failure: edge ${i + 1} maps to ${k_i + 1}, but ${k_i + 1} maps to ${pairings[k_i].targetEdgeIndex + 1}`);
        }

        const g_prod = multiplyTransforms(g[k_i], g[i]);
        if (!areTransformsEqual(g_prod, identity)) {
            console.error(`Sanity check failed: g_${k_i + 1} * g_${i + 1} != I`, g[k_i], g[i]);
        }

        sideData.push({
            test: T[i],
            fold: g[i]
        });
    }

    return { sideData, rA, rV };
}