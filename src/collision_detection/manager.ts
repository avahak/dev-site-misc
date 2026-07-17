/**
 * Basic template for a three.js scene.
 */
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MovingSphere, TrustRegionBroadPhase } from './broadPhase';
import { runBenchmark } from './data_structures/benchmark';

/**
 * @returns A random Gaussian-distributed pair of reals.
 */
function complexGaussian(): [number, number] {
    let u = Math.max(Number.MIN_VALUE, Math.random());
    const r = Math.sqrt(-2.0 * Math.log(u));
    const phi = 2.0 * Math.PI * Math.random();
    return [r * Math.cos(phi), r * Math.sin(phi)];
}
function gaussian3(): THREE.Vector3 {
    const z1 = complexGaussian();
    const z2 = complexGaussian();
    return new THREE.Vector3(z1[0], z1[1], z2[0]);
}


export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[] = [];
    gui: any;
    controls!: OrbitControls;
    timer: THREE.Timer = new THREE.Timer();
    isInitialized: boolean;
    containerSize: THREE.Vector2 = new THREE.Vector2(0, 0);     // Used to check for resize

    scene!: THREE.Scene;
    camera!: THREE.Camera;

    spheres: MovingSphere[] = [];
    detector!: TrustRegionBroadPhase;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.isInitialized = false;
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x111111, 1);
        this.container.appendChild(this.renderer.domElement);

        this.setupCamera();
        this.setupScene();
        this.createGUI();

        this.isInitialized = true;
        if (abortSignal.aborted) {
            this.dispose();
            return;
        }
        this.animate = this.animate.bind(this);
        this.renderer.setAnimationLoop(this.animate);
    }

    dispose() {
        if (!this.isInitialized)
            return;
        this.renderer.setAnimationLoop(null);
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.controls.dispose();
        this.timer.dispose();
        this.gui.destroy();
        this.renderer.dispose();
    }

    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width <= 0 || height <= 0 || (this.containerSize.x === width && this.containerSize.y === height))
            return;

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.containerSize.set(width, height);
        this.renderer.setSize(width, height);
        const aspect = width / height;
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.left = -aspect;
            this.camera.right = aspect;
            this.camera.updateProjectionMatrix();
        } else if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
        }

        const resolution = new THREE.Vector2();
        this.renderer.getDrawingBufferSize(resolution);
        console.log(`Resize to (${resolution.x}, ${resolution.y})`);
    }

    createGUI() {
        const benchmark = () => {
            console.log("Benchmarking..");
            runBenchmark();
        };
        this.gui = new GUI();
        const myObject = {
            benchmark,
            timeScale: 0,
        };
        this.gui.add(myObject, 'timeScale', -6, 2, 1).name("Log time scale")
            .onChange((value: number) => {
                this.timer.setTimescale(Math.exp(value));
            });
        this.gui.add(myObject, 'benchmark').name("Benchmark");
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(2, 0, 1);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupScene() {
        this.scene = new THREE.Scene();

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        for (let k = 0; k < 100; k++) {
            const r = 0.25 * (Math.random() + 1);
            const mSphere = new MovingSphere(gaussian3().multiplyScalar(2), r);

            const geometry = new THREE.SphereGeometry(mSphere.radius);
            const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
            const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.7 });
            const sphere = new THREE.Mesh(geometry, material);
            mSphere.obj = sphere;

            this.spheres.push(mSphere);
            this.scene.add(sphere);
        }
        this.detector = new TrustRegionBroadPhase(this.spheres, 5);
    }

    moveSpheres() {
        for (const sphere of this.spheres) {
            const dp = gaussian3().multiplyScalar(0.1);
            if (Math.random() < 0.1) {
                sphere.position.add(dp);
                sphere.position.x = (sphere.position.x + 1) % 2 - 1;
                sphere.position.y = (sphere.position.y + 1) % 2 - 1;
                sphere.position.z = (sphere.position.z + 1) % 2 - 1;
            }

            sphere.obj!.position.copy(sphere.position);
        }

        // this.detector.update();
        // this.detector.validate();
    }

    animate() {
        this.timer.update();
        this.controls.update();
        this.handleResize();
        this.render();
    }

    render() {
        this.moveSpheres();
        this.renderer.render(this.scene, this.camera);
    }
}