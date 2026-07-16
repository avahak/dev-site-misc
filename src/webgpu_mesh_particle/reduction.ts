// Just debugging


import { float, Fn, globalId, If, instanceIndex, int, localId, Loop, select, storage, uint, uniform, workgroupArray, workgroupBarrier } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { StorageBufferAttribute } from 'three/webgpu';

const WG_SIZE = 256;

export class Reduction {
    data: THREE.StorageBufferNode<"float">;
    partials: THREE.StorageBufferNode<"float"> | null = null;
    partialsSize: number = 0;

    reduction!: THREE.ComputeNode;

    // uniforms used by the compute shaders
    dataSize = uniform(0, "uint");
    dataOffset = uniform(0, "uint");
    partialsOffset = uniform(0, "uint");


    constructor(data: THREE.StorageBufferNode<"float">, dataSize: number) {
        this.data = data;
        this.dataSize.value = dataSize;
        this.createComputeShaders();
    }

    /**
     * Size for the temporary buffer needed to store all the reductions recursively. 
     * Return value is approximately dataSize/(WG_SIZE-1).
     * 
     * TODO Check this and ensurePartialsSize 
     */
    private static requiredPartialsSize(dataSize: number): number {
        let n = dataSize;
        let total = 0;
        while (n > 1) {
            n = Math.ceil(n / WG_SIZE);
            total += n;
        }
        return total;
    }

    /**
     * If partials does not exist or is too small, allocates a large enough buffer.
     * @param dataSize Size of the base data buffer.
     */
    private ensurePartialsSize(dataSize: number): void {
        const requiredSize = Reduction.requiredPartialsSize(dataSize);
        if (this.partials && this.partialsSize >= requiredSize)
            return;     // can use existing
        this.partials?.dispose();
        let newSize = requiredSize;
        if (this.partialsSize !== 0)       // If buffer already existed, increase at least 50%
            newSize = Math.max(requiredSize, Math.ceil(1.5 * this.partialsSize));
        const partialsAttribute = new StorageBufferAttribute(newSize, 1);
        this.partials = storage(partialsAttribute, 'float', newSize);
        this.partialsSize = newSize;
    }


    createComputeShaders() {
        const sharedData = workgroupArray('float', WG_SIZE) as any;     // r185 missing some TS definitions
        this.reduction = Fn(() => {
            sharedData.element(localId.x).assign(this.data.element(instanceIndex));
            workgroupBarrier();

            const offset = uint(WG_SIZE);
            (Loop as any)(offset.greaterThan(0), () => {
                offset.shiftRightAssign(1);
                If(localId.x.lessThan(offset), () => {
                    const x = sharedData.element(localId.x.add(offset));
                    sharedData.element(localId.x).addAssign(x);
                });
                workgroupBarrier();
            });

            If(localId.x.equal(0), () => {
                this.data.element(instanceIndex).assign(sharedData.element(uint(0)));
            });
        })().compute(this.dataSize.value, [WG_SIZE]);
    }


    dispatch(renderer: THREE.WebGPURenderer) {
        renderer.compute(this.reduction);
    }
}