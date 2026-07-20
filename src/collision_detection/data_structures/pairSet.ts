/**
 * Set for ordered pair of indices. Slow, not used.
 * NOTE: Only works for pairs with 0 <= both integers <= 94_906_265.
 */
export class PairSet {
    static N = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER));   // 94_906_265
    private set: Set<number>;

    constructor() {
        this.set = new Set();
    }

    get size(): number {
        return this.set.size;
    }

    /**
     * Yields each { i, j } pair stored in the set.
     */
    *[Symbol.iterator](): IterableIterator<{ i: number, j: number }> {
        for (const value of this.set) {
            const i = Math.floor(value / PairSet.N);
            const j = value % PairSet.N;
            yield { i, j };
        }
    }

    add(i: number, j: number): void {
        this.set.add(i * PairSet.N + j);
    }

    has(i: number, j: number): boolean {
        return this.set.has(i * PairSet.N + j);
    }

    delete(i: number, j: number): boolean {
        return this.set.delete(i * PairSet.N + j);
    }

    /**
     * Linear time, slow. 
     */
    deleteRow(i: number, jStart: number, jEnd: number): void {
        for (let j = jStart; j < jEnd; j++)
            this.set.delete(i * PairSet.N + j);
    }

    /**
     * Linear time, slow. 
     */
    deleteColumn(iStart: number, iEnd: number, j: number): void {
        for (let i = iStart; i < iEnd; i++)
            this.set.delete(i * PairSet.N + j);
    }

    clear(): void {
        this.set.clear();
    }
}