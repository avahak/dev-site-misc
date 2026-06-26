/**
 * - wood veneer
 * - plywood
 * - Herringbone parquet
 * 
 * - ???
 * - End-Grain Butcher Blocks
 * - Cross-Laminated Timber (CLT) & Glulam
 * - Finger-Jointed & Scarf-Jointed Lumber
 * - Lathe-Turned Wood (Bowls, Spindles, & Balusters)
 * - Steam-Bent Wood (Bentwood)
 */

import * as THREE from 'three';
import { resolveShaderChunk } from './shaderImport';
import { RenderManager as SolidRenderManager } from './solidManager';
import { WoodExtension } from './woodExtension';
import { NoiseExtension } from './noiseExtension';
import { DebugExtension } from './debugExtension';


export class WoodScene extends THREE.Scene {

    veneerSize: THREE.Vector3;
    veneerMaterial: THREE.ShaderMaterial;

    plywoodSize: THREE.Vector3;
    plywoodMaterial: THREE.ShaderMaterial;

    parquetSize: THREE.Vector2;
    parquetMaterial: THREE.ShaderMaterial;



    constructor(shaderChunks: Record<string, string>, woodExtension: WoodExtension, noiseExtension: NoiseExtension, debugExtension: DebugExtension) {
        super();


        // Veneer

        this.veneerSize = new THREE.Vector3(100, 2, 0.05);

        const numSegments = 128;
        this.veneerMaterial = new THREE.ShaderMaterial({
            uniforms: {
                phase: { value: 50 },        // unrolled-rolled up
                size: { value: this.veneerSize },
                gap: { value: 0.0 },
                numSegments: { value: numSegments },

                // time: { value: null },
            },
            vertexShader: resolveShaderChunk("vsVeneer", shaderChunks),
            fragmentShader: resolveShaderChunk("fsVeneer", shaderChunks),
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });
        woodExtension.addToShaderMaterial(this.veneerMaterial);
        noiseExtension.addToShaderMaterial(this.veneerMaterial);
        debugExtension.addToShaderMaterial(this.veneerMaterial);


        const veneerCylinder = WoodScene.createVeneerCylinder(numSegments, true);
        const veneerMesh = new THREE.Mesh(veneerCylinder, this.veneerMaterial);
        veneerMesh.frustumCulled = false;   // We modify vertex positions in shader
        this.add(veneerMesh);
        veneerMesh.rotateX(Math.PI / 2);
        veneerMesh.rotateY(Math.PI);
        veneerMesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -1);


        // Plywood

        this.plywoodSize = new THREE.Vector3(1, 1, 0.4);

        this.plywoodMaterial = new THREE.ShaderMaterial({
            uniforms: {
                size: { value: this.plywoodSize },
                numLayers: { value: 21 },       // Number of plys, always odd number

                // time: { value: null },
            },
            vertexShader: resolveShaderChunk("vsPlywood", shaderChunks),
            fragmentShader: resolveShaderChunk("fsPlywood", shaderChunks),
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });
        woodExtension.addToShaderMaterial(this.plywoodMaterial);
        noiseExtension.addToShaderMaterial(this.plywoodMaterial);
        debugExtension.addToShaderMaterial(this.plywoodMaterial);

        const plywoodBox = new THREE.BoxGeometry(this.plywoodSize.x, this.plywoodSize.y, this.plywoodSize.z);
        plywoodBox.translate(this.plywoodSize.x / 2, this.plywoodSize.y / 2, this.plywoodSize.z / 2);
        const plywoodMesh = new THREE.Mesh(plywoodBox, this.plywoodMaterial);
        this.add(plywoodMesh);
        plywoodMesh.position.set(2, 0, 1);


        // Herringbone parquet

        this.parquetSize = new THREE.Vector2(4, 0.1);

        this.parquetMaterial = new THREE.ShaderMaterial({
            uniforms: {
                size: { value: this.parquetSize },

                time: { value: 0 },
            },
            vertexShader: resolveShaderChunk("vsParquet", shaderChunks),
            fragmentShader: resolveShaderChunk("fsParquet", shaderChunks),
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });
        woodExtension.addToShaderMaterial(this.parquetMaterial);
        noiseExtension.addToShaderMaterial(this.parquetMaterial);
        debugExtension.addToShaderMaterial(this.parquetMaterial);

        const parquetBox = new THREE.BoxGeometry(20, 20, 0.1);
        const parquetMesh = new THREE.Mesh(parquetBox, this.parquetMaterial);
        this.add(parquetMesh);
    }


    /**
     * Cylinder topology but with fans anchored at index 0 of each cap. Position encodes
     * indexing of vertices with position.x being index around, position.y tells if triangle 
     * belongs to spiral or flat part, and index.z coding bottom/top. 
     * NOTE: Uses nonindexed geometry because of position.y. This is inefficient.
     */
    static createVeneerCylinder(numSegments: number, invert: boolean = false): THREE.BufferGeometry {
        const geometry = new THREE.BufferGeometry();
        const vertexData: number[] = [];

        const addTriangle = (x1: number, z1: number, x2: number, z2: number, x3: number, z3: number) => {
            const isTarget1 = x1 === numSegments - 1 || x1 === numSegments - 2;
            const isTarget2 = x2 === numSegments - 1 || x2 === numSegments - 2;
            const isTarget3 = x3 === numSegments - 1 || x3 === numSegments - 2;
            const isTarget = isTarget1 || isTarget2 || isTarget3;   // Used for separating spiral, flat part triangles

            const yVal = isTarget ? 1 : 0;

            vertexData.push(
                x1, yVal, z1,
                invert ? x3 : x2, yVal, invert ? z3 : z2,
                invert ? x2 : x3, yVal, invert ? z2 : z3,
            );
        };

        for (let i = 0; i < numSegments; i++) {
            const next = (i + 1) % numSegments;

            // side walls (tube)
            addTriangle(i, 0, next, 0, i, 1);
            addTriangle(i, 1, next, 0, next, 1);

            // caps: triangulate fans anchored at index 0 of each cap
            if (i >= 1 && i < numSegments - 1) {
                addTriangle(0, 0, i + 1, 0, i, 0);       // bottom cap
                addTriangle(0, 1, i, 1, i + 1, 1);       // top cap
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertexData), 3));
        return geometry;
    }


    prepareRender(solidRenderManager: SolidRenderManager) {
        this.veneerMaterial.uniforms.phase.value = (0.5 + 0.5 * Math.sin(2 * solidRenderManager.lastTime)) * this.veneerSize.x;
        this.parquetMaterial.uniforms.time.value = solidRenderManager.lastTime;
    }
}