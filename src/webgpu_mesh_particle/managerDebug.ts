import * as THREE from 'three/webgpu';
import { Inspector } from 'three/addons/inspector/Inspector.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { pass, uniformArray } from 'three/tsl';


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
    time!: THREE.UniformArrayNode<"float">;

    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    pipeline!: THREE.RenderPipeline;

    model!: GLTF;
    mesh!: THREE.SkinnedMesh;
    animationName!: string;
    animationAction!: THREE.AnimationAction;
    animationMixer!: THREE.AnimationMixer;

    // For the velocity lines:
    debugPositionAttribute!: THREE.BufferAttribute;
    oldPos: THREE.Vector3[] = [];
    newPos: THREE.Vector3[] = [];
    vel: THREE.Vector3[] = [];


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

        this.time = uniformArray([0, 0], "float" as const);

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

        this.animationMixer.stopAllAction();
        this.animationMixer.uncacheRoot(this.model.scene);
        this.scene.remove(this.model.scene);

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
            debugDump: async () => {
                console.log("debugDump");
            },
            debugLog: () => {
                console.log("debugLog");
            }
        };

        const gui = (this.renderer.inspector as Inspector).createParameters('Settings');
        const numSteps = 12;     // \in 3\N 
        gui.add(this.timeScale, 'value', 0, 1.5, 1.5 / numSteps)
            .name('Log time scale factor')
            .onChange((value: number) => {
                this.timer.setTimescale(value == 0 ? 0 : Math.exp(numSteps * (value - 1)));
            });
        gui.add(actions, 'debugLog').name('Debug log');
        gui.add(actions, 'debugDump').name('Debug dump');

        const selection: string[] = [];
        if (this.model.animations?.length > 0) {
            for (const animation of this.model.animations) {
                selection.push(animation.name);
            }
        }
        gui.add(this, 'animationName', selection)
            .onChange((clipName: string) => {
                const clip = THREE.AnimationClip.findByName(this.model.animations, clipName)!;
                const action = this.animationMixer.clipAction(clip);
                action.reset();
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.clampWhenFinished = false;
                action.timeScale = 1.0;
                this.animationAction.crossFadeTo(action, 0.5, true);
                action.play();
                this.animationAction = action;
            });
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(1, -1.9, 2.3);
        this.controls.target.set(0, 0, 1);
    }

    async setupScene() {
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AxesHelper(2));

        const light = new THREE.AmbientLight("#ffffff", 1);
        const loader = new GLTFLoader();
        this.model = await loader.loadAsync('/dev-site-misc/models/human.glb');
        this.model.scene.rotateX(Math.PI / 2);
        // this.model.scene.translateZ(-1);
        if (this.model.animations?.length > 0) {
            const clip = THREE.AnimationClip.findByName(this.model.animations, "Sword_Heavy_Combo") ?? this.model.animations[0];
            this.animationName = clip.name;

            this.animationMixer = new THREE.AnimationMixer(this.model.scene);

            this.animationAction = this.animationMixer.clipAction(clip);
            this.animationAction.setLoop(THREE.LoopRepeat, Infinity);
            this.animationAction.clampWhenFinished = false;
            this.animationAction.timeScale = 1.0;
            this.animationAction.play();
        }

        this.scene.add(light, this.model.scene);

        this.mesh = this.model.scene.getObjectByName("Mannequin_1") as THREE.SkinnedMesh;
        console.log("mesh", this.mesh);
    }

    setupPipeline() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.mesh.geometry.attributes.position.count * 6);
        this.debugPositionAttribute = new THREE.BufferAttribute(positions, 3);
        this.debugPositionAttribute.setUsage(THREE.DynamicDrawUsage);
        geometry.setAttribute('position', this.debugPositionAttribute);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lineSegments = new THREE.LineSegments(geometry, material);
        lineSegments.frustumCulled = false;
        lineSegments.rotateX(Math.PI / 2);
        this.scene.add(lineSegments);

        const basePass = pass(this.scene, this.camera);
        const baseColor = basePass.getTextureNode('output');
        this.pipeline = new THREE.RenderPipeline(this.renderer);
        this.pipeline.outputNode = baseColor;
    }

    updateLines(dt: number): void {
        const firstUpdate = this.newPos.length == 0;

        this.oldPos = this.newPos;
        const vs: THREE.Vector3[] = [];
        const vels: THREE.Vector3[] = [];
        const n = this.mesh.geometry.attributes.position.count;
        for (let i = 0; i < n; i++) {
            const v = this.mesh.getVertexPosition(i, new THREE.Vector3());
            vs.push(v);
            if (!firstUpdate)
                vels.push(v.clone().sub(this.oldPos[i]).multiplyScalar(1 / dt));
        }
        this.newPos = vs;
        this.vel = vels;

        if (firstUpdate)
            return;

        const positions = this.debugPositionAttribute.array as Float32Array;
        for (let i = 0; i < n; i++) {
            const start = this.newPos[i];
            const end = this.newPos[i].clone().addScaledVector(this.vel[i], 0.05);
            const stride = i * 6;
            positions[stride] = start.x;
            positions[stride + 1] = start.y;
            positions[stride + 2] = start.z;
            positions[stride + 3] = end.x;
            positions[stride + 4] = end.y;
            positions[stride + 5] = end.z;
        }
        this.debugPositionAttribute.needsUpdate = true;
    }

    animate() {
        this.timer.update();
        const dt = this.timer.getDelta();

        this.time.array = [this.timer.getElapsed(), dt];

        this.animationMixer.update(dt);
        this.model.scene.updateMatrixWorld(true);       // updates bones' matrixWorld
        // this.mesh.skeleton.update();

        this.updateLines(dt);

        this.controls.update();
        this.handleResize();

        this.pipeline.render();
    }
}