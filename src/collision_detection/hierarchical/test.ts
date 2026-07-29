import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SphereObject, Root, Region, LooseSphericalHierarchy } from './hierarchy';

const N = 2000;
const R = 0.15;
const TIMESTEP = 0.01;
const MAX_REGIONS = 50000;

const K0 = 3;
const A = 2.5;
const SCALING_FACTOR = 2.5;

const REGION_OPACITY = 0.1;
const OBJECT_OPACITY = 0.8;
const SELECTED_REGION_OPACITY = 0.5;


function formatLevelCounts(levelCounts: Map<number, number>): string {
    const sortedLevels = Array.from(levelCounts.keys()).sort((a, b) => a - b);
    return sortedLevels.map(level => `${level}:${levelCounts.get(level)}`).join(', ');
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

    // Hierarchy state
    hierarchy!: LooseSphericalHierarchy;
    objects: SphereObject[] = [];
    objectColors: THREE.Color[] = [];
    selectedObjectIndex: number | null = null;

    // Meshes
    circleGeom!: THREE.CircleGeometry;
    objectMeshes: THREE.Mesh[] = [];
    regionGeometry!: THREE.RingGeometry;
    regionMesh!: THREE.InstancedMesh;
    selectedRegionGeometry!: THREE.RingGeometry;
    selectedRegionMesh!: THREE.InstancedMesh;

    // Interaction state
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    dragState: number | null = null;
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    guiState = {
        animate: true,
        showRegions: true,
        showObjects: true,
        validate: false,
    };

    simulationTime = 0;

    timings: Record<string, number> = {};

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
        this.gui.add(this.guiState, 'showObjects').name("Show Objects");
        this.gui.add(this.guiState, 'showRegions').name("Show Regions");
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

        // Create geometry for objects (circles)
        this.circleGeom = new THREE.CircleGeometry(1, 32);

        // Create geometries for regions (rings)
        this.regionGeometry = new THREE.RingGeometry(0.97, 1.03, 64);
        this.selectedRegionGeometry = new THREE.RingGeometry(0.97, 1.03, 64);

        // Initialize the hierarchy
        this.initializeHierarchy();

        // Create instanced meshes for regions
        const regionMat = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: REGION_OPACITY,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const selectedRegionMat = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: SELECTED_REGION_OPACITY,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.regionMesh = new THREE.InstancedMesh(this.regionGeometry, regionMat, MAX_REGIONS);
        this.selectedRegionMesh = new THREE.InstancedMesh(this.selectedRegionGeometry, selectedRegionMat, MAX_REGIONS);

        // Disable frustum culling for both region meshes
        this.regionMesh.frustumCulled = false;
        this.selectedRegionMesh.frustumCulled = false;

        this.regionMesh.renderOrder = 1;
        this.selectedRegionMesh.renderOrder = 2;

        this.scene.add(this.regionMesh);
        this.scene.add(this.selectedRegionMesh);

        // Create individual meshes for objects (since they're more dynamic)
        this.createObjectMeshes();

        this.cleanUpTasks.push(() => {
            this.circleGeom.dispose();
            this.regionGeometry.dispose();
            this.selectedRegionGeometry.dispose();
        });
    }

    initializeHierarchy() {
        // Create sample objects
        this.objects = [];
        this.objectColors = [];

        for (let i = 0; i < N; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                0
            );
            const radius = R * (0.3 + Math.random());
            const obj = new SphereObject(pos, radius, i);
            this.objects.push(obj);
            this.objectColors.push(new THREE.Color().setHSL(i / N, 0.8, 0.5));
        }

        // Initialize hierarchy
        this.hierarchy = new LooseSphericalHierarchy(K0, A, SCALING_FACTOR);

        // Build initial tree
        for (const obj of this.objects)
            this.hierarchy.insert(obj);
    }

    createObjectMeshes() {
        // Create individual meshes for better control
        for (let i = 0; i < N; i++) {
            const mat = new THREE.MeshBasicMaterial({
                color: this.objectColors[i],
                transparent: true,
                opacity: OBJECT_OPACITY,
                depthTest: false,
                depthWrite: false
            });

            const mesh = new THREE.Mesh(this.circleGeom, mat);
            mesh.renderOrder = 3;
            mesh.visible = true;
            this.scene.add(mesh);
            this.objectMeshes.push(mesh);
        }
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
                    const obj = this.objects[this.dragState];
                    obj.center.copy(target);
                    this.hierarchy.update(obj);
                }
            }
        };

        const onPointerDown = (event: PointerEvent) => {
            if (event.button !== 0) return;
            const worldPt = new THREE.Vector3(this.pointer.x, this.pointer.y, 0).unproject(this.camera);

            let hitIndex = -1;
            let minSqDist = Infinity;

            for (let i = 0; i < this.objects.length; i++) {
                const obj = this.objects[i];
                const dx = obj.center.x - worldPt.x;
                const dy = obj.center.y - worldPt.y;
                const sqDist = dx * dx + dy * dy;

                if (sqDist <= obj.radius * obj.radius && sqDist < minSqDist) {
                    minSqDist = sqDist;
                    hitIndex = i;
                }
            }

            if (hitIndex !== -1) {
                this.selectedObjectIndex = hitIndex;
                this.dragState = hitIndex;
                this.controls.enabled = false;
            } else {
                this.selectedObjectIndex = null;
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

    collectRegions(node: Region | Root, regions: Region[]): Region[] {
        if (node instanceof Region) {
            regions.push(node);
        }
        for (const child of node.children) {
            this.collectRegions(child, regions);
        }
        return regions;
    }

    updateVisuals() {
        // Update object positions
        const dummy = new THREE.Object3D();

        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            const mesh = this.objectMeshes[i];

            mesh.visible = this.guiState.showObjects;
            mesh.position.set(obj.center.x, obj.center.y, 0.01); // Slight Z offset for objects
            mesh.scale.setScalar(obj.radius);

            // Highlight selected object
            if (i === this.selectedObjectIndex) {
                (mesh.material as THREE.MeshBasicMaterial).opacity = 1.0;
                (mesh.material as THREE.MeshBasicMaterial).color.setHex(0xffffff);
            } else {
                (mesh.material as THREE.MeshBasicMaterial).opacity = OBJECT_OPACITY;
                (mesh.material as THREE.MeshBasicMaterial).color.copy(this.objectColors[i]);
            }
        }

        // Update regions
        if (this.guiState.showRegions) {
            const allRegions = this.collectRegions(this.hierarchy.root, []);
            let regionCount = 0;
            let selectedRegionCount = 0;

            for (const region of allRegions) {
                if (regionCount >= MAX_REGIONS) break;

                const isSelected = this.selectedObjectIndex !== null &&
                    region.objects.some(obj => obj === this.objects[this.selectedObjectIndex!]);

                if (isSelected) {
                    dummy.position.set(region.center.x, region.center.y, -0.005);
                    dummy.scale.setScalar(region.radius);
                    dummy.updateMatrix();

                    this.selectedRegionMesh.setMatrixAt(selectedRegionCount, dummy.matrix);
                    this.selectedRegionMesh.setColorAt(selectedRegionCount,
                        new THREE.Color(0xff0000));
                    selectedRegionCount++;
                } else {
                    dummy.position.set(region.center.x, region.center.y, -0.01);
                    dummy.scale.setScalar(region.radius);
                    dummy.updateMatrix();

                    this.regionMesh.setMatrixAt(regionCount, dummy.matrix);

                    // const hasObject = region.objects.length !== 0;
                    const hue = 0.6 + 0.1 * (region.level % 8) / 8;
                    const color = new THREE.Color().setHSL(hue, 1, 0.5);
                    this.regionMesh.setColorAt(regionCount, color);

                    regionCount++;
                }
            }

            this.regionMesh.count = regionCount;
            this.regionMesh.instanceMatrix.needsUpdate = true;
            if (this.regionMesh.instanceColor) this.regionMesh.instanceColor.needsUpdate = true;

            this.selectedRegionMesh.count = selectedRegionCount;
            this.selectedRegionMesh.instanceMatrix.needsUpdate = true;
            if (this.selectedRegionMesh.instanceColor) this.selectedRegionMesh.instanceColor.needsUpdate = true;

            this.regionMesh.visible = true;
            this.selectedRegionMesh.visible = true;
        } else {
            this.regionMesh.visible = false;
            this.selectedRegionMesh.visible = false;
        }
    }

    animateObjectPositions(time: number): void {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;

        const yAmp = 4.2;
        const xAmp = 4.2 * aspect;
        const baseSpeed = 1.5;

        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            const freqX = (baseSpeed / xAmp) * (1.0 + 0.15 * Math.sin(i * 0.7));
            const freqY = (baseSpeed / yAmp) * (1.0 + 0.15 * Math.cos(i * 0.7));

            obj.center.x = xAmp * Math.sin(time * freqX + i * 1.37);
            obj.center.y = yAmp * Math.cos(time * freqY + i * 2.51);
        }
    }

    // Exponential moving average for timings
    measureTime<T>(name: string, execute: () => T, addedTimeMs: number = 0): T {
        const start = performance.now();
        const result = execute();
        const dt = performance.now() - start + addedTimeMs;

        const current = this.timings[name] === undefined ? 0 : this.timings[name];
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
        if (this.guiState.animate) {
            this.simulationTime += TIMESTEP;
            this.animateObjectPositions(this.simulationTime);
        }

        // Update hierarchy 
        const startTime = performance.now();
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            this.hierarchy.update(obj);
        }
        const updateDt = performance.now() - startTime;

        // Count statistics for text overlay
        const allRegions = this.collectRegions(this.hierarchy.root, []);
        const levelCounts = this.hierarchy.debug_countRegionsByLevel();
        const levelCountString = formatLevelCounts(levelCounts);

        const collisionsBF = this.measureTime('bruteForce', () => {
            return LooseSphericalHierarchy.debug_findCollisionsBruteForce(this.objects);
        }, 0);

        const collisionsQ = this.measureTime('query', () => {
            return this.hierarchy.findCollisionsByQuery().map((v) => v[0] * N + v[1]);
        }, updateDt);

        const collisionsR = this.measureTime('recursion', () => {
            return this.hierarchy.findCollisions().map((v) => v[0] * N + v[1]);
        }, updateDt);

        if (this.guiState.validate) {
            // Check count only:
            if (collisionsQ.length !== 2 * collisionsBF.length || collisionsR.length !== collisionsBF.length)
                throw Error(`Collision count mismatch. BF: ${collisionsBF.length}, Query: ${collisionsQ.length}, Recursive: ${collisionsR.length}`);
            // Check that all collisions were found:
            for (let [id1, id2] of collisionsBF) {
                const pair1 = id1 * N + id2;
                const pair2 = id2 * N + id1;
                const indexQ1 = collisionsQ.indexOf(pair1);
                const indexQ2 = collisionsQ.indexOf(pair2);
                const indexR1 = collisionsR.indexOf(pair1);
                const indexR2 = collisionsR.indexOf(pair2);
                if (indexQ1 === -1 || indexQ2 === -1)
                    throw Error(`Collision missing in Q`);
                if (indexR1 === -1 && indexR2 === -1)
                    throw Error(`Collision missing in R`);
            }
        }

        const collisionsTextParts = [
            `\tBF: ${(1000 / this.timings.bruteForce).toFixed(2)} fps`,
            `\tQuery: ${(1000 / this.timings.query).toFixed(2)} fps (${(this.timings.bruteForce / this.timings.query).toFixed(2)} x)`,
            `\tRecursion: ${(1000 / this.timings.recursion).toFixed(2)} fps (${(this.timings.bruteForce / this.timings.recursion).toFixed(2)} x)`,
        ];

        const collisionsText = collisionsTextParts.join("\n");


        const textParts = [
            `Objects: ${this.objects.length}`,
            `Levels: ${levelCountString}`,
            `Total regions: ${allRegions.length}`,
            `Scaling Factor: ${this.hierarchy.scalingFactor.toFixed(2)}`,
            this.selectedObjectIndex !== null ?
                `Selected: Object ${this.selectedObjectIndex}` :
                'Click to select object',
            `Collisions: ${collisionsBF.length},\n${collisionsText}`,
        ];
        this.textElement.innerHTML = textParts.join("\n");

        this.updateVisuals();
        this.renderer.render(this.scene, this.camera);
    }
}