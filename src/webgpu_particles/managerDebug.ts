// Just for debugging

import * as THREE from 'three/webgpu';
import { Inspector } from 'three/addons/inspector/Inspector.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { cameraProjectionMatrix, cameraViewMatrix, float, Fn, frameGroup, hash, If, instanceIndex, mat4, modelWorldMatrix, mrt, normalWorld, objectGroup, output, pass, perspectiveDepthToViewZ, positionGeometry, positionLocal, positionWorld, reference, reflect, renderGroup, screenCoordinate, screenSize, screenUV, select, smoothstep, storage, struct, texture, uniform, uv, vec2, vec3, vec4 } from 'three/tsl';


export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGPURenderer;
    cleanUpTasks: (() => void)[] = [];
    controls!: OrbitControls;
    isInitialized: boolean;
    containerSize: THREE.Vector2 = new THREE.Vector2(0, 0);     // Used to check for resize
    timeScale: THREE.Uniform<number> = new THREE.Uniform(0);

    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    pipeline!: THREE.RenderPipeline;
    // cameraMat!: THREE.UniformNode<"mat4", THREE.Matrix4>;
    glbObjs: THREE.Object3D[] = [];

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.isInitialized = false;
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGPURenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x111111, 1);
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
                // console.log("pos", this.camera.position);
                // console.log("dir", this.camera.getWorldDirection(new THREE.Vector3()));

                for (let obj of this.glbObjs) {
                    this.renderer.debug.getShaderAsync(this.scene, this.camera, obj).then((info) => {
                        console.log("info", info);
                    });
                }
            }
        };

        const gui = (this.renderer.inspector as Inspector).createParameters('Settings');
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
        let count = 0;
        gltf.scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                // console.log(`obj #${count}`, obj.name);
                if (obj.name == "Table_Cube")
                    this.glbObjs.push(obj);
            }
        });
        this.scene.add(light, gltf.scene);
        // TODO cleanup
    }

    setupPipeline() {
        const cameraMat = uniform(new THREE.Matrix4());
        (cameraMat as any).setGroup(frameGroup);
        cameraMat.onFrameUpdate(() => this.camera.projectionMatrix.clone().multiply(this.camera.matrixWorldInverse));

        const pClip = cameraMat.mul(vec4(positionWorld, 1));
        const pNDC = pClip.xyz.div(pClip.w);
        const pScreen = pNDC.add(vec3(1)).mul(0.5);

        // Incorrect results with MRT, uniform is not up to date for all meshes in scene:
        const basePass = pass(this.scene, this.camera);
        basePass.setMRT(mrt({
            output: output,
            myDebug: vec4(pScreen.xxx, 1),
        }));
        const baseColor = basePass.getTextureNode('output');
        const myDebug = basePass.getTextureNode('myDebug');

        // Correct results with two passes:
        // const basePass = pass(this.scene, this.camera);
        // const baseColor = basePass.getTextureNode('output');
        // const debugMaterial = new THREE.MeshBasicNodeMaterial();
        // debugMaterial.colorNode = vec4(pScreen.xxx, 1);
        // const debugPass = pass(this.scene, this.camera);
        // debugPass.overrideMaterial = debugMaterial;
        // const myDebug = debugPass.getTextureNode('output');

        this.pipeline = new THREE.RenderPipeline(this.renderer);
        this.pipeline.outputNode = vec3(myDebug.r).add(baseColor.mul(0.15));
    }

    animate() {
        this.controls.update();
        this.handleResize();
        this.render();
    }

    render() {
        this.pipeline.render();
    }
}