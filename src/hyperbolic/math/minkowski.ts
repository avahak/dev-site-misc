import { Complex, Vector3D } from '../types';
import { ComplexMath } from './complex';

export class MinkowskiGeometry {
    static minkowskiInnerProduct(v1: Vector3D, v2: Vector3D): number {
        return v1.x * v2.x + v1.y * v2.y - v1.t * v2.t;
    }

    static distance(v1: Vector3D, v2: Vector3D): number {
        const prod = -MinkowskiGeometry.minkowskiInnerProduct(v1, v2);
        return Math.acosh(Math.max(1, prod));
    }

    static poincareToHyperboloid(z: Complex): Vector3D {
        const r2 = ComplexMath.absSq(z);
        const den = Math.max(1e-10, 1 - r2);

        return {
            x: (2 * z.re) / den,
            y: (2 * z.im) / den,
            t: (1 + r2) / den
        };
    }

    static hyperboloidToPoincare(v: Vector3D): Complex {
        const den = 1 + v.t;
        return {
            re: v.x / den,
            im: v.y / den
        };
    }
}