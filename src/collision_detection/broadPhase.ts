import * as THREE from "three";
import { DividerList, DividerList_OfferResult } from "./data_structures/dividerList";

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
    /** Explicit pair certificates. Each entry stores (beta,index). */
    certificates: DividerList;
    obj?: THREE.Object3D;

    constructor(position: THREE.Vector3, radius: number, M: number) {
        this.position = position;
        this.radius = radius;
        this.buildPosition = new THREE.Vector3();
        this.active = new Set();
        this.certificates = new DividerList(M);
    }
}


/**
 * Broad phase collision algorithm. Inefficient if objects move fast and efficient 
 * when objects move slow. Can be used for continuous collision detection. 
 * Tunable with capacity of certificates that can be set per object. Depends only
 * on distances only so directly generalizes to AABB:s (with max-norm distance), 
 * \R^n (with n>3), or general metric spaces.
 * 
 * Notation.
 * 
 *      p_i      = current position
 *      pHat_i   = build position
 * 
 * Each object i partitions the other objects into
 * 
 *      active_i
 *      explicit_i
 *      dormant_i
 * 
 * where the dormant set is not explicitly represented.
 * 
 * For every pair (i,j) that is not active from either side define
 * 
 *      beta_ij =
 *          explicit certificate(i,j)    if j is explicit for i
 *          divider_i                    if j is dormant for i
 * 
 * Thus every non-active pair has a well-defined beta value from the
 * perspective of each endpoint.
 * 
 * Main invariant.
 * Geometric form:
 * 
 *      If j is not active for i and i is not active for j, then
 *          B(q_i,r_i) and B(q_j,r_j)
 *      are disjoint for every
 *          q_i in B(pHat_i, beta_ij) and
 *          q_j in B(pHat_j, beta_ji).
 * 
 * Equivalent algebraic form:
 * 
 *      If j is not active for i and i is not active for j, then
 *          beta_ij + beta_ji <= |pHat_i - pHat_j| - r_i - r_j
 * 
 * The maintained invariants are:
 * 
 * - active and explicit sets are disjoint.
 * - Every explicit certificate is smaller than the divider.
 * - The budget invariant above holds.
 * 
 * The algorithm is designed so that these invariants hold after
 * initialization and after every update.
 */
export class CertificateBroadPhase {
    objects: MovingSphere[];
    rebuildSet: Set<number>;

    constructor(objects: MovingSphere[]) {
        this.objects = objects;
        this.rebuildSet = new Set();

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
        a.certificates.clear();

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
                a.certificates.offer(beta, j);
        }

        if (!propagateChanges)
            return;

        for (let j = 0; j < this.objects.length; j++) {
            if (i === j)
                continue;

            const b = this.objects[j];
            const buildDistance = a.position.distanceTo(b.buildPosition);
            const currentDistance = a.position.distanceTo(b.position);

            // Largest beta preserving the budget invariant
            const beta = buildDistance - (currentDistance + a.radius + b.radius) / 2;

            b.certificates.deleteByIndex(i);

            if (beta < 0) {
                b.active.add(i);
                continue;
            }
            b.active.delete(i);

            const result = b.certificates.offer(beta, i);
            if (result === DividerList_OfferResult.DividerChanged) {
                const displacement = b.position.distanceTo(b.buildPosition);
                if (displacement > b.certificates.divider)
                    this.rebuildSet.add(j);
            }
        }
    }

    update(): void {
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];

            const displacement = a.position.distanceTo(a.buildPosition);
            if (displacement > a.certificates.divider) {
                this.rebuildSet.add(i);
                continue;
            }

            // Move expired certificates to active
            while (true) {
                const certificate = a.certificates.peekMin();
                if (!certificate)
                    break;
                if (displacement <= certificate.value)
                    break;

                a.certificates.extractMin();
                a.active.add(certificate.index);
            }
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

            // active and certificates must be disjoint
            for (const cert of a.certificates) {
                if (a.active.has(cert.index)) {
                    console.error("Invariant failed: active/certificate overlap", { i, j: cert.index });
                    return false;
                }

                if (cert.value > a.certificates.divider + eps) {
                    console.error("Invariant failed: certificate exceeds divider", {
                        i,
                        j: cert.index,
                        certificate: cert.value,
                        divider: a.certificates.divider
                    });
                    return false;
                }
            }

            for (let j = 0; j < this.objects.length; j++) {
                if (i === j)
                    continue;
                const b = this.objects[j];
                if (a.active.has(j) || b.active.has(i))
                    continue;

                const buildClearance = a.buildPosition.distanceTo(b.buildPosition) - a.radius - b.radius;
                const beta_ij = a.certificates.findByIndex(j)?.value ?? a.certificates.divider;
                const beta_ji = b.certificates.findByIndex(i)?.value ?? b.certificates.divider;

                if (beta_ij + beta_ji > buildClearance + eps) {
                    console.error("Invariant failed: budget", {
                        i,
                        j,
                        beta_ij,
                        beta_ji,
                        buildClearance
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