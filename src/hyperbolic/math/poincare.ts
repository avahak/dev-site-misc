import { Complex, PolygonMetrics } from '../types';
import { ComplexMath } from './complex';

export class PoincareGeometry {
    static distance(z1: Complex, z2: Complex): number {
        const num = ComplexMath.absSq(ComplexMath.sub(z1, z2));
        const den = (1 - ComplexMath.absSq(z1)) * (1 - ComplexMath.absSq(z2));
        const arg = 1 + (2 * num) / den;
        return Math.acosh(Math.max(1, arg));
    }

    /**
     * Evaluates a point along the unit-speed geodesic starting at c1 in the direction of c2.
     * @param c1 Starting point in the disk
     * @param c2 Target point in the disk
     * @param t Parameter in [0, 1] representing proportional hyperbolic distance
     */
    static geodesicPoint(c1: Complex, c2: Complex, t: number): Complex {
        // Map c1 to the origin
        const num = ComplexMath.sub(c2, c1);
        const den = ComplexMath.sub(ComplexMath.one(), ComplexMath.mul(ComplexMath.conj(c1), c2));
        const w = ComplexMath.div(num, den);

        const r = ComplexMath.abs(w);
        if (r < 1e-9)
            return c1;

        // Interpolate along the radial geodesic at the origin
        const distToW = Math.atanh(Math.min(r, 0.9999999));
        const rInterp = Math.tanh(t * distToW);
        const zeta = ComplexMath.scale(w, rInterp / r);

        // Map back to original disk position via T_c1^{-1}
        const numInv = ComplexMath.add(zeta, c1);
        const denInv = ComplexMath.add(ComplexMath.one(), ComplexMath.mul(ComplexMath.conj(c1), zeta));
        return ComplexMath.div(numInv, denInv);
    }

    /**
     * Discretizes the geodesic segment between c1 and c2 into a specified number of steps.
     */
    static getGeodesicPoints(c1: Complex, c2: Complex, steps: number = 16): Complex[] {
        const pts: Complex[] = [];
        for (let i = 0; i <= steps; i++)
            pts.push(PoincareGeometry.geodesicPoint(c1, c2, i / steps));
        return pts;
    }
}