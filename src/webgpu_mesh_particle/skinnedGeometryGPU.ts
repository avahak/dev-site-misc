import * as THREE from 'three/webgpu';
import { StorageBufferAttribute } from 'three/webgpu';
import { Fn, instanceIndex, select, storage, struct, vec3, vec4 } from 'three/tsl';

/**
 * Stores skinned mesh geometry on GPU. Everything other than matrixBuffer is static.
 * 
 * TODO store dynamic vertex pos, normal, vel(finite difference)
 */
export class SkinnedGeometryGPU {
    baseObj: THREE.Object3D;
    meshes: THREE.SkinnedMesh[];
    skeleton: THREE.Skeleton;
    vertexCount: number;
    triangleCount: number;
    boneCount: number;

    static BaseLayout = struct({
        position: 'vec3',
        normal: 'vec3',
        uv: 'vec2',
    });
    static BaseStride: number = 3 * 4;    // Careful with storage buffer alignment rules!
    baseBuffer: THREE.StorageBufferNode<"struct">;

    static SkinLayout = struct({
        skinIndices: 'ivec4',
        skinWeights: 'vec4',
        bindTransformIndex: 'uint',     // index in matrixBuffer for bindMatrix, and bindMatrixInverse is always next
    });
    static SkinStride: number = 3 * 4;
    skinBuffer: THREE.StorageBufferNode<"struct">;

    static DynamicLayout = struct({
        position: 'vec3',
        velocity: 'vec3',
        normal: 'vec3',
    });
    static DynamicStride: number = 3 * 4;
    dynamicBuffer: THREE.StorageBufferNode<"struct">;

    /** Indexing for triangle vertices, always 3 per triangle */
    indexBuffer: THREE.StorageBufferNode<"uint">;
    areaBuffer: THREE.StorageBufferNode<"float"> | null = null;

    /** (...boneMatrices, ...bindMatrices(and each inverse directly next)) */
    skinMatrixBuffer: THREE.StorageBufferNode<"mat4">;
    private skinMatrixAttribute: THREE.StorageBufferAttribute;
    private skinMatrixFloats: Float32Array;

    updateDynamicBuffer!: THREE.ComputeNode;
    /** Computed from static mesh so only should be done once */
    computeAreas!: THREE.ComputeNode;


    constructor(baseObj: THREE.Object3D, time: THREE.UniformArrayNode<"float">) {
        this.baseObj = baseObj;
        this.meshes = [];
        let skeleton: THREE.Skeleton | null = null;
        this.vertexCount = 0;
        this.triangleCount = 0;
        baseObj.traverse((obj) => {
            if (!(obj instanceof THREE.SkinnedMesh))
                return;
            if (skeleton && (skeleton !== obj.skeleton))
                throw Error("All SkinnedMesh:s need to share the same skeleton.");
            skeleton = obj.skeleton;
            this.vertexCount += obj.geometry.attributes.position.count;
            this.triangleCount += obj.geometry.index.count / 3;
            this.meshes.push(obj);
        });
        if (this.vertexCount == 0 || this.triangleCount == 0)
            throw Error("No SkinnedMesh geometry found.");

        this.skeleton = skeleton!;
        this.boneCount = this.skeleton.bones.length;

        const baseAttribute = new StorageBufferAttribute(this.vertexCount, SkinnedGeometryGPU.BaseStride);
        this.baseBuffer = storage(baseAttribute, SkinnedGeometryGPU.BaseLayout, this.vertexCount);

        const baseRawBuffer: ArrayBuffer = baseAttribute.array.buffer as ArrayBuffer;
        const baseFloats = new Float32Array(baseRawBuffer);

        const skinAttribute = new StorageBufferAttribute(this.vertexCount, SkinnedGeometryGPU.SkinStride);
        this.skinBuffer = storage(skinAttribute, SkinnedGeometryGPU.SkinLayout, this.vertexCount);
        const skinRawBuffer: ArrayBuffer = skinAttribute.array.buffer as ArrayBuffer;
        const skinFloats = new Float32Array(skinRawBuffer);
        const skinInts = new Int32Array(skinRawBuffer);

        const indexAttribute = new StorageBufferAttribute(this.triangleCount, 1);
        this.indexBuffer = storage(indexAttribute, "uint", this.triangleCount);
        const indexRawBuffer: ArrayBuffer = indexAttribute.array.buffer as ArrayBuffer;
        const indexInts = new Int32Array(indexRawBuffer);

        const dynamicBufferAttribute = new StorageBufferAttribute(this.vertexCount, SkinnedGeometryGPU.DynamicStride);
        this.dynamicBuffer = storage(dynamicBufferAttribute, SkinnedGeometryGPU.DynamicLayout, this.vertexCount);

        // Create 1 matrix for each bone and 2 matrices for each mesh to store its bindMatrix,bindMatrixInverse
        const skinMatrixCount = this.boneCount + 2 * this.meshes.length;
        this.skinMatrixAttribute = new StorageBufferAttribute(skinMatrixCount, 16);
        this.skinMatrixBuffer = storage(this.skinMatrixAttribute, "mat4", skinMatrixCount);
        this.skinMatrixFloats = this.skinMatrixAttribute.array as Float32Array;


        let vIndex = 0;
        let tIndex = 0;
        for (let i = 0; i < this.meshes.length; i++) {
            const indexStart = vIndex;
            const attr = this.meshes[i].geometry.attributes;
            for (let j = 0; j < attr.position.count; j++) {
                const vGeometryOffset = vIndex * SkinnedGeometryGPU.BaseStride;
                const vSkinningOffset = vIndex * SkinnedGeometryGPU.SkinStride;
                // positions
                for (let k = 0; k < 3; k++)
                    baseFloats[vGeometryOffset + k] = attr.position.getComponent(j, k);
                // normals
                for (let k = 0; k < 3; k++)
                    baseFloats[vGeometryOffset + 4 + k] = attr.normal.getComponent(j, k);
                // uv
                for (let k = 0; k < 2; k++)
                    baseFloats[vGeometryOffset + 8 + k] = attr.uv.getComponent(j, k);
                // skin indices
                for (let k = 0; k < 4; k++)
                    skinInts[vSkinningOffset + k] = attr.skinIndex.getComponent(j, k);
                // skin weights
                for (let k = 0; k < 4; k++)
                    skinFloats[vSkinningOffset + 4 + k] = attr.skinWeight.getComponent(j, k);
                // bindTransformIndex
                skinInts[vSkinningOffset + 8] = this.boneCount + 2 * i;

                vIndex++;
            }

            // indices
            for (let j = 0; j < this.meshes[i].geometry.index!.count; j++) {
                indexInts[tIndex] = indexStart + this.meshes[i].geometry.index!.array[j];
                tIndex++;
            }
        }

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
        this.baseObj.updateMatrixWorld(true);       // updates bones' matrixWorld
        this.skeleton.update();

        this.skinMatrixFloats.set(this.skeleton.boneMatrices!);
        for (let i = 0; i < this.meshes.length; i++) {
            const offset = (this.boneCount + 2 * i) * 16;
            this.skinMatrixFloats.set([...this.meshes[i].bindMatrix.elements], offset);
            this.skinMatrixFloats.set([...this.meshes[i].bindMatrixInverse.elements], offset + 16)
        }
        this.skinMatrixAttribute.needsUpdate = true;
    }


