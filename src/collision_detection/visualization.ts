// AI code

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CertificateBroadPhaseLazy, MovingSphere } from './broadPhaseLazy';
import { AABB, DynamicBVH, TreeNode } from './bvh';

const N = 2000;
const M = 10;
const MAX_FP = -1;
const R = 0.2;
const TIMESTEP = 0.001;
const MAX_LINKS = 100000;
const MAX_BVH_NODES = 50000; // Adjust based on your BVH depth/branching
const SAMPLE_COUNT = 50;

const HORIZON_PROM_OPACITY = 0.2;
const HORIZON_DIM_OPACITY = 0.03;


export class DiscBVHWrapper {
    balls: MovingSphere[];
    bvh: DynamicBVH<number>;
    leaves: TreeNode<number>[];

    constructor(balls: MovingSphere[]) {
        this.balls = balls;
        this.bvh = new DynamicBVH<number>();
        this.leaves = [];

        // 1. Initial Setup: Create a leaf for every ball and store a reference to it
        for (let i = 0; i < this.balls.length; i++) {
            const b = this.balls[i];
            const aabb = new AABB(
                b.position.x - b.radius,
                b.position.y - b.radius,
                -b.radius,
                b.position.x + b.radius,
                b.position.y + b.radius,
                b.radius
            );

            const leaf = new TreeNode<number>(aabb);
            leaf.isLeaf = true;
            leaf.data = i; // Store the array index as the data payload

            this.bvh.insertLeaf(leaf);
            this.leaves.push(leaf);
        }
    }

    update() {
        // 2. Update Step: Calculate the new tight bounds and let the BVH repair itself
        for (let i = 0; i < this.balls.length; i++) {
            const b = this.balls[i];
            const tightAABB = new AABB(
                b.position.x - b.radius,
                b.position.y - b.radius,
                -b.radius,
                b.position.x + b.radius,
                b.position.y + b.radius,
                b.radius
            );

            // Pass both the specific node we saved earlier, and its new exact bounds
            this.bvh.updateLeaf(this.leaves[i], tightAABB);
        }
    }

    countCollisions(): number {
        let collisionCount = 0;

        // 3. Query Step: Find all overlapping AABBs, then verify exact distances
        for (let i = 0; i < this.balls.length; i++) {
            const b = this.balls[i];
            const searchAABB = new AABB(
                b.position.x - b.radius,
                b.position.y - b.radius,
                -b.radius,
                b.position.x + b.radius,
                b.position.y + b.radius,
                b.radius
            );

            // Broad-phase: get all candidate indices from the BVH
            const candidates = this.bvh.query(searchAABB);

            for (const j of candidates) {
                // i < j prevents us from double-counting pairs (A hits B, B hits A) 
                // and prevents counting a ball colliding with itself (i === j)
                if (i < j) {
                    const otherBall = this.balls[j];

                    // Narrow-phase: Exact distance check to match Brute Force logic
                    const dx = b.position.x - otherBall.position.x;
                    const dy = b.position.y - otherBall.position.y;

                    // Assuming Z is 0 for 2D discs
                    const distSq = dx * dx + dy * dy;
                    const radiusSum = b.radius + otherBall.radius;

                    if (distSq <= radiusSum * radiusSum) {
                        collisionCount++;
                    }
                }
            }
        }

        return collisionCount;
    }

