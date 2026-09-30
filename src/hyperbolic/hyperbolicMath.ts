export class Complex {
    constructor(public re: number, public im: number) { }

    add(c: Complex): Complex { return new Complex(this.re + c.re, this.im + c.im); }
    sub(c: Complex): Complex { return new Complex(this.re - c.re, this.im - c.im); }
    mul(c: Complex): Complex { return new Complex(this.re * c.re - this.im * c.im, this.re * c.im + this.im * c.re); }
    div(c: Complex): Complex {
        const den = c.re * c.re + c.im * c.im;
        return new Complex((this.re * c.re + this.im * c.im) / den, (this.im * c.re - this.re * c.im) / den);
    }

    conj(): Complex { return new Complex(this.re, -this.im); }
    absSq(): number { return this.re * this.re + this.im * this.im; }
    abs(): number { return Math.sqrt(this.absSq()); }
    arg(): number { return Math.atan2(this.im, this.re); }

    scale(s: number): Complex { return new Complex(this.re * s, this.im * s); }
    normalize(): Complex {
        const mag = this.abs();
        return mag > 0 ? this.scale(1 / mag) : new Complex(1, 0);
    }

    static fromPolar(r: number, theta: number): Complex {
        return new Complex(r * Math.cos(theta), r * Math.sin(theta));
    }
}

export class Mobius {
    // Represents (a*z + b) / (conj(b)*z + conj(a)) where |a|^2 - |b|^2 = 1
    constructor(public a: Complex, public b: Complex) { }

    static identity(): Mobius {
        return new Mobius(new Complex(1, 0), new Complex(0, 0));
    }

    // Composes this transformation with another: this(other(z))
    compose(other: Mobius): Mobius {
        const aNew = this.a.mul(other.a).add(this.b.mul(other.b.conj()));
        const bNew = this.a.mul(other.b).add(this.b.mul(other.a.conj()));
        return new Mobius(aNew, bNew);
    }

    inverse(): Mobius {
        return new Mobius(this.a.conj(), this.b.scale(-1));
    }

    apply(z: Complex): Complex {
        const num = this.a.mul(z).add(this.b);
        const den = this.b.conj().mul(z).add(this.a.conj());
        return num.div(den);
    }

    // Applies the derivative to a tangent vector (direction)
    applyDir(z: Complex, dir: Complex): Complex {
        const den = this.b.conj().mul(z).add(this.a.conj());
        const denSq = den.mul(den);
        return dir.div(denSq);
    }

    // Map a point z0 to the origin
    static mapToOrigin(z0: Complex): Mobius {
        const gamma = 1 / Math.sqrt(1 - z0.absSq());
        return new Mobius(new Complex(gamma, 0), z0.scale(-gamma));
    }

    // Rotate around the origin by phi radians
    static rotation(phi: number): Mobius {
        return new Mobius(new Complex(Math.cos(phi / 2), Math.sin(phi / 2)), new Complex(0, 0));
    }

    // Finds the Mobius map taking (z1, v1) -> (z2, v2)
    static createMapping(z1: Complex, v1: Complex, z2: Complex, v2: Complex): Mobius {
        const T1 = Mobius.mapToOrigin(z1);
        const T2 = Mobius.mapToOrigin(z2);
        const T2_inv = T2.inverse();

        // T1 and T2 have positive real derivatives, so they preserve angles.
        // We just need a rotation at the origin to align the directions.
        const phi = v2.arg() - v1.arg();
        const R = Mobius.rotation(phi);

        return T2_inv.compose(R).compose(T1);
    }
}

export function hyperbolicDist(z1: Complex, z2: Complex): number {
    const num = z1.sub(z2).absSq();
    const den = (1 - z1.absSq()) * (1 - z2.absSq());
    const arg = 1 + 2 * num / den;
    return Math.acosh(Math.max(1, arg)); // clamp to 1 to avoid NaN from float inaccuracies
}

export function angleDist(a1: number, a2: number): number {
    const diff = (a1 - a2) % (2 * Math.PI);
    return Math.abs(diff > Math.PI ? diff - 2 * Math.PI : (diff < -Math.PI ? diff + 2 * Math.PI : diff));
}

export function lerpAngle(a: number, b: number, t: number): number {
    const diff = (b - a) % (2 * Math.PI);
    const shortest = (2 * diff) % (2 * Math.PI) - diff;
    return a + shortest * t;
}