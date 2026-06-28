import * as THREE from 'three';
import { WoodConfig, WoodSetup } from './woodSetup';
import { computeStats, Stats } from './utils/misc';
import { resolveShaderChunk } from './shaderImport';
import { NoiseExtension } from './noiseExtension';

/**
 * Global uniforms for the viewer scene.
 * NOTE: We are using vec4 arrays instead of float/int/vec3/etc. arrays since three.js 
 *       seems to mess packing up otherwise.
 */
export interface SolidSceneUniforms {
    zRanges: THREE.Uniform<THREE.Vector4>[];        // (start,end,length,-) for each wood type
    branchIndices: THREE.Uniform<THREE.Vector4>[];  // (start,end,length,-) for each wood type
    knotColors: THREE.Uniform<THREE.Vector4>[];     // knot colors for each wood type

    branchesZASD: THREE.Uniform<THREE.Vector4>[];   // z, angle, slope, death
    branchesR: THREE.Uniform<THREE.Vector4>[];      // radius, -, -, -
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
    static MAX_WOOD_TYPES = 4;      // Has to match value in shaders
    static MAX_BRANCHES = 1024;     // Has to match value in shaders
    static PROFILE_WIDTH = 2048;    // Width of the profile texture
    static setupResolution = new THREE.Vector2(256, 1024 * WoodExtension.MAX_WOOD_TYPES);

    woodSetups: WoodSetup[];
    uniforms: SolidSceneUniforms;
    ubo: THREE.UniformsGroup;
    profileTexture: THREE.DataTexture;

    setupRT: THREE.WebGLRenderTarget;
    setupMaterial: THREE.ShaderMaterial;

    constructor(shaderChunks: Record<string, string>, noiseExtension: NoiseExtension, woodConfigs: WoodConfig[]) {
        this.uniforms = {
            zRanges: Array.from({ length: WoodExtension.MAX_WOOD_TYPES }, () => new THREE.Uniform(new THREE.Vector4())),
            branchIndices: Array.from({ length: WoodExtension.MAX_WOOD_TYPES }, () => new THREE.Uniform(new THREE.Vector4())),
            knotColors: Array.from({ length: WoodExtension.MAX_WOOD_TYPES }, () => new THREE.Uniform(new THREE.Vector4())),

            branchesZASD: Array.from({ length: WoodExtension.MAX_BRANCHES }, () => new THREE.Uniform(new THREE.Vector4())),
            branchesR: Array.from({ length: WoodExtension.MAX_BRANCHES }, () => new THREE.Uniform(new THREE.Vector4())),
        };

        this.woodSetups = [];
        const profileData = new Float32Array(4 * 2 * WoodExtension.MAX_WOOD_TYPES * WoodExtension.PROFILE_WIDTH);
        let branchStart = 0;
        let zRangeStart = 0;
        for (let i = 0; i < WoodExtension.MAX_WOOD_TYPES; i++) {
            const woodSetup = new WoodSetup(WoodExtension.PROFILE_WIDTH, woodConfigs[i]);
            this.woodSetups.push(woodSetup);
            const n = woodSetup.branches.length;

            const zRange = woodSetup.woodConfig.zRange;
            this.uniforms.zRanges[i].value.set(zRangeStart, zRangeStart + zRange, zRange, 0);
            this.uniforms.branchIndices[i].value.set(branchStart, branchStart + n, n, 0);
            this.uniforms.knotColors[i].value.set(...woodSetup.woodConfig.knotColor, 1);

            for (let j = 0; j < n; j++) {
                const branch = woodSetup.branches[j];
                const k = branchStart + j;
                this.uniforms.branchesZASD[k].value.x = branch.zStart;
                this.uniforms.branchesZASD[k].value.y = branch.xyAngle;
                this.uniforms.branchesZASD[k].value.z = branch.initialSlope;
                this.uniforms.branchesZASD[k].value.w = branch.death;
                this.uniforms.branchesR[k].value.x = branch.radius;
            }

            branchStart += n;
            zRangeStart += woodSetup.woodConfig.zRange;

            // Copy from woodSetup.profile to profileData
            const segmentLength = 4 * 2 * WoodExtension.PROFILE_WIDTH;
            profileData.set(woodSetup.profile, i * segmentLength);
        }

        this.ubo = new THREE.UniformsGroup();
        this.ubo.setName("branchUBO");
        this.ubo.add(this.uniforms.zRanges);
        this.ubo.add(this.uniforms.branchIndices);
        this.ubo.add(this.uniforms.knotColors);
        this.ubo.add(this.uniforms.branchesZASD);
        this.ubo.add(this.uniforms.branchesR);

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

        this.profileTexture = new THREE.DataTexture(profileData, WoodExtension.PROFILE_WIDTH, 2 * WoodExtension.MAX_WOOD_TYPES);
        this.profileTexture.type = THREE.FloatType;
        this.profileTexture.format = THREE.RGBAFormat;
        this.profileTexture.wrapT = THREE.ClampToEdgeWrapping;
        this.profileTexture.magFilter = THREE.LinearFilter;
        this.profileTexture.minFilter = THREE.LinearFilter;
        this.profileTexture.needsUpdate = true;
    }

    addToShaderMaterial(material: THREE.ShaderMaterial, woodTypeIndex: number) {
        material.uniformsGroups.push(this.ubo);

        material.uniforms['branchIndexTex'] = { value: this.setupRT.textures[0] };
        material.uniforms['profileTexture'] = { value: this.profileTexture };
        material.uniforms['woodTypeIndex'] = { value: woodTypeIndex };

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