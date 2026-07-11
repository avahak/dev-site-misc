import { storage, struct, uniform } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { StorageBufferAttribute } from 'three/webgpu';

/**
 * Stores skinned mesh geometry on GPU.
 */
export class SkinnedGeometryGPU {
    static SkinnedVertexStruct = struct({
        position: 'vec3',
        normal: 'vec3',
        skinIndices: 'ivec4',
        skinWeights: 'vec4',
        uv: 'vec2',
    });
    static vertexStride: number = 5 * 4;    // Remember storage buffer alignment rules
    vertices: THREE.StorageBufferNode<"struct">;        // struct is SkinnedVertexStruct
    vertexCount: number;

    indices: THREE.StorageBufferNode<"int">;
    triangleCount: number;

    skeleton: THREE.Skeleton;
    bindMatrix: THREE.UniformNode<"mat4", THREE.Matrix4>;
    boneMatrices: THREE.StorageBufferNode<"mat4">;
    boneCount: number;
    private boneMatrixAttribute: THREE.StorageBufferAttribute;
    private boneMatrixView: Float32Array;


    constructor(obj: THREE.Object3D) {
        const meshes: THREE.SkinnedMesh[] = [];
        let skeleton: THREE.Skeleton | null = null;
        let bindMatrix: THREE.Matrix4 | null = null;
        let nVertex = 0;
        let nIndex = 0;
        obj.traverse((o) => {
            if (!(o instanceof THREE.SkinnedMesh))
                return;
            meshes.push(o);
            if (bindMatrix && (!bindMatrix.equals(o.bindMatrix)))
                throw Error("All bindMatrix:s need to be equal.");
            if (skeleton && (skeleton !== o.skeleton))
                throw Error("All SkinnedMesh:s need to share the same skeleton.");
            nVertex += o.geometry.attributes.position.count;
            nIndex += o.geometry.index.count;
            bindMatrix = o.bindMatrix;
            skeleton = o.skeleton;
        });
        if (nVertex == 0 || nIndex == 0)
            throw Error("No SkinnedMesh geometry found.");
        if (!skeleton)
            throw Error("No skeleton found.");
        this.skeleton = skeleton;

        const vertexBufferAttribute = new StorageBufferAttribute(nVertex, SkinnedGeometryGPU.vertexStride);
        const vertexRawBuffer: ArrayBuffer = vertexBufferAttribute.array.buffer as ArrayBuffer;
        const vertexFloatView = new Float32Array(vertexRawBuffer);
        const vertexIntView = new Int32Array(vertexRawBuffer);

        const indexBufferAttribute = new StorageBufferAttribute(nIndex, 1);
        const indexRawBuffer: ArrayBuffer = indexBufferAttribute.array.buffer as ArrayBuffer;
        const indexIntView = new Int32Array(indexRawBuffer);

        console.log("meshes", meshes);
        console.log("nVertex", nVertex);
        console.log("nVertex*SkinnedGeometryGPU.vertexStride*4", nVertex * SkinnedGeometryGPU.vertexStride * 4);
        console.log("vertexRawBuffer.byteLength", vertexRawBuffer.byteLength);
        console.log("nIndex", nIndex);
        console.log("nIndex*4", nIndex * 4);
        console.log("indexRawBuffer.byteLength", indexRawBuffer.byteLength);

        let vOffset = 0;
        let iOffset = 0;
        for (let i = 0; i < meshes.length; i++) {
            const attr = meshes[i].geometry.attributes;
            for (let j = 0; j < attr.position.count; j++) {
                // positions
                for (let k = 0; k < 3; k++)
                    vertexFloatView[vOffset + k] = attr.position.array[3 * j + k];
                // normals
                for (let k = 0; k < 3; k++)
                    vertexFloatView[vOffset + 4 + k] = attr.normal.array[3 * j + k];
                // skin indices
                for (let k = 0; k < 4; k++)
                    vertexIntView[vOffset + 8 + k] = attr.skinIndex.array[4 * j + k];
                // skin weights
                for (let k = 0; k < 4; k++)
                    vertexFloatView[vOffset + 12 + k] = attr.skinWeight.array[4 * j + k];
                // uv
                for (let k = 0; k < 2; k++)
                    vertexFloatView[vOffset + 16 + k] = attr.uv.array[2 * j + k];

                vOffset += SkinnedGeometryGPU.vertexStride;
            }

            // indices
            for (let j = 0; j < meshes[i].geometry.index!.count!; j++) {
                indexIntView[iOffset] = meshes[i].geometry.index!.array[j];
                iOffset++;
            }
        }

        this.vertices = storage(vertexBufferAttribute, SkinnedGeometryGPU.SkinnedVertexStruct, nVertex);
        this.indices = storage(indexBufferAttribute, "int", nIndex);
        this.vertexCount = nVertex;
        this.triangleCount = nIndex / 3;

        this.boneCount = this.skeleton.bones.length;
        console.log("this.boneCount", this.boneCount);
        this.boneMatrixAttribute = new StorageBufferAttribute(this.boneCount, 16);
        this.boneMatrices = storage(this.boneMatrixAttribute, "mat4", this.boneCount);
        this.boneMatrixView = new Float32Array(this.boneMatrixAttribute.array);

        this.bindMatrix = uniform(bindMatrix!);
    }

    /**
     * Should be called once every frame to update this.boneMatrices buffer on GPU.
     */
    updateBones() {
        // this.skeleton.update();
        this.boneMatrixView.set(this.skeleton.boneMatrices!);
        this.boneMatrixAttribute.needsUpdate = true;
    }

    dispose() {
        this.vertices.dispose();
        this.indices.dispose();
        this.boneMatrices.dispose();
    }
}