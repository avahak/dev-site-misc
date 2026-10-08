import { Complex } from '../types';

export class ComplexMath {
    static zero(): Complex {
        return { re: 0, im: 0 };
    }

    static one(): Complex {
        return { re: 1, im: 0 };
    }

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
        const den = v.re * v.re + v.im * v.im;
        return {
            re: (u.re * v.re + u.im * v.im) / den,
            im: (u.im * v.re - u.re * v.im) / den
        };
    }

    static conj(z: Complex): Complex {
        return { re: z.re, im: -z.im };
    }

    static scale(z: Complex, s: number): Complex {
        return { re: z.re * s, im: z.im * s };
    }

    static absSq(z: Complex): number {
        return z.re * z.re + z.im * z.im;
    }

    static abs(z: Complex): number {
        return Math.hypot(z.re, z.im);
    }

    static arg(z: Complex): number {
        return Math.atan2(z.im, z.re);
    }

    static fromPolar(r: number, theta: number): Complex {
        return { re: r * Math.cos(theta), im: r * Math.sin(theta) };
    }

    static angleDist(a1: number, a2: number): number {
        const diff = (a1 - a2) % (2 * Math.PI);
        return Math.abs(diff > Math.PI ? diff - 2 * Math.PI : (diff < -Math.PI ? diff + 2 * Math.PI : diff));
    }

    static lerpAngle(a: number, b: number, t: number): number {
        const diff = (b - a) % (2 * Math.PI);
        const shortest = (2 * diff) % (2 * Math.PI) - diff;
        return a + shortest * t;
    }
}