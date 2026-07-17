/* Testing an algorithm
NOTE could we could use half-planes (vec4) for certificates somehow? No sorting then..
     trustRadius would still stay a radius.
TODO How to handle duplicates?


Denote delta_{ij}=d(B(pBuild_i),r_i),B(pBuild_j,r_j)-r_i-r_j.

Invariants (ideally):
    1) After every update:
        For each i indices j are partitioned into active_i, certified_i, dormant_i
    2) After every update: For indices i and j:
        a) If delta_{ij} < 0 then j is in active_i
        b) If delta_{ij} < deltaTrust_i then j is in active_i or certified_i
    NOTE: This involves pBuild_i, pBuild_j only, no actual positions!
*/



import * as THREE from "three";
import { PriorityNode, SortedArrayQueue } from "./data_structures/sortedArrayQueue";


export class MovingSphere {
    position: THREE.Vector3;
    radius: number;
    buildPosition: THREE.Vector3;
    trustRadius: number;
    /** indices for spheres that are actively tracked */
    active: number[];
    /** (radius,index) for spheres that were closest at build time */
    certificates: SortedArrayQueue<PriorityNode>;
    obj?: THREE.Object3D;

    constructor(position: THREE.Vector3, radius: number) {
        this.position = position;
        this.radius = radius;
        this.buildPosition = new THREE.Vector3();
        this.trustRadius = 0;
        this.active = [];
        this.certificates = new SortedArrayQueue();
    }
}

export interface CollisionPair {
    i: number;
    j: number;
}

export class TrustRegionBroadPhase {
    M: number;
    objects: MovingSphere[];

    constructor(objects: MovingSphere[], M: number = 10) {
        this.objects = objects;
        this.M = M;
        // Initial build of every object.
        for (let i = 0; i < objects.length; i++)
            this.build(i);
    }

    build(i: number): void {
        const a = this.objects[i];
        a.buildPosition.copy(a.position);
        a.active.length = 0;

        const positive: PriorityNode[] = [];
        for (let j = 0; j < this.objects.length; j++) {
            if (i === j)
                continue;
            const b = this.objects[j];
            const centerDistance = a.position.distanceTo(b.position);
            const delta = centerDistance - a.radius - b.radius;
            if (delta <= 0)
                a.active.push(j);
            else
                positive.push({ index: j, delta });
        }
        positive.sort((x, y) => y.delta - x.delta);       // sort in decreasing radius

        // Assign new certificates:
        const count = Math.min(this.M, positive.length);
        a.certificates.setFrom(positive, positive.length - count, count);
        a.trustRadius = positive[count - 1].delta / 2;

        // Adjust other objects' certificates:
        // ...
    }

    /**
     * Perform one simulation step.
     */
    update() {
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            const buildDistance = a.position.distanceTo(a.buildPosition);

            // Extract expired certificates:
            do {
                const cert = a.certificates.peekMin();
                if (!cert) {
                    // console.log("DEBUG: certificates was empty.");
                    this.build(i);
                    return;
                }
                if (buildDistance <= cert.delta)
                    break;      // Certificate still holds

                // Certificate expires, move to active tracking
                a.certificates.extractMin();
                a.active.push(cert.index);
            } while (true);
        }
    }

    /**
     * Returns all currently intersecting pairs found through the active lists.
     * TODO What about duplicates?
     */
    getCollisions() {
        const collisions: CollisionPair[] = [];
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            for (const j of a.active) {
                if (j === i)
                    continue;
                const b = this.objects[j];
                if (a.position.distanceTo(b.position) <= a.radius + b.radius) {
                    collisions.push({ i: Math.min(i, j), j: Math.max(i, j) });
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

    validate(): boolean {
        const collisions = this.getCollisions();
        const groundTruth = this.getCollisionsBruteForce();
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