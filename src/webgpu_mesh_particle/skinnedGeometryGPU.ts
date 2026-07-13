import * as THREE from 'three/webgpu';
import { StorageBufferAttribute } from 'three/webgpu';
import { Fn, If, instanceIndex, mat3, select, storage, struct, vec3, vec4 } from 'three/tsl';

/**
 * Stores skinned mesh geometry on GPU. Everything other than matrixBuffer is static.
 * 
 * TODO store dynamic vertex pos, normal, vel(finite difference)
 */
export class SkinnedGeometryGPU {
    meshes: THREE.SkinnedMesh[];
    static StaticVertexStruct = struct({
        position: 'vec3',
        normal: 'vec3',
        skinIndices: 'ivec4',
        skinWeights: 'vec4',
        uv: 'vec2',
        bindTransformIndex: 'uint',     // index in matrixBuffer for bindMatrix, and bindMatrixInverse is always next
    });
    static DynamicVertexStruct = struct({
        position: 'vec3',
        velocity: 'vec3',
        normal: 'vec3',
    });
    static staticVertexStride: number = 5 * 4;    // Careful with storage buffer alignment rules!
    static dynamicVertexStride: number = 3 * 4;

    staticVertices: THREE.StorageBufferNode<"struct">;      // StaticVertexStruct
    dynamicVertices: THREE.StorageBufferNode<"struct">;     // DynamicVertexStruct
    vertexCount: number;

    dynamicVertexBufferAttribute: THREE.StorageBufferAttribute;     // here just for debugging!

    indices: THREE.StorageBufferNode<"int">;
    triangleCount: number;

    skeleton: THREE.Skeleton;
    boneCount: number;
    matrixBuffer: THREE.StorageBufferNode<"mat4">;  // (...boneMatrices, ...bindMatrices(and inverses))
    private matrixBufferAttribute: THREE.StorageBufferAttribute;
    private matrixBufferView: Float32Array;

    updateDynamicVertices!: THREE.ComputeNode;


    constructor(baseObj: THREE.Object3D, time: THREE.UniformArrayNode<"float">) {
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

        const staticVertexBufferAttribute = new StorageBufferAttribute(nVertex, SkinnedGeometryGPU.staticVertexStride);
        const vertexRawBuffer: ArrayBuffer = staticVertexBufferAttribute.array.buffer as ArrayBuffer;
        const vertexFloatView = new Float32Array(vertexRawBuffer);
        const vertexIntView = new Int32Array(vertexRawBuffer);

        const indexBufferAttribute = new StorageBufferAttribute(nIndex, 1);
        const indexRawBuffer: ArrayBuffer = indexBufferAttribute.array.buffer as ArrayBuffer;
        const indexIntView = new Int32Array(indexRawBuffer);

        console.log("this.boneCount", this.boneCount);
        console.log("this.meshes", this.meshes);
        console.log("nVertex", nVertex);
        console.log("nVertex*SkinnedGeometryGPU.vertexStride*4", nVertex * SkinnedGeometryGPU.staticVertexStride * 4);
        console.log("vertexRawBuffer.byteLength", vertexRawBuffer.byteLength);
        console.log("nIndex", nIndex);
        console.log("nIndex*4", nIndex * 4);
        console.log("indexRawBuffer.byteLength", indexRawBuffer.byteLength);

        let vOffset = 0;
        let iOffset = 0;
        for (let i = 0; i < this.meshes.length; i++) {
            const vIndexStart = vOffset / SkinnedGeometryGPU.staticVertexStride;
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
                // bindTransformIndex
                vertexIntView[vOffset + 18] = this.boneCount + 2 * i;

                vOffset += SkinnedGeometryGPU.staticVertexStride;
            }

            // indices
            for (let j = 0; j < this.meshes[i].geometry.index!.count; j++) {
                indexIntView[iOffset] = vIndexStart + this.meshes[i].geometry.index!.array[j];
                iOffset++;
            }
        }

        this.staticVertices = storage(staticVertexBufferAttribute, SkinnedGeometryGPU.StaticVertexStruct, nVertex);
        this.indices = storage(indexBufferAttribute, "int", nIndex);
        this.vertexCount = nVertex;
        this.triangleCount = nIndex / 3;

        this.dynamicVertexBufferAttribute = new StorageBufferAttribute(nVertex, SkinnedGeometryGPU.dynamicVertexStride);
        this.dynamicVertices = storage(this.dynamicVertexBufferAttribute, SkinnedGeometryGPU.DynamicVertexStruct, nVertex);

