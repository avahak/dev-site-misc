/**
 * Just helpers to probe GPU buffers for debugging
 */
import { Fn, instanceIndex, Loop, storage, uniform, uniformArray, vec3, vec4 } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { StorageBufferAttribute } from 'three/webgpu';
import { SkinnedGeometryGPU } from './skinnedGeometryGPU';

// Just for reference, TODO remove
// export function getSkinnedVertexPosition(
//     mesh: THREE.SkinnedMesh,
//     vertexIndex: number,
// ): THREE.Vector3 {
//     const position = mesh.geometry.attributes.position;
//     const skinIndex = mesh.geometry.attributes.skinIndex;
//     const skinWeight = mesh.geometry.attributes.skinWeight;
//     const bindPosition = new THREE.Vector3(
//         position.getComponent(vertexIndex, 0),
//         position.getComponent(vertexIndex, 1),
//         position.getComponent(vertexIndex, 2),
//     );
//     bindPosition.applyMatrix4(mesh.bindMatrix);
//     const result = new THREE.Vector3();
//     for (let i = 0; i < 4; i++) {
//         const weight = skinWeight.getComponent(vertexIndex, i);
//         if (weight === 0) {
//             continue;
//         }
//         const bone = skinIndex.getComponent(vertexIndex, i);
//         const boneMatrix = new THREE.Matrix4().multiplyMatrices(
//             mesh.skeleton.bones[bone].matrixWorld,
//             mesh.skeleton.boneInverses[bone],
//         );
//         const transformed = bindPosition.clone().applyMatrix4(boneMatrix);
//         result.addScaledVector(transformed, weight);
//     }
//     result.applyMatrix4(mesh.bindMatrixInverse);
//     return result;
// }


/**
 * Console logs a table from contents of an attribute on GPU
 */
export async function dumpBuffer<T>(
    renderer: THREE.WebGPURenderer,
    attribute: THREE.BufferAttribute,
    bytesPerStruct: number,
    count: number,
    decode: (data: DataView<ArrayBuffer>, base: number, index: number) => T
): Promise<any[]> {
    const buffer = await renderer.getArrayBufferAsync(attribute, null, 0, count * bytesPerStruct);
    const view = new DataView(buffer);
    const rows = [];
    for (let i = 0; i < count; i++)
        rows.push(decode(view, i * bytesPerStruct, i));
    return rows;
}


export class DebugGPU {
    maxNum: number = 1024;
    debugAttribute: THREE.StorageBufferAttribute;
    debugBuffer: THREE.StorageBufferNode<"vec4">;
    gpuMesh: SkinnedGeometryGPU;


    constructor(gpuMesh: SkinnedGeometryGPU) {
        this.gpuMesh = gpuMesh;
        this.debugAttribute = new StorageBufferAttribute(this.maxNum, 4);
        this.debugBuffer = storage(this.debugAttribute, "vec4", this.maxNum);
    }

    async debug(renderer: THREE.WebGPURenderer, num: number) {
        if (num > this.maxNum)
            throw Error(`num can be at most maxNum=${this.maxNum}`);

        // compute skinned vertex positions for a sample of points
        const indices = [];
        for (let k = 0; k < num; k++)
            indices.push(Math.round(Math.random() * this.gpuMesh.triangleCount * 3));

        const indicesUniform = uniformArray(indices, "int" as const);

        const animateVertex = Fn(([vIndex]: [THREE.Node<"int">]) => {
            const vertex = this.gpuMesh.vertices.element(vIndex);
            const pos0 = vec4(vertex.get("position") as THREE.Node<"vec3">, 1);
            const iSkin = (vertex.get("skinIndices") as THREE.Node<"ivec4">).toVar();
            const wSkin = (vertex.get("skinWeights") as THREE.Node<"vec4">).toVar();
            const bindMatrixIndices = vertex.get("bindMatrixIndices") as THREE.Node<"ivec2">;
            const bindMatrix = this.gpuMesh.matrixBuffer.element(bindMatrixIndices.x);
            const bindMatrixInverse = this.gpuMesh.matrixBuffer.element(bindMatrixIndices.y);

            const pos = bindMatrix.mul(pos0).toVar();

            const boneMatrix1 = this.gpuMesh.matrixBuffer.element(iSkin.x);
            const term1 = boneMatrix1.mul(pos).mul(wSkin.x);
            const boneMatrix2 = this.gpuMesh.matrixBuffer.element(iSkin.y);
            const term2 = boneMatrix2.mul(pos).mul(wSkin.y);
            const boneMatrix3 = this.gpuMesh.matrixBuffer.element(iSkin.z);
            const term3 = boneMatrix3.mul(pos).mul(wSkin.z);
            const boneMatrix4 = this.gpuMesh.matrixBuffer.element(iSkin.w);
            const term4 = boneMatrix4.mul(pos).mul(wSkin.w);

            const result = term1.add(term2).add(term3).add(term4);

            const resultModel = bindMatrixInverse.mul(result);

            return resultModel;
        });     // TODO .setLayout

        const fn = Fn(() => {
            const iIndex = indicesUniform.element(instanceIndex);
            const vIndex = this.gpuMesh.indices.element(iIndex);

            const result = animateVertex(vIndex);

            this.debugBuffer.element(instanceIndex).assign(result);
        })().compute(num);
        await renderer.compute(fn);

        const dump = await dumpBuffer(renderer, this.debugAttribute, 4 * 4, num, (view, base, _i) => {
            const f32 = (offset: number) => view.getFloat32(base + offset, true);
            return new THREE.Vector4(f32(0), f32(4), f32(8), f32(12));
            // return {
            //     pos: {
            //         x: f32(0),
            //         y: f32(4),
            //         z: f32(8),
            //         w: f32(12),
            //     },
            // };
        });

        // return { indices: indices, dump: dump };
        return indices.map((vv, i, _a) => ({ index: vv, v: dump[i] }));
    }
}