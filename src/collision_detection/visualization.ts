// Mostly AI-generated visualization

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CertificateBroadPhase, MovingSphere } from './broadPhase';

const N = 1000;
const M = 10;
const R = 0.2;
const TIMESTEP = 0.001;

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
    detector!: CertificateBroadPhase;
    balls: MovingSphere[] = [];
    colors: THREE.Color[] = [];
    selectedIndex: number | null = null;
    previousSelectedIndex: number | null = null;

    // Shared geometries
    circleGeom!: THREE.CircleGeometry;

    // Interaction state
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    dragState: number | null = null; // Stores index of dragged ball
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    guiState = {
        animate: true,
        showActive: false,
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
        if (!this.isInitialized)
            return;
        this.renderer.setAnimationLoop(null);
        this.container.removeChild(this.textElement);
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
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
        this.gui.add(this.guiState, 'showActive').name("Show active");
    }

    createTextElement(container: HTMLElement) {
        this.textElement = document.createElement('div');

        // Position it absolutely within the parent container
        this.textElement.style.position = 'absolute';
        this.textElement.style.top = '20px';
        this.textElement.style.left = '20px';

        // Basic typography styling
        this.textElement.style.color = 'white';
        this.textElement.style.fontFamily = 'monospace, sans-serif';
        this.textElement.style.fontSize = '18px';
        this.textElement.style.whiteSpace = 'pre'; // Preserves line breaks if you pass them

        // Crucial: prevents the text from blocking your three.js raycaster/dragging
        this.textElement.style.pointerEvents = 'none';
        this.textElement.style.zIndex = '10';

        container.appendChild(this.textElement);
    }

    setupCamera() {
        // Orthographic camera works best for 2D
        this.camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false; // Keep it locked to 2D
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.circleGeom = new THREE.CircleGeometry(1, 64);
        this.cleanUpTasks.push(() => this.circleGeom.dispose());

        // Initialize 20 random balls
        for (let i = 0; i < N; i++) {
            const pos = new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, 0);
            const radius = R * (0.25 + Math.random() * 0.75);
            const ball = new MovingSphere(pos, radius, M);

            this.balls.push(ball);

            // Random distinct color per index
            const color = new THREE.Color().setHSL(i / N, 0.8, 0.5);
            this.colors.push(color);
        }
        this.detector = new CertificateBroadPhase(this.balls);
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
            this.raycaster.setFromCamera(this.pointer, this.camera);

            // Raycast only against the base meshes
            const baseMeshes = this.balls
                .filter(b => b.obj && b.obj.userData.baseMesh)
                .map(b => b.obj!.userData.baseMesh);

            const intersects = this.raycaster.intersectObjects(baseMeshes);
            if (intersects.length > 0) {
                const hitMesh = intersects[0].object;
                const hitIndex = this.balls.findIndex(b => b.obj && b.obj.userData.baseMesh === hitMesh);

                if (hitIndex !== -1) {
                    if (this.selectedIndex !== hitIndex) {
                        this.previousSelectedIndex = this.selectedIndex;
                        this.selectedIndex = hitIndex;
                    }
                    this.dragState = hitIndex;
                    this.controls.enabled = false;
                }
            } else {
                // Clicking empty space deselects
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
        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];

            // 1. Initialize object tree for the ball if missing
            if (!ball.obj) {
                ball.obj = new THREE.Group();

                const baseMesh = new THREE.Mesh(this.circleGeom, new THREE.MeshBasicMaterial({
                    color: this.colors[i],
                    transparent: true,
                    depthTest: false,
                    depthWrite: false
                }));

                const horizonMesh = new THREE.Mesh(this.circleGeom, new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    depthTest: false,
                    depthWrite: false
                }));

                ball.obj.userData = {
                    baseMesh,
                    horizonMesh,
                    certMeshes: [] as THREE.Mesh[]
                };

                ball.obj.add(baseMesh);
                ball.obj.add(horizonMesh);
                this.scene.add(ball.obj);

                this.cleanUpTasks.push(() => {
                    baseMesh.material.dispose();
                    horizonMesh.material.dispose();
                });
            }

            // 2. Resolve visibilities based on interaction state
            let isBaseProminent = true;
            if (this.guiState.showActive && this.selectedIndex !== null) {
                // isBaseProminent = (i === this.selectedIndex) || this.balls[this.selectedIndex].active.has(i);
                // isBaseProminent = (i === this.selectedIndex) || this.detector.active.has(this.selectedIndex, i);
            }

            const isExtraProminent = (i === this.selectedIndex) || (i === this.previousSelectedIndex);

            const baseOpacity = isBaseProminent ? 0.9 : 0.15;
            const extraOpacity = isExtraProminent ? 0.4 : 0.05;

            // 3. Update Base Disc
            const baseMesh = ball.obj.userData.baseMesh as THREE.Mesh;
            baseMesh.position.copy(ball.position);
            baseMesh.scale.setScalar(ball.radius);
            (baseMesh.material as THREE.MeshBasicMaterial).opacity = baseOpacity;
            baseMesh.renderOrder = isBaseProminent ? 20 : 10; // Draw base discs on top

            // 4. Update Horizon Disc
            const horizonMesh = ball.obj.userData.horizonMesh as THREE.Mesh;
            horizonMesh.position.copy(ball.buildPosition);
            horizonMesh.scale.setScalar(ball.certificates.divider);
            (horizonMesh.material as THREE.MeshBasicMaterial).opacity = extraOpacity * 0.5; // Slightly dimmer than certificates
            horizonMesh.renderOrder = 0; // Draw horizon beneath everything

            // 5. Sync and update Certificate Discs
            const certMeshes = ball.obj.userData.certMeshes as THREE.Mesh[];
            let certIndex = 0;

            for (const cert of ball.certificates) {
                // Add new meshes if needed
                if (certIndex >= certMeshes.length) {
                    const m = new THREE.Mesh(this.circleGeom, new THREE.MeshBasicMaterial({
                        transparent: true,
                        depthTest: false,
                        depthWrite: false
                    }));
                    certMeshes.push(m);
                    ball.obj.add(m);
                    this.cleanUpTasks.push(() => m.material.dispose());
                }

                const m = certMeshes[certIndex];
                m.visible = true;
                m.position.copy(ball.buildPosition);
                m.scale.setScalar(cert.value);

                const mat = m.material as THREE.MeshBasicMaterial;
                mat.color.copy(this.colors[cert.index]);
                mat.opacity = extraOpacity;
                m.renderOrder = certIndex + 1; // Drawn in decreasing beta order (smallest renderOrder first)

                certIndex++;
            }

            // Hide unused cached meshes if the array shrunk
            for (let j = certIndex; j < certMeshes.length; j++) {
                certMeshes[j].visible = false;
            }
        }
    }


    animateBallPositions(time: number): void {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;

        // The orthographic camera in the template has a vertical view size of 10 (y from -5 to 5).
        // We use an amplitude of 4.2 to keep balls near the edge but mostly visible (accounting for radius).
        const yAmp = 4.2;
        const xAmp = 4.2 * aspect;
        const baseSpeed = 1.5;

        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];

            // Generate pseudo-random deterministic phases so balls start scattered
            const phaseX = i * 1.37;
            const phaseY = i * 2.51;

            // To maintain "same-ish" speeds across the screen regardless of aspect ratio, 
            // frequency is inversely proportional to the amplitude. 
            // We perturb the frequencies by +/- 15% using sine/cosine of the index 
            // so that each ball gets a uniquely shaped Lissajous curve.
            const freqX = (baseSpeed / xAmp) * (1.0 + 0.15 * Math.sin(i * 0.7));
            const freqY = (baseSpeed / yAmp) * (1.0 + 0.15 * Math.cos(i * 0.7));

            ball.position.x = xAmp * Math.sin(time * freqX + phaseX);
            ball.position.y = yAmp * Math.cos(time * freqY + phaseY);
            // z remains 0 
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
            `M=${M}`,
            `detector: ${(1000 / this.detectorTime).toFixed(2)} fps`,
            `brute force: ${(1000 / this.bfTime).toFixed(2)} fps`,
            `count=${count}`,
            `countBF=${countBF}`,
        ];
        this.textElement.innerHTML = textParts.join("\n");

        if (count !== countBF)
            throw Error("Counts don't match.");

        this.updateVisuals();
        this.renderer.render(this.scene, this.camera);
    }
}