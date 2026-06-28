/**
 * Fast Fourier Transform and periodic noise generation module.
 * Supports arbitrary signal lengths via radix-2 (power-of-two) or Bluestein's algorithm.
 * All noise outputs are real-valued and tileable (periodic) thanks to enforced Hermitian symmetry.
 * 
 * NOTE: Almost all AI-generated
 */

import { complexGaussian } from './misc';

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                   */
/* ------------------------------------------------------------------ */

function isPowerOfTwo(n: number): boolean {
    return n > 0 && (n & (n - 1)) === 0;
}

function nextPowerOfTwo(n: number): number {
    let p = 1;
    while (p < n) p <<= 1;
    return p;
}

function bitReverse(value: number, bits: number): number {
    let reversed = 0;
    for (let i = 0; i < bits; i++) {
        reversed = (reversed << 1) | (value & 1);
        value >>>= 1;
    }
    return reversed;
}

/* ------------------------------------------------------------------ */
/*  FFT class                                                         */
/* ------------------------------------------------------------------ */

export type FFTAlgorithm = 'auto' | 'radix2' | 'bluestein';

export class FFT {
    /**
     * Performs an in-place 1D FFT or inverse FFT.
     * Automatically chooses radix-2 for power-of-two lengths and Bluestein otherwise.
     *
     * @param real - Real part array.
     * @param imag - Imaginary part array (same length as real).
     * @param inverse - `true` for IFFT, `false` for forward FFT.
     * @param algorithm - Algorithm used to compute FFT.
     */
    static transform(
        real: Float32Array,
        imag: Float32Array,
        inverse: boolean,
        algorithm: FFTAlgorithm = 'auto',
    ): void {
        if (real.length !== imag.length) {
            throw new Error('Real and imaginary arrays must have equal length.');
        }
        const N = real.length;
        if (algorithm === 'radix2') {
            if (!isPowerOfTwo(N)) throw new Error('Radix-2 requires power-of-two length.');
            FFT.radix2(real, imag, inverse);
            return;
        }
        if (algorithm === 'bluestein') {
            FFT.bluestein(real, imag, inverse);
            return;
        }
        // 'auto'
        if (isPowerOfTwo(N)) {
            FFT.radix2(real, imag, inverse);
        } else {
            FFT.bluestein(real, imag, inverse);
        }
    }

    /**
     * In-place radix-2 Cooley-Tukey FFT.
     *
     * @param real - Real part (length must be power of two).
     * @param imag - Imaginary part.
     * @param inverse - Direction flag.
     */
    static radix2(real: Float32Array, imag: Float32Array, inverse: boolean): void {
        const N = real.length;
        const bits = Math.log2(N);

        for (let i = 0; i < N; i++) {
            const j = bitReverse(i, bits);
            if (j <= i) continue;
            [real[i], real[j]] = [real[j], real[i]];
            [imag[i], imag[j]] = [imag[j], imag[i]];
        }

        for (let size = 2; size <= N; size <<= 1) {
            const halfSize = size >>> 1;
            const angle = (inverse ? 2 : -2) * Math.PI / size;
            const wStepR = Math.cos(angle);
            const wStepI = Math.sin(angle);

            for (let start = 0; start < N; start += size) {
                let wr = 1.0;
                let wi = 0.0;
                for (let j = 0; j < halfSize; j++) {
                    const even = start + j;
                    const odd = even + halfSize;

                    const tr = wr * real[odd] - wi * imag[odd];
                    const ti = wr * imag[odd] + wi * real[odd];

                    real[odd] = real[even] - tr;
                    imag[odd] = imag[even] - ti;

                    real[even] += tr;
                    imag[even] += ti;

                    const nextWr = wr * wStepR - wi * wStepI;
                    wi = wr * wStepI + wi * wStepR;
                    wr = nextWr;
                }
            }
        }

        if (inverse) {
            const scale = 1 / N;
            for (let i = 0; i < N; i++) {
                real[i] *= scale;
                imag[i] *= scale;
            }
        }
    }

