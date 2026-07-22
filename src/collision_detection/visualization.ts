// Lot of AI code here

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CertificateBroadPhaseLazy, MovingSphere } from './broadPhaseLazy';

const N = 2000;
const M = 10;
const MAX_FP = 30;
const R = 0.1;
const TIMESTEP = 0.001;
const MAX_LINKS = 100000; // Upper bound for active link visualization
const SAMPLE_COUNT = 50;

// Opacity settings for the special regions B(buildPosition, divider)
const HORIZON_PROM_OPACITY = 0.2;
const HORIZON_DIM_OPACITY = 0.03;

export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[] = [];
    gui: any;
    controls!: OrbitControls;
    isInitialized: boolean;
    containerSize: THREE.Vector2 = new THREE.Vector2(0, 0);

    scene!: THREE.Scene;
    camera!: THREE.OrthographicCamera;
    textElement!: HTMLDivElement;

    // Algorithm state
    detector!: CertificateBroadPhaseLazy;
    balls: MovingSphere[] = [];
    colors: THREE.Color[] = [];
    selectedIndex: number | null = null;
    previousSelectedIndex: number | null = null;

    // Shared geometries & Instanced rendering
    circleGeom!: THREE.CircleGeometry;

    // We use two meshes per type to handle exact opacities (prominent vs dim) efficiently
    baseMeshProm!: THREE.InstancedMesh;
    baseMeshDim!: THREE.InstancedMesh;
    horizMeshProm!: THREE.InstancedMesh;
    horizMeshDim!: THREE.InstancedMesh;

    // Links rendering
    linksGeometry!: THREE.BufferGeometry;
    linksMesh!: THREE.LineSegments;

    // Interaction state
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    dragState: number | null = null; // Stores index of dragged ball
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    guiState = {
        animate: true,
        linkMode: 'Sampled', // Modes: 'None', 'Selected', 'Sampled', 'All'
        validate: false,
    };

    simulationTime = 0;
    detectorTime = 0;
    bfTime = 0;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.isInitialized = false;
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 1); // Black background
        this.container.appendChild(this.renderer.domElement);

        this.setupCamera();
        this.setupScene();
        this.createGUI();
        this.createTextElement(this.container);
        this.setupInteraction();

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
        this.container.removeChild(this.textElement);
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks) task();
        this.controls.dispose();
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
        const viewSize = 15;
        this.camera.left = -aspect * viewSize / 2;
        this.camera.right = aspect * viewSize / 2;
        this.camera.top = viewSize / 2;
        this.camera.bottom = -viewSize / 2;
        this.camera.updateProjectionMatrix();
    }

    createGUI() {
        this.gui = new GUI();
        this.gui.add(this.guiState, 'animate').name("Animate");
        this.gui.add(this.guiState, 'linkMode', ['None', 'Selected', 'Sampled', 'All']).name("Link Mode");
        this.gui.add(this.guiState, 'validate').name("Validate");
    }

    createTextElement(container: HTMLElement) {
        this.textElement = document.createElement('div');
        this.textElement.style.position = 'absolute';
        this.textElement.style.top = '20px';
        this.textElement.style.left = '20px';
        this.textElement.style.color = 'white';
        this.textElement.style.fontFamily = 'monospace, sans-serif';
        this.textElement.style.fontSize = '18px';
        this.textElement.style.whiteSpace = 'pre';
        this.textElement.style.pointerEvents = 'none';
        this.textElement.style.zIndex = '10';
        container.appendChild(this.textElement);
    }

    setupCamera() {
        this.camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false; // Keep it locked to 2D
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.circleGeom = new THREE.CircleGeometry(1, 32);

        // Factory for materials enforcing strict layering via depth/renderOrder rules
        const createMat = (opacity: number) => new THREE.MeshBasicMaterial({
            transparent: true,
            opacity,
            depthTest: false,
            depthWrite: false
        });

        const basePromMat = createMat(0.9);
        const baseDimMat = createMat(0.15);
        const horizPromMat = createMat(HORIZON_PROM_OPACITY);
        const horizDimMat = createMat(HORIZON_DIM_OPACITY);

        // Split meshes to retain exact transparency without custom shaders
        this.baseMeshProm = new THREE.InstancedMesh(this.circleGeom, basePromMat, N);
        this.baseMeshDim = new THREE.InstancedMesh(this.circleGeom, baseDimMat, N);
        this.horizMeshProm = new THREE.InstancedMesh(this.circleGeom, horizPromMat, N);
        this.horizMeshDim = new THREE.InstancedMesh(this.circleGeom, horizDimMat, N);

        // Strict occlusion ordering: Lines > Prominent Bases > Dim Bases > Prominent Horizons > Dim Horizons
        this.horizMeshDim.renderOrder = 1;
        this.horizMeshProm.renderOrder = 2;
        this.baseMeshDim.renderOrder = 3;
        this.baseMeshProm.renderOrder = 4;

        this.scene.add(this.baseMeshProm, this.baseMeshDim, this.horizMeshProm, this.horizMeshDim);

        // --- Batched Line Segments for Active Links ---
        this.linksGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(MAX_LINKS * 2 * 3);
        const colors = new Float32Array(MAX_LINKS * 2 * 3);

        this.linksGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.linksGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const lineMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            depthTest: false,
            depthWrite: false
        });
        this.linksMesh = new THREE.LineSegments(this.linksGeometry, lineMat);
        this.linksMesh.renderOrder = 5; // Always on top of everything
        this.scene.add(this.linksMesh);

        this.cleanUpTasks.push(() => {
            this.circleGeom.dispose();
            basePromMat.dispose();
            baseDimMat.dispose();
            horizPromMat.dispose();
            horizDimMat.dispose();
            this.linksGeometry.dispose();
            lineMat.dispose();
        });

        for (let i = 0; i < N; i++) {
            const pos = new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, 0);
            const radius = R * (0.25 + Math.random() * 0.75);
            const ball = new MovingSphere(pos, radius, MAX_FP);

            this.balls.push(ball);
            this.colors.push(new THREE.Color().setHSL(i / N, 0.8, 0.5));
        }

        this.detector = new CertificateBroadPhaseLazy(this.balls, M);
    }

    setupInteraction() {
        const onPointerMove = (event: PointerEvent) => {
            const rect = this.container.getBoundingClientRect();
            this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            if (this.dragState !== null) {
                this.raycaster.setFromCamera(this.pointer, this.camera);
                const target = new THREE.Vector3();
                if (this.raycaster.ray.intersectPlane(this.dragPlane, target)) {
                    this.balls[this.dragState].position.copy(target);
                }
            }
        };

        const onPointerDown = (event: PointerEvent) => {
            if (event.button !== 0) return; // Only process left-click for selection

            // Unproject exact mouse position into 2D world space
            const worldPt = new THREE.Vector3(this.pointer.x, this.pointer.y, 0).unproject(this.camera);

            let hitIndex = -1;
            let minSqDist = Infinity;

            // Mathematical distance check (100% reliable compared to Raycasting InstancedMeshes)
            for (let i = 0; i < this.balls.length; i++) {
                const ball = this.balls[i];
                const dx = ball.position.x - worldPt.x;
                const dy = ball.position.y - worldPt.y;
                const sqDist = dx * dx + dy * dy;

                if (sqDist <= ball.radius * ball.radius) {
                    // Pick the closest ball to the exact mouse cursor center
                    if (sqDist < minSqDist) {
                        minSqDist = sqDist;
                        hitIndex = i;
                    }
                }
            }

            if (hitIndex !== -1) {
                if (this.selectedIndex !== hitIndex) {
                    this.previousSelectedIndex = this.selectedIndex;
                    this.selectedIndex = hitIndex;
                }
                this.dragState = hitIndex;
                this.controls.enabled = false;
            } else {
                this.previousSelectedIndex = this.selectedIndex;
                this.selectedIndex = null;
            }
        };

        const onPointerUp = () => {
            this.dragState = null;
            this.controls.enabled = true;
        };

        const dom = this.renderer.domElement;
        dom.addEventListener('pointermove', onPointerMove);
        dom.addEventListener('pointerdown', onPointerDown);
        dom.addEventListener('pointerup', onPointerUp);
        dom.addEventListener('pointerleave', onPointerUp);

        this.cleanUpTasks.push(() => {
            dom.removeEventListener('pointermove', onPointerMove);
            dom.removeEventListener('pointerdown', onPointerDown);
            dom.removeEventListener('pointerup', onPointerUp);
            dom.removeEventListener('pointerleave', onPointerUp);
        });
    }

    updateVisuals() {
        const dummy = new THREE.Object3D();
        const whiteColor = new THREE.Color(0xffffff);

        let basePromCount = 0;
        let baseDimCount = 0;
        let horizPromCount = 0;
        let horizDimCount = 0;
        let linkVertexIndex = 0;

        const linkPositions = this.linksGeometry.attributes.position.array as Float32Array;
        const linkColors = this.linksGeometry.attributes.color.array as Float32Array;

        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];

            // Determine if this specific ball should be prominently highlighted
            let isProminent = (i === this.selectedIndex) || (i === this.previousSelectedIndex);
            if (this.guiState.linkMode === 'Sampled' && i < SAMPLE_COUNT) {
                isProminent = true;
            }

            // 1. Queue Base Discs
            dummy.position.set(ball.position.x, ball.position.y, 0);
            dummy.scale.setScalar(ball.radius);
            dummy.updateMatrix();

            if (isProminent) {
                this.baseMeshProm.setMatrixAt(basePromCount, dummy.matrix);
                this.baseMeshProm.setColorAt(basePromCount, this.colors[i]);
                basePromCount++;
            } else {
                this.baseMeshDim.setMatrixAt(baseDimCount, dummy.matrix);
                this.baseMeshDim.setColorAt(baseDimCount, this.colors[i]);
                baseDimCount++;
            }

            // 2. Queue Horizon Discs (Build Regions)
            dummy.position.set(ball.buildPosition.x, ball.buildPosition.y, 0);
            // dummy.scale.setScalar(ball.certificates.divider);
            dummy.scale.setScalar(ball.divider);
            dummy.updateMatrix();

            if (isProminent) {
                this.horizMeshProm.setMatrixAt(horizPromCount, dummy.matrix);
                this.horizMeshProm.setColorAt(horizPromCount, whiteColor);
                horizPromCount++;
            } else {
                this.horizMeshDim.setMatrixAt(horizDimCount, dummy.matrix);
                this.horizMeshDim.setColorAt(horizDimCount, whiteColor);
                horizDimCount++;
            }

            // 3. Queue Active Links
            let showLinks = false;
            if (this.guiState.linkMode === 'All') {
                showLinks = true;
            } else if (this.guiState.linkMode === 'Sampled' || this.guiState.linkMode === 'Selected') {
                showLinks = isProminent;
            }

            if (showLinks && (ball as any).active) {
                for (const neighborIdx of (ball as any).active) {
                    if (linkVertexIndex >= MAX_LINKS * 6) break;

                    const neighbor = this.balls[neighborIdx];

                    // Source Point (Gold/Magenta)
                    linkPositions[linkVertexIndex] = ball.position.x;
                    linkPositions[linkVertexIndex + 1] = ball.position.y;
                    linkPositions[linkVertexIndex + 2] = 0.0;
                    linkColors[linkVertexIndex] = 1.0;
                    linkColors[linkVertexIndex + 1] = 0.8;
                    linkColors[linkVertexIndex + 2] = 0.0;
                    linkVertexIndex += 3;

                    // Target Point (Cyan)
                    linkPositions[linkVertexIndex] = neighbor.position.x;
                    linkPositions[linkVertexIndex + 1] = neighbor.position.y;
                    linkPositions[linkVertexIndex + 2] = 0.0;
                    linkColors[linkVertexIndex] = 0.0;
                    linkColors[linkVertexIndex + 1] = 1.0;
                    linkColors[linkVertexIndex + 2] = 1.0;
                    linkVertexIndex += 3;
                }
            }
        }

        // 4. Update Instance counts and flag GPUs
        this.baseMeshProm.count = basePromCount;
        this.baseMeshProm.instanceMatrix.needsUpdate = true;
        if (this.baseMeshProm.instanceColor) this.baseMeshProm.instanceColor.needsUpdate = true;

        this.baseMeshDim.count = baseDimCount;
        this.baseMeshDim.instanceMatrix.needsUpdate = true;
        if (this.baseMeshDim.instanceColor) this.baseMeshDim.instanceColor.needsUpdate = true;

        this.horizMeshProm.count = horizPromCount;
        this.horizMeshProm.instanceMatrix.needsUpdate = true;
        if (this.horizMeshProm.instanceColor) this.horizMeshProm.instanceColor.needsUpdate = true;

        this.horizMeshDim.count = horizDimCount;
        this.horizMeshDim.instanceMatrix.needsUpdate = true;
        if (this.horizMeshDim.instanceColor) this.horizMeshDim.instanceColor.needsUpdate = true;

        this.linksGeometry.setDrawRange(0, linkVertexIndex / 3);
        this.linksGeometry.attributes.position.needsUpdate = true;
        this.linksGeometry.attributes.color.needsUpdate = true;
    }

    animateBallPositions(time: number): void {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;

        const yAmp = 4.2;
        const xAmp = 4.2 * aspect;
        const baseSpeed = 1.5;

        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            const phaseX = i * 1.37;
            const phaseY = i * 2.51;
            const freqX = (baseSpeed / xAmp) * (1.0 + 0.15 * Math.sin(i * 0.7));
            const freqY = (baseSpeed / yAmp) * (1.0 + 0.15 * Math.cos(i * 0.7));

            ball.position.x = xAmp * Math.sin(time * freqX + phaseX);
            ball.position.y = yAmp * Math.cos(time * freqY + phaseY);
        }
    }

    animate() {
        this.controls.update();
        this.handleResize();
        this.render();
    }

    render() {
        this.simulationTime += TIMESTEP;
        if (this.guiState.animate)
            this.animateBallPositions(this.simulationTime);

        let time, dt, deviation, normalizedDeviation, alpha;

        time = performance.now();
        this.detector.update();
        const count = this.detector.countCollisions();
        dt = performance.now() - time;
        deviation = Math.abs(dt - this.detectorTime);
        normalizedDeviation = Math.min(deviation / this.detectorTime, 1);
        alpha = 0.01 + 0.04 * normalizedDeviation;
        this.detectorTime = (1 - alpha) * this.detectorTime + alpha * dt;

        time = performance.now();
        const countBF = this.detector.countCollisionsBruteForce();
        dt = performance.now() - time;
        deviation = Math.abs(dt - this.bfTime);
        normalizedDeviation = Math.min(deviation / this.bfTime, 1);
        alpha = 0.01 + 0.04 * normalizedDeviation;
        this.bfTime = (1 - alpha) * this.bfTime + alpha * dt;

        const textParts = [
            `n=${N}`,
            `MAX_FP=${MAX_FP}`,
            `detector: ${(1000 / this.detectorTime).toFixed(2)} fps`,
            `brute force: ${(1000 / this.bfTime).toFixed(2)} fps`,
            `count=${count}`,
            `countBF=${countBF}`,
        ];
        this.textElement.innerHTML = textParts.join("\n");

        if (this.guiState.validate)
            this.detector.validateInvariants();
        if (count !== countBF)
            throw Error("Counts don't match.");

        this.updateVisuals();
        this.renderer.render(this.scene, this.camera);
    }
}