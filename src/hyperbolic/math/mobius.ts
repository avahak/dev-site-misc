import { Complex, MobiusMatrix } from '../types';
import { ComplexMath } from './complex';

export class MobiusTransform {
    static identity(): MobiusMatrix {
        return {
            a: ComplexMath.one(),
            b: ComplexMath.zero(),
            c: ComplexMath.zero(),
            d: ComplexMath.one(),
            isReflected: false
        };
    }

    static normalize(m: MobiusMatrix): MobiusMatrix {
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

    static matrixConj(m: MobiusMatrix): MobiusMatrix {
        return {
            a: ComplexMath.conj(m.a),
            b: ComplexMath.conj(m.b),
            c: ComplexMath.conj(m.c),
            d: ComplexMath.conj(m.d),
            isReflected: m.isReflected
        };
    }

    static apply(m: MobiusMatrix, z: Complex): Complex {
        const evalZ = m.isReflected ? ComplexMath.conj(z) : z;

        const num = ComplexMath.add(ComplexMath.mul(m.a, evalZ), m.b);
        const den = ComplexMath.add(ComplexMath.mul(m.c, evalZ), m.d);
        return ComplexMath.div(num, den);
    }

    static multiply(m1: MobiusMatrix, m2: MobiusMatrix): MobiusMatrix {
        const r1 = !!m1.isReflected;
        const r2 = !!m2.isReflected;

        const effM2 = r1 ? MobiusTransform.matrixConj(m2) : m2;

        const a = ComplexMath.add(ComplexMath.mul(m1.a, effM2.a), ComplexMath.mul(m1.b, effM2.c));
        const b = ComplexMath.add(ComplexMath.mul(m1.a, effM2.b), ComplexMath.mul(m1.b, effM2.d));
        const c = ComplexMath.add(ComplexMath.mul(m1.c, effM2.a), ComplexMath.mul(m1.d, effM2.c));
        const d = ComplexMath.add(ComplexMath.mul(m1.c, effM2.b), ComplexMath.mul(m1.d, effM2.d));

        return MobiusTransform.normalize({ a, b, c, d, isReflected: r1 !== r2 });
    }

    static inverse(m: MobiusMatrix): MobiusMatrix {
        const r = !!m.isReflected;
        const det = ComplexMath.sub(ComplexMath.mul(m.a, m.d), ComplexMath.mul(m.b, m.c));

        let inv: MobiusMatrix = {
            a: ComplexMath.div(m.d, det),
            b: ComplexMath.div(ComplexMath.scale(m.b, -1), det),
            c: ComplexMath.div(ComplexMath.scale(m.c, -1), det),
            d: ComplexMath.div(m.a, det),
            isReflected: r
        };

        if (r)
            inv = MobiusTransform.matrixConj(inv);
        return MobiusTransform.normalize(inv);
    }

    static rotation(angle: number): MobiusMatrix {
        return MobiusTransform.normalize({
            a: { re: Math.cos(angle / 2), im: Math.sin(angle / 2) },
            b: ComplexMath.zero(),
            c: ComplexMath.zero(),
            d: { re: Math.cos(angle / 2), im: -Math.sin(angle / 2) },
            isReflected: false
        });
    }

    /**
     * Constructs a conformal hyperbolic translation sending origin 0 to point a in D^2.
     * T_a(z) = (z + a) / (1 + conj(a) * z)
     */
    static mapOriginTo(a: Complex): MobiusMatrix {
        return MobiusTransform.normalize({
            a: { re: 1, im: 0 },
            b: a,
            c: { re: a.re, im: -a.im }, // conj(a)
            d: { re: 1, im: 0 },
            isReflected: false,
        });
    }

    /**
     * Constructs a conformal hyperbolic translation sending point a in D^2 to origin 0.
     * T_{-a}(z) = (z - a) / (1 - conj(a) * z)
     */
    static mapToOrigin(a: Complex): MobiusMatrix {
        return MobiusTransform.normalize({
            a: { re: 1, im: 0 },
            b: { re: -a.re, im: -a.im }, // -a
            c: { re: -a.re, im: a.im },  // -conj(a)
            d: { re: 1, im: 0 },
            isReflected: false,
        });
    }

    static areTransformsEqual(m1: MobiusMatrix, m2: MobiusMatrix, tol: number = 1e-5): boolean {
        // 1. Differing orientation-preservation status means the maps are distinct
        if (!!m1.isReflected !== !!m2.isReflected)
            return false;

        // 2. A conformal Möbius transformation is uniquely determined by 3 distinct points.
        const testPoints: Complex[] = [
            { re: -0.4, im: -0.2 },
            { re: 0.4, im: -0.2 },
            { re: 0, im: 0.5 }
        ];

        for (const pt of testPoints) {
            const z1 = MobiusTransform.apply(m1, pt);
            const z2 = MobiusTransform.apply(m2, pt);
            if (ComplexMath.abs(ComplexMath.sub(z1, z2)) > tol)
                return false;
        }

        return true;
    }
}