// AI-generated, nothing here yet.

import { dispatch, ComputeBuiltins } from "./dispatcher";

const WG_SIZE = 16;

function* histogramShader(
    builtins: ComputeBuiltins,
    shared: null,
    input: Uint32Array,
    histogram: Uint32Array,
    bucketCount: number,
): Generator<never, void, unknown> {
    const { globalId } = builtins;

    if (globalId >= input.length) {
        return;
    }

    const bucket = input[globalId];

    if (bucket >= bucketCount) {
        throw new Error(`Bucket ${bucket} out of range.`);
    }

    // GPU:
    // atomicAdd(&histogram[bucket], 1u);
    histogram[bucket]++;
}

export function histogram(
    input: Uint32Array,
    bucketCount: number,
): Uint32Array {
    const histogram = new Uint32Array(bucketCount);

    dispatch(
        {
            workgroupCount: Math.ceil(input.length / WG_SIZE),
            workgroupSize: WG_SIZE,
        },
        histogramShader,
        input,
        histogram,
        bucketCount,
    );

    return histogram;
}

//--------------------------------------------------
// Reference
//--------------------------------------------------

function histogramTrivial(
    input: Uint32Array,
    bucketCount: number,
): Uint32Array {
    const histogram = new Uint32Array(bucketCount);

    for (const x of input) {
        histogram[x]++;
    }

    return histogram;
}

//--------------------------------------------------
// Testing
//--------------------------------------------------

function compareArrays(
    a: Uint32Array,
    b: Uint32Array,
): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

export function histogramTest(): void {
    let failCount = 0;

    for (let n = 1; n <= 512; n++) {

        const bucketCount = 32;

        const input = new Uint32Array(n);

        for (let i = 0; i < n; i++) {
            input[i] = (Math.random() * bucketCount) | 0;
        }

        const a = histogram(input, bucketCount);
        const b = histogramTrivial(input, bucketCount);

        if (!compareArrays(a, b)) {
            failCount++;
            console.log(`Histogram failed n=${n}`, a, b);
        }
    }

    console.log("Histogram tests failed:", failCount);
}