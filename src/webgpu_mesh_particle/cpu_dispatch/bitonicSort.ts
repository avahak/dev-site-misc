// Just within one workgroup, not generally usable like this
// AI-generated

// Consider radix sort instead (but more complicated).

import { barrier, dispatch, ComputeBuiltins } from "./dispatcher";

const WG_SIZE = 16;


function* localBitonicSortShader(
    builtins: ComputeBuiltins,
    shared: { scratch: Float32Array },
    data: Float32Array,
    dataOffset: number,
    dataSize: number,
): Generator<ReturnType<typeof barrier>, void, unknown> {
    const { localId, globalId, workgroupSize } = builtins;
    const g = dataOffset + globalId;
    const end = dataOffset + dataSize;

    //--------------------------------------------------
    // load
    //--------------------------------------------------
    shared.scratch[localId] =
        g < end ? data[g] : Number.POSITIVE_INFINITY;
    yield barrier();

    //--------------------------------------------------
    // bitonic network
    //--------------------------------------------------
    for (let k = 2; k <= workgroupSize; k <<= 1) {
        for (let j = k >> 1; j > 0; j >>= 1) {
            const partner = localId ^ j;
            if (partner > localId) {
                const ascending = (localId & k) === 0;
                const a = shared.scratch[localId];
                const b = shared.scratch[partner];
                if ((a > b) === ascending) {
                    shared.scratch[localId] = b;
                    shared.scratch[partner] = a;
                }
            }

            yield barrier();
        }
    }

    //--------------------------------------------------
    // store
    //--------------------------------------------------
    if (g < end) {
        data[g] = shared.scratch[localId];
    }
}

export function bitonicSortLocal(
    data: Float32Array,
    dataOffset = 0,
    dataSize = data.length,
): void {
    if (dataSize > WG_SIZE) {
        throw new Error("bitonicSortLocal only supports one workgroup.");
    }

    dispatch(
        {
            workgroupCount: 1,
            workgroupSize: WG_SIZE,
            createSharedMemory: () => ({
                scratch: new Float32Array(WG_SIZE)
            })
        },
        localBitonicSortShader,
        data,
        dataOffset,
        dataSize
    );
}

function trivialSort(data: Float32Array): void {
    const tmp = Array.from(data);
    tmp.sort((a, b) => a - b);
    data.set(tmp);
}

//--------------------------------------------------
// TESTING
//--------------------------------------------------

function compareArrays(
    a: Float32Array,
    b: Float32Array,
): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (Math.abs(a[i] - b[i]) > 1e-6) {
            return false;
        }
    }

    return true;
}


export function bitonicSortTest(): void {
    let failCount = 0;

    for (let n = 1; n <= WG_SIZE; n++) {
        const a = new Float32Array(n);
        const b = new Float32Array(n);

        for (let i = 0; i < n; i++) {
            const x = 20 * Math.random() - 10;
            a[i] = x;
            b[i] = x;
        }

        bitonicSortLocal(a);
        trivialSort(b);

        if (!compareArrays(a, b)) {
            failCount++;
            console.log(`n=${n} bitonicSort failed`, a, b);
        }
    }

    console.log("bitonicSort tests failed:", failCount);
}