export class SeededRandom {
    private seed: number;
    private state: number;

    constructor(seed: number = Date.now()) {
        this.seed = seed;
        this.state = seed;
    }

    private mulberry32(): number {
        this.state |= 0;
        this.state = this.state + 0x6D2B79F5 | 0;
        let t = Math.imul(this.state ^ this.state >>> 15, 1 | this.state);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    next(): number {
        return this.mulberry32();
    }

    nextInt(min: number, max: number): number {
        return Math.floor(this.mulberry32() * (max - min + 1)) + min;
    }

    nextFloat(min: number, max: number): number {
        return this.mulberry32() * (max - min) + min;
    }

    nextElement<T>(array: T[]): T {
        return array[Math.floor(this.mulberry32() * array.length)];
    }

    nextBoolean(trueProbability: number = 0.5): boolean {
        return this.mulberry32() < trueProbability;
    }

    shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(this.mulberry32() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    reset(): void {
        this.state = this.seed;
    }

    getSeed(): number {
        return this.seed;
    }

    setSeed(newSeed: number): void {
        this.seed = newSeed;
        this.state = newSeed;
    }
}