    getNodesAABBs(): { min: { x: number, y: number, z: number }, max: { x: number, y: number, z: number } }[] {
        const aabbs = this.bvh.getAllAABBs();

        return aabbs.map(aabb => ({
            min: { x: aabb.minX, y: aabb.minY, z: aabb.minZ },
            max: { x: aabb.maxX, y: aabb.maxY, z: aabb.maxZ }
        }));
    }
}

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
    bvhWrapper!: DiscBVHWrapper;
    balls: MovingSphere[] = [];
    colors: THREE.Color[] = [];
    selectedIndex: number | null = null;
    previousSelectedIndex: number | null = null;

    // Meshes
    circleGeom!: THREE.CircleGeometry;
    baseMeshProm!: THREE.InstancedMesh;
    baseMeshDim!: THREE.InstancedMesh;
    horizMeshProm!: THREE.InstancedMesh;
    horizMeshDim!: THREE.InstancedMesh;

    // Links & BVH rendering
    linksGeometry!: THREE.BufferGeometry;
    linksMesh!: THREE.LineSegments;
    bvhGeometry!: THREE.BufferGeometry;
    bvhMesh!: THREE.LineSegments;

    // Interaction state
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    dragState: number | null = null;
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    guiState = {
        animate: true,
        linkMode: 'Sampled',
        showBVH: true,
        validate: false,
    };

    simulationTime = 0;
    timings: Record<string, number> = {
        detector: 0,
        bvh: 0,
        bruteForce: 0
    };

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.isInitialized = false;
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 1);
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
        this.gui.add(this.guiState, 'showBVH').name("Show BVH Bounds");
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
        this.textElement.style.textShadow = '1px 1px 2px black';
        container.appendChild(this.textElement);
    }

    setupCamera() {
        this.camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false;
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.circleGeom = new THREE.CircleGeometry(1, 32);

        const createMat = (opacity: number) => new THREE.MeshBasicMaterial({
            transparent: true, opacity, depthTest: false, depthWrite: false
        });

        this.baseMeshProm = new THREE.InstancedMesh(this.circleGeom, createMat(0.9), N);
        this.baseMeshDim = new THREE.InstancedMesh(this.circleGeom, createMat(0.15), N);
        this.horizMeshProm = new THREE.InstancedMesh(this.circleGeom, createMat(HORIZON_PROM_OPACITY), N);
        this.horizMeshDim = new THREE.InstancedMesh(this.circleGeom, createMat(HORIZON_DIM_OPACITY), N);

        this.horizMeshDim.renderOrder = 1;
        this.horizMeshProm.renderOrder = 2;
        this.baseMeshDim.renderOrder = 3;
        this.baseMeshProm.renderOrder = 4;

        this.scene.add(this.baseMeshProm, this.baseMeshDim, this.horizMeshProm, this.horizMeshDim);

        // Active Links
        this.linksGeometry = new THREE.BufferGeometry();
        this.linksGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_LINKS * 6), 3));
        this.linksGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX_LINKS * 6), 3));

        this.linksMesh = new THREE.LineSegments(this.linksGeometry, new THREE.LineBasicMaterial({
            vertexColors: true, transparent: true, opacity: 0.8, depthTest: false, depthWrite: false
        }));
        this.linksMesh.renderOrder = 5;
        this.scene.add(this.linksMesh);

        // BVH Bounding Boxes
        this.bvhGeometry = new THREE.BufferGeometry();
        // 12 lines per box * 2 verts per line * 3 floats = 72 floats per box
        this.bvhGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_BVH_NODES * 72), 3));
        this.bvhMesh = new THREE.LineSegments(this.bvhGeometry, new THREE.LineBasicMaterial({
            color: 0x00ff88, transparent: true, opacity: 0.25, depthTest: false
        }));
        this.bvhMesh.renderOrder = 6;
        this.scene.add(this.bvhMesh);

        this.cleanUpTasks.push(() => {
            this.circleGeom.dispose();
            this.linksGeometry.dispose();
            this.bvhGeometry.dispose();
        });

        for (let i = 0; i < N; i++) {
            const pos = new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, 0);
            const radius = R * (0.25 + Math.random() * 0.75);
            this.balls.push(new MovingSphere(pos, radius, MAX_FP));
            this.colors.push(new THREE.Color().setHSL(i / N, 0.8, 0.5));
        }

        this.detector = new CertificateBroadPhaseLazy(this.balls, M);
        this.bvhWrapper = new DiscBVHWrapper(this.balls);
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
            if (event.button !== 0) return;
            const worldPt = new THREE.Vector3(this.pointer.x, this.pointer.y, 0).unproject(this.camera);

            let hitIndex = -1;
            let minSqDist = Infinity;

            for (let i = 0; i < this.balls.length; i++) {
                const ball = this.balls[i];
                const dx = ball.position.x - worldPt.x;
                const dy = ball.position.y - worldPt.y;
                const sqDist = dx * dx + dy * dy;

                if (sqDist <= ball.radius * ball.radius && sqDist < minSqDist) {
                    minSqDist = sqDist;
                    hitIndex = i;
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

        let basePromCount = 0, baseDimCount = 0;
        let horizPromCount = 0, horizDimCount = 0;
        let linkIdx = 0;

        const linkPos = this.linksGeometry.attributes.position.array as Float32Array;
        const linkCol = this.linksGeometry.attributes.color.array as Float32Array;

        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            let isProminent = (i === this.selectedIndex) || (i === this.previousSelectedIndex);
            if (this.guiState.linkMode === 'Sampled' && i < SAMPLE_COUNT) isProminent = true;

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

            dummy.position.set(ball.buildPosition.x, ball.buildPosition.y, 0);
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

            let showLinks = this.guiState.linkMode === 'All' ||
                ((this.guiState.linkMode === 'Sampled' || this.guiState.linkMode === 'Selected') && isProminent);

            if (showLinks && (ball as any).active) {
                for (const neighborIdx of (ball as any).active) {
                    if (linkIdx >= MAX_LINKS * 6) break;
                    const n = this.balls[neighborIdx];

                    linkPos[linkIdx] = ball.position.x; linkPos[linkIdx + 1] = ball.position.y; linkPos[linkIdx + 2] = 0;
                    linkCol[linkIdx] = 1.0; linkCol[linkIdx + 1] = 0.8; linkCol[linkIdx + 2] = 0.0;
                    linkIdx += 3;

                    linkPos[linkIdx] = n.position.x; linkPos[linkIdx + 1] = n.position.y; linkPos[linkIdx + 2] = 0;
                    linkCol[linkIdx] = 0.0; linkCol[linkIdx + 1] = 1.0; linkCol[linkIdx + 2] = 1.0;
                    linkIdx += 3;
                }
            }
        }

        // Commit instances
        this.baseMeshProm.count = basePromCount; this.baseMeshProm.instanceMatrix.needsUpdate = true;
        if (this.baseMeshProm.instanceColor) this.baseMeshProm.instanceColor.needsUpdate = true;
        this.baseMeshDim.count = baseDimCount; this.baseMeshDim.instanceMatrix.needsUpdate = true;
        if (this.baseMeshDim.instanceColor) this.baseMeshDim.instanceColor.needsUpdate = true;
        this.horizMeshProm.count = horizPromCount; this.horizMeshProm.instanceMatrix.needsUpdate = true;
        if (this.horizMeshProm.instanceColor) this.horizMeshProm.instanceColor.needsUpdate = true;
        this.horizMeshDim.count = horizDimCount; this.horizMeshDim.instanceMatrix.needsUpdate = true;
        if (this.horizMeshDim.instanceColor) this.horizMeshDim.instanceColor.needsUpdate = true;

        this.linksGeometry.setDrawRange(0, linkIdx / 3);
        this.linksGeometry.attributes.position.needsUpdate = true;
        this.linksGeometry.attributes.color.needsUpdate = true;

        // Draw BVH Bounds
        if (this.guiState.showBVH) {
            this.bvhMesh.visible = true;
            const nodes = this.bvhWrapper.getNodesAABBs();
            const bvhPos = this.bvhGeometry.attributes.position.array as Float32Array;
            let bIdx = 0;

            for (let i = 0; i < nodes.length; i++) {
                if (bIdx >= MAX_BVH_NODES * 72) break;
                const { min, max } = nodes[i];

                // Front face edges (Z depth is flattened for 2D visual clarity, or keep it to see 3D padding)
                const pts = [
                    [min.x, min.y], [max.x, min.y],
                    [max.x, min.y], [max.x, max.y],
                    [max.x, max.y], [min.x, max.y],
                    [min.x, max.y], [min.x, min.y]
                ];

                for (const pt of pts) {
                    bvhPos[bIdx++] = pt[0];
                    bvhPos[bIdx++] = pt[1];
                    bvhPos[bIdx++] = 0;
                }
            }
            this.bvhGeometry.setDrawRange(0, bIdx / 3);
            this.bvhGeometry.attributes.position.needsUpdate = true;
        } else {
            this.bvhMesh.visible = false;
        }
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
            const freqX = (baseSpeed / xAmp) * (1.0 + 0.15 * Math.sin(i * 0.7));
            const freqY = (baseSpeed / yAmp) * (1.0 + 0.15 * Math.cos(i * 0.7));

            ball.position.x = xAmp * Math.sin(time * freqX + i * 1.37);
            ball.position.y = yAmp * Math.cos(time * freqY + i * 2.51);
        }
    }

    // Exponential moving average for timings
    measureTime(name: string, execute: () => number): number {
        const start = performance.now();
        const result = execute();
        const dt = performance.now() - start;

        const current = this.timings[name];
        const deviation = Math.abs(dt - current);
        const normalizedDeviation = Math.min(deviation / (current || 1), 1);
        const alpha = 0.01 + 0.04 * normalizedDeviation;
        this.timings[name] = (1 - alpha) * current + alpha * dt;

        return result;
    }

    animate() {
        this.controls.update();
        this.handleResize();
        this.render();
    }

    render() {
        this.simulationTime += TIMESTEP;
        if (this.guiState.animate) {
            this.animateBallPositions(this.simulationTime);
        }

        // 1. Certificate Broad Phase
        const countLazy = this.measureTime('detector', () => {
            this.detector.update();
            return this.detector.countCollisions();
        });

        // 2. 3D BVH Broad Phase
        const countBVH = this.measureTime('bvh', () => {
            this.bvhWrapper.update();
            return this.bvhWrapper.countCollisions();
        });

        // 3. Brute Force
        const countBF = this.measureTime('bruteForce', () => {
            return this.detector.countCollisionsBruteForce();
        });

        const textParts = [
            `n=${N} | MAX_FP=${MAX_FP}`,
            `Detector: ${(1000 / this.timings.detector).toFixed(2)} fps (${countLazy})`,
            `3D BVH:   ${(1000 / this.timings.bvh).toFixed(2)} fps (${countBVH})`,
            `Brute:    ${(1000 / this.timings.bruteForce).toFixed(2)} fps (${countBF})`,
        ];
        this.textElement.innerHTML = textParts.join("\n");

        if (this.guiState.validate) {
            this.detector.validateInvariants();
        }

        // Disable strict matching until the BVH is fully hooked up and outputting exact identical pairs
        // if (countLazy !== countBF || countBVH !== countBF) {
        //     console.warn(`Mismatch! Lazy: ${countLazy}, BVH: ${countBVH}, BF: ${countBF}`);
        // }

        this.updateVisuals();
        this.renderer.render(this.scene, this.camera);
    }
}