    createComputeNodes(time: THREE.UniformArrayNode<"float">) {
        this.updateDynamicBuffer = Fn(() => {
            const baseVertex = this.baseBuffer.element(instanceIndex);
            const skinVertex = this.skinBuffer.element(instanceIndex);
            const pos0 = baseVertex.get("position") as THREE.Node<"vec3">;
            const normal0 = baseVertex.get("normal") as THREE.Node<"vec3">;
            const iSkin = (skinVertex.get("skinIndices") as THREE.Node<"ivec4">).toVar();
            const wSkin = (skinVertex.get("skinWeights") as THREE.Node<"vec4">).toVar();
            const bindTransformIndex = skinVertex.get("bindTransformIndex") as THREE.Node<"uint">;
            const bindMatrix = this.skinMatrixBuffer.element(bindTransformIndex);
            const bindMatrixInverse = this.skinMatrixBuffer.element(bindTransformIndex.add(1));

            const boneMatrix1 = this.skinMatrixBuffer.element(iSkin.x).mul(wSkin.x);
            const boneMatrix2 = this.skinMatrixBuffer.element(iSkin.y).mul(wSkin.y);
            const boneMatrix3 = this.skinMatrixBuffer.element(iSkin.z).mul(wSkin.z);
            const boneMatrix4 = this.skinMatrixBuffer.element(iSkin.w).mul(wSkin.w);
            const bm = boneMatrix1.add(boneMatrix2).add(boneMatrix3).add(boneMatrix4);
            const matrix4 = bindMatrixInverse.mul(bm).mul(bindMatrix).toVar();

            const newPos = matrix4.mul(vec4(pos0, 1)).xyz.toVar();

            const matrix3 = matrix4.toMat3().toVar();
            // Correct new normal is normalize(adj(M)^{-T} normal0):
            const newNormal = matrix3.inverse().mul(matrix3.determinant()).transpose().mul(normal0).normalize();
            // NOTE: Often people just use normalize(M normal0) since typically M is close to rotation:
            // const newNormal = matrix3.mul(normal0).normalize();

            const vertex = this.dynamicBuffer.element(instanceIndex);
            const pos = vertex.get("position") as THREE.Node<"vec3">;

            const dt = time.element(1);
            const vel = newPos.sub(pos).div(dt);

            vertex.get("velocity").assign(select(dt.greaterThan(0), vel, vec3(0)));
            pos.assign(newPos);
            vertex.get("normal").assign(newNormal);
        })().compute(this.vertexCount);


        this.computeAreas = Fn(() => {
            // ...
        })().compute(this.triangleCount);
    }


    dispose() {
        this.baseBuffer.dispose();
        this.skinBuffer.dispose();
        this.dynamicBuffer.dispose();
        this.skinMatrixBuffer.dispose();
        this.indexBuffer.dispose();
        this.areaBuffer?.dispose();
    }
}