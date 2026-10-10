import { ComplexMath } from './complex';
import { MobiusTransform } from './mobius';
import { PoincareGeometry } from './poincare';
import { MinkowskiGeometry } from './minkowski';
import { FundamentalPolygonBuilder } from './polygon';

function assert(condition: boolean, message: string): void {
    if (!condition)
        throw new Error(`Assertion failed: ${message}`);
}

export function testPolygonRelations(): void {
    const p = 8;
    const q = 8;

    const polygon = FundamentalPolygonBuilder.build(p, q);
    const { r1, r2, r3 } = polygon.reflections;
    const I = MobiusTransform.identity();

    // 1. Triangle Group Generator Involutions
    assert(MobiusTransform.areTransformsEqual(MobiusTransform.multiply(r1, r1), I), 'r1^2 == I');
    assert(MobiusTransform.areTransformsEqual(MobiusTransform.multiply(r2, r2), I), 'r2^2 == I');
    assert(MobiusTransform.areTransformsEqual(MobiusTransform.multiply(r3, r3), I), 'r3^2 == I');

    // 2. Fundamental Group Relations
    let rho_p = I;
    const rho = MobiusTransform.multiply(r1, r2);
    for (let k = 0; k < p; k++) rho_p = MobiusTransform.multiply(rho_p, rho);
    assert(MobiusTransform.areTransformsEqual(rho_p, I), '(r1 * r2)^p == I');

    let r2r3_q = I;
    const r2r3 = MobiusTransform.multiply(r2, r3);
    for (let k = 0; k < q; k++) r2r3_q = MobiusTransform.multiply(r2r3_q, r2r3);
    assert(MobiusTransform.areTransformsEqual(r2r3_q, I), '(r2 * r3)^q == I');

    // 3. Standalone Edge Reflection Invariants
    for (let i = 0; i < p; i++) {
        const sigma_i = polygon.edgeReflections[i];

        // Involution test: \sigma_i^2 == I
        const sigma_sq = MobiusTransform.multiply(sigma_i, sigma_i);
        assert(MobiusTransform.areTransformsEqual(sigma_sq, I), `sigma_${i}^2 == I`);

        // Midpoint fixed-point test: \sigma_i(m_i) == m_i
        const fixedMidpoint = MobiusTransform.apply(sigma_i, polygon.midpoints[i]);
        const midDist = ComplexMath.abs(ComplexMath.sub(fixedMidpoint, polygon.midpoints[i]));
        assert(midDist < 1e-4, `sigma_${i} fixes edge midpoint m_${i}`);

        // Vertex fixed-point test: \sigma_i fixes its bounding vertices v_{i-1} and v_i
        const prevVertIdx = (i - 1 + p) % p;
        const fixedV1 = MobiusTransform.apply(sigma_i, polygon.vertices[prevVertIdx]);
        const fixedV2 = MobiusTransform.apply(sigma_i, polygon.vertices[i]);

        const distV1 = ComplexMath.abs(ComplexMath.sub(fixedV1, polygon.vertices[prevVertIdx]));
        const distV2 = ComplexMath.abs(ComplexMath.sub(fixedV2, polygon.vertices[i]));

        assert(distV1 < 1e-4, `sigma_${i} fixes bounding vertex v_${prevVertIdx}`);
        assert(distV2 < 1e-4, `sigma_${i} fixes bounding vertex v_${i}`);
    }
}

export function runTests(): void {
    console.log('Running math library tests...');

    // 1. Möbius composition & inverse test
    const M1 = MobiusTransform.rotation(Math.PI / 3);
    const M2 = MobiusTransform.mapToOrigin({ re: 0.3, im: -0.2 });
    const M_comp = MobiusTransform.multiply(M1, M2);
    const M_inv = MobiusTransform.inverse(M_comp);
    const Identity = MobiusTransform.multiply(M_comp, M_inv);

    assert(MobiusTransform.areTransformsEqual(Identity, MobiusTransform.identity()), 'Mobius composition with inverse should equal Identity');

    // 2. Poincaré <-> Minkowski conversion roundtrip
    const zInitial = { re: 0.4, im: -0.5 };
    const hyperboloidPt = MinkowskiGeometry.poincareToHyperboloid(zInitial);
    const norm = MinkowskiGeometry.minkowskiInnerProduct(hyperboloidPt, hyperboloidPt);
    assert(Math.abs(norm - (-1)) < 1e-6, `Hyperboloid point must have Minkowski norm -1, got ${norm}`);

    const zRoundtrip = MinkowskiGeometry.hyperboloidToPoincare(hyperboloidPt);
    const distError = ComplexMath.abs(ComplexMath.sub(zInitial, zRoundtrip));
    assert(distError < 1e-6, `Roundtrip Poincaré-Minkowski error too large: ${distError}`);

    // 3. Metric equivalence across models
    const zA = { re: 0.1, im: 0.2 };
    const zB = { re: -0.4, im: 0.3 };

    const distPoincare = PoincareGeometry.distance(zA, zB);
    const vecA = MinkowskiGeometry.poincareToHyperboloid(zA);
    const vecB = MinkowskiGeometry.poincareToHyperboloid(zB);
    const distMinkowski = MinkowskiGeometry.distance(vecA, vecB);

    assert(Math.abs(distPoincare - distMinkowski) < 1e-5, `Distances in Poincaré (${distPoincare}) and Minkowski (${distMinkowski}) must match`);

    testPolygonRelations();

    console.log('All math library tests passed successfully!');
}