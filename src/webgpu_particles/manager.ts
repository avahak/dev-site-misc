/**
 * Basic template for a three.js scene.
 */
import * as THREE from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGPURenderer;
    cleanUpTasks: (() => void)[] = [];
    animationRequestID: number | null = null;
    gui: any;
    controls!: OrbitControls;
    timer: THREE.Timer = new THREE.Timer();
    isInitialized: boolean;

    scene!: THREE.Scene;
    camera!: THREE.Camera;
    cube!: THREE.Mesh;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.isInitialized = false;
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGPURenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x111111, 1);
        this.container.appendChild(this.renderer.domElement);

        this.setupCamera();
        this.setupScene();
        this.setupResizeRenderer();
        this.createGUI();

        await this.renderer.init();

        this.isInitialized = true;
        if (abortSignal.aborted) {
            this.dispose();
            return;
        }
        this.animate = this.animate.bind(this);
        this.animate();
    }

    dispose() {
        if (!this.isInitialized)
            return;
        if (this.animationRequestID)
            cancelAnimationFrame(this.animationRequestID);
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.controls.dispose();
        this.renderer.dispose();
        this.timer.dispose();
        this.gui.destroy();
    }

    resizeRenderer() {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const { clientWidth, clientHeight } = this.container;
        this.renderer.setSize(clientWidth, clientHeight);
        const aspect = clientWidth / clientHeight;
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.left = -aspect;
            this.camera.right = aspect;
            this.camera.updateProjectionMatrix();
        } else if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
        }
        const res = new THREE.Vector2();
        this.renderer.getDrawingBufferSize(res);
        console.log(`Resize! (${res.x}, ${res.y})`);
    }

    setupResizeRenderer() {
        // Create a ResizeObserver to monitor the container's size
        const resizeObserver = new ResizeObserver(() => {
            this.resizeRenderer();
        });
        resizeObserver.observe(this.container);
        this.cleanUpTasks.push(() => resizeObserver.unobserve(this.container));
    }

    createGUI() {
        this.gui = new GUI();
        const myObject = {
            timeScale: 0,
        };
        this.gui.add(myObject, 'timeScale', -6, 2, 1).name("Log time scale")
            .onChange((value: number) => {
                this.timer.setTimescale(Math.exp(value));
            });
        // this.gui.close();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(2, 0, 1);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupScene() {
        this.scene = new THREE.Scene();
        const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const cubeMaterial = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.scene.add(this.cube);
        this.cleanUpTasks.push(() => cubeGeometry.dispose());
        this.cleanUpTasks.push(() => cubeMaterial.dispose());
    }

    animate() {
        this.animateStep();
        this.animationRequestID = requestAnimationFrame(this.animate);
    }

    animateStep() {
        this.timer.update();
        this.controls.update();
        this.render();
    }

    render() {
        const t = this.timer.getElapsed();
        this.cube.setRotationFromEuler(new THREE.Euler(0.2 * t, 0.25 * t, 0.3 * t));
        this.renderer.render(this.scene, this.camera);
    }
}