import { MobiusTransform } from '../math/mobius';
import { Complex, FundamentalPolygon, MobiusMatrix } from '../types';

/**
 * Snaps gView back toward identity if gView(0) has wandered out of P_0.
 *
 * @param gView Current view transformation matrix.
 * @param polygon Fundamental polygon configuration.
 * @param folds Array of side-pairing fold matrices g_i corresponding to polygon.sideTests.
 * @param maxIter Maximum allowed domain folding iterations (default: 64).
 */
export function normalizeGView(
    gView: MobiusMatrix,
    polygon: FundamentalPolygon,
    folds: MobiusMatrix[],
    maxIter = 64
): MobiusMatrix {
    // 1. Evaluate origin image in world/tiling space
    let z0 = MobiusTransform.apply(gView, { re: 0, im: 0 });

    // 2. Accumulate folding transformations h in H
    let h = MobiusTransform.identity();
    const sideCount = polygon.sideTests.length;

    for (let iter = 0; iter < maxIter; iter++) {
        let moved = false;

        for (let i = 0; i < sideCount; i++) {
            const Tz = MobiusTransform.apply(polygon.sideTests[i], z0);

            // Point lies outside edge i (Im(T_i(z)) <= 0)
            if (Tz.im <= 0) {
                const g_i = folds[i];

                // Advance test point and accumulate transform: h_new = g_i o h_old
                z0 = MobiusTransform.apply(g_i, z0);
                h = MobiusTransform.multiply(g_i, h);

                moved = true;
                break; // Restart edge testing from edge 0
            }
        }

        if (!moved)
            break; // z0 is successfully folded inside P_0
    }

    // 3. Update view matrix: gView_new = h o gView_old
    const updatedView = MobiusTransform.multiply(h, gView);

    // 4. Renormalize matrix coefficients to prevent determinant/floating-point drift
    return MobiusTransform.normalize(updatedView);
}

/**
 * Computes updated gView for a mouse pan gesture from z1 to z2 in Poincaré coordinates.
 *
 * @param gView Current view transformation matrix.
 * @param z1 Starting mouse position in disk coordinates.
 * @param z2 Current mouse position in disk coordinates.
 * @param polygon Fundamental polygon configuration for normalization.
 * @param folds Array of side-pairing fold matrices g_i.
 */
export function panGView(
    gView: MobiusMatrix,
    z1: Complex,
    z2: Complex,
    polygon: FundamentalPolygon,
    folds: MobiusMatrix[]
): MobiusMatrix {
    // Guard against points on or outside the unit boundary circle |z| >= 1
    const r1Sq = z1.re * z1.re + z1.im * z1.im;
    const r2Sq = z2.re * z2.re + z2.im * z2.im;
    if (r1Sq >= 0.999 || r2Sq >= 0.999)
        return gView;

    // 1. Construct hyperbolic isometry mapping z2 -> 0 -> z1
    // M_drag = T_{z1} o T_{-z2}
    const toOrigin = MobiusTransform.mapToOrigin(z2);     // Sends z2 to 0
    const fromOrigin = MobiusTransform.mapOriginTo(z1);   // Sends 0 to z1
    const dragTransform = MobiusTransform.multiply(fromOrigin, toOrigin);

    // 2. Apply drag transform to view: gView_new = gView_old o M_drag
    // Ensures that gView_new(z2) = gView_old(M_drag(z2)) = gView_old(z1)
    const rawPanView = MobiusTransform.multiply(gView, dragTransform);

    // 3. Re-center gView around identity if origin moved outside P_0
    return normalizeGView(rawPanView, polygon, folds);
}