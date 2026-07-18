// array version

export interface PriorityNode {
    delta: number;
    index: number;
}


export class SmallPriorityList2 {
    readonly capacity: number;
    private _size: number;
    private deltas: number[];
    private indices: number[];

    constructor(M: number) {
        this.capacity = M;
        this._size = 0;
        this.deltas = new Array<number>(M).fill(0);
        this.indices = new Array<number>(M).fill(0);
    }

    get size(): number {
        return this._size;
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

    findByIndex(index: number): PriorityNode | null {
        for (let i = 0; i < this._size; i++) {
            if (this.indices[i] === index)
                return { delta: this.deltas[i], index: this.indices[i] };
        }
        return null;
    }

    peekMax(): PriorityNode | null {
        if (this._size === 0)
            return null;
        return { delta: this.deltas[0], index: this.indices[0] };
    }

    peekMin(): PriorityNode | null {
        if (this._size === 0)
            return null;
        const lastIdx = this._size - 1;
        return { delta: this.deltas[lastIdx], index: this.indices[lastIdx] };
    }

    extractMin(): PriorityNode | null {
        if (this._size === 0)
            return null;
        const lastIdx = this._size - 1;
        const minElement = { delta: this.deltas[lastIdx], index: this.indices[lastIdx] };
        this._size--;
        return minElement;
    }

    deleteByIndex(index: number): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this.indices[i] === index) {
                for (let j = i; j < this._size - 1; j++) {
                    this.deltas[j] = this.deltas[j + 1];
                    this.indices[j] = this.indices[j + 1];
                }
                this._size--;
                return true;
            }
        }
        return false;
    }

    insert(delta: number, index: number): void {
        if (this._size === this.capacity && delta >= this.deltas[0])
            return;

        let pos = 0;
        while (pos < this._size && delta < this.deltas[pos])
            pos++;

        if (this._size < this.capacity) {
            for (let i = this._size; i > pos; i--) {
                this.deltas[i] = this.deltas[i - 1];
                this.indices[i] = this.indices[i - 1];
            }
            this.deltas[pos] = delta;
            this.indices[pos] = index;
            this._size++;
        } else {
            for (let i = 0; i < pos - 1; i++) {
                this.deltas[i] = this.deltas[i + 1];
                this.indices[i] = this.indices[i + 1];
            }
            this.deltas[pos - 1] = delta;
            this.indices[pos - 1] = index;
        }
    }
}