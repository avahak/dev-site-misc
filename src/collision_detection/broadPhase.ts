/* Testing an algorithm
NOTE could we could use half-planes (vec4) for certificates somehow? No sorting then..
TODO How to handle duplicates?

Denote half of the distance between balls i, j with delta_{ij}:
    delta_{ij} := (d(pBuild_i, pBuild_j) - r_i - r_j) / 2.

Possible invariants? (TODO, NOT THOUGHT THROUGH!):
    1) After every update:
        For each i indices j are partitioned into active_i, certified_i, dormant_i
        Since we do not track dormand_i, this just means active_i\cap certified_i=\emptyset
    2) After every update: For indices i and j:
        a) If delta_{ij} < 0 then j is in active_i
        b) If delta_{ij} < deltaTrust_i then j is in active_i or certified_i
    NOTE: This involves pBuild_i, pBuild_j only, no actual positions!

NOTE: SmallPriorityList is a list with fixed maximum size M and stores elements with
smallest deltas in it. If a new element is inserted and the list is full, one element is dropped.
*/


import * as THREE from "three";
import { SmallPriorityList } from "./data_structures/smallPriorityList";


export class MovingSphere {
    position: THREE.Vector3;
    radius: number;
    buildPosition: THREE.Vector3;
    /** indices for spheres that are actively tracked, TODO inefficient */
    active: Set<number>;
    /** (delta,index) for spheres that were closest at build time */
    certificates: SmallPriorityList;
    obj?: THREE.Object3D;

    constructor(position: THREE.Vector3, radius: number, M: number) {
        this.position = position;
        this.radius = radius;
        this.buildPosition = new THREE.Vector3();
        this.active = new Set();
        this.certificates = new SmallPriorityList(M);
    }
}

export interface CollisionPair {
    i: number;
    j: number;
}

export class TrustRegionBroadPhase {
    objects: MovingSphere[];
    rebuildSet: Set<number>;

    constructor(objects: MovingSphere[]) {
        this.objects = objects;
        this.rebuildSet = new Set();
        for (let i = 0; i < objects.length; i++)
            this.objects[i].buildPosition.copy(this.objects[i].position);
        for (let i = 0; i < objects.length; i++)
            this.build(i, false);
    }

    build(i: number, adjustOthers: boolean): void {
        const a = this.objects[i];
        this.rebuildSet.delete(i);
        a.buildPosition.copy(a.position);
        a.active.clear();
        a.certificates.clear();

        for (let j = 0; j < this.objects.length; j++) {
            if (i === j)
                continue;
            const b = this.objects[j];
            const centerDistance = a.position.distanceTo(b.position);
            const delta = (centerDistance - a.radius - b.radius) / 2;
            if (delta < 0)
                a.active.add(j);
            else
                a.certificates.insert(delta, j);
        }

        if (!adjustOthers)
            return;

        // Adjust other objects' certificates w.r.t. i:
        for (let j = 0; j < this.objects.length; j++) {
            if (i === j)
                continue;
            const b = this.objects[j];
            // This comes out of the invariant property:
            const centerBuildDistance = a.position.distanceTo(b.buildPosition);
            const centerDistance = a.position.distanceTo(b.position);
            const delta = centerBuildDistance - (centerDistance + a.radius + b.radius) / 2;

            let trustDelta = 0;
            if (b.certificates.size !== 0)
                trustDelta = b.certificates.peekMax()!.delta;

            // Clear previous record of i
            b.active.delete(i);
            b.certificates.deleteByIndex(i);

            if (delta < 0)
                b.active.add(i);
            if (delta >= 0 && delta < trustDelta)   // initial trust region cannot be extended
                b.certificates.insert(delta, i);

            if (b.certificates.size === 0)
                this.rebuildSet.add(j);
        }
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
                    // need to rebuild i
                    this.rebuildSet.add(i);
                    break;
                }
                if (buildDistance <= cert.delta)
                    break;      // Certificate still holds

                // Certificate expires, move it to active tracking
                a.certificates.extractMin();
                a.active.add(cert.index);
            } while (true);
        }

        // Rebuild if there are no certificates left
        while (this.rebuildSet.size > 0) {
            const [i] = this.rebuildSet;        // JS... 
            const a = this.objects[i];
            if (a.certificates.size === 0)
                this.build(i, true);
            else
                throw Error("DEBUG: expected a.certificates.size===0");
        }
    }

    validateInvariants() {
        // Should check invariants here.
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

    validateCollisions(): boolean {
        const collisions = this.getCollisions();
        const groundTruth = this.getCollisionsBruteForce();
        // if (Math.random() < 0.0001)
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