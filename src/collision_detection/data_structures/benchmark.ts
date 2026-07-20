import { SortedList } from "./sortedList";
import { SortedList2 } from "./sortedList2";

type Distribution<T> = [value: T, weight: number][];

const enum OperationKind {
    HasIndex,
    FindByIndex,
    Insert,
    DeleteByIndex,
    PeekMax,
    PeekMin,
    ExtractMin,
}

interface BenchmarkParams {
    queueCount: number;
    queueCapacity: number;
    operationCount: number;
    weights: Distribution<OperationKind>;
}

interface Operation {
    kind: OperationKind;
    queue: number;
    delta: number;
    index: number;
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

function generateOperations(params: BenchmarkParams): Operation[] {
    const operations = new Array<Operation>(params.operationCount);

    for (let i = 0; i < operations.length; i++) {
        operations[i] = {
            kind: sample(params.weights),
            queue: (Math.random() * params.queueCount) | 0,
            delta: Math.random(),
            index: (Math.random() * 1000) | 0
        };
    }

    return operations;
}

function benchmark(
    queues: (SortedList | SortedList2)[],
    operations: Operation[]
): number {
    let checksum = 0;
    const t0 = performance.now();

    for (let i = 0; i < operations.length; i++) {
        const operation = operations[i];
        const queue = queues[operation.queue];

        switch (operation.kind) {
            case OperationKind.HasIndex:
                const value = queue.hasIndex(operation.index);
                if (value)
                    checksum += 1;
                break;

            case OperationKind.FindByIndex: {
                const node = queue.findByIndex(operation.index);
                if (node)
                    checksum += node.index;
                break;
            }

            case OperationKind.Insert:
                queue.insert(operation.delta, operation.index);
                break;

            case OperationKind.DeleteByIndex:
                if (queue.deleteByIndex(operation.index))
                    checksum++;
                break;

            case OperationKind.PeekMax: {
                const node = queue.peekMax();
                if (node)
                    checksum += node.index;
                break;
            }

            case OperationKind.PeekMin: {
                const node = queue.peekMin();
                if (node)
                    checksum += node.index;
                break;
            }

            case OperationKind.ExtractMin: {
                const node = queue.extractMin();
                if (node)
                    checksum += node.index;
                break;
            }
        }
    }

    const t1 = performance.now();

    let totalSize = 0;
    let totalCapacity = 0;
    for (let i = 0; i < queues.length; i++) {
        totalSize += queues[i].size;
        totalCapacity += queues[i].capacity;
    }
    const averageLoadFactor = totalSize / totalCapacity;
    console.log(
        `checksum=${checksum}, avgLoadFactor=${averageLoadFactor.toFixed(3)}`
    );
    return t1 - t0;
}

function createQueues(
    params: BenchmarkParams,
    createQueue: () => SortedList | SortedList2
): (SortedList | SortedList2)[] {
    const queues = new Array<SortedList | SortedList2>(params.queueCount);

    for (let i = 0; i < queues.length; i++)
        queues[i] = createQueue();

    return queues;
}


export function runBenchmark() {
    const params: BenchmarkParams = {
        queueCount: 1000,
        queueCapacity: 10,
        operationCount: 10_000_000,
        weights: [
            [OperationKind.HasIndex, 1000],
            [OperationKind.FindByIndex, 100],
            [OperationKind.Insert, 200],
            [OperationKind.DeleteByIndex, 10],
            [OperationKind.PeekMax, 50],
            [OperationKind.PeekMin, 500],
            [OperationKind.ExtractMin, 50],
        ]
    };

    const operations = generateOperations(params);

    benchmark(
        createQueues(params, () => new SortedList(params.queueCapacity)),
        operations
    );

    const ms1 = benchmark(
        createQueues(params, () => new SortedList(params.queueCapacity)),
        operations
    );

    console.log(`TypedArray: ${ms1.toFixed(1)} ms`);

    benchmark(
        createQueues(params, () => new SortedList2(params.queueCapacity)),
        operations
    );

    const ms2 = benchmark(
        createQueues(params, () => new SortedList2(params.queueCapacity)),
        operations
    );

    console.log(`JS array: ${ms2.toFixed(1)} ms`);
}