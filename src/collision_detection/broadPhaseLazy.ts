import * as THREE from "three";
import { SortedList } from "./data_structures/sortedList";

export interface CollisionPair {
    i: number;
    j: number;
}

export class MovingSphere {
    position: THREE.Vector3;
    radius: number;
    /** Frozen reference position from the last rebuild. */
    buildPosition: THREE.Vector3;
    /** Pairs tracked explicitly. */
    active: Set<number>;

    divider: number;
    obj?: THREE.Object3D;
    mMargin: number;        // number of extra objects on top of mBase

    constructor(position: THREE.Vector3, radius: number, mMargin: number) {
        this.position = position;
        this.radius = radius;
        this.buildPosition = new THREE.Vector3();
        this.active = new Set();

        this.divider = Infinity;
        this.mMargin = mMargin;
    }
}

/**
 * Denote 
 * 
 *      d_i = divider_i
 * 
 * Invariant:
 * 
 * Geometric form:
 * 
 *      If j is not active for i and i is not active for j, then
 *          B(q_i,r_i) and B(q_j,r_j)
 *      are disjoint for every
 *          q_i in B(pHat_i, d_i) and
 *          q_j in B(pHat_j, d_j).
 * 
 * Equivalent algebraic form:
 * 
 *      d_i + d_j <= |pHat_i - pHat_j| - r_i - r_j
 * 
 * TODO Need to rethink this, might not be correct!
 *  
 */
export class CertificateBroadPhaseLazy {
    objects: MovingSphere[];
    rebuildSet: Set<number>;

    static mBase = 10;          // belongs in MovingSphere but here just for simplicity
    sharedSortList: SortedList; // list of capacity mBase+1 shared for ball initialization

    constructor(objects: MovingSphere[]) {
        this.objects = objects;
        this.rebuildSet = new Set();
        this.sharedSortList = new SortedList(CertificateBroadPhaseLazy.mBase + 1);

        for (let i = 0; i < objects.length; i++)
            this.build(i, false);
    }

    /**
     * Rebuild object i from scratch. If `propagateChanges` is true, adjust the 
     * corresponding certificates stored by every other object so that the budget 
     * invariant is preserved.
     */
    build(i: number, propagateChanges: boolean): void {
        const a = this.objects[i];
        this.rebuildSet.delete(i);
        a.buildPosition.copy(a.position);
        a.active.clear();
        this.sharedSortList.clear();

        for (let j = 0; j < this.objects.length; j++) {
            if (i === j)
                continue;
            const b = this.objects[j];

            // NOTE: There is leeway in how we choose beta. Here we choose to use half of 
            // the current clearance. If another beta_{ij} was chosen, the corresponding 
            // beta_{ji} would have to be adjusted accordingly to preserve the invariant.
            const distance = a.position.distanceTo(b.position);
            const beta = (distance - a.radius - b.radius) / 2;

            if (beta < 0)
                a.active.add(j);
            else
                this.sharedSortList.insert(beta, j);
        }
        // Instantly add to the closest objects to active tracking:
        for (let j = 1; j < this.sharedSortList.size; j++)
            a.active.add(this.sharedSortList._indices[j]);
        a.divider = this.sharedSortList._values[0];

        if (!propagateChanges)
            return;

        for (let j = 0; j < this.objects.length; j++) {
            if (i === j || a.active.has(j))
                continue;

            const b = this.objects[j];
            const buildDistance = a.position.distanceTo(b.buildPosition);

            // Invariant requires:
            // beta + a.divider <= buildDistance - a.radius - b.radius
            const beta = buildDistance - a.radius - b.radius - a.divider;

            if (beta < b.divider) {
                b.active.add(i);
                continue;
            }
            b.active.delete(i);
        }
    }

    update(): void {
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];

            const displacement = a.position.distanceTo(a.buildPosition);
            if (displacement > a.divider) {
                this.rebuildSet.add(i);
                continue;
            }

            // Count false positives:

            let falsePositives = 0;
            for (const j of a.active) {
                const b = this.objects[j];
                if (a.position.distanceTo(b.position) >= a.radius + b.radius)
                    falsePositives++;
            }
            if (falsePositives > CertificateBroadPhaseLazy.mBase + a.mMargin)
                this.rebuildSet.add(i);
        }

        while (this.rebuildSet.size > 0) {
            const [i] = this.rebuildSet;
            this.build(i, true);
        }
    }


    validateInvariants(): boolean {
        const eps = 1e-8;
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            for (let j = 0; j < this.objects.length; j++) {
                if (i === j)
                    continue;
                const b = this.objects[j];
                if (a.active.has(j) || b.active.has(i))
                    continue;

                const buildDistance = a.buildPosition.distanceTo(b.buildPosition);
                const buildClearance = buildDistance - a.radius - b.radius;

                if (a.divider + b.divider > buildClearance + eps) {
                    console.error("Invariant failed: budget", {
                        i,
                        j,
                        divider_i: a.divider,
                        divider_j: b.divider,
                        buildClearance,
                    });
                    return false;
                }
            }
        }
        return true;
    }

    countCollisions(): number {
        let count = 0;
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            for (const j of a.active) {
                if (j === i)
                    continue;
                const b = this.objects[j];
                if (j < i && b.active.has(i))
                    continue;       // duplicate
                if (a.position.distanceTo(b.position) < a.radius + b.radius)
                    count++;
            }
        }
        return count;
    }

    countCollisionsBruteForce(): number {
        let count = 0;
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            for (let j = i + 1; j < this.objects.length; j++) {
                const b = this.objects[j];
                if (a.position.distanceTo(b.position) < a.radius + b.radius)
                    count++;
            }
        }
        return count;
    }

    getCollisions() {
        const collisions: CollisionPair[] = [];

        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            for (const j of a.active) {
                if (j === i)
                    continue;
                const b = this.objects[j];
                if (j < i && b.active.has(i))
                    continue;       // duplicate
                if (a.position.distanceTo(b.position) <= a.radius + b.radius) {
                    const i0 = Math.min(i, j);
                    const j0 = Math.max(i, j);
                    collisions.push({ i: i0, j: j0 });
                }
            }
        }

        return collisions;
    }

    /**
     * Brute-force method.
     */
    getCollisionsBruteForce(): CollisionPair[] {
        const collisions: CollisionPair[] = [];
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            for (let j = i + 1; j < this.objects.length; j++) {
                const b = this.objects[j];
                const r = a.radius + b.radius;
                if (a.position.distanceTo(b.position) <= r) {
                    collisions.push({ i, j });
                }
            }
        }
        return collisions;
    }

    validateCollisions(): boolean {
        const collisions = this.getCollisions();
        const groundTruth = this.getCollisionsBruteForce();
        // if (Math.random() < 0.001)
        //     console.log("validate: ", collisions.length, groundTruth.length);
        const reported = new Set<string>();
        for (const c of collisions) {
            reported.add(`${c.i},${c.j}`);
        }
        for (const c of groundTruth) {
            const key = `${c.i},${c.j}`;
            if (!reported.has(key)) {
                const a = this.objects[c.i];
                const b = this.objects[c.j];
                console.error(
                    `Missed collision (${c.i}, ${c.j})`,
                    {
                        objectA: a,
                        objectB: b,
                        r: a.position.distanceTo(b.position) - a.radius - b.radius,
                    }
                );
                return false;
            }
        }
        return true;
    }
}