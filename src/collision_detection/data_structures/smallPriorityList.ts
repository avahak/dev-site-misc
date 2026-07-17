// TypedArray version
// TODO rethink duplicate checking, does not work fully here. Maybe remove completely.

export interface PriorityNode {
    delta: number;
    index: number;
}


export class SmallPriorityList {
    readonly capacity: number;
    private _size: number;
    /** Deltas in decreasing order */
    private deltas: Float64Array;
    private indices: Int32Array;

    constructor(M: number) {
        this.capacity = M;
        this._size = 0;
        this.deltas = new Float64Array(M);
        this.indices = new Int32Array(M);
    }

    get size(): number {
        return this._size;
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
                return { delta: this.deltas[i], index: this.indices[i] };
        }
        return null;
    }

    /**
     * Returns the node with smallest delta. O(1).
     */
    peekMin(): PriorityNode | null {
        if (this._size === 0)
            return null;
        const lastIdx = this._size - 1;
        return { delta: this.deltas[lastIdx], index: this.indices[lastIdx] };
    }

    /**
     * Removes and returns node with smallest delta. O(1).
     */
    extractMin(): PriorityNode | null {
        if (this._size === 0)
            return null;
        const lastIdx = this._size - 1;
        const minElement = { delta: this.deltas[lastIdx], index: this.indices[lastIdx] };
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
                    this.deltas.copyWithin(i, i + 1, this._size);
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
     */
    insert(delta: number, index: number): void {
        // If full and delta is larger than largest element, do nothing
        if (this._size === this.capacity && delta >= this.deltas[0])
            return;

        // If the index already exists, remove it first to avoid duplicates.
        // for (let i = 0; i < this._size; i++) {
        //     if (this.indices[i] === index) {
        //         this.deleteByIndex(index);
        //         break;
        //     }
        // }

        // Find insertion position
        let pos = 0;
        while (pos < this._size && delta < this.deltas[pos])
            pos++;


        if (this._size < this.capacity) {
            // Array is not full: shift elements right to make room
            if (pos < this._size) {
                this.deltas.copyWithin(pos + 1, pos, this._size);
                this.indices.copyWithin(pos + 1, pos, this._size);
            }
            this.deltas[pos] = delta;
            this.indices[pos] = index;
            this._size++;
        } else {
            // Now the array is full, pos > 0, and we need to drop element at 0.
            // Shift elements to the left, from index 1 up to pos-1.
            if (pos > 1) {
                this.deltas.copyWithin(0, 1, pos);
                this.indices.copyWithin(0, 1, pos);
            }
            this.deltas[pos - 1] = delta;
            this.indices[pos - 1] = index;
        }
    }
}