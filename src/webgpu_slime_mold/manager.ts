import * as THREE from 'three/webgpu';
import { Inspector } from 'three/addons/inspector/Inspector.js';
import { cos, float, Fn, If, instanceIndex, select, sin, storage, struct, texture, uniform, uv, vec2, vec3, vec4 } from 'three/tsl';
import { StorageBufferAttribute } from 'three/webgpu';

const TEXTURE_SIZE = 1024;
const NUM_PARTICLES = 1000;

export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGPURenderer;
    timer: THREE.Timer = new THREE.Timer();
    camera!: THREE.OrthographicCamera;

    // Ping-pong Render Targets for trail field
    renderTargetA!: THREE.RenderTarget;
    renderTargetB!: THREE.RenderTarget;

    // Particle storage buffer
    particleAttribute!: THREE.StorageBufferAttribute;

    // Compute pass
    computeParticles!: THREE.ComputeNode;

    // Render Scenes & Objects
    depositScene!: THREE.Scene;
    diffuseSceneA!: THREE.Scene;
    diffuseSceneB!: THREE.Scene;
    screenScene!: THREE.Scene;
    particleScene!: THREE.Scene;

    useAAsSourceUniform = uniform(1);

    // State
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

        this.setupSceneAndRenderTargets();
        this.setupBuffersAndCompute();
        this.setupDisplayScenes();
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

    private setupSceneAndRenderTargets() {
        // Orthographic camera covering [-1, 1]^2, placed at z = 1
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);

        const options: THREE.RenderTargetOptions = {
            type: THREE.HalfFloatType,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        };

        this.renderTargetA = new THREE.RenderTarget(TEXTURE_SIZE, TEXTURE_SIZE, options);
        this.renderTargetB = new THREE.RenderTarget(TEXTURE_SIZE, TEXTURE_SIZE, options);
    }

    private setupGUI() {
        const params = { viewMode: this.displayMode };
        const gui = (this.renderer.inspector as Inspector).createParameters('Display Settings');
        gui.add(params, 'viewMode', ['field', 'particles']).name('View Mode').onChange((val: 'field' | 'particles') => {
            this.displayMode = val;
        });
    }

    private setupBuffersAndCompute() {
        // 1. Particle Storage Buffer (x, y, angle, padding)
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

        // 2. Compute Shader: Move Particles
        this.computeParticles = Fn(() => {
            const particle = particleBufferNode.element(instanceIndex);
            const pData = particle.get('data') as THREE.Node<'vec4'>;

            const pos = pData.xy.toVar();
            const angle = pData.z;

            const speed = float(0.002);
            const dir = vec2(cos(angle), sin(angle));
            pos.addAssign(dir.mul(speed));

            // Flat torus wrapping [-1, 1]^2
            If(pos.x.greaterThan(1.0), () => { pos.x.subAssign(2.0); });
            If(pos.x.lessThan(-1.0), () => { pos.x.addAssign(2.0); });
            If(pos.y.greaterThan(1.0), () => { pos.y.subAssign(2.0); });
            If(pos.y.lessThan(-1.0), () => { pos.y.addAssign(2.0); });

            pData.assign(vec4(pos, angle, 0.0));
        })().compute(NUM_PARTICLES);

        // 3. Deposit Scene: Render particles as instanced sprites using Hardware Additive Blending
        const depositMaterial = new THREE.SpriteNodeMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false
        });

        const activeParticle = particleBufferNode.element(instanceIndex);
        const activeData = activeParticle.get('data') as THREE.Node<'vec4'>;

        depositMaterial.positionNode = vec3(activeData.xy, 0.0);
        depositMaterial.scaleNode = vec2(float(0.003)); // Particle deposit size
        depositMaterial.colorNode = vec3(0.15); // Deposit intensity per frame

        const depositSprite = new THREE.Sprite(depositMaterial);
        depositSprite.count = NUM_PARTICLES;
        depositSprite.frustumCulled = false;

        this.depositScene = new THREE.Scene();
        this.depositScene.add(depositSprite);
    }

    private setupDisplayScenes() {
        // Blur node helper using y.oneMinus() to correct RenderTarget Y-inversion
        const createBlurNode = (tex: THREE.Texture) => {
            const texUv = vec2(uv().x, uv().y.oneMinus());
            const texelSize = vec2(1.0 / TEXTURE_SIZE);
            let sumNode = vec3(0.0) as THREE.Node<'vec3'>;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const offset = vec2(float(dx), float(dy)).mul(texelSize);
                    const sample = texture(tex, texUv.add(offset)).rgb;
                    sumNode = sumNode.add(sample);
                }
            }
            const avg = sumNode.div(9.0);
            const decayFactor = float(0.95);
            return avg.mul(decayFactor);
        };

        // Diffusion Scene A (Reads Target A -> Renders into Target B)
        const diffuseMatA = new THREE.MeshBasicNodeMaterial();
        diffuseMatA.colorNode = createBlurNode(this.renderTargetA.texture);
        this.diffuseSceneA = new THREE.Scene();
        this.diffuseSceneA.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), diffuseMatA));

        // Diffusion Scene B (Reads Target B -> Renders into Target A)
        const diffuseMatB = new THREE.MeshBasicNodeMaterial();
        diffuseMatB.colorNode = createBlurNode(this.renderTargetB.texture);
        this.diffuseSceneB = new THREE.Scene();
        this.diffuseSceneB.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), diffuseMatB));

        // Screen Display Scene (Renders target containing fresh diffusion to screen)
        const screenMat = new THREE.MeshBasicNodeMaterial();
        const screenUv = vec2(uv().x, uv().y.oneMinus());
        const displayTexA = texture(this.renderTargetA.texture, screenUv);
        const displayTexB = texture(this.renderTargetB.texture, screenUv);

        // When useAAsSource is 1, RenderTarget B holds the newly diffused output
        const activeFieldTex = select(this.useAAsSourceUniform.equal(1), displayTexB, displayTexA);

        screenMat.colorNode = vec3(activeFieldTex.r.mul(0.2), activeFieldTex.r, activeFieldTex.r.mul(0.4));
        this.screenScene = new THREE.Scene();
        this.screenScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), screenMat));

        // Direct Particle View Scene (For Inspector toggle)
        const particleDisplayMat = new THREE.SpriteNodeMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false
        });

        const ParticleStruct = struct({ data: 'vec4' });
        const activeParticle = storage(this.particleAttribute, ParticleStruct, NUM_PARTICLES).element(instanceIndex);
        const activeData = activeParticle.get('data') as THREE.Node<'vec4'>;

        particleDisplayMat.positionNode = vec3(activeData.xy, 0.0);
        particleDisplayMat.scaleNode = vec2(float(0.005));
        particleDisplayMat.colorNode = vec3(0.2, 0.9, 1.0);

        const particleDisplaySprite = new THREE.Sprite(particleDisplayMat);
        particleDisplaySprite.count = NUM_PARTICLES;
        particleDisplaySprite.frustumCulled = false;

        this.particleScene = new THREE.Scene();
        this.particleScene.add(particleDisplaySprite);
    }

    animate() {
        this.timer.update();

        const currentSourceRT = this.useAAsSource ? this.renderTargetA : this.renderTargetB;
        const currentTargetRT = this.useAAsSource ? this.renderTargetB : this.renderTargetA;
        const currentDiffuseScene = this.useAAsSource ? this.diffuseSceneA : this.diffuseSceneB;

        this.useAAsSourceUniform.value = this.useAAsSource ? 1 : 0;

        // Step 1: Update particle positions on GPU
        this.renderer.compute(this.computeParticles);

        // Step 2: Deposit particles onto source RenderTarget (accumulates on top of history)
        this.renderer.setRenderTarget(currentSourceRT);
        this.renderer.autoClear = false;
        this.renderer.render(this.depositScene, this.camera);

        // Step 3: Diffuse & Decay from source RenderTarget into target RenderTarget
        this.renderer.setRenderTarget(currentTargetRT);
        this.renderer.autoClear = true;
        this.renderer.render(currentDiffuseScene, this.camera);

        // Step 4: Render active mode to screen canvas
        this.renderer.setRenderTarget(null);
        this.renderer.autoClear = true;

        if (this.displayMode === 'field') {
            this.renderer.render(this.screenScene, this.camera);
        } else {
            this.renderer.render(this.particleScene, this.camera);
        }

        // Swap ping-pong state
        this.useAAsSource = !this.useAAsSource;
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
        this.renderTargetA.dispose();
        this.renderTargetB.dispose();
        this.container.removeChild(this.renderer.domElement);
        this.timer.dispose();
    }
}