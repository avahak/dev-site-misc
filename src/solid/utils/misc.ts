interface Point3D {
    x: number;
    y: number;
    z: number;
}

type Distribution<T> = [value: T, weight: number][];


/**
 * @returns A random Gaussian-distributed pair of reals.
 */
function complexGaussian(): [number, number] {
    let u = Math.max(Number.MIN_VALUE, Math.random());
    const r = Math.sqrt(-2.0 * Math.log(u));
    const phi = 2.0 * Math.PI * Math.random();
    return [r * Math.cos(phi), r * Math.sin(phi)];
}

/**
 * Reverses the bits of an integer for a given bit-width. Required to map
 * array indices to their correct positions for the Radix-2 FFT algorithm.
 * @param {number} n - The integer index to reverse.
 * @param {number} bits - The total number of bits representing the sequence length.
 * @returns {number} The bit-reversed integer index.
 */
function bitReverse(n: number, bits: number): number {
    let reversed = 0;
    for (let i = 0; i < bits; i++) {
        if ((n & (1 << i)) !== 0) {
            reversed |= (1 << (bits - 1 - i));
        }
    }
    return reversed;
}

/**
 * Normalizes array to [0, 1] range.
 */
function normalize(array: Float32Array) {
    let minVal = Infinity;
    let maxVal = -Infinity;

    for (let i = 0; i < array.length; i++) {
        minVal = Math.min(minVal, array[i]);
        maxVal = Math.max(maxVal, array[i]);
    }

    const range = maxVal - minVal;
    if (range > 0) {
        for (let i = 0; i < array.length; i++) {
            array[i] = (array[i] - minVal) / range;
        }
    }
}

/**
 * Generates a set of random weights summing to 1. The variation among the lengths 
 * is controlled by a log-normal dispersion parameter. Small values produce nearly 
 * identical segments, while larger values introduce more variation.
 *
 * @param n - The number of parts to split the space into.
 * @param dispersion - The log-scale standard deviation.
 * @returns An array of `n` normalized weights that sums to 1.
 */
function generateRandomWeights(n: number, dispersion: number): number[] {
    const weights: number[] = [];
    let totalWeight = 0;

    for (let i = 0; i < n; i++) {
        const x = complexGaussian()[0];
        const w = Math.exp(dispersion * x);     // sample from log-normal distribution
        weights.push(w);
        totalWeight += w;
    }

    return weights.map(w => w / totalWeight);
}

/**
 * Determines whether the intersection of a cylinder C (x^2 + y^2 = R) 
 * and two Euclidean balls B(p1, r1) and B(p2, r2) is empty.
 * NOTE: AI code
 * @param R The squared radius of the cylinder (from x^2 + y^2 = R)
 * @param p1 Center of the first ball
 * @param r1 Radius of the first ball
 * @param p2 Center of the second ball
 * @param r2 Radius of the second ball
 * @returns true if the intersection on the cylinder is empty, false otherwise.
 */
function isCylinderIntersectionEmpty(
    R: number,
    p1: Point3D,
    r1: number,
    p2: Point3D,
    r2: number
): boolean {
    // 1. Trivial 3D check: If the spheres do not intersect in 3D space,
    // they cannot possibly intersect on the cylinder surface.
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance3D >= r1 + r2)
        return true;

    // 2. Map 3D positions to angular coordinates theta on the cylinder.
    const theta1 = Math.atan2(p1.y, p1.x);
    const theta2 = Math.atan2(p2.y, p2.x);

    // 3. Compute the shortest angular distance along the circumference.
    let deltaTheta = Math.abs(theta1 - theta2);
    if (deltaTheta > Math.PI) {
        deltaTheta = 2 * Math.PI - deltaTheta;
    }

    // 4. Define the target function F(t) = f1(t) + f2(t)
    // t tracks the local angular displacement from p1 towards p2.
    const getHalfWidthSum = (t: number): number => {
        const term1 = r1 * r1 - 4 * R * Math.sin(t / 2) * Math.sin(t / 2);
        const term2 = r2 * r2 - 4 * R * Math.sin((deltaTheta - t) / 2) * Math.sin((deltaTheta - t) / 2);

        const f1 = term1 > 0 ? Math.sqrt(term1) : 0;
        const f2 = term2 > 0 ? Math.sqrt(term2) : 0;

        return f1 + f2;
    };

    // 5. Perform Ternary Search to find the maximum capability of the combined bounds.
    let low = 0;
    let high = deltaTheta;
    const iterations = 60;

    for (let i = 0; i < iterations; i++) {
        const m1 = low + (high - low) / 3;
        const m2 = high - (high - low) / 3;

        if (getHalfWidthSum(m1) < getHalfWidthSum(m2)) {
            low = m1;
        } else {
            high = m2;
        }
    }

    const maxHalfWidthSum = getHalfWidthSum((low + high) / 2);
    const verticalDistance = Math.abs(p1.z - p2.z);

    // 6. If the vertical distance between centers is strictly less than 
    // the maximum combined vertical half-widths, a mutual point exists.
    return verticalDistance >= maxHalfWidthSum;
}


/**
 * Sample from a finite probability distribution.
 * Example use: 
 * ```
 * sample([["Face card", 3/13], ["Non-face card", 10/13]])
 * ```
 */
function sample<T>(distribution: Distribution<T>): T {
    const totalWeight = distribution.reduce((sum, [_, weight]) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [value, weight] of distribution) {
        random -= weight;
        if (random <= 0)
            return value;
    }

    return distribution[distribution.length - 1][0];
}

function clamp(v: number) {
    return Math.max(0, Math.min(1, v));
}

function lerp(a: Point3D, b: Point3D, t: number): Point3D {
    return {
        x: clamp(a.x + (b.x - a.x) * t),
        y: clamp(a.y + (b.y - a.y) * t),
        z: clamp(a.z + (b.z - a.z) * t),
    };
}

function scale(c: Point3D, s: number): Point3D {
    return {
        x: clamp(c.x * s),
        y: clamp(c.y * s),
        z: clamp(c.z * s),
    };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}


export type { Point3D };
export {
    bitReverse, complexGaussian, normalize, generateRandomWeights,
    isCylinderIntersectionEmpty, sample, lerp, clamp, smoothstep, scale,
};