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
    containerSize: THREE.Vector2 = new THREE.Vector2(0, 0);     // Used to check for resize

    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
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
        this.renderer.domElement.style.position = "absolute";
        this.renderer.domElement.style.left = "0";
        this.renderer.domElement.style.top = "0";
        this.renderer.domElement.style.width = "100%";
        this.renderer.domElement.style.height = "100%";

        this.setupCamera();
        this.setupScene();
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
        this.handleResize();
        this.render();
    }

    render() {
        const t = this.timer.getElapsed();
        this.cube.setRotationFromEuler(new THREE.Euler(0.2 * t, 0.25 * t, 0.3 * t));
        this.renderer.render(this.scene, this.camera);
    }
}