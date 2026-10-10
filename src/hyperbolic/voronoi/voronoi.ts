import * as THREE from 'three';
import { FundamentalPolygon, GroupElement } from '../types';
import { generateBaseSeeds, filterAndExpandSeeds, createSeedDataTexture, SeedDataResult } from './seeds';
import voronoiOffscreenVs from './shaders/vs.glsl?raw';
import voronoiOffscreenFs from './shaders/fs_voronoi.glsl?raw';

export class VoronoiPipeline {
    private renderTarget: THREE.WebGLRenderTarget;
    private offscreenScene: THREE.Scene;
    private offscreenCamera: THREE.OrthographicCamera;
    private offscreenMaterial: THREE.ShaderMaterial;
    private quadMesh: THREE.Mesh;

    public R_tex = 0.5;

    constructor(resolution = 1024) {
        this.renderTarget = new THREE.WebGLRenderTarget(resolution, resolution, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
        });

        this.offscreenScene = new THREE.Scene();
        this.offscreenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.offscreenCamera.position.set(0, 0, 1);

        this.offscreenMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_seedData: { value: null },
                u_seedCount: { value: 0 },
                u_R_tex: { value: 0.5 },
            },
            vertexShader: voronoiOffscreenVs,
            fragmentShader: voronoiOffscreenFs,
            depthTest: false,
            depthWrite: false,
            // glslVersion: THREE.GLSL3,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        this.quadMesh = new THREE.Mesh(geometry, this.offscreenMaterial);
        this.offscreenScene.add(this.quadMesh);
    }

    public updateBaseTexture(
        renderer: THREE.WebGLRenderer,
        polygon: FundamentalPolygon,
        subgroup: GroupElement[],
        seedCount = 100,
        margin = 0.25,
        prominence = 0.7
    ): { texture: THREE.Texture; R_tex: number } {
        const baseSeeds = generateBaseSeeds(polygon, seedCount, prominence);
        const { expandedSeeds, R_tex } = filterAndExpandSeeds(baseSeeds, subgroup, polygon, margin);
        const seedResult: SeedDataResult = createSeedDataTexture(expandedSeeds, R_tex, margin);

        this.R_tex = R_tex;

        this.offscreenMaterial.uniforms.u_seedData.value = seedResult.dataTexture;
        this.offscreenMaterial.uniforms.u_seedCount.value = seedResult.seedCount;
        this.offscreenMaterial.uniforms.u_R_tex.value = R_tex;

        const currentRenderTarget = renderer.getRenderTarget();
        renderer.setRenderTarget(this.renderTarget);
        renderer.clear();
        renderer.render(this.offscreenScene, this.offscreenCamera);
        renderer.setRenderTarget(currentRenderTarget);

        return {
            texture: this.renderTarget.texture,
            R_tex,
        };
    }

    public getTexture(): THREE.Texture {
        return this.renderTarget.texture;
    }

    public dispose(): void {
        this.renderTarget.dispose();
        this.offscreenMaterial.dispose();
        this.quadMesh.geometry.dispose();
    }
}