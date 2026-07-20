export interface Node {
    value: number;
    index: number;
}

export const enum DividerList_OfferResult {
    Ignored,
    Explicit,
    DividerChanged,
}

/**
 * Stores a divider together with up to M explicit values in a fixed-size,
 * decreasingly sorted array.
 *
 *     values[0]           = divider
 *     values[1 .. size]   = explicit values
 *
 * Decreasing order is used so that extractMin() is O(1).
 *
 * The divider is not an explicit value. Instead, it separates the explicit
 * values from all values that have been omitted.
 *
 * The operations
 *
 *     offer()
 *     deleteByIndex()
 *     extractMin()
 *
 * maintain the invariant:
 *
 *     Every offered value that has not subsequently been removed 
 *     is either explicit or at least the divider.
 *
 * The divider may decrease over time but never increase.
 */
export class DividerList {
    /** Physical capacity including the divider slot. */
    readonly capacity: number;
    /** Total occupied slots including the divider. */
    private _size: number;
    /** Values in decreasing order. values[0] is the divider. */
    private values: Float64Array;
    /** indices[0] is unused. */
    private indices: Int32Array;

    /**
     * Creates an empty DividerList.
     * @param capacity Physical storage capacity, including the divider slot.
     */
    constructor(capacity: number) {
        this.capacity = capacity;
        this.values = new Float64Array(capacity);
        this.indices = new Int32Array(capacity);
        this.values[0] = Infinity;
        this.indices[0] = -1;   // just for debugging
        this._size = 1;
    }

    /** Number of explicit certificates. */
    get size(): number {
        return this._size - 1;
    }

    /** Current divider. */
    get divider(): number {
        return this.values[0];
    }

    *[Symbol.iterator](): IterableIterator<Node> {
        for (let i = 1; i < this._size; i++) {
            yield {
                value: this.values[i],
                index: this.indices[i],
            };
        }
    }

    /**
     * O(1).
     */
    clear() {
        this.values[0] = Infinity;
        this._size = 1;
    }

    /**
     * O(n).
     */
    findByIndex(index: number): Node | null {
        for (let i = 1; i < this._size; i++) {
            if (this.indices[i] === index)
                return { value: this.values[i], index: this.indices[i] };
        }
        return null;
    }

    /**
     * Returns the smallest explicit certificate.
     */
    peekMin(): Node | null {
        if (this._size <= 1)
            return null;

        const i = this._size - 1;
        return {
            value: this.values[i],
            index: this.indices[i],
        };
    }

    /**
     * Removes and returns the smallest explicit certificate. O(1).
     */
    extractMin(): Node | null {
        if (this._size <= 1)
            return null;

        const i = this._size - 1;
        const node = {
            value: this.values[i],
            index: this.indices[i],
        };

        this._size--;
        return node;
    }

    /**
     * Removes an explicit certificate by index. O(n).
     */
    deleteByIndex(index: number): boolean {
        const values = this.values;
        const indices = this.indices;

        // Skip the divider at position 0.
        for (let i = 1; i < this._size; i++) {
            if (indices[i] === index) {
                if (i < this._size - 1) {
                    values.copyWithin(i, i + 1, this._size);
                    indices.copyWithin(i, i + 1, this._size);
                }
                this._size--;
                return true;
            }
        }

        return false;
    }

    /**
     * Offers a new explicit certificate. O(n).
     * @returns value from `DividerList_OfferResult` based on resulting changes.
     */
    offer(value: number, index: number): DividerList_OfferResult {
        const values = this.values;
        const indices = this.indices;

        if (value >= values[0])
            return DividerList_OfferResult.Ignored;

        // Find insertion position among explicit certificates.
        let pos = 1;
        while (pos < this._size && value < values[pos])
            pos++;

        // Explicit list not full.
        if (this._size < this.capacity) {
            if (pos < this._size) {
                values.copyWithin(pos + 1, pos, this._size);
                indices.copyWithin(pos + 1, pos, this._size);
            }
            values[pos] = value;
            indices[pos] = index;
            this._size++;
            return DividerList_OfferResult.Explicit;
        }

        // The explicit list is full.
        //
        // Promote the largest explicit certificate to become the new
        // divider, then insert the new explicit certificate.
        if (pos > 1) {
            values.copyWithin(0, 1, pos);
            indices.copyWithin(0, 1, pos);
        }
        values[pos - 1] = value;
        indices[pos - 1] = index;
        return DividerList_OfferResult.DividerChanged;
    }
}