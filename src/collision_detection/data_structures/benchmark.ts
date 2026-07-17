import { SmallPriorityList } from "./smallPriorityList";
import { SmallPriorityList2 } from "./smallPriorityList2";

type Distribution<T> = [value: T, weight: number][];

const enum OperationKind {
    Insert,
    Extract,
    Delete
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
    queues: (SmallPriorityList | SmallPriorityList2)[],
    operations: Operation[]
): number {
    let checksum = 0;
    const t0 = performance.now();

    for (let i = 0; i < operations.length; i++) {
        const operation = operations[i];
        const queue = queues[operation.queue];

        switch (operation.kind) {
            case OperationKind.Insert:
                queue.insert(operation.delta, operation.index);
                break;

            case OperationKind.Extract: {
                const node = queue.extractMin();
                if (node)
                    checksum += node.index;
                break;
            }

            case OperationKind.Delete:
                if (queue.deleteByIndex(operation.index))
                    checksum++;
                break;
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
    createQueue: () => SmallPriorityList | SmallPriorityList2
): (SmallPriorityList | SmallPriorityList2)[] {
    const queues = new Array<SmallPriorityList | SmallPriorityList2>(params.queueCount);

    for (let i = 0; i < queues.length; i++)
        queues[i] = createQueue();

    return queues;
}


export function runBenchmark() {
    const params: BenchmarkParams = {
        queueCount: 200,
        queueCapacity: 100,
        operationCount: 10_000_000,
        weights: [
            [OperationKind.Insert, 80],
            [OperationKind.Extract, 10],
            [OperationKind.Delete, 10]
        ]
    };

    const operations = generateOperations(params);

    benchmark(
        createQueues(params, () => new SmallPriorityList(params.queueCapacity)),
        operations
    );

    const ms1 = benchmark(
        createQueues(params, () => new SmallPriorityList(params.queueCapacity)),
        operations
    );

    console.log(`SmallPriorityList: ${ms1.toFixed(1)} ms`);

    benchmark(
        createQueues(params, () => new SmallPriorityList2(params.queueCapacity)),
        operations
    );

    const ms2 = benchmark(
        createQueues(params, () => new SmallPriorityList2(params.queueCapacity)),
        operations
    );

    console.log(`SmallPriorityList2: ${ms2.toFixed(1)} ms`);
}