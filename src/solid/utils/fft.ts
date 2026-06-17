/**
 * FFT stuff for generating 1/f^\alpha noise. Mostly AI-generated.
 */

import { bitReverse, complexGaussian, normalize } from './misc';

/**
 * FFT stuff for generating 1/f^\alpha noise. Mostly AI-generated.
 */
class FFT {
    /**
     * Performs an in-place 1D Fast Fourier Transform (FFT) or Inverse FFT (IFFT)
     * on split real and imaginary Float32Array blocks using the Cooley-Tukey algorithm.
     * @param {Float32Array} real - The real component array of length N.
     * @param {Float32Array} imag - The imaginary component array of length N.
     * @param {boolean} inverse - Set to true for an Inverse FFT, false for a Forward FFT.
     */
    static fft1D(real: Float32Array, imag: Float32Array, inverse: boolean): void {
        const N = real.length;
        const bits = Math.log2(N);

        // Reorder elements via bit-reversal permutation
        for (let i = 0; i < N; i++) {
            const j = bitReverse(i, bits);
            if (i < j) {
                [real[i], real[j]] = [real[j], real[i]];
                [imag[i], imag[j]] = [imag[j], imag[i]];
            }
        }

        // Cooley-Tukey Decimation-in-Time implementation
        for (let len = 2; len <= N; len <<= 1) {
            const angle = (2 * Math.PI / len) * (inverse ? 1 : -1);
            const wlenReal = Math.cos(angle);
            const wlenImag = Math.sin(angle);

            for (let i = 0; i < N; i += len) {
                let wReal = 1.0;
                let wImag = 0.0;
                const halfLen = len >> 1;

                for (let j = 0; j < halfLen; j++) {
                    const uReal = real[i + j];
                    const uImag = imag[i + j];

                    const vReal = real[i + j + halfLen];
                    const vImag = imag[i + j + halfLen];

                    // Complex multiplication: t = w * v
                    const tReal = vReal * wReal - vImag * wImag;
                    const tImag = vReal * wImag + vImag * wReal;

                    // Butterfly updates
                    real[i + j] = uReal + tReal;
                    imag[i + j] = uImag + tImag;
                    real[i + j + halfLen] = uReal - tReal;
                    imag[i + j + halfLen] = uImag - tImag;

                    // Rotate twiddle factor for next iteration
                    const nextWReal = wReal * wlenReal - wImag * wlenImag;
                    wImag = wReal * wlenImag + wImag * wlenReal;
                    wReal = nextWReal;
                }
            }
        }

        // Apply scaling factor if computing the Inverse FFT
        if (inverse) {
            for (let i = 0; i < N; i++) {
                real[i] /= N;
                imag[i] /= N;
            }
        }
    }