        // Create 1 matrix for each bone and 2 matrices for each mesh to store its bindMatrix,bindMatrixInverse
        const nMatrix = this.boneCount + 2 * this.meshes.length;
        this.matrixBufferAttribute = new StorageBufferAttribute(nMatrix, 16);
        this.matrixBuffer = storage(this.matrixBufferAttribute, "mat4", nMatrix);
        this.matrixBufferView = this.matrixBufferAttribute.array as Float32Array;

        this.createComputeNodes(time);
    }

    /**
     * Takes in index used by `indices` and returns corresponding mesh and index index within that mesh.
     */
    decodeIndexIndex(index: number): { mesh: THREE.SkinnedMesh, index: number } {
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
     * Takes in index used by `vertices` and returns corresponding mesh and vertex index within that mesh.
     */
    decodeVertexIndex(index: number): { mesh: THREE.SkinnedMesh, index: number } {
        let i = 0;
        let indexStart = 0;
        while (i < this.meshes.length) {
            const n = this.meshes[i].geometry.attributes.position.count;
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
        this.skeleton.update();
        this.matrixBufferView.set(this.skeleton.boneMatrices!);
        for (let i = 0; i < this.meshes.length; i++) {
            const offset = (this.boneCount + 2 * i) * 16;
            this.matrixBufferView.set([...this.meshes[i].bindMatrix.elements], offset);
            this.matrixBufferView.set([...this.meshes[i].bindMatrixInverse.elements], offset + 16)
        }
        this.matrixBufferAttribute.needsUpdate = true;
    }


    createComputeNodes(time: THREE.UniformArrayNode<"float">) {
        this.updateDynamicVertices = Fn(() => {
            const vertex0 = this.staticVertices.element(instanceIndex);
            const pos0 = vertex0.get("position") as THREE.Node<"vec3">;
            const normal0 = vertex0.get("normal") as THREE.Node<"vec3">;
            const iSkin = (vertex0.get("skinIndices") as THREE.Node<"ivec4">).toVar();
            const wSkin = (vertex0.get("skinWeights") as THREE.Node<"vec4">).toVar();
            const bindTransformIndex = vertex0.get("bindTransformIndex") as THREE.Node<"uint">;
            const bindMatrix = this.matrixBuffer.element(bindTransformIndex);
            const bindMatrixInverse = this.matrixBuffer.element(bindTransformIndex.add(1));

            // const pos = bindMatrix.mul(pos0).toVar();
            // const boneMatrix1 = this.matrixBuffer.element(iSkin.x);
            // const term1 = boneMatrix1.mul(pos).mul(wSkin.x);
            // const boneMatrix2 = this.matrixBuffer.element(iSkin.y);
            // const term2 = boneMatrix2.mul(pos).mul(wSkin.y);
            // const boneMatrix3 = this.matrixBuffer.element(iSkin.z);
            // const term3 = boneMatrix3.mul(pos).mul(wSkin.z);
            // const boneMatrix4 = this.matrixBuffer.element(iSkin.w);
            // const term4 = boneMatrix4.mul(pos).mul(wSkin.w);
            // const result = term1.add(term2).add(term3).add(term4);
            // const resultModel = bindMatrixInverse.mul(result);

            const boneMatrix1 = this.matrixBuffer.element(iSkin.x).mul(wSkin.x);
            const boneMatrix2 = this.matrixBuffer.element(iSkin.y).mul(wSkin.y);
            const boneMatrix3 = this.matrixBuffer.element(iSkin.z).mul(wSkin.z);
            const boneMatrix4 = this.matrixBuffer.element(iSkin.w).mul(wSkin.w);
            const bm = boneMatrix1.add(boneMatrix2).add(boneMatrix3).add(boneMatrix4);
            const matrix4 = bindMatrixInverse.mul(bm).mul(bindMatrix).toVar();

            const newPos = matrix4.mul(vec4(pos0, 1)).xyz;

            const matrix3 = matrix4.toMat3().toVar();
            // Correct new normal is normalize(adj(M)^{-T} normal0):
            const newNormal = matrix3.inverse().mul(matrix3.determinant()).transpose().mul(normal0).normalize();
            // NOTE: Often people just use normalize(M normal0) since typically M is close to rotation:
            // const newNormal = matrix3.mul(normal0).normalize();

            const vertex = this.dynamicVertices.element(instanceIndex);
            const pos = vertex.get("position") as THREE.Node<"vec3">;

            const dt = time.element(1).toVar();
            const vel = newPos.sub(pos).div(dt);

            vertex.get("velocity").assign(select(dt.greaterThan(0), vel, vec3(0)));
            pos.assign(newPos);
            vertex.get("normal").assign(newNormal);
        })().compute(this.vertexCount);
    }


    dispose() {
        this.meshes = [];
        this.staticVertices.dispose();
        this.indices.dispose();
        this.matrixBuffer.dispose();
    }
}