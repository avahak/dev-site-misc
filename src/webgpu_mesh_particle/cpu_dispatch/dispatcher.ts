// Tool for prototyping compute shader algorithms on the CPU.
// Simulates workgroups, shared memory and workgroup barriers so algorithms can be
// tested and debugged before being translated to WGSL/TSL.

// TODO consider implementing multidimensional dispatch if there is need


export interface ComputeBuiltins {
    globalId: number;
    localId: number;
    workgroupId: number;
    workgroupSize: number;
}

export interface ComputeDispatch<T> {
    workgroupCount: number;
    workgroupSize?: number;
    createSharedMemory?: () => T;
    schedule?: "lockstep" | "random";
    seed?: number;      // Seed for random scheduling, only used when schedule==="random".
}

const BARRIER = Symbol("ComputeBarrier");

export function barrier(): typeof BARRIER {
    return BARRIER;
}

export type ComputeShader<T = null> = (
    builtins: ComputeBuiltins,
    shared: T,
    ...args: any[]
) => Generator<typeof BARRIER, void, unknown>;


function shuffle(
    array: number[],
    random: () => number,
): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = (random() * (i + 1)) | 0;
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function mulberry32(seed: number): () => number {
    return () => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}


export function dispatch<T>(
    dispatch: ComputeDispatch<T>,
    shader: ComputeShader<T>,
    ...args: any[]
): void {
    const {
        workgroupCount,
        workgroupSize = 16,
        createSharedMemory = (() => null as T),
        schedule = "random",
        seed,
    } = dispatch;

    const random = (seed === undefined) ? Math.random : mulberry32(seed);

    for (let workgroupId = 0; workgroupId < workgroupCount; workgroupId++) {
        const sharedMemory = createSharedMemory();
        const threads: Generator<typeof BARRIER, void, unknown>[] = [];

        for (let localId = 0; localId < workgroupSize; localId++) {
            threads.push(shader({
                globalId: workgroupId * workgroupSize + localId,
                localId,
                workgroupId,
                workgroupSize
            }, sharedMemory, ...args));
        }

        const executionOrder = [...threads.keys()];

        while (true) {
            if (schedule === "random") {
                shuffle(executionOrder, random);
            }

            let activeThreads = 0;

            for (const i of executionOrder) {
                const result = threads[i].next();

                if (!result.done) {
                    activeThreads++;

                    if (result.value !== BARRIER) {
                        throw new Error(
                            `Thread ${i} in workgroup ${workgroupId} yielded something other than barrier().`
                        );
                    }
                }
            }

            if (activeThreads === 0) {
                break;
            }

            if (activeThreads !== workgroupSize) {
                throw new Error(
                    `Barrier divergence in workgroup ${workgroupId}. ` +
                    `Active threads: ${activeThreads}, expected: ${workgroupSize}.`
                );
            }
        }
    }
}