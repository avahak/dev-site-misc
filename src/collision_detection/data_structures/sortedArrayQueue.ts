// Queue based on sorted array, intended for small sizes


export interface PriorityNode {
    delta: number;
    index: number;
}

export class SortedArrayQueue<T extends PriorityNode> {
    /** Maintained in descending order of delta. */
    queue: T[] = [];

    clear() {
        this.queue.length = 0;
    }

    /** 
     * Clears existing elements and copies elements from an array that has to be 
     * sorted in descending order.
     */
    setFrom(source: T[], offset: number = 0, size: number = source.length - offset) {
        this.queue.length = 0;
        for (let k = offset; k < offset + size; k++)
            this.queue.push(source[k]);
    }

    /**
     * O(n).
     */
    insert(node: T): void {
        // With binary search:
        // let low = 0;
        // let high = this.queue.length - 1;
        // while (low <= high) {
        //     const mid = (low + high) >>> 1;
        //     if (this.queue[mid].delta < node.delta) {
        //         high = mid - 1;
        //     } else {
        //         low = mid + 1;
        //     }
        // }
        // this.queue.splice(low, 0, node);

        // With linear search:
        let i = 0;
        while (i < this.queue.length && this.queue[i].delta > node.delta)
            i++;
        this.queue.splice(i, 0, node);
    }

    /**
     * O(n).
     */
    deleteByIndex(index: number): boolean {
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].index === index) {
                this.queue.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    /**
     * O(n).
     */
    findByIndex(index: number): T | undefined {
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].index === index)
                return this.queue[i];
        }
        return undefined;
    }

    /**
     * Returns the node with smallest delta. O(1).
     */
    peekMin(): T | undefined {
        if (this.queue.length === 0)
            return undefined;
        return this.queue[this.queue.length - 1];
    }

    /**
     * Removes and returns node with smallest delta. O(1).
     */
    extractMin(): T | undefined {
        return this.queue.pop();
    }

    get size(): number {
        return this.queue.length;
    }
}