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
    /** Maximum number of allowed false positives before object is rebuild */
    maxFalsePositives: number;  // -1 means don't use

    constructor(position: THREE.Vector3, radius: number, maxFalsePositives: number) {
        this.position = position;
        this.radius = radius;
        this.buildPosition = new THREE.Vector3();
        this.active = new Set();

        this.divider = Infinity;
        this.maxFalsePositives = maxFalsePositives;
    }
}

/**
 * Broad phase collision algorithm. Inefficient if objects move fast and efficient 
 * when objects move slow. Can be used for continuous collision detection. 
 * Tunable with capacity of certificates that can be set per object. Depends only
 * on distances only so directly generalizes to AABB:s (with max-norm distance), 
 * \R^n (with n>3), or general metric spaces.
 * 
 * Denote 
 * 
 *      d_i      = divider_i
 *      p_i      = current position
 *      pHat_i   = build position
 * 
 * Invariants
 * 
 * a) Geometric form:
 * 
 *      If j is not active for i and i is not active for j, then
 *          B(q_i,r_i) and B(q_j,r_j)
 *      are disjoint for every
 *          q_i in B(pHat_i, d_i) and
 *          q_j in B(pHat_j, d_j).
 * 
 * a') Equivalent algebraic/budget form:
 * 
 *      If j is not active for i and i is not active for j, then
 *          d_i + d_j <= |pHat_i - pHat_j| - r_i - r_j
 * 
 * b) Single ownership for active pairs: for every i, j: 
 * 
 *      i cannot be active for j if j is active for i.
 * 
 */
export class CertificateBroadPhaseLazy {
    objects: MovingSphere[];
    rebuildSet: Set<number>;

    /** A parameter to for divider choosing heuristic */
    mBase: number;
    sharedSortList: SortedList; // temporary work array

    constructor(objects: MovingSphere[], mBase: number) {
        this.objects = objects;
        this.rebuildSet = new Set();
        this.mBase = mBase;
        this.sharedSortList = new SortedList(this.mBase + 1);

        for (let i = 0; i < objects.length; i++)
            this.updateTrustRegionHeuristic(i);
        for (let i = 0; i < objects.length; i++)
            this.updateActive(i);
    }

    private orderStatisticDividerHeuristic(i: number): void {
        // NOTE: Choosing a.divider like this is only one heuristic and requires using
        // costly sorting during each rebuild.
        // Are there better choices? Fixed radius? Adaptive?
        const a = this.objects[i];
        a.buildPosition.copy(a.position);
        this.sharedSortList.clear();

        for (let j = 0; j < this.objects.length; j++) {
            if (i === j)
                continue;
            const b = this.objects[j];

            // NOTE: There is leeway in how we choose beta. Here we choose to use half of 
            // the current clearance. 
            const distance = a.position.distanceTo(b.position);
            const beta = (distance - a.radius - b.radius) / 2;

            if (beta >= 0)
                this.sharedSortList.insert(beta, j);
        }
        // Now a.divider is the (this.mBase+1):th smallest positive half-clearance:
        a.divider = this.sharedSortList._values[0];
    }

    private fixedDividerHeuristic(i: number): void {
        const a = this.objects[i];
        a.buildPosition.copy(a.position);
        a.divider = 0.1 + a.radius;
    }

    private updateTrustRegionHeuristic(i: number): void {
        // this.orderStatisticDividerHeuristic(i);
        this.fixedDividerHeuristic(i);
    }

    /**
     * Enforces invariant to hold by adding to active if invarint requires it.
     * NOTE: We have chosen to add to b.active instead of a.active, but this could 
     *       be written either way.
     */
    private updateActive(i: number): void {
        const a = this.objects[i];
        a.active.clear();

        for (let j = 0; j < this.objects.length; j++) {
            if (i === j)
                continue;
            const b = this.objects[j];
            const buildDistance = a.buildPosition.distanceTo(b.buildPosition);

            // Invariant requires: 
            // Since a.active is empty, either
            //      * b.active has to include i, or 
            //      * b.divider <= buildDistance - a.radius - b.radius - a.divider.
            const beta = buildDistance - a.radius - b.radius - a.divider;
            if (beta < b.divider)
                b.active.add(i);
            else
                b.active.delete(i);
        }
    }


    /**
     * Needs to be called before collision detection every frame.
     */
    update(): void {
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];

            const displacement = a.position.distanceTo(a.buildPosition);
            if (displacement > a.divider) {
                this.rebuildSet.add(i);
                continue;
            }

            // Count false positives:
            // NOTE: This could be done every once in a while, not constantly
            if (a.maxFalsePositives !== -1) {
                let falsePositives = 0;
                for (const j of a.active) {
                    const b = this.objects[j];
                    if (a.position.distanceTo(b.position) >= a.radius + b.radius)
                        falsePositives++;
                }
                if (falsePositives > a.maxFalsePositives)
                    this.rebuildSet.add(i);
            }
        }

        while (this.rebuildSet.size > 0) {
            const [i] = this.rebuildSet;
            this.updateTrustRegionHeuristic(i);
            this.updateActive(i);
            this.rebuildSet.delete(i);
        }
    }


    validateInvariants(): boolean {
        const eps = 1e-8;
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            if (a.active.has(i))
                console.error("Object tracks itself in active", { i });

            for (let j = 0; j < this.objects.length; j++) {
                const b = this.objects[j];
                if (a.active.has(j) && b.active.has(i))
                    console.error("Duplicate active", { i, j });

                if (i === j)
                    continue;
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
                const b = this.objects[j];
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
                const b = this.objects[j];
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