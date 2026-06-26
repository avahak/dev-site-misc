import * as THREE from 'three';
import { WoodSetup } from './woodSetup';
import { computeStats, Stats } from './utils/misc';
import { resolveShaderChunk } from './shaderImport';
import { NoiseExtension } from './noiseExtension';

/**
 * Global uniforms for the viewer scene.
 */
export interface SolidSceneuniforms {
    zRange: THREE.Uniform<number>;
    numBranches: THREE.Uniform<number>;
    branchesZASD: THREE.Uniform<THREE.Vector4>[];   // z, angle, slope, death
    branchesR: THREE.Uniform<THREE.Vector4>[];      // radius, -, -, -
    knotColor: THREE.Uniform<THREE.Vector4>;
}

interface MRTTextureStats {
    r: Stats;
    g: Stats;
    b: Stats;
    a: Stats;
}

/**
 * Handles uniforms, textures for wood. Use `addToShaderMaterial` to inject these 
 * into a THREE.ShaderMaterial.
 */
export class WoodExtension {
    static setupResolution = new THREE.Vector2(256, 1024);
    static MAX_BRANCHES = 1024;     // Has to match value in shaders

    woodSetup: WoodSetup;
    uniforms: SolidSceneuniforms;
    ubo: THREE.UniformsGroup;
    profileTexture: THREE.DataTexture;

    setupRT: THREE.WebGLRenderTarget;
    setupMaterial: THREE.ShaderMaterial;

    constructor(shaderChunks: Record<string, string>, noiseExtension: NoiseExtension) {
        this.woodSetup = new WoodSetup();     // TODO how to combine multiple?

        const n = this.woodSetup.branches.length;
        this.uniforms = {
            zRange: new THREE.Uniform(this.woodSetup.woodConfig.zRange),
            numBranches: new THREE.Uniform(n),
            branchesZASD: Array.from({ length: WoodExtension.MAX_BRANCHES }, () => new THREE.Uniform(new THREE.Vector4())),
            branchesR: Array.from({ length: WoodExtension.MAX_BRANCHES }, () => new THREE.Uniform(new THREE.Vector4())),
            knotColor: new THREE.Uniform(new THREE.Vector4(0.2, 0.2, 0.15, 1)),
        };
        for (let k = 0; k < n; k++) {
            const branch = this.woodSetup.branches[k];
            this.uniforms.branchesZASD[k].value.x = branch.zStart;
            this.uniforms.branchesZASD[k].value.y = branch.xyAngle;
            this.uniforms.branchesZASD[k].value.z = branch.initialSlope;
            this.uniforms.branchesZASD[k].value.w = branch.death;
            this.uniforms.branchesR[k].value.x = branch.radius;
        }
        this.ubo = new THREE.UniformsGroup();
        this.ubo.setName("branchUBO");
        this.ubo.add(this.uniforms.zRange);
        this.ubo.add(this.uniforms.numBranches);
        this.ubo.add(this.uniforms.branchesZASD);
        this.ubo.add(this.uniforms.branchesR);
        this.ubo.add(this.uniforms.knotColor);

        this.setupRT = new THREE.WebGLRenderTarget(WoodExtension.setupResolution.x, WoodExtension.setupResolution.y, {
            count: 2,
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
        });

        this.setupMaterial = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: WoodExtension.setupResolution },
            },
            vertexShader: resolveShaderChunk("vsPlain", shaderChunks),
            fragmentShader: resolveShaderChunk("fsWoodSetup", shaderChunks),
            uniformsGroups: [this.ubo],
            depthWrite: false,
            depthTest: false,
            glslVersion: THREE.GLSL3,
        });
        noiseExtension.addToShaderMaterial(this.setupMaterial);

        this.profileTexture = new THREE.DataTexture(this.woodSetup.profile, this.woodSetup.profile.length / 4, 1);
        this.profileTexture.type = THREE.FloatType;
        this.profileTexture.format = THREE.RGBAFormat;
        this.profileTexture.wrapT = THREE.ClampToEdgeWrapping;
        this.profileTexture.magFilter = THREE.LinearFilter;
        this.profileTexture.minFilter = THREE.LinearFilter;
        this.profileTexture.needsUpdate = true;
    }

    addToShaderMaterial(material: THREE.ShaderMaterial) {
        material.uniformsGroups.push(this.ubo);

        material.uniforms['branchIndexTex'] = { value: this.setupRT.textures[0] };
        material.uniforms['profileTexture'] = { value: this.profileTexture };

        material.defines['USE_WOOD'] = true;

        material.needsUpdate = true;
    }

    // Just for debug!
    computeSetupRTTextureStats(renderer: THREE.WebGLRenderer): MRTTextureStats {
        const width = this.setupRT.width;
        const height = this.setupRT.height;
        const numPixels = width * height;

        const rawBuffer = new Float32Array(numPixels * 4);

        // Read from 2nd color attachment
        renderer.readRenderTargetPixels(this.setupRT, 0, 0, width, height, rawBuffer, 0, 1);

        // Create a reusable single-channel buffer to conserve CPU memory
        const channelBuffer = new Float32Array(numPixels);
        const channelNames: Array<keyof MRTTextureStats> = ["r", "g", "b", "a"];
        const result = {} as MRTTextureStats;

        // Process each color channel completely independently
        for (let c = 0; c < 4; c++) {
            for (let i = 0; i < numPixels; i++)
                channelBuffer[i] = rawBuffer[i * 4 + c];
            const stats = computeStats(channelBuffer);
            result[channelNames[c]] = stats;
        }

        return result;
    }

    dispose() {
        this.profileTexture.dispose();
        this.ubo.dispose();
        this.setupRT.dispose();
        this.setupMaterial.dispose();
    }
}