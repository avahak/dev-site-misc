export interface Node {
    value: number;
    index: number;
}


/**
 * Sorted list of fixed size, JS array version.
 * Handling duplicates is left to the user and is not checked here.
 */
export class SortedList2 {
    readonly capacity: number;
    private _size: number;
    private values: number[];
    private indices: number[];

    constructor(M: number) {
        this.capacity = M;
        this._size = 0;
        this.values = new Array<number>(M).fill(0);
        this.indices = new Array<number>(M).fill(0);
    }

    get size(): number {
        return this._size;
    }

    *[Symbol.iterator](): IterableIterator<Node> {
        for (let i = 0; i < this._size; i++) {
            yield { value: this.values[i], index: this.indices[i] };
        }
    }

    clear() {
        this._size = 0;
    }

    hasIndex(index: number): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this.indices[i] === index)
                return true;
        }
        return false;
    }

    findByIndex(index: number): Node | null {
        for (let i = 0; i < this._size; i++) {
            if (this.indices[i] === index)
                return { value: this.values[i], index: this.indices[i] };
        }
        return null;
    }

    peekMax(): Node | null {
        if (this._size === 0)
            return null;
        return { value: this.values[0], index: this.indices[0] };
    }

    peekMin(): Node | null {
        if (this._size === 0)
            return null;
        const lastIdx = this._size - 1;
        return { value: this.values[lastIdx], index: this.indices[lastIdx] };
    }

    extractMin(): Node | null {
        if (this._size === 0)
            return null;
        const lastIdx = this._size - 1;
        const minElement = { value: this.values[lastIdx], index: this.indices[lastIdx] };
        this._size--;
        return minElement;
    }

    deleteByIndex(index: number): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this.indices[i] === index) {
                for (let j = i; j < this._size - 1; j++) {
                    this.values[j] = this.values[j + 1];
                    this.indices[j] = this.indices[j + 1];
                }
                this._size--;
                return true;
            }
        }
        return false;
    }

    insert(value: number, index: number): Node | null {
        if (this._size === this.capacity && value >= this.values[0])
            return null;

        let pos = 0;
        while (pos < this._size && value < this.values[pos])
            pos++;

        if (this._size < this.capacity) {
            for (let i = this._size; i > pos; i--) {
                this.values[i] = this.values[i - 1];
                this.indices[i] = this.indices[i - 1];
            }
            this.values[pos] = value;
            this.indices[pos] = index;
            this._size++;
            return null;
        }

        const dropped = { value: this.values[0], index: this.indices[0] };
        for (let i = 0; i < pos - 1; i++) {
            this.values[i] = this.values[i + 1];
            this.indices[i] = this.indices[i + 1];
        }
        this.values[pos - 1] = value;
        this.indices[pos - 1] = index;
        return dropped;
    }
}