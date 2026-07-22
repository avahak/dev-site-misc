export interface Node {
    value: number;
    index: number;
}


/**
 * Sorted list of fixed size, TypedArray version.
 * Handling duplicates is left to the user and is not checked here.
 */
export class SortedList {
    readonly capacity: number;
    _size: number;
    /** _values in decreasing order */
    _values: Float64Array;
    _indices: Int32Array;

    constructor(M: number) {
        this.capacity = M;
        this._size = 0;
        this._values = new Float64Array(M);
        this._indices = new Int32Array(M);
    }

    get size(): number {
        return this._size;
    }

    /**
     * Allows iteration.
     */
    *[Symbol.iterator](): IterableIterator<Node> {
        for (let i = 0; i < this._size; i++) {
            yield { value: this._values[i], index: this._indices[i] };
        }
    }

    /**
     * O(1).
     */
    clear() {
        this._size = 0;
    }

    /**
     * O(M).
     */
    hasIndex(index: number): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this._indices[i] === index)
                return true;
        }
        return false;
    }

    /**
     * O(n).
     */
    findByIndex(index: number): Node | null {
        for (let i = 0; i < this._size; i++) {
            if (this._indices[i] === index)
                return { value: this._values[i], index: this._indices[i] };
        }
        return null;
    }

    /**
     * Returns the node with smallest value. O(1).
     */
    peekMax(): Node | null {
        if (this._size === 0)
            return null;
        return { value: this._values[0], index: this._indices[0] };
    }

    /**
     * Returns the node with smallest value. O(1).
     */
    peekMin(): Node | null {
        if (this._size === 0)
            return null;
        const lastIdx = this._size - 1;
        return { value: this._values[lastIdx], index: this._indices[lastIdx] };
    }

    /**
     * Removes and returns node with smallest value. O(1).
     */
    extractMin(): Node | null {
        if (this._size === 0)
            return null;
        const lastIdx = this._size - 1;
        const minElement = { value: this._values[lastIdx], index: this._indices[lastIdx] };
        this._size--;
        return minElement;
    }

    /**
     * O(n).
     */
    deleteByIndex(index: number): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this._indices[i] === index) {
                if (i < this._size - 1) {
                    // Shift everything right of i to the left
                    this._values.copyWithin(i, i + 1, this._size);
                    this._indices.copyWithin(i, i + 1, this._size);
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
    insert(value: number, index: number): Node | null {
        // If full and value is larger than largest element, do nothing
        if (this._size === this.capacity && value >= this._values[0])
            return null;

        // Find insertion position
        let pos = 0;
        while (pos < this._size && value < this._values[pos])
            pos++;

        if (this._size < this.capacity) {
            // Array is not full: shift elements right to make room
            if (pos < this._size) {
                this._values.copyWithin(pos + 1, pos, this._size);
                this._indices.copyWithin(pos + 1, pos, this._size);
            }
            this._values[pos] = value;
            this._indices[pos] = index;
            this._size++;
            return null;
        }

        // Now the array is full, pos > 0, and we need to drop element at 0.
        // Shift elements to the left, from index 1 up to pos-1.
        const dropped = { value: this._values[0], index: this._indices[0] };
        if (pos > 1) {
            this._values.copyWithin(0, 1, pos);
            this._indices.copyWithin(0, 1, pos);
        }
        this._values[pos - 1] = value;
        this._indices[pos - 1] = index;
        return dropped;
    }
}