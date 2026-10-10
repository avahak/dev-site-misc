import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { FundamentalPolygon, GroupElement, MobiusMatrix, SidePairing } from '../types';
import { FundamentalPolygonBuilder } from '../math/polygon';
import { runTests } from '../math/test';
import { VoronoiPipeline } from './voronoi';
import { PaintPipeline } from './paint';
import { TriangleGroup } from '../math/group';
import { MobiusTransform } from '../math/mobius';
import { ComplexMath } from '../math/complex';
import { panGView } from './view';
import vs from './shaders/vs.glsl?raw';
import fs from './shaders/fs.glsl?raw';

const MAX_SIDES = 12;

export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[] = [];
    gui: any;
    timer: THREE.Timer = new THREE.Timer();
    isInitialized: boolean;
    containerSize: THREE.Vector2 = new THREE.Vector2(0, 0);

    scene!: THREE.Scene;
    camera!: THREE.Camera;
    shaderMaterial!: THREE.ShaderMaterial;

    polygon!: FundamentalPolygon;
    folds!: MobiusMatrix[];
    subgroup!: GroupElement[];
    paintPipeline!: PaintPipeline;

    gView: MobiusMatrix = MobiusTransform.identity();
    resolution: THREE.Vector2 = new THREE.Vector2();
    scale: number = 1.8;

    // GUI Configurable Parameters
    brushRadius: number = 0.04;
    brushColor: string = '#ff3344';
    voronoiSeedCount: number = 20;
    voronoiProminence: number = 0.7; // Controls saturation/darkness vs colorful/light

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.isInitialized = false;
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x111111, 1);
        this.container.appendChild(this.renderer.domElement);

        runTests();

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
        this.shaderMaterial?.dispose();
        this.paintPipeline?.dispose();
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

        this.renderer.getDrawingBufferSize(this.resolution);

        this.shaderMaterial.uniforms.resolution.value = this.resolution;
    }

    createGUI() {
        this.gui = new GUI();

        const brushFolder = this.gui.addFolder('Brush Settings');
        brushFolder.add(this, 'brushRadius', 0.005, 0.25, 0.001).name('Radius');

        // Store reference to the color controller to update its UI widget programmatically
        const colorController = brushFolder.addColor(this, 'brushColor').name('Color');

        brushFolder.add({
            randomColor: () => {
                // Generate a random 6-digit hex color string
                const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                this.brushColor = randomHex;
                colorController.setValue(randomHex); // Updates both the property and the lil-gui color picker UI
            }
        }, 'randomColor').name('Random Color');

        const voronoiFolder = this.gui.addFolder('Voronoi Background');
        voronoiFolder.add(this, 'voronoiSeedCount', 5, 100, 1).name('Seed Count');
        voronoiFolder.add(this, 'voronoiProminence', 0.0, 1.0, 0.05).name('Prominence');
        voronoiFolder.add(this, 'resetCanvas').name('Reset & Re-bake');

        const timeFolder = this.gui.addFolder('Time Animation');
        const myObject = { timeScale: 0 };
        timeFolder.add(myObject, 'timeScale', -6, 2, 1).name("Log time scale")
            .onChange((value: number) => {
                this.timer.setTimescale(Math.exp(value));
            });
    }

    setupCamera() {
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);
    }

    setupScene() {
        this.scene = new THREE.Scene();

        const p = 6;
        const q = 4;
        const pairings: SidePairing[] = [
            { edgeIndex: 0, targetEdgeIndex: 3, sign: -1 },
            { edgeIndex: 1, targetEdgeIndex: 5, sign: -1 },
            { edgeIndex: 2, targetEdgeIndex: 4, sign: -1 },
            { edgeIndex: 3, targetEdgeIndex: 0, sign: -1 },
            { edgeIndex: 4, targetEdgeIndex: 2, sign: -1 },
            { edgeIndex: 5, targetEdgeIndex: 1, sign: -1 },
        ];

        this.polygon = FundamentalPolygonBuilder.build(p, q);
        this.folds = FundamentalPolygonBuilder.getTilingFolds(this.polygon, pairings);

        const u_T_re = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
        const u_T_im = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
        const u_g_re = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
        const u_g_im = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());

        for (let i = 0; i < p; i++) {
            const T = this.polygon.sideTests[i];
            u_T_re[i].set(T.a.re, T.b.re, T.c.re, T.d.re);
            u_T_im[i].set(T.a.im, T.b.im, T.c.im, T.d.im);

            const g = this.folds[i];
            u_g_re[i].set(g.a.re, g.b.re, g.c.re, g.d.re);
            u_g_im[i].set(g.a.im, g.b.im, g.c.im, g.d.im);
        }

        const generators = TriangleGroup.computeSidePairingGenerators(this.polygon, pairings, false);
        this.subgroup = TriangleGroup.exploreSubgroupBounded(generators, 0.98, 10, false);

        // Initialize PaintPipeline
        this.paintPipeline = new PaintPipeline(this.renderer, 2048);
        this.paintPipeline.setSubgroup(this.subgroup);

        // Generate initial Voronoi texture and bake into paint canvas
        const { R_tex } = this.rebuildVoronoiCanvas();

        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: new THREE.Vector2() },
                time: { value: 0 },
                u_sideCount: { value: p },
                u_T_re: { value: u_T_re },
                u_T_im: { value: u_T_im },
                u_g_re: { value: u_g_re },
                u_g_im: { value: u_g_im },
                u_paintTexture: { value: this.paintPipeline.getCurrentTexture() },
                u_R_tex: { value: R_tex },
                u_gView_re: { value: null },
                u_gView_im: { value: null },
                scale: { value: this.scale },
            },
            vertexShader: vs,
            fragmentShader: fs,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        this.scene.add(new THREE.Mesh(geometry, this.shaderMaterial));
        this.cleanUpTasks.push(() => geometry.dispose());
        this.cleanUpTasks.push(() => this.shaderMaterial.dispose());
        this.cleanUpTasks.push(() => this.paintPipeline.dispose());
    }

    public resetCanvas() {
        const { R_tex } = this.rebuildVoronoiCanvas();
        if (this.shaderMaterial) {
            this.shaderMaterial.uniforms.u_paintTexture.value = this.paintPipeline.getCurrentTexture();
            this.shaderMaterial.uniforms.u_R_tex.value = R_tex;
        }
    }

    private rebuildVoronoiCanvas() {
        const voronoiPipeline = new VoronoiPipeline(2048);
        const { texture: baseTexture, R_tex } = voronoiPipeline.updateBaseTexture(
            this.renderer,
            this.polygon,
            this.subgroup,
            Math.round(this.voronoiSeedCount),
            0.05,
            this.voronoiProminence
        );

        this.paintPipeline.setR_tex(R_tex);
        this.paintPipeline.initializeWithTexture(baseTexture);
        voronoiPipeline.dispose();

        return { R_tex };
    }

    inputTransform(x: number, y: number, dx: number, dy: number) {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        const s = this.scale / Math.min(w, h);
        const z = { re: s * (x - w / 2), im: -s * (y - h / 2) };
        const dz = { re: s * dx, im: -s * dy };
        this.gView = panGView(this.gView, z, ComplexMath.add(z, dz), this.polygon, this.folds);
    }

    inputStroke(x: number, y: number, dx: number, dy: number) {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        const s = this.scale / Math.min(w, h);

        const z1Local = { re: s * (x - w / 2), im: -s * (y - h / 2) };
        const z2Local = { re: s * (x + dx - w / 2), im: -s * (y + dy - h / 2) };

        const z1 = MobiusTransform.apply(this.gView, z1Local);
        const z2 = MobiusTransform.apply(this.gView, z2Local);

        if (z1.re * z1.re + z1.im * z1.im >= 0.99 || z2.re * z2.re + z2.im * z2.im >= 0.99) {
            return;
        }

        this.paintPipeline.addStroke(z1, z2, this.brushRadius, new THREE.Color(this.brushColor));
        this.shaderMaterial.uniforms.u_paintTexture.value = this.paintPipeline.getCurrentTexture();
    }

    animate() {
        this.timer.update();
        this.handleResize();
        this.render();
    }

    render() {
        const t = this.timer.getElapsed();
        this.shaderMaterial.uniforms.time.value = t;
        this.shaderMaterial.uniforms.u_gView_re.value = new THREE.Vector4(this.gView.a.re, this.gView.b.re, this.gView.c.re, this.gView.d.re);
        this.shaderMaterial.uniforms.u_gView_im.value = new THREE.Vector4(this.gView.a.im, this.gView.b.im, this.gView.c.im, this.gView.d.im);
        this.shaderMaterial.uniforms.scale.value = this.scale;
        this.renderer.render(this.scene, this.camera);
    }
}