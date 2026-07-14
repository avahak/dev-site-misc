// See:
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_blending.html
// https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/skinnedMesh.js
// https://www.youtube.com/watch?v=hXjNC8pNOTE&t=3162s


import * as THREE from 'three/webgpu';
import { Inspector } from 'three/addons/inspector/Inspector.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Fn, pass, uniformArray, vertexIndex } from 'three/tsl';
import { SkinnedGeometryGPU } from './skinnedGeometryGPU';
import { DebugGPU } from './debug';
import { prefixSumTest } from './cpu_dispatch/prefixScan';
import { bitonicSortTest } from './cpu_dispatch/bitonicSort';
import { histogramTest } from './cpu_dispatch/histogram';


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
    animationName!: string;
    animationAction!: THREE.AnimationAction;
    animationMixer!: THREE.AnimationMixer;

    gpuGeometry!: SkinnedGeometryGPU;
    gpuDebug!: DebugGPU;


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

                // const n = 100;
                // const gpuResult = await this.gpuDebug.debug(this.renderer, n);
                // const result = [];
                // for (let k = 0; k < n; k++) {
                //     const gpuIndex = gpuResult[k].index;
                //     const mi = this.gpuGeometry.decodeVertexIndex(gpuIndex);
                //     // const v = mi.mesh.getVertexPosition(mi.index, new THREE.Vector3());
                //     const v = getSkinnedVertexNormal(mi.mesh, mi.index, true);
                //     const v2 = gpuResult[k].v;
                //     const error = Math.hypot(v.x - v2.x, v.y - v2.y, v.z - v2.z);
                //     result.push({ index: gpuIndex, error: error, cpu: v, gpu: gpuResult[k].v });
                // }
                // console.log("result:");
                // console.table(result);

                prefixSumTest();
                bitonicSortTest();
                histogramTest();
            },
            debugLog: () => {
                console.log("debugLog");
                // console.log(this.model.scene);
                let skeleton: THREE.Skeleton | null = null;
                this.model.scene.traverse((obj) => {
                    if (obj instanceof THREE.SkinnedMesh) {
                        if (skeleton && (skeleton !== obj.skeleton))
                            console.log("Skeleton is not unique.")
                        skeleton = obj.skeleton;

                        console.log("bindMatrix", obj.bindMatrix.elements);
                        const geometry = obj.geometry;
                        console.log("skinIndex", geometry.attributes.skinIndex);
                        console.log("skinWeight", geometry.attributes.skinWeight);
                        console.log("position", geometry.attributes.position);
                        console.log("index", geometry.index);
                    }
                });
                skeleton = skeleton as (THREE.Skeleton | null);     // TS BS
                if (skeleton) {
                    // console.log("a", skeleton);
                    // console.log("b", skeleton.bones.length);
                    // console.log("c", skeleton.boneInverses);
                    // console.log("d", skeleton.boneMatrices);
                    console.log("sum(boneMatrices)", skeleton.boneMatrices?.reduce((s, v) => s + v, 0));
                }
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

        this.camera.position.set(1.5, -2, 1.5);
        this.controls.target.set(0, 0, 1);
    }

    async setupScene() {
        this.scene = new THREE.Scene();
        // this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshNormalMaterial()));
        this.scene.add(new THREE.AxesHelper(2));

        const light = new THREE.AmbientLight("#ffffff", 1);
        const loader = new GLTFLoader();
        this.model = await loader.loadAsync('/dev-site-misc/models/human.glb');
        this.model.scene.rotateX(Math.PI / 2);
        // this.model.scene.translateZ(-1);
        if (this.model.animations?.length > 0) {
            const clip = THREE.AnimationClip.findByName(this.model.animations, "Zombie_Walk_Fwd_Loop") ?? this.model.animations[0];
            this.animationName = clip.name;

            this.animationMixer = new THREE.AnimationMixer(this.model.scene);

            this.animationAction = this.animationMixer.clipAction(clip);
            this.animationAction.setLoop(THREE.LoopRepeat, Infinity);
            this.animationAction.clampWhenFinished = false;
            this.animationAction.timeScale = 1.0;
            this.animationAction.play();
        }

        this.scene.add(light, this.model.scene);

        this.gpuGeometry = new SkinnedGeometryGPU(this.model.scene, this.time);
        this.gpuDebug = new DebugGPU(this.gpuGeometry);
    }

    setupPipeline() {
        const lineCount = this.gpuGeometry.vertexCount;
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lineCount * 2 * 3), 3));
        const lineMaterial = new THREE.LineBasicNodeMaterial({ color: 0x00ffaa });
        lineMaterial.positionNode = Fn(() => {
            const isTarget = vertexIndex.bitAnd(1).equal(1); // start: 0, end: 1
            const lineIndex = vertexIndex.shiftRight(1);
            const vertex = this.gpuGeometry.dynamicVertices.element(lineIndex);
            const pos = vertex.get("position") as THREE.Node<"vec3">;
            const vel = vertex.get("velocity") as THREE.Node<"vec3">;
            const normal = vertex.get("normal") as THREE.Node<"vec3">;

            const offsets = [0.02, -0.05, 0.00];
            return isTarget.select(pos.add(normal.mul(offsets[0])).add(vel.mul(offsets[1])), pos.add(normal.mul(offsets[0])).add(vel.mul(offsets[2])));
            // return isTarget.select(pos, pos.add(normal.mul(0.1)));
        })();
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        lines.frustumCulled = false;
        lines.rotateX(Math.PI / 2);
        this.scene.add(lines);

        const basePass = pass(this.scene, this.camera);
        const baseColor = basePass.getTextureNode('output');
        this.pipeline = new THREE.RenderPipeline(this.renderer);
        this.pipeline.outputNode = baseColor;
    }

    animate() {
        this.timer.update();
        this.time.array = [this.timer.getElapsed(), this.timer.getDelta()];

        this.animationMixer.update(this.timer.getDelta());
        this.gpuGeometry.updateBones();

        this.controls.update();
        this.handleResize();
        this.render();
    }

    render() {
        this.gpuDebug.computePos(this.timer.getDelta());
        this.renderer.compute(this.gpuGeometry.updateDynamicVertices);
        this.pipeline.render();
    }
}