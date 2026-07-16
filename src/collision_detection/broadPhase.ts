// Testing an algorithm

import * as THREE from "three";


export class MovingSphere {
    position: THREE.Vector3;
    radius: number;
    rebuildPosition: THREE.Vector3;
    trustRadius: number;
    active: number[];
    obj?: THREE.Object3D;

    constructor(position: THREE.Vector3, radius: number) {
        this.position = position;
        this.radius = radius;
        this.rebuildPosition = new THREE.Vector3();
        this.trustRadius = 0;
        this.active = [];
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
        // Initial rebuild of every object.
        for (let i = 0; i < objects.length; ++i) {
            this.rebuild(i);
        }
    }

    rebuild(i: number): void {
        const a = this.objects[i];
        a.rebuildPosition.copy(a.position);
        a.active.length = 0;
        const positive: { index: number; delta: number }[] = [];
        for (let j = 0; j < this.objects.length; ++j) {
            if (i === j)
                continue;
            const b = this.objects[j];
            const centerDistance = a.position.distanceTo(b.position);
            const delta = centerDistance - a.radius - b.radius;
            if (delta <= 0) {
                a.active.push(j);
            } else {
                positive.push({ index: j, delta });
            }
        }
        positive.sort((x, y) => x.delta - y.delta);
        const count = Math.min(this.M, positive.length);
        for (let k = 0; k < count; ++k) {
            a.active.push(positive[k].index);
        }
        a.trustRadius = positive[count - 1].delta / 2;
    }

    /**
     * Perform one simulation step.
     * Returns all currently intersecting pairs found through the active lists.
     */
    update(): CollisionPair[] {
        const collisions: CollisionPair[] = [];
        for (let i = 0; i < this.objects.length; i++) {
            const a = this.objects[i];
            // Check active list.
            for (const j of a.active) {
                if (j === i)
                    continue;
                const b = this.objects[j];
                if (a.position.distanceTo(b.position) <= a.radius + b.radius) {
                    collisions.push({ i: Math.min(i, j), j: Math.max(i, j) });
                }
            }
            // Rebuild if outside trust region.
            if (a.position.distanceTo(a.rebuildPosition) > a.trustRadius) {
                this.rebuild(i);
            }
        }
        return collisions;          // What about duplicates?
    }

    /**
     * Brute-force method.
     */
    bruteForce(): CollisionPair[] {
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

    validate(collisions: CollisionPair[]): boolean {
        const groundTruth = this.bruteForce();
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