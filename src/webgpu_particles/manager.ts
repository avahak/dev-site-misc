// Start with:
// https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language
// https://threejsroadmap.com/blog/introduction-to-webgpu-compute-shaders
// view-source:https://threejs.org/examples/webgpu_compute_particles.html
// https://github.com/wayne-wu/webgpu-crowd-simulation/tree/main
// https://www.utsubo.com/blog/webgpu-threejs-migration-guide
// https://threejs.org/examples/webgpu_tsl_transpiler.html
// https://medium.com/@christianhelgeson/three-js-webgpurenderer-part-1-fragment-vertex-shaders-1070063447f0

// https://boytchev.github.io/tsl-textures/
// https://github.com/boytchev/tsl-textures/tree/main
// https://github.com/boytchev/tsl-textures/blob/main/src/wood.js

import * as THREE from 'three/webgpu';
import { Inspector } from 'three/addons/inspector/Inspector.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import StorageInstancedBufferAttribute from 'three/src/renderers/common/StorageInstancedBufferAttribute.js';
import { float, Fn, hash, instanceIndex, mrt, normalWorld, output, pass, select, smoothstep, storage, struct, uniform, uv, vec2, vec3, vec4 } from 'three/tsl';


export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGPURenderer;
    cleanUpTasks: (() => void)[] = [];
    controls!: OrbitControls;
    timer: THREE.Timer = new THREE.Timer();
    isInitialized: boolean;
    containerSize: THREE.Vector2 = new THREE.Vector2(0, 0);     // Used to check for resize
    timeScale: THREE.Uniform<number> = new THREE.Uniform(0);

    scene!: THREE.Scene;
    particleScene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    pipeline!: THREE.RenderPipeline;
    updateFn!: THREE.ComputeNode;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.isInitialized = false;
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGPURenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x111111, 1);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.container.appendChild(this.renderer.domElement);
        this.renderer.inspector = new Inspector();

        this.setupCamera();
        await this.setupScene();
        this.createGUI();

        await this.renderer.init();
        this.setupPipeline();

        this.isInitialized = true;
        if (abortSignal.aborted) {
            this.dispose();
            return;
        }
        this.animate = this.animate.bind(this);
        this.renderer.setAnimationLoop(this.animate);
    }

    async dispose() {
        if (!this.isInitialized)
            return;
        this.renderer.setAnimationLoop(null);
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.controls.dispose();
        this.timer.dispose();
        // this.renderer.dispose();        // Disabled due to three.js Inspector bug (r185)
    }

    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width <= 0 || height <= 0 || (this.containerSize.x === width && this.containerSize.y === height))
            return;

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.containerSize.set(width, height);
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        const resolution = new THREE.Vector2();
        this.renderer.getDrawingBufferSize(resolution);
        console.log(`Resize to (${resolution.x}, ${resolution.y})`);
    }

    createGUI() {
        const actions = {
            debugLog: () => {
                console.log("pos", this.camera.position);
                console.log("dir", this.camera.getWorldDirection(new THREE.Vector3()));
            }
        };

        const gui = (this.renderer.inspector as Inspector).createParameters('Settings');
        gui.add(this.timeScale, 'value', -6, 2, 1)
            .name('Log time scale')
            .onChange((value: number) => {
                this.timer.setTimescale(Math.exp(value));
            });
        gui.add(actions, 'debugLog').name('Debug log');
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(-4, -0.4, 3.3);
        this.controls.target.set(1.7, 1.8, 0.3);
    }

    async setupScene() {
        this.scene = new THREE.Scene();

        const light = new THREE.AmbientLight("#ffffff", 1);
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync('/dev-site-misc/models/room.glb');
        gltf.scene.rotateX(-Math.PI / 2);
        this.scene.add(light, gltf.scene);
        // TODO cleanup

        this.particleScene = new THREE.Scene();
    }

    setupPipeline() {
        const basePass = pass(this.scene, this.camera);
        basePass.setMRT(mrt({
            output: output,
            normal: normalWorld
        }));
        const baseColor = basePass.getTextureNode('output');
        const baseNormal = basePass.getTextureNode('normal');
        const baseDepth = basePass.getTextureNode('depth');

        const n = 50000;

        const ParticleStruct = struct({
            pos: 'vec4',        // (x, y, z, life)
            vel: 'vec4'         // (dx, dy, dz, dLife)
        });
        const bufferAttribute = new StorageInstancedBufferAttribute(n, 8);
        const particleBuffer = storage(bufferAttribute, ParticleStruct, n);

        const gaussian2 = Fn(([seed]: [THREE.Node<"float">]) => {
            const theta = hash(seed.add(1)).mul(Math.PI * 2);
            const r = hash(seed.add(2).log().mul(-2)).sqrt();
            return vec2(theta.cos(), theta.sin()).mul(r);
        });
        const init = Fn(() => {
            const particle = particleBuffer.element(instanceIndex);
            const particlePos = particle.get('pos') as THREE.Node<"vec4">;
            const particleVel = particle.get('vel') as THREE.Node<"vec4">;

            const i = instanceIndex.toFloat().mul(10);
            const phi = hash(i.add(1)).mul(Math.PI * 2);
            const r = hash(i.add(2)).sqrt();
            const z = hash(i.add(3)).mul(0.5);
            const pos = vec3(
                phi.cos().mul(r),
                phi.sin().mul(r),
                z,
            ).mul(10.0);
            // const phiVel = hash(i.add(4)).mul(Math.PI * 2);
            const vel = vec3(
                gaussian2(i.add(4)),
                gaussian2(i.add(6)).x,
            ).mul(40.0);
            const dLife = hash(i.add(8)).mul(-1.0).add(-0.5);
            particlePos.assign(vec4(pos, 1));
            particleVel.assign(vec4(vel, dLife));
        })().compute(n);
        this.renderer.compute(init);

        const time = uniform(new THREE.Vector2());
        time.onFrameUpdate(() => time.value.set(this.timer.getElapsed(), this.timer.getDelta()));

        this.updateFn = Fn(() => {
            const particle = particleBuffer.element(instanceIndex);
            const particlePos = particle.get('pos') as THREE.Node<"vec4">;
            const particleVel = particle.get('vel') as THREE.Node<"vec4">;

            const dt = time.y.mul(0.1);
            const newVel = particleVel.add(vec4(0, 0, -9.81, 0).mul(dt));
            const newPos = particlePos.add(newVel.mul(dt));
            particlePos.assign(newPos);
            particleVel.assign(newVel);
        })().compute(n);

        const material = new THREE.SpriteNodeMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const pos = particleBuffer.element(instanceIndex).get('pos') as THREE.Node<"vec4">;
        material.positionNode = pos;
        material.scaleNode = select(pos.w.lessThan(0), 0.0, 0.05);
        material.colorNode = vec3(1, pos.w.mul(0.5), 0);
        material.opacityNode = smoothstep(float(0.5), float(0.4), uv().distance(vec2(0.5)));
        const particles = new THREE.Sprite(material);
        particles.count = n;
        this.particleScene.add(particles);

        const particlePass = pass(this.particleScene, this.camera);
        const particleColor = particlePass.getTextureNode('output');

        const bloomPass = bloom(particleColor, 0.5, 0.5, 0.1);
        this.pipeline = new THREE.RenderPipeline(this.renderer);
        this.pipeline.outputNode = baseColor.add(particleColor).add(bloomPass);
    }

    animate() {
        this.timer.update();
        this.controls.update();
        this.handleResize();
        this.render();
    }

    render() {
        this.renderer.compute(this.updateFn);
        this.pipeline.render();
    }
}