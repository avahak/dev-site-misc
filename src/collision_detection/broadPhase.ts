/*
Broad phase collision algorithm.

Notation.
    p_i      = current position
    pHat_i   = build position

Each object i partitions the other objects into
    active_i
    certificates_i
    dormant_i
where the dormant set is implicit.

For every pair (i,j) that is not active from either side define
    beta_ij =
        certificate(i,j)      if j is certified by i
        H_i                   if j is dormant for i
where H_i is the horizon certificate.

The invariants we have are:
- active and certificates are disjoint.
- Certificates of i are in order and <= H_i.
- The budget invariant a)<=>a') explained below.

Invariant:
a) Geometric form:
    If j is not active for i and i is not active for j, then
        B(q_i,r_i) and B(q_j,r_j)
    are disjoint for every
        q_i in B(pHat_i,beta_ij)
        q_j in B(pHat_j,beta_ji)

a') Equivalent algebraic form (budget form):
    beta_ij + beta_ji <= |pHat_i - pHat_j| - r_i - r_j

The algorithm is designed so that the invariants holds after initialization 
and every update call.

The only invariants we really have are:

- active and certificates are disjoint.
- Every explicit certificate satisfies certificate <= horizon.
 -The budget invariant a)<=>a').
*/

export interface CollisionPair {
    i: number;
    j: number;
}


import * as THREE from "three";
import { SmallPriorityList } from "./data_structures/smallPriorityList";


export class MovingSphere {
    position: THREE.Vector3;
    radius: number;
    /** Frozen reference position from the last rebuild. */
    buildPosition: THREE.Vector3;
    /** Pairs tracked explicitly. */
    active: Set<number>;
    /** Explicit pair certificates. Each entry stores (beta,index). */
    certificates: SmallPriorityList;
    /**
     * Horizon certificate.
     * Every dormant pair is assigned this beta value.
     * It may decrease but never increase until object is rebuilt.
     */
    horizon: number;
    obj?: THREE.Object3D;

    constructor(position: THREE.Vector3, radius: number, M: number) {
        this.position = position;
        this.radius = radius;
        this.buildPosition = new THREE.Vector3();
        this.active = new Set();
        this.certificates = new SmallPriorityList(M);
        this.horizon = 0;
    }
}

export class CertificateBroadPhase {
    objects: MovingSphere[];
    rebuildSet: Set<number>;

    constructor(objects: MovingSphere[]) {
        this.objects = objects;
        this.rebuildSet = new Set();

        for (const object of objects)
            object.buildPosition.copy(object.position);
        for (let i = 0; i < objects.length; i++)
            this.build(i, false);
    }

    build(i: number, updateOtherObjects: boolean): void {
        const a = this.objects[i];
        this.rebuildSet.delete(i);
        a.buildPosition.copy(a.position);
        a.active.clear();
        a.certificates.clear();

        for (let j = 0; j < this.objects.length; j++) {
            if (i === j)
                continue;

            const b = this.objects[j];
            const distance = a.position.distanceTo(b.position);
            const beta = (distance - a.radius - b.radius) / 2;

            if (beta < 0)
                a.active.add(j);
            else
                a.certificates.insert(beta, j);
        }
        a.horizon = a.certificates.size === 0 ?
            Number.POSITIVE_INFINITY : a.certificates.peekMax()!.value;


        if (!updateOtherObjects)
            return;

        for (let j = 0; j < this.objects.length; j++) {
            if (i === j)
                continue;

            const b = this.objects[j];
            const buildDistance = a.position.distanceTo(b.buildPosition);
            const currentDistance = a.position.distanceTo(b.position);

            // Largest beta preserving the budget invariant
            const beta = buildDistance - (currentDistance + a.radius + b.radius) / 2;

            b.active.delete(i);
            b.certificates.deleteByIndex(i);

            if (beta < 0) {
                b.active.add(i);
                continue;
            }

            if (beta >= b.horizon)
                continue;

            const largestCertificate = b.certificates.peekMax()?.value ?? -Infinity;

            if (b.certificates.size === b.certificates.capacity && beta > largestCertificate) {
                b.horizon = beta;
            } else {
                const dropped = b.certificates.insert(beta, i);
                if (dropped)
                    b.horizon = dropped.value;
            }

            const displacement = b.position.distanceTo(b.buildPosition);
            if (displacement > b.horizon)
                this.rebuildSet.add(j);
        }
    }

    update(): void {
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            const displacement = a.position.distanceTo(a.buildPosition);

            while (true) {
                const certificate = a.certificates.peekMin();
                if (!certificate)
                    break;
                if (displacement <= certificate.value)
                    break;

                a.certificates.extractMin();
                a.active.add(certificate.index);
            }

            if (displacement > a.horizon)
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

            // active and certificates must be disjoint
            for (const cert of a.certificates) {
                if (a.active.has(cert.index)) {
                    console.error("Invariant failed: active/certificate overlap", { i, j: cert.index });
                    return false;
                }

                if (cert.value > a.horizon + eps) {
                    console.error("Invariant failed: certificate exceeds horizon", {
                        i,
                        j: cert.index,
                        certificate: cert.value,
                        horizon: a.horizon
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
                const cert_ij = a.certificates.findByIndex(j);
                const cert_ji = b.certificates.findByIndex(i);
                const beta_ij = cert_ij ? cert_ij.value : a.horizon;
                const beta_ji = cert_ji ? cert_ji.value : b.horizon;

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

    getCollisions() {
        const collisions: CollisionPair[] = [];
        const reported = new Set<string>();

        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            for (const j of a.active) {
                if (j === i)
                    continue;
                const b = this.objects[j];
                if (a.position.distanceTo(b.position) <= a.radius + b.radius) {
                    const i0 = Math.min(i, j);
                    const j0 = Math.max(i, j);
                    const key = `${i0},${j0}`;
                    if (!reported.has(key)) {
                        reported.add(key);
                        collisions.push({ i: i0, j: j0 });
                    }
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