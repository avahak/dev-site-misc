/**
 * Just helpers to probe GPU buffers for debugging
 */
import { Fn, instanceIndex, Loop, storage, uniform, uniformArray, vec3, vec4 } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { StorageBufferAttribute } from 'three/webgpu';
import { SkinnedGeometryGPU } from './skinnedGeometryGPU';

// Just for reference
export function getSkinnedVertexPosition(
    mesh: THREE.SkinnedMesh,
    vertexIndex: number,
): THREE.Vector3 {
    const position = mesh.geometry.attributes.position;
    const skinIndex = mesh.geometry.attributes.skinIndex;
    const skinWeight = mesh.geometry.attributes.skinWeight;
    const bindPosition = new THREE.Vector3(
        position.getComponent(vertexIndex, 0),
        position.getComponent(vertexIndex, 1),
        position.getComponent(vertexIndex, 2),
    );
    bindPosition.applyMatrix4(mesh.bindMatrix);
    const result = new THREE.Vector3();
    for (let i = 0; i < 4; i++) {
        const weight = skinWeight.getComponent(vertexIndex, i);
        const bone = skinIndex.getComponent(vertexIndex, i);
        const boneMatrix = new THREE.Matrix4().multiplyMatrices(
            mesh.skeleton.bones[bone].matrixWorld,
            mesh.skeleton.boneInverses[bone],
        );
        const transformed = bindPosition.clone().applyMatrix4(boneMatrix);
        result.addScaledVector(transformed, weight);
    }
    result.applyMatrix4(mesh.bindMatrixInverse);
    return result;
}

export function getSkinnedVertexNormal(
    mesh: THREE.SkinnedMesh,
    vertexIndex: number,
    useAdjugateTranspose: boolean,
): THREE.Vector3 {
    const normal = mesh.geometry.attributes.normal;
    const skinIndex = mesh.geometry.attributes.skinIndex;
    const skinWeight = mesh.geometry.attributes.skinWeight;
    const bindNormal = new THREE.Vector3(
        normal.getComponent(vertexIndex, 0),
        normal.getComponent(vertexIndex, 1),
        normal.getComponent(vertexIndex, 2),
    );
    if (useAdjugateTranspose) {
        const blendedMatrix = new THREE.Matrix4();
        blendedMatrix.elements.fill(0);
        for (let i = 0; i < 4; i++) {
            const weight = skinWeight.getComponent(vertexIndex, i);
            const bone = skinIndex.getComponent(vertexIndex, i);
            const boneMatrix = new THREE.Matrix4().multiplyMatrices(
                mesh.skeleton.bones[bone].matrixWorld,
                mesh.skeleton.boneInverses[bone],
            );
            for (let j = 0; j < 16; j++)
                blendedMatrix.elements[j] += boneMatrix.elements[j] * weight;
        }
        const m = new THREE.Matrix4().multiplyMatrices(mesh.bindMatrixInverse, blendedMatrix).multiply(mesh.bindMatrix);
        const m3 = new THREE.Matrix3().setFromMatrix4(m);
        const det = m3.determinant();
        m3.invert();
        m3.multiplyScalar(det);
        m3.transpose();
        const result = bindNormal.applyMatrix3(m3);
        result.normalize();
        return result;
    } else {
        const bm3 = new THREE.Matrix3().setFromMatrix4(mesh.bindMatrix);
        bindNormal.applyMatrix3(bm3);
        const result = new THREE.Vector3();
        for (let i = 0; i < 4; i++) {
            const weight = skinWeight.getComponent(vertexIndex, i);
            const bone = skinIndex.getComponent(vertexIndex, i);
            const boneMatrix = new THREE.Matrix4().multiplyMatrices(
                mesh.skeleton.bones[bone].matrixWorld,
                mesh.skeleton.boneInverses[bone],
            );
            const boneMatrix3 = new THREE.Matrix3().setFromMatrix4(boneMatrix);
            const transformed = bindNormal.clone().applyMatrix3(boneMatrix3);
            result.addScaledVector(transformed, weight);
        }
        const bmi3 = new THREE.Matrix3().setFromMatrix4(mesh.bindMatrixInverse);
        result.applyMatrix3(bmi3);
        result.normalize();
        return result;
    }
}


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

    oldPos: THREE.Vector3[] = [];
    newPos: THREE.Vector3[] = [];
    vel: THREE.Vector3[] = [];


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
            indices.push(Math.round(Math.random() * this.gpuMesh.vertexCount));

        const indicesUniform = uniformArray(indices, "int" as const);


        const fn = Fn(() => {
            const vIndex = indicesUniform.element(instanceIndex);

            const vertex = this.gpuMesh.dynamicVertices.element(vIndex);
            const pos = vertex.get("position") as THREE.Node<"vec3">;
            const vel = vertex.get("velocity") as THREE.Node<"vec3">;
            const normal = vertex.get("normal") as THREE.Node<"vec3">;

            const result = vel;

            this.debugBuffer.element(instanceIndex).assign(vec4(result, 0));
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

    computePos(dt: number) {
        this.oldPos = this.newPos;
        const vs: THREE.Vector3[] = [];
        const vels: THREE.Vector3[] = [];
        const n = this.gpuMesh.vertexCount;
        for (let i = 0; i < n; i++) {
            const mi = this.gpuMesh.decodeVertexIndex(i);
            const v = mi.mesh.getVertexPosition(mi.index, new THREE.Vector3());
            vs.push(v);
            if (this.oldPos.length == n)
                vels.push(v.clone().sub(this.oldPos[i]).multiplyScalar(1 / dt));
        }
        this.newPos = vs;
        this.vel = vels;
    }
}