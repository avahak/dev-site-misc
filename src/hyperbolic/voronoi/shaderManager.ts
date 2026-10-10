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
import { deserializeTiling } from '../tilingSerialization';

const MAX_SIDES = 12;

export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[] = [];
    gui: any;
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
    overlay: number = 0.1;
    scale: number = 1.5;

    // GUI Configurable Parameters
    brushRadius: number = 0.04;
    brushColor: string = '#ff3344';
    voronoiSeedCount: number = 10;
    voronoiProminence: number = 0.1;

    // Pre-allocated uniform containers (stable references for WebGL)
    private u_edgeA = new Float32Array(MAX_SIDES);
    private u_edgeB = new Float32Array(MAX_SIDES);
    private u_edgeMapRe = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
    private u_edgeMapIm = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
    private u_edgeReflected = new Float32Array(MAX_SIDES);
    private u_T_re = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
    private u_T_im = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
    private u_g_re = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
    private u_g_im = Array.from({ length: MAX_SIDES }, () => new THREE.Vector4());
    private u_gReflected = new Float32Array(MAX_SIDES);

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

        if (this.shaderMaterial) {
            this.shaderMaterial.uniforms.resolution.value = this.resolution;
        }
    }

    createGUI() {
        this.gui = new GUI();

        const brushFolder = this.gui.addFolder('Brush Settings');
        brushFolder.add(this, 'brushRadius', 0.01, 0.5, 0.001).name('Radius');
        const colorController = brushFolder.addColor(this, 'brushColor').name('Color');
        brushFolder.add({
            randomColor: () => {
                const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                this.brushColor = randomHex;
                colorController.setValue(randomHex);
            }
        }, 'randomColor').name('Random Color');

        const voronoiFolder = this.gui.addFolder('Voronoi Background');
        voronoiFolder.add(this, 'voronoiSeedCount', 3, 50, 1).name('Seed Count');
        voronoiFolder.add(this, 'voronoiProminence', 0.0, 1.0, 0.05).name('Prominence');
        voronoiFolder.add(this, 'resetCanvas').name('Reset & Re-bake');

        const viewFolder = this.gui.addFolder('View Settings');
        viewFolder.add(this, 'scale', 0.25, 2.05, 0.05).name('Scale / Zoom');
        viewFolder.add(this, 'overlay', 0.0, 0.8).name('Overlay');
        viewFolder.add({
            savePNG: () => this.paintPipeline.saveTextureAsPNG('poincare_painting.png')
        }, 'savePNG').name('Save Paint as PNG');
        viewFolder.add({
            importClipboard: () => this.importTilingFromClipboard()
        }, 'importClipboard').name('Import Tiling from Clipboard');
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

        // const p = 6;
        // const q = 4;
        // const pairings: SidePairing[] = [
        //     { edgeIndex: 0, targetEdgeIndex: 0, sign: 1 },
        //     { edgeIndex: 1, targetEdgeIndex: 1, sign: 1 },
        //     { edgeIndex: 2, targetEdgeIndex: 2, sign: 1 },
        //     { edgeIndex: 3, targetEdgeIndex: 3, sign: 1 },
        //     { edgeIndex: 4, targetEdgeIndex: 4, sign: 1 },
        //     { edgeIndex: 5, targetEdgeIndex: 5, sign: 1 },
        // ];

        this.paintPipeline = new PaintPipeline(this.renderer, 1024);

        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: new THREE.Vector2() },
                u_sideCount: { value: p },
                u_T_re: { value: this.u_T_re },
                u_T_im: { value: this.u_T_im },
                u_g_re: { value: this.u_g_re },
                u_g_im: { value: this.u_g_im },
                u_gReflected: { value: this.u_gReflected },
                u_paintTexture: { value: null },
                u_R_tex: { value: 1.0 },
                u_gView_re: { value: null },
                u_gView_im: { value: null },
                u_gViewReflected: { value: 0.0 },
                u_overlay: { value: 0.1 },
                u_scale: { value: this.scale },
                u_edgeA: { value: this.u_edgeA },
                u_edgeB: { value: this.u_edgeB },
                u_edgeMapRe: { value: this.u_edgeMapRe },
                u_edgeMapIm: { value: this.u_edgeMapIm },
                u_edgeReflected: { value: this.u_edgeReflected },
            },
            vertexShader: vs,
            fragmentShader: fs,
        });

        this.applyTiling(p, q, pairings);

        const geometry = new THREE.PlaneGeometry(2, 2);
        this.scene.add(new THREE.Mesh(geometry, this.shaderMaterial));
        this.cleanUpTasks.push(() => geometry.dispose());
        this.cleanUpTasks.push(() => this.shaderMaterial.dispose());
        this.cleanUpTasks.push(() => this.paintPipeline.dispose());
    }

    private applyTiling(p: number, q: number, pairings: SidePairing[]) {
        this.polygon = FundamentalPolygonBuilder.build(p, q);
        this.folds = FundamentalPolygonBuilder.getTilingFolds(this.polygon, pairings);

        for (let i = 0; i < MAX_SIDES; i++) {
            if (i < p) {
                const v1 = this.polygon.vertices[i];
                const v2 = this.polygon.vertices[(i + 1) % p];
                const T1 = MobiusTransform.mapToOrigin(v1);
                const v2Prime = MobiusTransform.apply(T1, v2);
                const theta = Math.atan2(v2Prime.im, v2Prime.re);
                const R = MobiusTransform.rotation(-theta);
                const M_edge = MobiusTransform.multiply(R, T1);

                const mappedV1 = MobiusTransform.apply(M_edge, v1);
                const mappedV2 = MobiusTransform.apply(M_edge, v2);
                let a = mappedV1.re;
                let b = mappedV2.re;
                if (a > b) {
                    const temp = a; a = b; b = temp;
                }

                this.u_edgeA[i] = a;
                this.u_edgeB[i] = b;
                this.u_edgeMapRe[i].set(M_edge.a.re, M_edge.b.re, M_edge.c.re, M_edge.d.re);
                this.u_edgeMapIm[i].set(M_edge.a.im, M_edge.b.im, M_edge.c.im, M_edge.d.im);
                this.u_edgeReflected[i] = M_edge.isReflected ? 1.0 : 0.0;

                const T = this.polygon.sideTests[i];
                this.u_T_re[i].set(T.a.re, T.b.re, T.c.re, T.d.re);
                this.u_T_im[i].set(T.a.im, T.b.im, T.c.im, T.d.im);

                const g = this.folds[i];
                this.u_g_re[i].set(g.a.re, g.b.re, g.c.re, g.d.re);
                this.u_g_im[i].set(g.a.im, g.b.im, g.c.im, g.d.im);
                this.u_gReflected[i] = g.isReflected ? 1.0 : 0.0;
            } else {
                this.u_edgeA[i] = 0;
                this.u_edgeB[i] = 0;
                this.u_edgeMapRe[i].set(1, 0, 0, 1);
                this.u_edgeMapIm[i].set(0, 0, 0, 0);
                this.u_edgeReflected[i] = 0.0;
                this.u_T_re[i].set(1, 0, 0, 1);
                this.u_T_im[i].set(0, 0, 0, 0);
                this.u_g_re[i].set(1, 0, 0, 1);
                this.u_g_im[i].set(0, 0, 0, 0);
                this.u_gReflected[i] = 0.0;
            }
        }

        const generators = TriangleGroup.computeSidePairingGenerators(this.polygon, pairings, false);
        this.subgroup = TriangleGroup.exploreSubgroupBounded(generators, 0.98, 10, false);

        this.paintPipeline.setSubgroup(this.subgroup);
        const { R_tex } = this.rebuildVoronoiCanvas();

        if (this.shaderMaterial) {
            this.shaderMaterial.uniforms.u_sideCount.value = p;
            this.shaderMaterial.uniforms.u_R_tex.value = R_tex;
            this.shaderMaterial.uniforms.u_paintTexture.value = this.paintPipeline.getCurrentTexture();
            this.shaderMaterial.uniforms.u_edgeA.value = this.u_edgeA;
            this.shaderMaterial.uniforms.u_edgeB.value = this.u_edgeB;
            this.shaderMaterial.uniforms.u_edgeMapRe.value = this.u_edgeMapRe;
            this.shaderMaterial.uniforms.u_edgeMapIm.value = this.u_edgeMapIm;
            this.shaderMaterial.uniforms.u_edgeReflected.value = this.u_edgeReflected;
            this.shaderMaterial.uniforms.u_T_re.value = this.u_T_re;
            this.shaderMaterial.uniforms.u_T_im.value = this.u_T_im;
            this.shaderMaterial.uniforms.u_g_re.value = this.u_g_re;
            this.shaderMaterial.uniforms.u_g_im.value = this.u_g_im;
            this.shaderMaterial.uniforms.u_gReflected.value = this.u_gReflected;
        }

        this.gView = MobiusTransform.identity();
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

    public async importTilingFromClipboard() {
        try {
            const jsonStr = await navigator.clipboard.readText();
            const data = deserializeTiling(jsonStr);

            this.applyTiling(data.p, data.q, data.sidePairings);
            console.log(`Successfully imported {${data.p}, ${data.q}} tiling from clipboard!`);
        } catch (err) {
            console.error('Failed to import tiling from clipboard. Make sure clipboard contains valid tiling JSON.', err);
        }
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

        if (z1.re * z1.re + z1.im * z1.im >= 0.99 || z2.re * z2.re + z2.im * z2.im >= 0.99)
            return;

        this.paintPipeline.addStroke(z1, z2, this.brushRadius, new THREE.Color(this.brushColor));
        this.shaderMaterial.uniforms.u_paintTexture.value = this.paintPipeline.getCurrentTexture();
    }

    animate() {
        this.handleResize();
        this.render();
    }

    render() {
        this.shaderMaterial.uniforms.u_gView_re.value = new THREE.Vector4(this.gView.a.re, this.gView.b.re, this.gView.c.re, this.gView.d.re);
        this.shaderMaterial.uniforms.u_gView_im.value = new THREE.Vector4(this.gView.a.im, this.gView.b.im, this.gView.c.im, this.gView.d.im);
        this.shaderMaterial.uniforms.u_gViewReflected.value = this.gView.isReflected ? 1.0 : 0.0; // <--- Add this
        this.shaderMaterial.uniforms.u_scale.value = this.scale;
        this.shaderMaterial.uniforms.u_overlay.value = this.overlay;
        this.renderer.render(this.scene, this.camera);
    }
}