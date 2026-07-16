// TODO: Consider using GPUBuffer for the temporary array


import { NodeElements } from 'three/src/nodes/core/Node.js';
import { Fn, globalId, If, instanceIndex, select, storage, uniform, workgroupArray, workgroupBarrier } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { StorageBufferAttribute } from 'three/webgpu';

const WG_SIZE = 256;

// interface CommonUniforms {
//     dataSize: THREE.UniformNode<"uint", number>;
//     dataOffset: THREE.UniformNode<"uint", number>;
//     blockSumsOffset: THREE.UniformNode<"uint", number>;
// }

export class PrefixScan {
    blockSums: THREE.StorageBufferNode<"float"> | null = null;
    blockSumsSize: number = 0;
    // localScanShader!: THREE.TSL.FnNode<[{ data: THREE.StorageBufferNode<"float"> }], void>;
    localScanShader!: NodeElements;      // ShaderCallNodeInternal<void>;

    data: THREE.StorageBufferNode<"float">;

    // uniforms used by the compute shaders
    dataSize = uniform(0, "uint");
    dataOffset = uniform(0, "uint");
    blockSumsOffset = uniform(0, "uint");


    constructor(data: THREE.StorageBufferNode<"float">) {
        this.data = data;
        this.createComputeShaders();
    }

    /**
     * Size for the temporary buffer needed to store block sums. 
     * Return value is approximately n/(WG_SIZE-1).
     */
    private static blockSumsBufferSize(n: number): number {
        let total = 0;
        while (n > 1) {
            n = Math.ceil(n / WG_SIZE);
            total += n;
        }
        return total;
    }


    createComputeShaders() {
        // this.blockSums
        // this.localScanShader = Fn(([{ data }]: [{ data: THREE.StorageBufferNode<"float"> }]) => {
        // this.localScanShader = Fn(() => {
        this.localScanShader = Fn(() => {
            const sharedData = workgroupArray('float', WG_SIZE) as any;     // r185 missing some TS definitions
            sharedData.element(instanceIndex).assign(this.data.element(instanceIndex));
            workgroupBarrier();

            const x = sharedData.element(instanceIndex);
            const xm = sharedData.element(instanceIndex.sub(1));
            const xp = sharedData.element(instanceIndex.add(1));
            const val = select(
                instanceIndex.greaterThan(0).and(instanceIndex.lessThan(this.dataSize.sub(1))),
                x.add(xm).add(xp).div(3),
                this.dataSize
            );
            If(instanceIndex.lessThan(this.dataSize.sub(1)), () => {
                this.data.element(instanceIndex).assign(val);
            });
        })();
    }


    debug(size: number) {
        this.dataSize.value = size;
        return this.localScanShader;
    }


    // debug(data: THREE.StorageBufferNode<"float">, size: number): THREE.ComputeNode {
    //     this.dataSize.value = size;
    //     return this.localScanShader({ data: data }).compute(size);
    // }

    /**
     * If blockSums does not exist or is too small, allocates a new larger buffer.
     * @param baseBufferSize Size of the base data being summed.
     */
    private ensureBufferSize(baseBufferSize: number): void {
        const requiredSize = PrefixScan.blockSumsBufferSize(baseBufferSize);
        if (this.blockSums && this.blockSumsSize >= requiredSize)
            return;     // can use existing
        this.blockSums?.dispose();
        let newSize = requiredSize;
        if (this.blockSumsSize !== 0)       // If buffer already existed, increase at least 50%
            newSize = Math.max(requiredSize, Math.ceil(1.5 * this.blockSumsSize));
        const blockSumsAttribute = new StorageBufferAttribute(newSize, 1);
        this.blockSums = storage(blockSumsAttribute, 'float', newSize);
        this.blockSumsSize = newSize;
    }

    dispose() {
        this.blockSums?.dispose();
    }
}