    /**
     * In-place Bluestein (chirp-Z) FFT for arbitrary lengths.
     *
     * @param real - Real part.
     * @param imag - Imaginary part.
     * @param inverse - Direction flag.
     */
    static bluestein(real: Float32Array, imag: Float32Array, inverse: boolean): void {
        const N = real.length;
        if (N === 0) return;

        const M = nextPowerOfTwo((N << 1) - 1);
        const ar = new Float32Array(M);
        const ai = new Float32Array(M);
        const br = new Float32Array(M);
        const bi = new Float32Array(M);

        const sign = inverse ? 1 : -1;

        for (let n = 0; n < N; n++) {
            const angle = sign * Math.PI * n * n / N;
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            ar[n] = real[n] * c - imag[n] * s;
            ai[n] = real[n] * s + imag[n] * c;
        }

        for (let n = 0; n < N; n++) {
            const angle = -sign * Math.PI * n * n / N;
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            br[n] = c;
            bi[n] = s;
            if (n !== 0) {
                br[M - n] = c;
                bi[M - n] = s;
            }
        }

        FFT.convolveComplex(ar, ai, br, bi);

        for (let n = 0; n < N; n++) {
            const angle = sign * Math.PI * n * n / N;
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            const r = ar[n] * c - ai[n] * s;
            const im = ar[n] * s + ai[n] * c;
            real[n] = r;
            imag[n] = im;
        }

        if (inverse) {
            const scale = 1 / N;
            for (let i = 0; i < N; i++) {
                real[i] *= scale;
                imag[i] *= scale;
            }
        }
    }

    /**
     * Complex convolution via three radix-2 FFTs (x, y, and inverse).
     *
     * @param xr - Real part of first sequence (overwritten with result).
     * @param xi - Imag part of first sequence.
     * @param yr - Real part of second sequence.
     * @param yi - Imag part of second sequence.
     */
    static convolveComplex(
        xr: Float32Array,
        xi: Float32Array,
        yr: Float32Array,
        yi: Float32Array
    ): void {
        FFT.radix2(xr, xi, false);
        FFT.radix2(yr, yi, false);
        const N = xr.length;
        for (let i = 0; i < N; i++) {
            const r = xr[i] * yr[i] - xi[i] * yi[i];
            const im = xr[i] * yi[i] + xi[i] * yr[i];
            xr[i] = r;
            xi[i] = im;
        }
        FFT.radix2(xr, xi, true);
    }

    /**
     * Performs an in-place 1D FFT/IFFT (delegates to {@link transform}).
     *
     * @param real - Real part.
     * @param imag - Imaginary part.
     * @param inverse - Direction flag.
     */
    static fft1D(real: Float32Array, imag: Float32Array, inverse: boolean): void {
        FFT.transform(real, imag, inverse);
    }

