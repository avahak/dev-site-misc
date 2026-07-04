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
import { float, Fn, hash, If, instanceIndex, mat4, mrt, normalWorld, output, pass, perspectiveDepthToViewZ, positionWorld, reflect, Return, saturate, screenCoordinate, screenUV, select, smoothstep, storage, struct, texture, uniform, uv, vec2, vec3, vec4 } from 'three/tsl';

/** 
 * Computes the velocity vector of magnitude r to hit p1 from p0 under gravity (0,0,-9.81). 
 */
function findLaunchVelocity(p0: THREE.Vector3, r: number, p1: THREE.Vector3): THREE.Vector3 | null {
    const delta = new THREE.Vector3().subVectors(p1, p0);
    const c = delta.lengthSq();
    if (c === 0)
        return new THREE.Vector3(0, 0, r);

    const g = 9.81;
    const a = 0.25 * g * g;
    const b = g * delta.z - r * r;
    const disc = b * b - 4 * a * c;
    if (disc < 0)
        return null;

    const tSq1 = (-b - Math.sqrt(disc)) / (2 * a);
    const tSq2 = (-b + Math.sqrt(disc)) / (2 * a);
    const tSq = tSq1 > 0 ? tSq1 : tSq2;
    if (tSq <= 0)
        return null;

    const t = Math.sqrt(tSq);
    return new THREE.Vector3(delta.x / t, delta.y / t, delta.z / t + 0.5 * g * t);
}

