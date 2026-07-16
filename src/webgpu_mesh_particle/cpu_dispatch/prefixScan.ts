// See: https://en.wikipedia.org/wiki/Prefix_sum
// Testing Blelloch algorithm for prefix sum on CPU: `Algorithm 2: Work-efficient` inside 
// the workgroup and recursive reduction to size n/WG_SIZE outside.

import { barrier, dispatch, ComputeBuiltins } from './dispatcher';

const WG_SIZE = 16;

function* localScanShader(
    builtins: ComputeBuiltins,
    shared: { local: Float32Array },
    data: Float32Array,
    dataOffset: number,
    dataSize: number,
    blockSums: Float32Array | null,
    blockSumsOffset: number
): Generator<ReturnType<typeof barrier>, void, unknown> {
    const { localId, globalId, workgroupId, workgroupSize } = builtins;
    const g = dataOffset + globalId;
    const end = dataOffset + dataSize;

    // load
    shared.local[localId] = g < end ? data[g] : 0;
    yield barrier();

    // upsweep
    for (let stride = 1; stride < workgroupSize; stride *= 2) {
        const index = (localId + 1) * stride * 2 - 1;
        if (index < workgroupSize) {
            shared.local[index] += shared.local[index - stride];
        }
        yield barrier();
    }

    // Save block sum
    let blockSum = 0;
    if (localId === workgroupSize - 1) {
        blockSum = shared.local[workgroupSize - 1];
        shared.local[workgroupSize - 1] = 0;
    }
    yield barrier();

    // downsweep
    for (let stride = workgroupSize / 2; stride >= 1; stride /= 2) {
        const index = (localId + 1) * stride * 2 - 1;
        if (index < workgroupSize) {
            const t = shared.local[index - stride];
            shared.local[index - stride] = shared.local[index];
            shared.local[index] += t;
        }
        yield barrier();
    }

    // store, exclusive -> inclusive
    if (g < end) {
        data[g] += shared.local[localId];
    }

    // Write block sum out to the blockSums buffer (only thread 0 needs to do this, 
    // or the last thread. Here we use the last thread as it holds the value)
    if (localId === workgroupSize - 1 && blockSums) {
        blockSums[blockSumsOffset + workgroupId] = blockSum;
    }
}

function* addBlockSumShader(
    builtins: ComputeBuiltins,
    shared: null,
    data: Float32Array,
    dataOffset: number,
    dataSize: number,
    blockSums: Float32Array,
    blockSumsOffset: number
): Generator<ReturnType<typeof barrier>, void, unknown> {
    const { globalId, workgroupId } = builtins;
    const g = dataOffset + globalId;
    const end = dataOffset + dataSize;

    // The first block doesn't have a previous block sum to add
    if (workgroupId > 0 && g < end) {
        const offset = blockSums[blockSumsOffset + workgroupId - 1];
        data[g] += offset;
    }
}

/**
 * Size for the temporary buffer needed to store block sums. 
 * Return value is approximately count/(WG_SIZE-1).
 */
function blockSumsBufferSize(count: number): number {
    let total = 0;
    while (count > 1) {
        count = Math.ceil(count / WG_SIZE);
        total += count;
    }
    return total;
}

export function prefixScanBlelloch(
    data: Float32Array,
    dataOffset = 0,
    dataSize = data.length,
    blockSums?: Float32Array,
    blockSumsOffset = 0,
): void {
    if (!blockSums) {
        blockSums = new Float32Array(blockSumsBufferSize(dataSize)); // NOTE: only allocated on first call
    }

    const blockCount = Math.ceil(dataSize / WG_SIZE);

    //--------------------------------------------------
    // Base case
    //--------------------------------------------------
    if (blockCount === 1) {
        dispatch(
            {
                workgroupCount: 1,
                workgroupSize: WG_SIZE,
                createSharedMemory: () => ({ local: new Float32Array(WG_SIZE) }),
            },
            localScanShader, data, dataOffset, dataSize, null, 0
        );
        return;
    }

    //--------------------------------------------------
    // Pass 1
    //--------------------------------------------------
    dispatch(
        {
            workgroupCount: blockCount,
            workgroupSize: WG_SIZE,
            createSharedMemory: () => ({ local: new Float32Array(WG_SIZE) }),
        },
        localScanShader, data, dataOffset, dataSize, blockSums, blockSumsOffset
    );

    //--------------------------------------------------
    // Pass 2
    //--------------------------------------------------
    prefixScanBlelloch(blockSums, blockSumsOffset, blockCount, blockSums, blockSumsOffset + blockCount);

    //--------------------------------------------------
    // Pass 3
    //--------------------------------------------------
    dispatch({ workgroupCount: blockCount, workgroupSize: WG_SIZE, },
        addBlockSumShader, data, dataOffset, dataSize, blockSums, blockSumsOffset);
}

//--------------------------------------------------
// TESTING
//--------------------------------------------------

function prefixScanTrivial(data: Float32Array) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i];
        data[i] = sum;
    }
}

function compareArrays(a: Float32Array, b: Float32Array): boolean {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (Math.abs(a[i] - b[i]) > 1e-4) {
            return false;
        }
    }
    return true;
}

export function prefixSumTest() {
    let failCount = 0;
    for (let n = 1; n <= 512; n++) {
        const a = new Float32Array(n);
        const b = new Float32Array(n);

        for (let i = 0; i < n; i++) {
            a[i] = b[i] = 2 * Math.random() - 1;
        }

        prefixScanBlelloch(a);
        prefixScanTrivial(b);

        if (!compareArrays(a, b)) {
            failCount++;
            console.log(`n=${n}: prefixSum test failed: `, a, b);
        }
    }
    console.log("prefixSum tests failed: ", failCount);
}