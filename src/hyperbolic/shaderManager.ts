import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import vs from './shaders/vs.glsl?raw';
import fs from './shaders/fs.glsl?raw';
import { SidePairing } from './types';
import { computeSubgroupPreprocessing } from './hyperbolicPreprocessing';

const MAX_SIDES = 12;

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
    camera!: THREE.Camera;
    shaderMaterial!: THREE.ShaderMaterial;

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
        this.shaderMaterial?.dispose();
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

        this.shaderMaterial.uniforms.resolution.value = resolution;
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
    }

    setupCamera() {
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false;
    }

    setupScene() {
        this.scene = new THREE.Scene();

        // 1. Example Configuration: (p, q) = (6, 4) with e1~-e4, e2~-e6, e3~-e5
        const p = 6;
        const q = 4;
        const pairings: SidePairing[] = [
            { edgeIndex: 0, targetEdgeIndex: 3, sign: -1 }, // e1 ~ -e4
            { edgeIndex: 1, targetEdgeIndex: 5, sign: -1 }, // e2 ~ -e6
            { edgeIndex: 2, targetEdgeIndex: 4, sign: -1 }, // e3 ~ -e5
            { edgeIndex: 3, targetEdgeIndex: 0, sign: -1 }, // e4 ~ -e1
            { edgeIndex: 4, targetEdgeIndex: 2, sign: -1 }, // e5 ~ -e3
            { edgeIndex: 5, targetEdgeIndex: 1, sign: -1 }, // e6 ~ -e2
        ];

        // 2. Preprocessing pipeline
        const result = computeSubgroupPreprocessing(p, q, pairings);

        // 3. Prepare Uniform Arrays
        const u_T_re = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
        const u_T_im = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
        const u_g_re = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
        const u_g_im = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());

        for (let i = 0; i < p; i++) {
            const T = result.sideData[i].test;
            u_T_re[i].set(T.a.re, T.b.re, T.c.re, T.d.re);
            u_T_im[i].set(T.a.im, T.b.im, T.c.im, T.d.im);

            const g = result.sideData[i].fold;
            u_g_re[i].set(g.a.re, g.b.re, g.c.re, g.d.re);
            u_g_im[i].set(g.a.im, g.b.im, g.c.im, g.d.im);
        }

        // 4. Construct Material and Screen Plane
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: new THREE.Vector2() },
                time: { value: 0 },
                u_sideCount: { value: p },
                u_T_re: { value: u_T_re },
                u_T_im: { value: u_T_im },
                u_g_re: { value: u_g_re },
                u_g_im: { value: u_g_im },
            },
            vertexShader: vs,
            fragmentShader: fs,
            side: THREE.DoubleSide,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        this.scene.add(new THREE.Mesh(geometry, this.shaderMaterial));
        this.cleanUpTasks.push(() => geometry.dispose());
        this.cleanUpTasks.push(() => this.shaderMaterial.dispose());
    }

    animate() {
        this.timer.update();
        this.controls.update();
        this.handleResize();
        this.render();
    }

    render() {
        const t = this.timer.getElapsed();
        this.shaderMaterial.uniforms.time.value = t;
        this.renderer.render(this.scene, this.camera);
    }
}