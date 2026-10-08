// Version using atomics instead of AdditiveBlending
// Not recommended unless problems arise

import * as THREE from 'three/webgpu';
import { Inspector } from 'three/addons/inspector/Inspector.js';
import { atomicAdd, atomicLoad, atomicStore, clamp, cos, float, floor, Fn, If, int, instanceIndex, select, sin, storage, struct, uint, uniform, uv, vec2, vec3, vec4 } from 'three/tsl';
import { StorageBufferAttribute } from 'three/webgpu';

const TEXTURE_SIZE = 1024;
const NUM_PARTICLES = 100000;
const FIXED_POINT_SCALE = 1000.0; // 1.0 float density = 1000 uint

export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGPURenderer;
    timer: THREE.Timer = new THREE.Timer();
    scene!: THREE.Scene;
    camera!: THREE.OrthographicCamera;

    // Display objects
    quadMesh!: THREE.Mesh;
    particleSprite!: THREE.Sprite;

    // Trail storage buffers for ping-pong double buffering
    trailAttributeA!: THREE.StorageBufferAttribute;
    trailAttributeB!: THREE.StorageBufferAttribute;

    // Particle storage buffer
    particleAttribute!: THREE.StorageBufferAttribute;

    // Compute passes
    computeParticlesOnA!: THREE.ComputeNode;
    computeParticlesOnB!: THREE.ComputeNode;
    computeDiffuseAtoB!: THREE.ComputeNode;
    computeDiffuseBtoA!: THREE.ComputeNode;

    // Display material & ping-pong uniform
    displayMaterial!: THREE.MeshBasicNodeMaterial;
    useAAsSourceUniform = uniform(1);

    // View state
    displayMode: 'field' | 'particles' = 'field';
    useAAsSource: boolean = true;
    isInitialized: boolean = false;

    constructor(container: HTMLDivElement) {
        this.container = container;
    }

    async init(abortSignal?: AbortSignal) {
        this.renderer = new THREE.WebGPURenderer({ antialias: false });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.renderer.inspector = new Inspector();

        this.setupScene();
        this.setupBuffersAndCompute();
        this.setupGUI();

        await this.renderer.init();

        if (abortSignal?.aborted) {
            this.dispose();
            return;
        }

        this.isInitialized = true;
        this.animate = this.animate.bind(this);
        this.renderer.setAnimationLoop(this.animate);
    }

    private setupScene() {
        this.scene = new THREE.Scene();
        // 2D Orthographic setup covering [-1, 1]
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    }

    private setupGUI() {
        const params = {
            viewMode: this.displayMode
        };

        const gui = (this.renderer.inspector as Inspector).createParameters('Display Settings');
        gui.add(params, 'viewMode', ['field', 'particles']).name('View Mode').onChange((val: 'field' | 'particles') => {
            this.displayMode = val;
            this.updateVisibility();
        });
    }

    private updateVisibility() {
        if (this.quadMesh) {
            this.quadMesh.visible = (this.displayMode === 'field');
        }
        if (this.particleSprite) {
            this.particleSprite.visible = (this.displayMode === 'particles');
        }
    }

    private setupBuffersAndCompute() {
        const totalPixels = TEXTURE_SIZE * TEXTURE_SIZE;

        // 1. Trail Buffers
        this.trailAttributeA = new StorageBufferAttribute(new Uint32Array(totalPixels), 1);
        this.trailAttributeB = new StorageBufferAttribute(new Uint32Array(totalPixels), 1);

        const trailNodeA = storage(this.trailAttributeA, 'uint', totalPixels);
        const trailNodeB = storage(this.trailAttributeB, 'uint', totalPixels);

        // Instruct TSL WGSL generator to output array<atomic<u32>>
        (trailNodeA as any).isAtomic = true;
        (trailNodeB as any).isAtomic = true;

        // 2. Particle Buffer struct (x, y, angle, padding)
        const ParticleStruct = struct({
            data: 'vec4'
        });

        const particleArray = new Float32Array(NUM_PARTICLES * 4);
        for (let i = 0; i < NUM_PARTICLES; i++) {
            particleArray[i * 4 + 0] = (Math.random() * 2) - 1; // x
            particleArray[i * 4 + 1] = (Math.random() * 2) - 1; // y
            particleArray[i * 4 + 2] = Math.random() * Math.PI * 2; // angle
            particleArray[i * 4 + 3] = 0; // padding
        }

        this.particleAttribute = new StorageBufferAttribute(particleArray, 4);
        const particleBufferNode = storage(this.particleAttribute, ParticleStruct, NUM_PARTICLES);

        // 3. Particle Movement & Deposit Compute Function
        const createParticleCompute = (targetTrailNode: any) => {
            return Fn(() => {
                const particle = particleBufferNode.element(instanceIndex);
                const pData = particle.get('data') as THREE.Node<'vec4'>;

                const pos = pData.xy.toVar();
                const angle = pData.z;

                const speed = float(0.005);
                const dir = vec2(cos(angle), sin(angle));
                pos.addAssign(dir.mul(speed));

                // Flat torus wrapping on [-1, 1]^2
                If(pos.x.greaterThan(1.0), () => { pos.x.subAssign(2.0); });
                If(pos.x.lessThan(-1.0), () => { pos.x.addAssign(2.0); });
                If(pos.y.greaterThan(1.0), () => { pos.y.subAssign(2.0); });
                If(pos.y.lessThan(-1.0), () => { pos.y.addAssign(2.0); });

                pData.assign(vec4(pos, angle, 0.0));

                const gridUV = pos.add(1.0).mul(0.5);
                const gridX = int(clamp(floor(gridUV.x.mul(TEXTURE_SIZE)), 0, TEXTURE_SIZE - 1));
                const gridY = int(clamp(floor(gridUV.y.mul(TEXTURE_SIZE)), 0, TEXTURE_SIZE - 1));

                const pixelIndex = gridY.mul(TEXTURE_SIZE).add(gridX);

                const depositAmount = uint(200);
                atomicAdd(targetTrailNode.element(pixelIndex), depositAmount);
            })().compute(NUM_PARTICLES);
        };

        this.computeParticlesOnA = createParticleCompute(trailNodeA);
        this.computeParticlesOnB = createParticleCompute(trailNodeB);

        // 4. Diffusion and Decay Compute Function (3x3 Box Blur + Decay)
        const createDiffuseCompute = (sourceNode: any, targetNode: any) => {
            return Fn(() => {
                const idx = int(instanceIndex);
                const x = idx.mod(TEXTURE_SIZE);
                const y = idx.div(TEXTURE_SIZE);

                const sum = float(0).toVar();

                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const nx = int(clamp(float(x.add(dx)), 0, TEXTURE_SIZE - 1));
                        const ny = int(clamp(float(y.add(dy)), 0, TEXTURE_SIZE - 1));
                        const nIdx = ny.mul(TEXTURE_SIZE).add(nx);

                        const val = float(atomicLoad(sourceNode.element(nIdx)) as any);
                        sum.addAssign(val);
                    }
                }

                const avg = sum.div(9.0);
                const decayFactor = float(0.95);
                const decayedVal = avg.mul(decayFactor);

                atomicStore(targetNode.element(idx), uint(decayedVal));
            })().compute(totalPixels);
        };

        this.computeDiffuseAtoB = createDiffuseCompute(trailNodeA, trailNodeB);
        this.computeDiffuseBtoA = createDiffuseCompute(trailNodeB, trailNodeA);

        // 5. Screen Quad Display Material setup
        this.displayMaterial = new THREE.MeshBasicNodeMaterial();

        const screenUv = uv();
        const sampleX = int(clamp(floor(screenUv.x.mul(TEXTURE_SIZE)), 0, TEXTURE_SIZE - 1));
        // Direct UV mapping without oneMinus() so Y-alignment matches orthographic space
        const sampleY = int(clamp(floor(screenUv.y.mul(TEXTURE_SIZE)), 0, TEXTURE_SIZE - 1));
        const pixelIdx = sampleY.mul(TEXTURE_SIZE).add(sampleX);

        const rawUintA = float(atomicLoad(trailNodeA.element(pixelIdx)) as any);
        const rawUintB = float(atomicLoad(trailNodeB.element(pixelIdx)) as any);

        const densityA = rawUintA.div(FIXED_POINT_SCALE);
        const densityB = rawUintB.div(FIXED_POINT_SCALE);

        const activeDensity = select(this.useAAsSourceUniform.equal(1), densityA, densityB);
        this.displayMaterial.colorNode = vec3(activeDensity.mul(0.2), activeDensity, activeDensity.mul(0.4));

        const quadGeometry = new THREE.PlaneGeometry(2, 2);
        this.quadMesh = new THREE.Mesh(quadGeometry, this.displayMaterial);
        this.scene.add(this.quadMesh);

        // 6. Direct Particle Display (Instanced Sprites)
        const particleMaterial = new THREE.SpriteNodeMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false
        });

        const activeParticle = particleBufferNode.element(instanceIndex);
        const activeData = activeParticle.get('data') as THREE.Node<'vec4'>;

        particleMaterial.positionNode = vec3(activeData.xy, 0.0);
        particleMaterial.scaleNode = vec2(float(0.005));
        particleMaterial.colorNode = vec3(0.2, 0.9, 1.0);

        this.particleSprite = new THREE.Sprite(particleMaterial);
        this.particleSprite.count = NUM_PARTICLES;
        this.particleSprite.frustumCulled = false;
        this.scene.add(this.particleSprite);

        this.updateVisibility();
    }

    animate() {
        this.timer.update();

        // Step 1: Run particle movement + deposit on active buffer
        if (this.useAAsSource) {
            this.useAAsSourceUniform.value = 1;
            this.renderer.compute(this.computeParticlesOnA);
            // Step 2: Diffuse from A into B
            this.renderer.compute(this.computeDiffuseAtoB);
        } else {
            this.useAAsSourceUniform.value = 0;
            this.renderer.compute(this.computeParticlesOnB);
            // Step 2: Diffuse from B into A
            this.renderer.compute(this.computeDiffuseBtoA);
        }

        // Swap ping-pong buffers
        this.useAAsSource = !this.useAAsSource;

        // Step 3: Render Active Scene to Screen
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width <= 0 || height <= 0) return;

        this.renderer.setSize(width, height);
    }

    dispose() {
        if (!this.isInitialized) return;
        this.renderer.setAnimationLoop(null);
        this.container.removeChild(this.renderer.domElement);
        this.timer.dispose();
    }
}