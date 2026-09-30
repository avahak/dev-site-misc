/**
 * Visualizing churning with one object following a geodesic in hyperbolic space.
 */

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import vsTiling from './shaders/vs_tiling.glsl?raw';
import fsTiling from './shaders/fs_tiling.glsl?raw';

const K_MAX = 200;
const EPSILON = 1e-9;

// Rendering:
const BASE_SCALE = 0.001;
const OBJECT_SIZE = 0.005;
const ANIMATION_BASE_SPEED = 0.02;

export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[] = [];
    gui: any;
    controls!: OrbitControls;
    timer: THREE.Timer = new THREE.Timer();
    isInitialized: boolean;
    containerSize: THREE.Vector2 = new THREE.Vector2(0, 0);

    scene!: THREE.Scene;
    camera!: THREE.OrthographicCamera;

    // Visual Meshes
    objectMesh!: THREE.Mesh;
    regionMeshes: THREE.LineLoop[] = [];
    poincareBoundaryMesh!: THREE.Mesh;

    // Intrinsic 1D State (Positions along the geodesic)
    currentTime: number = 0;
    regionCenters: number[] = [];

    // Application Settings
    settings = {
        S: 2.0,
        timeScale: 0,
        // p=Number of sides per polygon, q=Number of polygons meeting at a vertex, (p-2)(q-2) > 4
        pq: [6, 5],
    };

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
        if (!this.isInitialized) return;
        this.renderer.setAnimationLoop(null);
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks) task();
        this.controls.dispose();
        this.timer.dispose();
        this.gui.destroy();
        this.renderer.dispose();
    }

    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width <= 0 || height <= 0 || (this.containerSize.x === width && this.containerSize.y === height)) return;

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.containerSize.set(width, height);
        this.renderer.setSize(width, height);

        const aspect = width / height;
        const viewSize = 1.2 / aspect;

        this.camera.left = -viewSize * aspect;
        this.camera.right = viewSize * aspect;
        this.camera.top = viewSize;
        this.camera.bottom = -viewSize;
        this.camera.updateProjectionMatrix();
    }

    createGUI() {
        this.gui = new GUI();
        this.gui.add(this.settings, 'S', 1.1, 4.1, 0.1).name("Constant S")
            .onChange(() => {
                this.resetSimulation();
            });
        this.gui.add(this.settings, 'pq', [[3, 7], [7, 3], [3, 8], [8, 3], [4, 5], [5, 4], [4, 6], [6, 4], [4, 7], [7, 4], [5, 5], [5, 6], [6, 5]]).name("{p, q}")
            .onChange(() => {
                this.resetSimulation();
            });
        this.gui.add(this.settings, 'timeScale', -6, 5, 1).name("Log time scale")
            .onChange((value: number) => {
                this.timer.setTimescale(value === -6 ? 0 : Math.exp(value));
            });
        this.gui.add({ reset: () => this.resetSimulation() }, 'reset').name("Reset Time");
    }

    setupCamera() {
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false;
        this.controls.zoomSpeed = 2;
    }

    setupScene() {
        this.scene = new THREE.Scene();

        // 1. Base Object (Red dot locked visually at origin)
        const dotGeo = new THREE.CircleGeometry(1, 32);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false });
        this.objectMesh = new THREE.Mesh(dotGeo, dotMat);
        this.objectMesh.position.set(0, 0, 0);
        this.objectMesh.renderOrder = 2;
        this.scene.add(this.objectMesh);

        this.cleanUpTasks.push(() => dotGeo.dispose());
        this.cleanUpTasks.push(() => dotMat.dispose());

        // 2. Poincaré Disk Boundary with Tiling Shader
        const diskGeo = new THREE.CircleGeometry(1, 128);
        const diskMat = new THREE.ShaderMaterial({
            vertexShader: vsTiling,
            fragmentShader: fsTiling,
            uniforms: {
                u_time: { value: 0.0 },
                u_shift: { value: 0.0 },
                u_n1: { value: new THREE.Vector3() },
                u_n2: { value: new THREE.Vector3() },
                u_n3: { value: new THREE.Vector3() },
            },
            transparent: false,
            depthTest: false,
            depthWrite: false,
        });

        this.poincareBoundaryMesh = new THREE.Mesh(diskGeo, diskMat);
        this.poincareBoundaryMesh.renderOrder = 0;
        this.scene.add(this.poincareBoundaryMesh);

        // Keep the original boundary ring explicitly
        const diskEdges = new THREE.EdgesGeometry(diskGeo);
        const edgeMat = new THREE.LineBasicMaterial({ color: 0x555555 });
        const edgeMesh = new THREE.LineLoop(diskEdges, edgeMat);
        this.poincareBoundaryMesh.add(edgeMesh);

        this.cleanUpTasks.push(() => diskGeo.dispose());
        this.cleanUpTasks.push(() => diskEdges.dispose());
        this.cleanUpTasks.push(() => diskMat.dispose());
        this.cleanUpTasks.push(() => edgeMat.dispose());

        // 3. Region Meshes (Unit circles transformed dynamically in render())
        const circleGeo = new THREE.CircleGeometry(1, 128);
        const edges = new THREE.EdgesGeometry(circleGeo);

        for (let k = 0; k <= K_MAX; k++) {
            const color = new THREE.Color().setHSL(k / 7.7, 1, 0.6);
            const mat = new THREE.LineBasicMaterial({ color: color });

            const mesh = new THREE.LineLoop(edges, mat);
            mesh.renderOrder = 1;
            this.scene.add(mesh);

            this.regionMeshes.push(mesh);
            this.regionCenters.push(0);

            this.cleanUpTasks.push(() => mat.dispose());
        }

        this.cleanUpTasks.push(() => circleGeo.dispose());
        this.cleanUpTasks.push(() => edges.dispose());

        this.resetSimulation();
    }

    resetSimulation() {
        this.currentTime = 0;
        for (let k = 0; k <= K_MAX; k++) {
            this.regionCenters[k] = 0;
        }

        this.camera.position.set(0, 0, 10);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    updateSimulation(dt: number) {
        const targetTime = this.currentTime + ANIMATION_BASE_SPEED * dt / BASE_SCALE;

        // Process all exact threshold steps crossed during this frame
        while (this.regionCenters[0] + 1.0 <= targetTime + EPSILON) {
            this.regionCenters[0] += 1.0;

            let childCenter = this.regionCenters[0];
            let childRadius = 1.0;

            for (let k = 1; k <= K_MAX; k++) {
                const center = this.regionCenters[k];
                const radius = Math.pow(this.settings.S, k);
                const dist = Math.abs(center - childCenter);

                if (dist + childRadius <= radius + EPSILON) {
                    break;
                } else {
                    this.regionCenters[k] = childCenter;
                }

                childCenter = this.regionCenters[k];
                childRadius = radius;
            }
        }

        this.currentTime = targetTime;
    }

    animate() {
        this.timer.update();
        this.controls.update();
        this.handleResize();

        const dt = this.timer.getDelta();
        this.updateSimulation(dt);

        this.render();
    }

    render() {
        const [p, q] = this.settings.pq;

        // 2. Calculate Minkowski Normal Vectors
        const n1 = new THREE.Vector3(0, 1, 0);

        const n2 = new THREE.Vector3(Math.sin(Math.PI / p), -Math.cos(Math.PI / p), 0);

        // Derived by enforcing dot_minkowski(n2, n3) = -cos(PI/q) and dot_minkowski(n3, n3) = 1
        const n3_x = -Math.cos(Math.PI / q) / Math.sin(Math.PI / p);
        const n3_z = -Math.sqrt(n3_x * n3_x - 1.0); // Must be negative so origin is inside
        const n3 = new THREE.Vector3(n3_x, 0, n3_z);

        // Triangle: (a,pi/p), (b,pi/q), (c,pi/2), c is hypotenuse
        // cosine rule: cos(alpha) = -cos(beta)cos(gamma) + sin(beta)sin(gamma)cosh(a)
        // plug in gamma=pi/2 to get: cosh(a) = cos(alpha)/sin(beta)
        const a = Math.acosh(Math.cos(Math.PI / p) / Math.sin(Math.PI / q));
        const b = Math.acosh(Math.cos(Math.PI / q) / Math.sin(Math.PI / p));
        // cosh(c) = cosh(a)*cosh(b)
        const c = Math.acosh(1.0 / (Math.tan(Math.PI / p) * Math.tan(Math.PI / q)));

        // 1. Calculate Period L, this is the sum of the sides the path takes before repeating
        let L = p % 2 == 0 ? 2 * b : (q % 2 == 0 ? 2 * (b + c) : 2 * (a + b + c));

        const s = this.currentTime * BASE_SCALE;
        const wrapCount = Math.floor(s / L);
        const offset = s - wrapCount * L - L / 2;   // centering to migitate floating point errors

        const v = Math.tanh(offset / 2.0);

        if (this.poincareBoundaryMesh.material instanceof THREE.ShaderMaterial) {
            this.poincareBoundaryMesh.material.uniforms.u_time.value = performance.now();
            this.poincareBoundaryMesh.material.uniforms.u_shift.value = v;
            this.poincareBoundaryMesh.material.uniforms.u_n1.value.copy(n1);
            this.poincareBoundaryMesh.material.uniforms.u_n2.value.copy(n2);
            this.poincareBoundaryMesh.material.uniforms.u_n3.value.copy(n3);
        }

        for (let k = 0; k <= K_MAX; k++) {
            // Intrinsic center of region k relative to the object's current position
            const D_k = BASE_SCALE * (this.regionCenters[k] - this.currentTime);
            const R_k = BASE_SCALE * Math.pow(this.settings.S, k);

            // Map geodesic endpoints to Poincaré disk via x_e = tanh(x_h / 2)
            const hMin = D_k - R_k;
            const hMax = D_k + R_k;

            const eMin = Math.tanh(hMin / 2);
            const eMax = Math.tanh(hMax / 2);

            let xc = (eMax + eMin) / 2;
            let re = (eMax - eMin) / 2;

            this.regionMeshes[k].position.set(xc, 0, 0);
            this.regionMeshes[k].scale.set(re, re, 1);
        }

        this.objectMesh.scale.set(OBJECT_SIZE / this.camera.zoom, OBJECT_SIZE / this.camera.zoom);
        this.renderer.render(this.scene, this.camera);
    }
}