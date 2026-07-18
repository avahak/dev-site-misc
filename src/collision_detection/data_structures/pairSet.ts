/**
 * Set for unordered bounded integer pairs. Might be useless.
 */
class PairSet {
    private set: Set<number>;
    private n: number;

    constructor(n: number) {
        this.n = n;
        this.set = new Set();
    }

    add(i: number, j: number): void {
        const a = Math.min(i, j);
        const b = Math.max(i, j);
        this.set.add(a * this.n + b);
    }

    has(i: number, j: number): boolean {
        const a = Math.min(i, j);
        const b = Math.max(i, j);
        return this.set.has(a * this.n + b);
    }

    delete(i: number, j: number): boolean {
        const a = Math.min(i, j);
        const b = Math.max(i, j);
        return this.set.delete(a * this.n + b);
    }

    /**
     * Linear time, slow. 
     */
    deleteAll(i: number): void {
        for (let j = 0; j < this.n; j++) {
            const a = Math.min(i, j);
            const b = Math.max(i, j);
            this.set.delete(a * this.n + b);
        }
    }

    clear(): void {
        this.set.clear();
    }

    get size(): number {
        return this.set.size;
    }
}