export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGPURenderer;
    cleanUpTasks: (() => void)[] = [];
    controls!: OrbitControls;
    timer: THREE.Timer = new THREE.Timer();
    isInitialized: boolean;
    containerSize: THREE.Vector2 = new THREE.Vector2(0, 0);     // Used to check for resize
    timeScale: THREE.Uniform<number> = new THREE.Uniform(1);
    raycaster = new THREE.Raycaster();

    scene!: THREE.Scene;
    particleScene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    gbufferPipeline!: THREE.RenderPipeline;
    pipeline!: THREE.RenderPipeline;
    updateFn!: THREE.ComputeNode;

    static shootSpeed = 10;
    shootVel: THREE.Vector3 = new THREE.Vector3(-8, -0.7, 6).setLength(RenderManager.shootSpeed);

    torus!: THREE.Mesh;

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
        // TODO this is very incomplete..

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
                console.log("shootVel", this.shootVel);

                const pClip = new THREE.Vector4(0, 0, 0, 1).applyMatrix4(this.camera.projectionMatrix.clone().multiply(this.camera.matrixWorldInverse));
                const pNDC = new THREE.Vector3(pClip.x / pClip.w, pClip.y / pClip.w, pClip.z / pClip.w);
                console.log("debug_NDC(0)", pNDC);
            }
        };

        const gui = (this.renderer.inspector as Inspector).createParameters('Settings');
        const numSteps = 6;     // \in 3\N 
        gui.add(this.timeScale, 'value', 0, 1.5, 1.5 / numSteps)
            .name('Log time scale factor')
            .onChange((value: number) => {
                this.timer.setTimescale(value == 0 ? 0 : Math.exp(numSteps * (value - 1)));
            });
        gui.add(actions, 'debugLog').name('Debug log');
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(5.5, -2.9, 4.3);
        this.controls.target.set(0.5, 0.5, 0.0);
    }

    async setupScene() {
        this.scene = new THREE.Scene();
        // this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshNormalMaterial()));
        // this.scene.add(new THREE.AxesHelper(1));

        const light = new THREE.AmbientLight("#ffffff", 1);
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync('/dev-site-misc/models/room.glb');
        gltf.scene.translateZ(-0.5);
        gltf.scene.rotateX(-Math.PI / 2);
        this.scene.add(light, gltf.scene);
        // TODO cleanup

        this.torus = new THREE.Mesh(new THREE.TorusGeometry(1.3, 1.1), new THREE.MeshNormalMaterial());
        this.torus.position.set(-3.5, -2, 1.2);
        this.scene.add(this.torus);

        this.particleScene = new THREE.Scene();
    }

    setupPipeline() {
        const time = uniform(new THREE.Vector2());
        time.onFrameUpdate(() => time.value.set(this.timer.getElapsed(), this.timer.getDelta()));
        const cameraMat = uniform(new THREE.Matrix4());
        cameraMat.onFrameUpdate(() => this.camera.projectionMatrix.clone().multiply(this.camera.matrixWorldInverse));
        const ts = uniform(this.timeScale.value);
        ts.onFrameUpdate(() => this.timeScale.value);
        const shootVel = uniform(new THREE.Vector3());
        shootVel.onFrameUpdate(() => this.shootVel);

        // Pipeline for depth and normals needed by compute:
        const normalMaterial = new THREE.MeshBasicNodeMaterial();
        normalMaterial.outputNode = normalWorld;
        const depthNormalPass = pass(this.scene, this.camera);
        depthNormalPass.overrideMaterial = normalMaterial;
        const baseNormal = depthNormalPass.getTextureNode("output");
        const baseDepth = depthNormalPass.getTextureNode("depth");
        this.gbufferPipeline = new THREE.RenderPipeline(this.renderer);
        this.gbufferPipeline.outputNode = baseNormal;

        const n = 100000;
        const ParticleStruct = struct({
            pos: 'vec4',        // (x, y, z, life)
            vel: 'vec4',        // (dx, dy, dz, dLife)
            state: 'vec4',      // (isVisible,-,-,-)
        });
        const bufferAttribute = new StorageInstancedBufferAttribute(n, 12);
        const particleBuffer = storage(bufferAttribute, ParticleStruct, n);
        const particle = particleBuffer.element(instanceIndex);
        const particlePos = particle.get('pos') as THREE.Node<"vec4">;
        const particleVel = particle.get('vel') as THREE.Node<"vec4">;
        const particleState = particle.get('state') as THREE.Node<"vec4">;

        const gaussian2 = Fn(([seed]: [THREE.Node<"float">]) => {
            const theta = hash(seed.add(1)).mul(Math.PI * 2).toVar();
            const r = hash(seed.add(2)).log().mul(-2).sqrt();
            return vec2(theta.cos(), theta.sin()).mul(r);
        });
        const reset = () => {
            const i = instanceIndex.toFloat().mul(20).toVar();
            const pos = vec3(
                gaussian2(i.add(4)),
                gaussian2(i.add(6)).x,
            ).mul(0.05);
            const vel = vec3(
                gaussian2(i.add(8)),
                gaussian2(i.add(10)).x,
            ).mul(0.5).add(shootVel);
            const dLife = hash(i.add(12)).mul(-1.0).add(-0.5);
            particlePos.assign(vec4(pos, 1));
            particleVel.assign(vec4(vel, dLife));
            particleState.assign(vec4(0, 0, 0, 0));
        };
        const init = Fn(() => {
            reset();
        })().compute(n);
        this.renderer.compute(init);

        this.updateFn = Fn(() => {
            const newVel = particleVel.add(vec4(0, 0, -9.81, 0).mul(time.y)).toVar();
            const newPos = particlePos.add(newVel.mul(time.y)).toVar();

            const pClip = cameraMat.mul(vec4(newPos.xyz, 1)).toVar();
            const pNDC = pClip.xyz.div(pClip.w);
            const pScreen0 = pNDC.mul(0.5).add(vec3(0.5));
            const pScreen = vec2(pScreen0.x, pScreen0.y.oneMinus()).toVar();

            const depth = texture(baseDepth, pScreen.xy).r;

            const inFront = pNDC.z.lessThan(1).and(pNDC.z.greaterThan(-1));
            const behindOccluder = depth.greaterThan(pNDC.z);
            const isVisible = inFront.and(behindOccluder);
            particleState.assign(vec4(select(isVisible, 1, 0), 0, 0, 0));
            If(ts.equal(0), () => {
                // Time is stopped
                Return();
            });
            If(isVisible, () => {
                particlePos.assign(newPos);
                particleVel.assign(newVel);
            }).Else(() => {
                const normal = texture(baseNormal, pScreen.xy).xyz;
                const reflected = reflect(particleVel.xyz, normal);
                // const reflected = particleVel.xyz.sub(normal.mul(particleVel.xyz.dot(normal).mul(1.8)));
                particleVel.xyz = reflected;

                particlePos.w.assign(newPos.w.sub(0.05));   // needed to prevent repeated collisions in place
            });

            If(particlePos.w.lessThan(0), () => {
                reset();
            });
        })().compute(n);

        const basePass = pass(this.scene, this.camera);
        const baseColor = basePass.getTextureNode('output');

        const material = new THREE.SpriteNodeMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
        });
        material.positionNode = particlePos.xyz;
        const size = smoothstep(0, 0.2, particlePos.w).mul(0.05);
        material.scaleNode = select(particleState.x.lessThan(0.5), 0.0, size);
        material.colorNode = vec3(1, particlePos.w.mul(0.5), 0);
        material.opacityNode = smoothstep(float(0.5), float(0.4), uv().distance(vec2(0.5)));
        const particleSprite = new THREE.Sprite(material);
        particleSprite.count = n;
        particleSprite.frustumCulled = false;
        this.particleScene.add(particleSprite);

        const particlePass = pass(this.particleScene, this.camera);
        const particleColor = particlePass.getTextureNode('output');
        const bloomPass = bloom(particleColor, 0.2, 0.5, 0.1);

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
        const t = this.timer.getElapsed();
        this.torus.rotation.set(t, 0.3 * t, 0.7 * t);

        this.gbufferPipeline.render();
        this.renderer.compute(this.updateFn);
        this.pipeline.render();
    }

    interact(x: number, y: number) {
        const p = new THREE.Vector2(2 * x / this.container.clientWidth - 1, -2 * y / this.container.clientHeight + 1);
        this.raycaster.setFromCamera(p, this.camera);
        const intersects = this.raycaster.intersectObject(this.scene);
        if (intersects.length > 0) {
            const vel = findLaunchVelocity(new THREE.Vector3(), RenderManager.shootSpeed, intersects[0].point);
            if (vel)
                this.shootVel.copy(vel);
        }
    }
}