    /**
     * In-place 2D FFT/IFFT on interleaved complex data.
     * Transforms rows then columns (separability).
     *
     * @param grid - Flattened 2D array of interleaved [real, imag] pairs.
     * @param width - Number of columns.
     * @param height - Number of rows.
     * @param inverse - Direction flag.
     * @param options - Algorithm options passed to 1D transforms.
     */
    static fft2D(
        grid: Float32Array,
        width: number,
        height: number,
        inverse: boolean,
        algorithm: FFTAlgorithm = 'auto',
    ): void {
        const maxDim = Math.max(width, height);
        const rowReal = new Float32Array(maxDim);
        const rowImag = new Float32Array(maxDim);

        // Transform rows
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 2;
                rowReal[x] = grid[idx];
                rowImag[x] = grid[idx + 1];
            }
            FFT.transform(rowReal.subarray(0, width), rowImag.subarray(0, width), inverse, algorithm);
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 2;
                grid[idx] = rowReal[x];
                grid[idx + 1] = rowImag[x];
            }
        }

        // Transform columns
        const colReal = new Float32Array(maxDim);
        const colImag = new Float32Array(maxDim);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const idx = (y * width + x) * 2;
                colReal[y] = grid[idx];
                colImag[y] = grid[idx + 1];
            }
            FFT.transform(colReal.subarray(0, height), colImag.subarray(0, height), inverse, algorithm);
            for (let y = 0; y < height; y++) {
                const idx = (y * width + x) * 2;
                grid[idx] = colReal[y];
                grid[idx + 1] = colImag[y];
            }
        }
    }

    /**
     * In-place 3D FFT/IFFT on interleaved complex data.
     * Transforms X, then Y, then Z axes (separability).
     *
     * @param grid - Flattened 3D array of interleaved [real, imag] pairs.
     * @param width - Size along X.
     * @param height - Size along Y.
     * @param depth - Size along Z.
     * @param inverse - Direction flag.
     * @param options - Algorithm options passed to 1D transforms.
     */
    static fft3D(
        grid: Float32Array,
        width: number,
        height: number,
        depth: number,
        inverse: boolean,
        algorithm: FFTAlgorithm = 'auto',
    ): void {
        const maxDim = Math.max(width, height, depth);
        const lineReal = new Float32Array(maxDim);
        const lineImag = new Float32Array(maxDim);

        // X-axis
        for (let z = 0; z < depth; z++) {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = ((z * height + y) * width + x) * 2;
                    lineReal[x] = grid[idx];
                    lineImag[x] = grid[idx + 1];
                }
                FFT.transform(lineReal.subarray(0, width), lineImag.subarray(0, width), inverse, algorithm);
                for (let x = 0; x < width; x++) {
                    const idx = ((z * height + y) * width + x) * 2;
                    grid[idx] = lineReal[x];
                    grid[idx + 1] = lineImag[x];
                }
            }
        }

        // Y-axis
        for (let z = 0; z < depth; z++) {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const idx = ((z * height + y) * width + x) * 2;
                    lineReal[y] = grid[idx];
                    lineImag[y] = grid[idx + 1];
                }
                FFT.transform(lineReal.subarray(0, height), lineImag.subarray(0, height), inverse, algorithm);
                for (let y = 0; y < height; y++) {
                    const idx = ((z * height + y) * width + x) * 2;
                    grid[idx] = lineReal[y];
                    grid[idx + 1] = lineImag[y];
                }
            }
        }

        // Z-axis
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                for (let z = 0; z < depth; z++) {
                    const idx = ((z * height + y) * width + x) * 2;
                    lineReal[z] = grid[idx];
                    lineImag[z] = grid[idx + 1];
                }
                FFT.transform(lineReal.subarray(0, depth), lineImag.subarray(0, depth), inverse, algorithm);
                for (let z = 0; z < depth; z++) {
                    const idx = ((z * height + y) * width + x) * 2;
                    grid[idx] = lineReal[z];
                    grid[idx + 1] = lineImag[z];
                }
            }
        }
    }

    /* ================================================================== */
    /*  Noise generation (Hermitian-symmetric, no normalisation)          */
    /* ================================================================== */

    /**
     * Generates a 1D periodic noise signal with a 1/f^alpha power spectrum.
     * Output is real-valued and tileable. DC component is set to zero.
     *
     * @param N - Length of the output array (any positive integer).
     * @param alpha - Spectral exponent (0 = white, 1 = pink, 2 = brown).
     * @returns A Float32Array of length N containing the spatial noise samples.
     */
    static generateNoise1D(N: number, alpha: number): Float32Array {
        const real = new Float32Array(N);
        const imag = new Float32Array(N);

        // Fill with complex Gaussian noise
        for (let i = 0; i < N; i++) {
            const [gr, gi] = complexGaussian();
            real[i] = gr;
            imag[i] = gi;
        }

        let sumVariance = 0;

        // Apply spectral weight and enforce Hermitian symmetry
        const half = N >>> 1;
        for (let k = 0; k < N; k++) {
            const freq = k <= half ? k : k - N;
            const mag = Math.abs(freq);
            if (mag === 0) {
                real[k] = 0;
                imag[k] = 0;
                continue;
            }
            const weight = 1 / Math.pow(mag, alpha / 2);
            real[k] *= weight;
            imag[k] *= weight;
            const isFixedBin = ((2 * k) % N == 0);
            sumVariance += (isFixedBin ? 1 : 2) * weight * weight;
        }

        // Enforce Hermitian symmetry: X[N-k] = conj(X[k]) for k > 0
        for (let k = 1; k < N; k++) {
            const sym = N - k;
            if (k < sym) {
                real[sym] = real[k];
                imag[sym] = -imag[k];
            }
        }

        // Nyquist bin (N even) must be real
        if ((N & 1) === 0) {
            imag[N >> 1] = 0;
        }

        FFT.fft1D(real, imag, true);

        const stdDev = Math.sqrt(sumVariance) / N;
        for (let k = 0; k < N; k++)
            real[k] /= stdDev;

        // Extract real part only
        return new Float32Array(real);
    }

    /**
     * Generates a 2D periodic noise texture with a 1/f^alpha power spectrum.
     * Supports non‑square sizes and arbitrary lengths.
     * Output is real‑valued and tileable. DC component is set to zero.
     *
     * @param width  - Number of columns (any positive integer).
     * @param height - Number of rows (any positive integer).
     * @param alpha  - Spectral exponent (0 = white, 1 = pink, 2 = brown).
     * @returns A Float32Array of length width×height in row‑major order.
     */
    static generateNoise2D(width: number, height: number, alpha: number): Float32Array {
        const total = width * height;
        const grid = new Float32Array(total * 2);

        // Initialise with complex Gaussian noise
        for (let i = 0; i < total; i++) {
            const [gr, gi] = complexGaussian();
            grid[i * 2] = gr;
            grid[i * 2 + 1] = gi;
        }

        let sumVariance = 0;

        // Apply spectral weight (PSD ~ 1/f^alpha)
        const halfW = width >>> 1;
        const halfH = height >>> 1;
        for (let y = 0; y < height; y++) {
            const fy = y <= halfH ? y : y - height;
            for (let x = 0; x < width; x++) {
                const fx = x <= halfW ? x : x - width;
                const idx = (y * width + x) * 2;
                const magSq = fx * fx + fy * fy;
                if (magSq === 0) {
                    // DC component
                    grid[idx] = 0;
                    grid[idx + 1] = 0;
                    continue;
                }
                const weight = 1.0 / Math.pow(magSq, alpha / 4);
                grid[idx] *= weight;
                grid[idx + 1] *= weight;
                const isFixedBin = ((2 * x) % width == 0) && ((2 * y) % height == 0);
                sumVariance += (isFixedBin ? 1 : 2) * weight * weight;
            }
        }

        // Enforce Hermitian symmetry: F[-k] = conj(F[k])
        for (let y = 0; y < height; y++) {
            const sy = (height - y) % height;
            for (let x = 0; x < width; x++) {
                const sx = (width - x) % width;
                const idxA = (y * width + x) * 2;
                const idxB = (sy * width + sx) * 2;
                if (idxA < idxB) {
                    grid[idxB] = grid[idxA];
                    grid[idxB + 1] = -grid[idxA + 1];
                } else if (idxA === idxB) {
                    // Self‑symmetric bins (DC, Nyquist corners) must be purely real
                    grid[idxA + 1] = 0;
                }
            }
        }

        FFT.fft2D(grid, width, height, true);

        const stdDev = Math.sqrt(sumVariance) / total;

        // Extract real part
        const result = new Float32Array(total);
        for (let i = 0; i < total; i++) {
            result[i] = grid[i * 2] / stdDev;
        }
        return result;
    }

    /**
     * Generates a 3D periodic noise volume with a 1/f^alpha power spectrum.
     * Supports non‑cubic sizes and arbitrary lengths.
     * Output is real‑valued and tileable. DC component is set to zero.
     *
     * @param width  - X‑axis size (any positive integer).
     * @param height - Y‑axis size (any positive integer).
     * @param depth  - Z‑axis size (any positive integer).
     * @param alpha  - Spectral exponent (0 = white, 1 = pink, 2 = brown).
     * @returns A Float32Array of length width×height×depth in (Z‑major, then Y, then X) order.
     */
    static generateNoise3D(
        width: number,
        height: number,
        depth: number,
        alpha: number
    ): Float32Array {
        const total = width * height * depth;
        const grid = new Float32Array(total * 2);

        for (let i = 0; i < total; i++) {
            const [gr, gi] = complexGaussian();
            grid[i * 2] = gr;
            grid[i * 2 + 1] = gi;
        }

        let sumVariance = 0;

        // Apply spectral weight
        const halfW = width >>> 1;
        const halfH = height >>> 1;
        const halfD = depth >>> 1;
        for (let z = 0; z < depth; z++) {
            const fz = z <= halfD ? z : z - depth;
            for (let y = 0; y < height; y++) {
                const fy = y <= halfH ? y : y - height;
                for (let x = 0; x < width; x++) {
                    const fx = x <= halfW ? x : x - width;
                    const idx = ((z * height + y) * width + x) * 2;
                    const magSq = fx * fx + fy * fy + fz * fz;
                    if (magSq === 0) {
                        grid[idx] = 0;
                        grid[idx + 1] = 0;
                        continue;
                    }
                    const weight = 1.0 / Math.pow(magSq, alpha / 4);
                    grid[idx] *= weight;
                    grid[idx + 1] *= weight;
                    const isFixedBin = ((2 * x) % width == 0) && ((2 * y) % height == 0) && ((2 * z) % depth == 0);
                    sumVariance += (isFixedBin ? 1 : 2) * weight * weight;
                }
            }
        }

        // Enforce Hermitian symmetry
        for (let z = 0; z < depth; z++) {
            const sz = (depth - z) % depth;
            for (let y = 0; y < height; y++) {
                const sy = (height - y) % height;
                for (let x = 0; x < width; x++) {
                    const sx = (width - x) % width;
                    const idxA = ((z * height + y) * width + x) * 2;
                    const idxB = ((sz * height + sy) * width + sx) * 2;
                    if (idxA < idxB) {
                        grid[idxB] = grid[idxA];
                        grid[idxB + 1] = -grid[idxA + 1];
                    } else if (idxA === idxB) {
                        grid[idxA + 1] = 0;
                    }
                }
            }
        }

        FFT.fft3D(grid, width, height, depth, true);

        const stdDev = Math.sqrt(sumVariance) / total;

        const result = new Float32Array(total);
        for (let i = 0; i < total; i++) {
            result[i] = grid[i * 2] / stdDev;
        }
        return result;
    }
}