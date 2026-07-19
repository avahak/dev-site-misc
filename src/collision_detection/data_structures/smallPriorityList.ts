// TypedArray version
// TODO rethink duplicate checking, does not work fully here. Maybe remove completely.

export interface PriorityNode {
    value: number;
    index: number;
}


export class SmallPriorityList {
    readonly capacity: number;
    private _size: number;
    /** values in decreasing order */
    private values: Float64Array;
    private indices: Int32Array;

    constructor(M: number) {
        this.capacity = M;
        this._size = 0;
        this.values = new Float64Array(M);
        this.indices = new Int32Array(M);
    }

    get size(): number {
        return this._size;
    }

    /**
     * Allows iteration.
     */
    *[Symbol.iterator](): IterableIterator<PriorityNode> {
        for (let i = 0; i < this._size; i++) {
            yield { value: this.values[i], index: this.indices[i] };
        }
    }

    clear() {
        this._size = 0;
    }

    /**
     * O(M).
     */
    hasIndex(index: number): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this.indices[i] === index)
                return true;
        }
        return false;
    }

    /**
     * O(n).
     */
    findByIndex(index: number): PriorityNode | null {
        for (let i = 0; i < this._size; i++) {
            if (this.indices[i] === index)
                return { value: this.values[i], index: this.indices[i] };
        }
        return null;
    }

    /**
     * Returns the node with smallest value. O(1).
     */
    peekMax(): PriorityNode | null {
        if (this._size === 0)
            return null;
        return { value: this.values[0], index: this.indices[0] };
    }

    /**
     * Returns the node with smallest value. O(1).
     */
    peekMin(): PriorityNode | null {
        if (this._size === 0)
            return null;
        const lastIdx = this._size - 1;
        return { value: this.values[lastIdx], index: this.indices[lastIdx] };
    }

    /**
     * Removes and returns node with smallest value. O(1).
     */
    extractMin(): PriorityNode | null {
        if (this._size === 0)
            return null;
        const lastIdx = this._size - 1;
        const minElement = { value: this.values[lastIdx], index: this.indices[lastIdx] };
        this._size--;
        return minElement;
    }

    /**
     * O(n).
     */
    deleteByIndex(index: number): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this.indices[i] === index) {
                if (i < this._size - 1) {
                    // Shift everything right of i to the left
                    this.values.copyWithin(i, i + 1, this._size);
                    this.indices.copyWithin(i, i + 1, this._size);
                }
                this._size--;
                return true;
            }
        }
        return false;
    }

    /**
     * O(n).
     * NOTE: If trying to insert an existing element does not always update correctly.
     * @returns `null` or element that was dropped due to capacity limit
     */
    insert(value: number, index: number): PriorityNode | null {
        // If full and value is larger than largest element, do nothing
        if (this._size === this.capacity && value >= this.values[0])
            return null;

        // If the index already exists, remove it first to avoid duplicates.
        // for (let i = 0; i < this._size; i++) {
        //     if (this.indices[i] === index) {
        //         this.deleteByIndex(index);
        //         break;
        //     }
        // }

        // Find insertion position
        let pos = 0;
        while (pos < this._size && value < this.values[pos])
            pos++;

        if (this._size < this.capacity) {
            // Array is not full: shift elements right to make room
            if (pos < this._size) {
                this.values.copyWithin(pos + 1, pos, this._size);
                this.indices.copyWithin(pos + 1, pos, this._size);
            }
            this.values[pos] = value;
            this.indices[pos] = index;
            this._size++;
            return null;
        }

        // Now the array is full, pos > 0, and we need to drop element at 0.
        // Shift elements to the left, from index 1 up to pos-1.
        const dropped = { value: this.values[0], index: this.indices[0] };
        if (pos > 1) {
            this.values.copyWithin(0, 1, pos);
            this.indices.copyWithin(0, 1, pos);
        }
        this.values[pos - 1] = value;
        this.indices[pos - 1] = index;
        return dropped;
    }
}