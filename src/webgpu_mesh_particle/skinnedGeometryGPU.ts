import * as THREE from 'three/webgpu';
import { StorageBufferAttribute } from 'three/webgpu';
import { storage, struct, uniform } from 'three/tsl';

/**
 * Stores skinned mesh geometry on GPU. Everything other than matrixBuffer is static.
 */
export class SkinnedGeometryGPU {
    meshes: THREE.SkinnedMesh[];
    static SkinnedVertexStruct = struct({
        position: 'vec3',
        normal: 'vec3',
        skinIndices: 'ivec4',
        skinWeights: 'vec4',
        uv: 'vec2',
        bindMatrixIndices: 'ivec2',        // (index for bindMatrix, index for bindMatrixInverse), indices refer to matrixBuffer
    });
    static vertexStride: number = 5 * 4;    // Remember storage buffer alignment rules
    vertices: THREE.StorageBufferNode<"struct">;        // struct is SkinnedVertexStruct
    vertexCount: number;

    indices: THREE.StorageBufferNode<"int">;
    triangleCount: number;

    skeleton: THREE.Skeleton;
    boneCount: number;
    matrixBuffer: THREE.StorageBufferNode<"mat4">;  // (...boneMatrices, ...bindMatrices(and inverses))
    private matrixBufferAttribute: THREE.StorageBufferAttribute;
    private matrixBufferView: Float32Array;


    constructor(baseObj: THREE.Object3D) {
        this.meshes = [];
        let skeleton: THREE.Skeleton | null = null;
        let nVertex = 0;
        let nIndex = 0;
        baseObj.traverse((obj) => {
            if (!(obj instanceof THREE.SkinnedMesh))
                return;
            if (skeleton && (skeleton !== obj.skeleton))
                throw Error("All SkinnedMesh:s need to share the same skeleton.");
            skeleton = obj.skeleton;
            nVertex += obj.geometry.attributes.position.count;
            nIndex += obj.geometry.index.count;
            this.meshes.push(obj);
        });
        if (nVertex == 0 || nIndex == 0)
            throw Error("No SkinnedMesh geometry found.");

        this.skeleton = skeleton!;
        this.boneCount = this.skeleton.bones.length;

        const vertexBufferAttribute = new StorageBufferAttribute(nVertex, SkinnedGeometryGPU.vertexStride);
        const vertexRawBuffer: ArrayBuffer = vertexBufferAttribute.array.buffer as ArrayBuffer;
        const vertexFloatView = new Float32Array(vertexRawBuffer);
        const vertexIntView = new Int32Array(vertexRawBuffer);

        const indexBufferAttribute = new StorageBufferAttribute(nIndex, 1);
        const indexRawBuffer: ArrayBuffer = indexBufferAttribute.array.buffer as ArrayBuffer;
        const indexIntView = new Int32Array(indexRawBuffer);

        console.log("this.boneCount", this.boneCount);
        console.log("this.meshes", this.meshes);
        console.log("nVertex", nVertex);
        console.log("nVertex*SkinnedGeometryGPU.vertexStride*4", nVertex * SkinnedGeometryGPU.vertexStride * 4);
        console.log("vertexRawBuffer.byteLength", vertexRawBuffer.byteLength);
        console.log("nIndex", nIndex);
        console.log("nIndex*4", nIndex * 4);
        console.log("indexRawBuffer.byteLength", indexRawBuffer.byteLength);

        let vOffset = 0;
        let iOffset = 0;
        for (let i = 0; i < this.meshes.length; i++) {
            const vIndexStart = vOffset / SkinnedGeometryGPU.vertexStride;
            const attr = this.meshes[i].geometry.attributes;
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
                // bindMatrixIndices
                for (let k = 0; k < 2; k++)
                    vertexIntView[vOffset + 18 + k] = this.boneCount + 2 * i + k;

                vOffset += SkinnedGeometryGPU.vertexStride;
            }

            // indices
            for (let j = 0; j < this.meshes[i].geometry.index!.count; j++) {
                indexIntView[iOffset] = vIndexStart + this.meshes[i].geometry.index!.array[j];
                iOffset++;
            }
        }

        this.vertices = storage(vertexBufferAttribute, SkinnedGeometryGPU.SkinnedVertexStruct, nVertex);
        this.indices = storage(indexBufferAttribute, "int", nIndex);
        this.vertexCount = nVertex;
        this.triangleCount = nIndex / 3;

        // Create 1 matrix for each bone and 2 matrices for each mesh to store its bindMatrix,bindMatrixInverse
        const nMatrix = this.boneCount + 2 * this.meshes.length;
        this.matrixBufferAttribute = new StorageBufferAttribute(nMatrix, 16);
        this.matrixBuffer = storage(this.matrixBufferAttribute, "mat4", nMatrix);
        this.matrixBufferView = this.matrixBufferAttribute.array as Float32Array;
    }

    /**
     * Takes in index used by `indices` and returns corresponding mesh and index within that mesh.
     */
    decodeIndex(index: number): { mesh: THREE.SkinnedMesh, index: number } {
        let i = 0;
        let indexStart = 0;
        while (i < this.meshes.length) {
            const n = this.meshes[i].geometry.index!.count;
            if (indexStart + n > index)
                break;
            indexStart += n;
            i++;
        }
        return { mesh: this.meshes[i], index: index - indexStart };
    }

    /**
     * Should be called once every frame to update `matrixBuffer` on GPU.
     */
    updateBones() {
        // this.skeleton.update();
        this.matrixBufferView.set(this.skeleton.boneMatrices!);
        for (let i = 0; i < this.meshes.length; i++) {
            const offset = (this.boneCount + 2 * i) * 16;
            this.matrixBufferView.set([...this.meshes[i].bindMatrix.elements], offset);
            this.matrixBufferView.set([...this.meshes[i].bindMatrixInverse.elements], offset + 16)
        }
        this.matrixBufferAttribute.needsUpdate = true;
    }

    dispose() {
        this.meshes = [];
        this.vertices.dispose();
        this.indices.dispose();
        this.matrixBuffer.dispose();
    }
}