    /**
     * Performs a 2D FFT or IFFT operation on an interleaved complex data grid.
     * Leverages the separability property by transforming X and Y axes sequentially.
     * @param {Float32Array} grid - Flattened 2D grid containing interleaved [real, imag] elements.
     * @param {number} N - The structural resolution edge length of the square (must be a power of 2).
     * @param {boolean} inverse - Set to true for an Inverse FFT, false for a Forward FFT.
     */
    static fft2D(grid: Float32Array, N: number, inverse: boolean): void {
        const realBuf = new Float32Array(N);
        const imagBuf = new Float32Array(N);

        // 1. Transform X-Axis rows
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                const idx = ((y * N) + x) * 2;
                realBuf[x] = grid[idx];
                imagBuf[x] = grid[idx + 1];
            }
            FFT.fft1D(realBuf, imagBuf, inverse);
            for (let x = 0; x < N; x++) {
                const idx = ((y * N) + x) * 2;
                grid[idx] = realBuf[x];
                grid[idx + 1] = imagBuf[x];
            }
        }

        // 2. Transform Y-Axis columns
        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                const idx = ((y * N) + x) * 2;
                realBuf[y] = grid[idx];
                imagBuf[y] = grid[idx + 1];
            }
            FFT.fft1D(realBuf, imagBuf, inverse);
            for (let y = 0; y < N; y++) {
                const idx = ((y * N) + x) * 2;
                grid[idx] = realBuf[y];
                grid[idx + 1] = imagBuf[y];
            }
        }
    }

    /**
     * Performs a 3D FFT or IFFT operation on an interleaved complex data grid.
     * Leverages the separability property by transforming X, Y, and Z axes sequentially.
     * @param {Float32Array} grid - Flattened 3D grid containing interleaved [real, imag] elements.
     * @param {number} N - The structural resolution edge length of the cube (must be a power of 2).
     * @param {boolean} inverse - Set to true for an Inverse FFT, false for a Forward FFT.
     */
    static fft3D(grid: Float32Array, N: number, inverse: boolean): void {
        const realBuf = new Float32Array(N);
        const imagBuf = new Float32Array(N);

        // 1. Transform X-Axis lines
        for (let z = 0; z < N; z++) {
            for (let y = 0; y < N; y++) {
                for (let x = 0; x < N; x++) {
                    const idx = ((z * N * N) + (y * N) + x) * 2;
                    realBuf[x] = grid[idx];
                    imagBuf[x] = grid[idx + 1];
                }
                FFT.fft1D(realBuf, imagBuf, inverse);
                for (let x = 0; x < N; x++) {
                    const idx = ((z * N * N) + (y * N) + x) * 2;
                    grid[idx] = realBuf[x];
                    grid[idx + 1] = imagBuf[x];
                }
            }
        }

        // 2. Transform Y-Axis lines
        for (let z = 0; z < N; z++) {
            for (let x = 0; x < N; x++) {
                for (let y = 0; y < N; y++) {
                    const idx = ((z * N * N) + (y * N) + x) * 2;
                    realBuf[y] = grid[idx];
                    imagBuf[y] = grid[idx + 1];
                }
                FFT.fft1D(realBuf, imagBuf, inverse);
                for (let y = 0; y < N; y++) {
                    const idx = ((z * N * N) + (y * N) + x) * 2;
                    grid[idx] = realBuf[y];
                    grid[idx + 1] = imagBuf[y];
                }
            }
        }

        // 3. Transform Z-Axis lines
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                for (let z = 0; z < N; z++) {
                    const idx = ((z * N * N) + (y * N) + x) * 2;
                    realBuf[z] = grid[idx];
                    imagBuf[z] = grid[idx + 1];
                }
                FFT.fft1D(realBuf, imagBuf, inverse);
                for (let z = 0; z < N; z++) {
                    const idx = ((z * N * N) + (y * N) + x) * 2;
                    grid[idx] = realBuf[z];
                    grid[idx + 1] = imagBuf[z];
                }
            }
        }
    }

    /**
     * Generates a 1D periodic/tileable 1/f^alpha noise signal using an IFFT pipeline.
     * Extracts the real output values and normalizes them into a standard uniform [0, 1] range.
     * @param {number} N - Resolution size of the signal array (must be a power of 2).
     * @param {number} alpha - The spectral density exponent factor (0 = White, 1 = Pink, 2 = Brown noise).
     * @returns {Float32Array} A linear array of length N representing normalized spatial noise scalars.
     */
    static generateNoise1D(N: number, alpha: number): Float32Array {
        const complexGrid = new Float32Array(N * 2);

        for (let i = 0; i < N * 2; i += 2) {
            const [rx, ry] = complexGaussian();
            complexGrid[i] = rx;
            complexGrid[i + 1] = ry;
        }

        for (let x = 0; x < N; x++) {
            const fx = x < N / 2 ? x : x - N;
            const idx = x * 2;
            const magSq = fx * fx;

            if (magSq === 0) {
                complexGrid[idx] = 0.0;
                complexGrid[idx + 1] = 0.0;
                continue;
            }

            const frequencyMagnitude = Math.abs(fx);
            const spectralWeight = 1.0 / Math.pow(frequencyMagnitude, alpha);

            complexGrid[idx] *= spectralWeight;
            complexGrid[idx + 1] *= spectralWeight;
        }

        const realBuf = new Float32Array(N);
        const imagBuf = new Float32Array(N);
        for (let x = 0; x < N; x++) {
            realBuf[x] = complexGrid[x * 2];
            imagBuf[x] = complexGrid[x * 2 + 1];
        }

        FFT.fft1D(realBuf, imagBuf, true);

        const spatialNoise = new Float32Array(N);
        for (let i = 0; i < N; i++)
            spatialNoise[i] = realBuf[i];
        normalize(spatialNoise);

        return spatialNoise;
    }

    /**
     * Generates a 2D periodic/tileable 1/f^alpha noise texture using an IFFT pipeline.
     * Extracts the real output values and normalizes them into a standard uniform [0, 1] range.
     * @param {number} N - Resolution size of the texture square (must be a power of 2).
     * @param {number} alpha - The spectral density exponent factor (0 = White, 1 = Pink, 2 = Brown noise).
     * @returns {Float32Array} A linear array of length N^2 representing normalized spatial noise scalars.
     */
    static generateNoise2D(N: number, alpha: number): Float32Array {
        const totalPixels = N * N;
        const complexGrid = new Float32Array(totalPixels * 2);

        for (let i = 0; i < totalPixels * 2; i += 2) {
            const [rx, ry] = complexGaussian();
            complexGrid[i] = rx;
            complexGrid[i + 1] = ry;
        }

        for (let y = 0; y < N; y++) {
            const fy = y < N / 2 ? y : y - N;
            for (let x = 0; x < N; x++) {
                const fx = x < N / 2 ? x : x - N;
                const idx = ((y * N) + x) * 2;
                const magSq = fx * fx + fy * fy;

                if (magSq === 0) {
                    complexGrid[idx] = 0.0;
                    complexGrid[idx + 1] = 0.0;
                    continue;
                }

                const frequencyMagnitude = Math.sqrt(magSq);
                const spectralWeight = 1.0 / Math.pow(frequencyMagnitude, alpha);

                complexGrid[idx] *= spectralWeight;
                complexGrid[idx + 1] *= spectralWeight;
            }
        }

        FFT.fft2D(complexGrid, N, true);

        const spatialNoise = new Float32Array(totalPixels);
        for (let i = 0; i < totalPixels; i++)
            spatialNoise[i] = complexGrid[i * 2];
        normalize(spatialNoise);

        return spatialNoise;
    }

    /**
     * Generates a 3D periodic/tileable 1/f^alpha noise texture using an IFFT pipeline.
     * Extracts the real output values and normalizes them into a standard uniform [0, 1] range.
     * @param {number} N - Resolution size of the texture cube (must be a power of 2).
     * @param {number} alpha - The spectral density exponent factor (0 = White, 1 = Pink, 2 = Brown noise).
     * @returns {Float32Array} A linear array of length N^3 representing normalized spatial noise scalars.
     */
    static generateNoise3D(N: number, alpha: number): Float32Array {
        const totalVoxels = N * N * N;
        const complexGrid = new Float32Array(totalVoxels * 2);

        for (let i = 0; i < totalVoxels * 2; i += 2) {
            const [rx, ry] = complexGaussian();
            complexGrid[i] = rx;
            complexGrid[i + 1] = ry;
        }

        for (let z = 0; z < N; z++) {
            const fz = z < N / 2 ? z : z - N;
            for (let y = 0; y < N; y++) {
                const fy = y < N / 2 ? y : y - N;
                for (let x = 0; x < N; x++) {
                    const fx = x < N / 2 ? x : x - N;
                    const idx = ((z * N * N) + (y * N) + x) * 2;
                    const magSq = fx * fx + fy * fy + fz * fz;

                    if (magSq === 0) {
                        complexGrid[idx] = 0.0;
                        complexGrid[idx + 1] = 0.0;
                        continue;
                    }

                    const frequencyMagnitude = Math.sqrt(magSq);
                    const spectralWeight = 1.0 / Math.pow(frequencyMagnitude, alpha);

                    complexGrid[idx] *= spectralWeight;
                    complexGrid[idx + 1] *= spectralWeight;
                }
            }
        }

        FFT.fft3D(complexGrid, N, true);

        const spatialNoise = new Float32Array(totalVoxels);
        for (let i = 0; i < totalVoxels; i++)
            spatialNoise[i] = complexGrid[i * 2];
        normalize(spatialNoise);

        return spatialNoise;
    }
}

export { FFT };