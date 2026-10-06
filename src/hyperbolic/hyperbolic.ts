import { Complex, MobiusMatrix, Point2D } from './types';

export class ComplexMath {
    static add(u: Complex, v: Complex): Complex {
        return { re: u.re + v.re, im: u.im + v.im };
    }

    static sub(u: Complex, v: Complex): Complex {
        return { re: u.re - v.re, im: u.im - v.im };
    }

    static mul(u: Complex, v: Complex): Complex {
        return {
            re: u.re * v.re - u.im * v.im,
            im: u.re * v.im + u.im * v.re
        };
    }

    static div(u: Complex, v: Complex): Complex {
        const denom = v.re * v.re + v.im * v.im;
        return {
            re: (u.re * v.re + u.im * v.im) / denom,
            im: (u.im * v.re - u.re * v.im) / denom
        };
    }

    static conj(z: Complex): Complex {
        return { re: z.re, im: -z.im };
    }

    static scale(z: Complex, s: number): Complex {
        return { re: z.re * s, im: z.im * s };
    }

    static abs(z: Complex): number {
        return Math.hypot(z.re, z.im);
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
}

export class MobiusTransform {
    static identity(): MobiusMatrix {
        return {
            a: { re: 1, im: 0 },
            b: { re: 0, im: 0 },
            c: { re: 0, im: 0 },
            d: { re: 1, im: 0 },
            isReflected: false
        };
    }

    static apply(m: MobiusMatrix, z: Point2D | Complex): Complex {
        const input: Complex = 'x' in z ? { re: z.x, im: z.y } : z;
        const evalZ = m.isReflected ? ComplexMath.conj(input) : input;

        const num = ComplexMath.add(ComplexMath.mul(m.a, evalZ), m.b);
        const den = ComplexMath.add(ComplexMath.mul(m.c, evalZ), m.d);
        return ComplexMath.div(num, den);
    }

    static multiply(m1: MobiusMatrix, m2: MobiusMatrix): MobiusMatrix {
        const r1 = !!m1.isReflected;
        const r2 = !!m2.isReflected;

        const effM2 = r1 ? ComplexMath.matrixConj(m2) : m2;

        const a = ComplexMath.add(ComplexMath.mul(m1.a, effM2.a), ComplexMath.mul(m1.b, effM2.c));
        const b = ComplexMath.add(ComplexMath.mul(m1.a, effM2.b), ComplexMath.mul(m1.b, effM2.d));
        const c = ComplexMath.add(ComplexMath.mul(m1.c, effM2.a), ComplexMath.mul(m1.d, effM2.c));
        const d = ComplexMath.add(ComplexMath.mul(m1.c, effM2.b), ComplexMath.mul(m1.d, effM2.d));

        return { a, b, c, d, isReflected: r1 !== r2 };
    }

    static inverse(m: MobiusMatrix): MobiusMatrix {
        const r = !!m.isReflected;
        const inv: MobiusMatrix = {
            a: m.d,
            b: ComplexMath.scale(m.b, -1),
            c: ComplexMath.scale(m.c, -1),
            d: m.a,
            isReflected: r
        };
        return r ? ComplexMath.matrixConj(inv) : inv;
    }

    static distance(m1: MobiusMatrix, m2: MobiusMatrix): number {
        if (!!m1.isReflected !== !!m2.isReflected) return Infinity;

        const da = ComplexMath.abs(ComplexMath.sub(m1.a, m2.a));
        const db = ComplexMath.abs(ComplexMath.sub(m1.b, m2.b));
        const dc = ComplexMath.abs(ComplexMath.sub(m1.c, m2.c));
        const dd = ComplexMath.abs(ComplexMath.sub(m1.d, m2.d));

        return da + db + dc + dd;
    }
}

export class HyperbolicGeometry {
    static getGeodesicPoints(p1: Point2D, p2: Point2D, steps: number = 16): Point2D[] {
        const cross = p1.x * p2.y - p1.y * p2.x;

        if (Math.abs(cross) < 1e-5) {
            const pts: Point2D[] = [];
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                pts.push({
                    x: p1.x + t * (p2.x - p1.x),
                    y: p1.y + t * (p2.y - p1.y)
                });
            }
            return pts;
        }

        const d1 = p1.x * p1.x + p1.y * p1.y + 1;
        const d2 = p2.x * p2.x + p2.y * p2.y + 1;
        const det = 2 * (p1.x * p2.y - p2.x * p1.y);

        const cx = (p2.y * d1 - p1.y * d2) / det;
        const cy = (p1.x * d2 - p2.x * d1) / det;
        const radius = Math.sqrt(cx * cx + cy * cy - 1);

        let a1 = Math.atan2(p1.y - cy, p1.x - cx);
        let a2 = Math.atan2(p2.y - cy, p2.x - cx);

        let da = a2 - a1;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;

        const pts: Point2D[] = [];
        for (let i = 0; i <= steps; i++) {
            const a = a1 + (i / steps) * da;
            pts.push({
                x: cx + radius * Math.cos(a),
                y: cy + radius * Math.sin(a)
            });
        }
        return pts;
    }
}