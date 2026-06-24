/**
 * - wood veneer
 * - plywood
 * - Herringbone parquet
 */

import * as THREE from 'three';
import { resolveShaderChunk } from './shaderImport';
import { RenderManager as SolidRenderManager } from './solidManager';


export class WoodScene extends THREE.Scene {

    veneerSize: THREE.Vector3;
    veneerMaterial: THREE.ShaderMaterial;

    plywoodSize: THREE.Vector3;
    plywoodMaterial: THREE.ShaderMaterial;


    constructor(solidRenderManager: SolidRenderManager, shaderChunks: Record<string, string>) {
        super();

        // Veneer

        this.veneerSize = new THREE.Vector3(200, 4, 0.01);

        this.veneerMaterial = new THREE.ShaderMaterial({
            uniforms: {
                phase: { value: 50 },        // unrolled-rolled up
                size: { value: this.veneerSize },
                gap: { value: 0.0 },

                // time: { value: null },

                noiseTexture: { value: solidRenderManager.noise3d },
                branchIndexTex: { value: solidRenderManager.setupRT.textures[0] },
                profileTexture: { value: solidRenderManager.profileTexture },

                knotColor: { value: new THREE.Vector3(0.2, 0.2, 0.15) },

                debug1: { value: 0.2 },
                debug2: { value: 0.2 },
                debug3: { value: 0.5 },
                debug4: { value: 0.2 },
                debug5: { value: 0.0 },
                debug6: { value: 0.0 },
                debug7: { value: 0.0 },
                debug8: { value: 0.0 },
            },
            vertexShader: resolveShaderChunk("vsVeneer", shaderChunks),
            fragmentShader: resolveShaderChunk("fsVeneer", shaderChunks),
            uniformsGroups: [solidRenderManager.globalUBO],
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        const m = Math.round(500 * this.veneerSize.x);
        const veneerBox = new THREE.BoxGeometry(this.veneerSize.x, this.veneerSize.y, this.veneerSize.z, m, 1, 1);
        veneerBox.translate(this.veneerSize.x / 2, this.veneerSize.y / 2, this.veneerSize.z / 2);
        const veneerMesh = new THREE.Mesh(veneerBox, this.veneerMaterial);
        veneerMesh.frustumCulled = false;   // We modify vertex positions in shader
        this.add(veneerMesh);


        // Plywood

        this.plywoodSize = new THREE.Vector3(1, 1, 0.4);

        this.plywoodMaterial = new THREE.ShaderMaterial({
            uniforms: {
                size: { value: this.plywoodSize },
                numLayers: { value: 21 },       // Number of plys, always odd number

                // time: { value: null },

                noiseTexture: { value: solidRenderManager.noise3d },
                branchIndexTex: { value: solidRenderManager.setupRT.textures[0] },
                profileTexture: { value: solidRenderManager.profileTexture },

                knotColor: { value: new THREE.Vector3(0.2, 0.2, 0.15) },

                debug1: { value: 0.2 },
                debug2: { value: 0.2 },
                debug3: { value: 0.5 },
                debug4: { value: 0.2 },
                debug5: { value: 0.0 },
                debug6: { value: 0.0 },
                debug7: { value: 0.0 },
                debug8: { value: 0.0 },
            },
            vertexShader: resolveShaderChunk("vsPlywood", shaderChunks),
            fragmentShader: resolveShaderChunk("fsPlywood", shaderChunks),
            uniformsGroups: [solidRenderManager.globalUBO],
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        const plywoodBox = new THREE.BoxGeometry(this.plywoodSize.x, this.plywoodSize.y, this.plywoodSize.z, m, 1, 1);
        plywoodBox.translate(this.plywoodSize.x / 2, this.plywoodSize.y / 2, this.plywoodSize.z / 2);
        const plywoodMesh = new THREE.Mesh(plywoodBox, this.plywoodMaterial);
        this.add(plywoodMesh);
    }

    prepareRender(solidRenderManager: SolidRenderManager) {
        this.veneerMaterial.uniforms.phase.value = (0.5 + 0.5 * Math.sin(solidRenderManager.lastTime)) * this.veneerSize.x;
    }
}