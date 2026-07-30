// AI-code here

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SphereObject, Root, Region, LooseSphericalHierarchy } from './tree';

// Tree initialization
const K_MAX = 4;
const MARGIN_RATIO = 3;
const SCALING_FACTOR = 2.5;

// Opacity
const REGION_OPACITY = 0.005;
const OBJECT_OPACITY = 0.9;
const SELECTED_REGION_OPACITY = 0.1;

// Outlines
const OUTLINE_STRENGTH = 0.1;
const SELECTED_OUTLINE_STRENGTH = 1.0;
const OUTLINE_WIDTH_PIXELS = 2.0;
const OUTLINE_LIGHTNESS = 0.2;

// Orbits initialization
const ORBIT_RADIUS_BASE = 3;
const ORBIT_RADIUS_STD = 4;

// Rendering specific 
const REGION_SPHERE_SEGMENTS = 32;
const MAX_REGIONS = 50000;

interface OrbitParam {
    u: THREE.Vector3;
    v: THREE.Vector3;
    a: number;
    b: number;
    omega: number;
    phase: number;
}

function randomGaussian(mean = 0, stdev = 1): number {
    const u1 = 1 - Math.random();
    const u2 = 1 - Math.random();
    const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + stdev * randStdNormal;
}

function formatLevelCounts(levelCounts: Map<number, number>): string {
    const sortedLevels = Array.from(levelCounts.keys()).sort((a, b) => a - b);
    return sortedLevels.map(level => `${level}:${levelCounts.get(level)}`).join(', ');
}

function createOutlineMaterial(baseOpacity: number, outlineOpacity: number): THREE.MeshBasicMaterial {
    const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: baseOpacity,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    mat.onBeforeCompile = (shader) => {
        shader.vertexShader = `
            varying vec3 vPerspectiveNormal;
            varying vec3 vPerspectiveViewDir;
            ${shader.vertexShader}
        `.replace(
            '#include <project_vertex>',
            `#include <project_vertex>
            #ifdef USE_INSTANCING
                mat3 normMat = mat3(modelViewMatrix * instanceMatrix);
            #else
                mat3 normMat = normalMatrix;
            #endif
            vPerspectiveNormal = normalize(normMat * normal);
            vPerspectiveViewDir = normalize(-mvPosition.xyz);
            `
        );

        shader.fragmentShader = `
            varying vec3 vPerspectiveNormal;
            varying vec3 vPerspectiveViewDir;
            ${shader.fragmentShader}
        `;

        const outlineCode = `
            // Perspective-correct surface-to-view angle
            float cosAngle = abs(dot(normalize(vPerspectiveNormal), normalize(vPerspectiveViewDir)));
            float cos2 = cosAngle * cosAngle;

            // Screen-space derivative gives rate of change per pixel
            float delta = fwidth(cos2);

            // Estimated distance from the geometric silhouette edge in screen pixels
            float pixelDist = cos2 / max(delta, 1e-6);

            // Set desired outline width in screen pixels
            float outlineWidthPixels = ${OUTLINE_WIDTH_PIXELS.toFixed(3)};

            // Smooth falloff from edge (1.0) to outline boundary (0.0)
            float rim = 1.0 - smoothstep(0.0, outlineWidthPixels, pixelDist);

            gl_FragColor.a = clamp(gl_FragColor.a + rim * ${outlineOpacity.toFixed(3)}, 0.0, 1.0);
            gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), rim * ${OUTLINE_LIGHTNESS.toFixed(3)});
        `;

        if (shader.fragmentShader.includes('#include <opaque_fragment>')) {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <opaque_fragment>',
                `#include <opaque_fragment>\n${outlineCode}`
            );
        } else if (shader.fragmentShader.includes('#include <dithering_fragment>')) {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `#include <dithering_fragment>\n${outlineCode}`
            );
        } else {
            shader.fragmentShader = shader.fragmentShader.replace(
                'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
                `gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n${outlineCode}`
            );
        }
    };

    return mat;
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
    camera!: THREE.PerspectiveCamera;
    textElement!: HTMLDivElement;

    hierarchy!: LooseSphericalHierarchy;
    objects: SphereObject[] = [];
    objectColors: THREE.Color[] = [];
    orbitParams: OrbitParam[] = [];
    selectedObjectIndex: number | null = null;

    sphereGeom!: THREE.SphereGeometry;
    objectMeshes: THREE.Mesh[] = [];
    regionGeometry!: THREE.SphereGeometry;
    regionMesh!: THREE.InstancedMesh;
    selectedRegionGeometry!: THREE.SphereGeometry;
    selectedRegionMesh!: THREE.InstancedMesh;

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    dragState: number | null = null;
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    guiState = {
        objectCount: 1000,
        objectSize: 0,
        timeScale: 1,
        motionMode: 'Orbits',
        showRegions: true,
        showObjects: true,
        validate: false,
    };

    simulationTime: number = 0;
    simulationTimeDelta: number = 1;

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

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    createGUI() {
        this.gui = new GUI();
        const objectCounts = [10, 50, 200, 500, 1000, 2000, 5000, 10000];
        this.gui.add(this.guiState, 'objectCount', objectCounts)
            .name('Number of objects')
            .onChange(() => {
                this.rebuildObjects();
            });
        this.gui.add(this.guiState, 'objectSize', -5, 5)
            .name('Object size')
            .onChange(() => {
                this.rebuildObjects();
            });
        const numSteps = 8;     // should be even
        this.gui.add(this.guiState, 'timeScale', 0, 2, 2 / numSteps)
            .name('Log time scale factor')
            .onChange((value: number) => {
                this.simulationTimeDelta = value == 0 ? 0 : Math.pow(2, numSteps * (value - 1));
            });
        this.gui.add(this.guiState, 'motionMode', ['Box', 'Orbits']).name("Motion Mode");
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
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = true;
        this.camera.position.set(0, -15, 15);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupScene() {
        this.scene = new THREE.Scene();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 10, 20);
        this.scene.add(dirLight);

        this.sphereGeom = new THREE.SphereGeometry(1, 32, 16);
        this.regionGeometry = new THREE.SphereGeometry(1, 2 * REGION_SPHERE_SEGMENTS, REGION_SPHERE_SEGMENTS);
        this.selectedRegionGeometry = new THREE.SphereGeometry(1, 2 * REGION_SPHERE_SEGMENTS, REGION_SPHERE_SEGMENTS);

        this.initializeHierarchy();

        const regionMat = createOutlineMaterial(REGION_OPACITY, OUTLINE_STRENGTH);
        const selectedRegionMat = createOutlineMaterial(SELECTED_REGION_OPACITY, SELECTED_OUTLINE_STRENGTH);

        this.regionMesh = new THREE.InstancedMesh(this.regionGeometry, regionMat, MAX_REGIONS);
        this.selectedRegionMesh = new THREE.InstancedMesh(this.selectedRegionGeometry, selectedRegionMat, MAX_REGIONS);

        this.regionMesh.frustumCulled = false;
        this.selectedRegionMesh.frustumCulled = false;

        this.regionMesh.renderOrder = 1;
        this.selectedRegionMesh.renderOrder = 2;

        this.scene.add(this.regionMesh);
        this.scene.add(this.selectedRegionMesh);

        this.createObjectMeshes();

        this.cleanUpTasks.push(() => {
            this.sphereGeom.dispose();
            this.regionGeometry.dispose();
            this.selectedRegionGeometry.dispose();
        });
    }

    initializeHierarchy() {
        this.objects = [];
        this.objectColors = [];
        this.orbitParams = [];

        const count = this.guiState.objectCount;

        for (let i = 0; i < count; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            );
            const radius = Math.pow(1.5, this.guiState.objectSize) * 0.2 * (0.3 + Math.random());
            const obj = new SphereObject(pos, radius, i);
            this.objects.push(obj);
            this.objectColors.push(new THREE.Color().setHSL(i / count, 0.8, 0.5));

            const u = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize();

            let temp = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            if (Math.abs(u.dot(temp.clone().normalize())) > 0.9) {
                temp.set(1, 0, 0);
            }
            const v = new THREE.Vector3().crossVectors(u, temp).normalize();

            const a = ORBIT_RADIUS_BASE + Math.abs(randomGaussian(0, ORBIT_RADIUS_STD));
            const b = a * (0.5 + 0.5 * Math.random());
            const omega = (0.8 / Math.sqrt(a)) * (0.5 + Math.random());
            const phase = Math.random() * Math.PI * 2;

            this.orbitParams.push({ u, v, a, b, omega, phase });
        }

        this.hierarchy = new LooseSphericalHierarchy(K_MAX, MARGIN_RATIO, SCALING_FACTOR);

        for (const obj of this.objects)
            this.hierarchy.insert(obj);
    }

    rebuildObjects(): void {
        // Clear old meshes from the scene and dispose their materials
        for (const mesh of this.objectMeshes) {
            this.scene.remove(mesh);
            if (mesh.material instanceof THREE.Material) {
                mesh.material.dispose();
            }
        }
        this.objectMeshes = [];

        // Clear selection to avoid out-of-bounds references
        this.selectedObjectIndex = null;

        // Rebuild hierarchy and create new meshes
        this.initializeHierarchy();
        this.createObjectMeshes();
    }

    createObjectMeshes() {
        const count = this.objects.length;

        for (let i = 0; i < count; i++) {
            const mat = new THREE.MeshStandardMaterial({
                color: this.objectColors[i],
                transparent: true,
                opacity: OBJECT_OPACITY,
                depthTest: true,
                depthWrite: true,
                roughness: 0.4,
            });

            const mesh = new THREE.Mesh(this.sphereGeom, mat);
            mesh.renderOrder = 3;
            mesh.visible = true;
            this.scene.add(mesh);
            this.objectMeshes.push(mesh);
        }
    }

    setupInteraction(): void {
        const dom = this.renderer.domElement;

        // Unbind right-click from OrbitControls panning and disable context menu
        this.controls.mouseButtons.RIGHT = null;

        const onContextMenu = (event: MouseEvent) => event.preventDefault();
        dom.addEventListener('contextmenu', onContextMenu);

        let startX = 0;
        let startY = 0;

        const updatePointer = (event: PointerEvent) => {
            const rect = dom.getBoundingClientRect();
            this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const performAnalyticalHitTest = (): number => {
            this.raycaster.setFromCamera(this.pointer, this.camera);
            const rayOrigin = this.raycaster.ray.origin;
            const rayDir = this.raycaster.ray.direction;

            let hitIndex = -1;
            let minDistance = Infinity;

            for (let i = 0; i < this.objects.length; i++) {
                const obj = this.objects[i];

                const L = new THREE.Vector3().subVectors(obj.center, rayOrigin);
                const tca = L.dot(rayDir);

                if (tca < 0) continue;

                const d2 = L.lengthSq() - tca * tca;
                const radius2 = obj.radius * obj.radius;

                if (d2 <= radius2) {
                    const thc = Math.sqrt(radius2 - d2);
                    const t0 = tca - thc;

                    if (t0 < minDistance) {
                        minDistance = t0;
                        hitIndex = i;
                    }
                }
            }

            return hitIndex;
        };

        const onPointerDown = (event: PointerEvent) => {
            updatePointer(event);
            startX = event.clientX;
            startY = event.clientY;

            // Right-Click (Button 2): Start object move
            if (event.button === 2) {
                const hitIndex = performAnalyticalHitTest();

                if (hitIndex !== -1) {
                    this.selectedObjectIndex = hitIndex;
                    this.dragState = hitIndex;

                    const viewDir = new THREE.Vector3();
                    this.camera.getWorldDirection(viewDir);
                    this.dragPlane.setFromNormalAndCoplanarPoint(
                        viewDir.negate(),
                        this.objects[hitIndex].center
                    );
                }
            }
        };

        const onPointerMove = (event: PointerEvent) => {
            updatePointer(event);

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

        const onPointerUp = (event: PointerEvent) => {
            // Left-Click (Button 0): Selection on still click
            if (event.button === 0 && this.dragState === null) {
                const dist = Math.hypot(event.clientX - startX, event.clientY - startY);
                if (dist < 5) {
                    updatePointer(event);
                    const hitIndex = performAnalyticalHitTest();
                    this.selectedObjectIndex = hitIndex !== -1 ? hitIndex : null;
                }
            }

            if (event.button === 2 || event.type === 'pointerleave') {
                this.dragState = null;
            }
        };

        dom.addEventListener('pointerdown', onPointerDown);
        dom.addEventListener('pointermove', onPointerMove);
        dom.addEventListener('pointerup', onPointerUp);
        dom.addEventListener('pointerleave', onPointerUp);

        this.cleanUpTasks.push(() => {
            dom.removeEventListener('contextmenu', onContextMenu);
            dom.removeEventListener('pointerdown', onPointerDown);
            dom.removeEventListener('pointermove', onPointerMove);
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
        const dummy = new THREE.Object3D();

        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            const mesh = this.objectMeshes[i];

            mesh.visible = this.guiState.showObjects;
            mesh.position.copy(obj.center);
            mesh.scale.setScalar(obj.radius);

            if (i === this.selectedObjectIndex) {
                (mesh.material as THREE.MeshStandardMaterial).opacity = 1.0;
                (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x444444);
                (mesh.material as THREE.MeshStandardMaterial).color.setHex(0xffffff);
            } else {
                (mesh.material as THREE.MeshStandardMaterial).opacity = OBJECT_OPACITY;
                (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
                (mesh.material as THREE.MeshStandardMaterial).color.copy(this.objectColors[i]);
            }
        }

        if (this.guiState.showRegions) {
            const allRegions = this.collectRegions(this.hierarchy.root, []);
            let regionCount = 0;
            let selectedRegionCount = 0;

            const ancestorMap = new Map<Region, number>();
            if (this.selectedObjectIndex !== null) {
                const selectedObj = this.objects[this.selectedObjectIndex];

                for (const region of allRegions) {
                    if (region.objects.includes(selectedObj)) {
                        let curr: Region | Root | null = region;
                        let depth = 0;
                        while (curr && curr instanceof Region) {
                            if (!ancestorMap.has(curr)) {
                                ancestorMap.set(curr, depth);
                            }
                            curr = curr.parentNode;
                            depth++;
                        }
                    }
                }
            }

            for (const region of allRegions) {
                if (regionCount >= MAX_REGIONS) break;

                const isAncestor = ancestorMap.has(region);

                if (isAncestor) {
                    const depth = ancestorMap.get(region)!;

                    dummy.position.copy(region.center);
                    dummy.scale.setScalar(region.radius);
                    dummy.updateMatrix();

                    this.selectedRegionMesh.setMatrixAt(selectedRegionCount, dummy.matrix);

                    const hue = (0.0 + depth * 0.47) % 1.0;
                    const color = new THREE.Color().setHSL(hue, 1.0, 0.55);

                    this.selectedRegionMesh.setColorAt(selectedRegionCount, color);
                    selectedRegionCount++;
                } else {
                    dummy.position.copy(region.center);
                    dummy.scale.setScalar(region.radius);
                    dummy.updateMatrix();

                    this.regionMesh.setMatrixAt(regionCount, dummy.matrix);

                    const hue = 0.65;
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

    animateObjectPositionsOrbits(time: number): void {
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            const param = this.orbitParams[i];

            const angle = time * param.omega + param.phase;

            obj.center
                .copy(param.u)
                .multiplyScalar(param.a * Math.cos(angle))
                .addScaledVector(param.v, param.b * Math.sin(angle));
        }
    }

    animateObjectPositionsBox(time: number): void {
        const xAmp = 8;
        const yAmp = 5;
        const zAmp = 5;
        const baseSpeed = 1.5;

        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            const freqX = (baseSpeed / xAmp) * (1.0 + 0.15 * Math.sin(i * 0.7));
            const freqY = (baseSpeed / yAmp) * (1.0 + 0.15 * Math.cos(i * 0.7));
            const freqZ = (baseSpeed / zAmp) * (1.0 + 0.15 * Math.sin(i * 0.9));

            obj.center.x = xAmp * Math.sin(time * freqX + i * 1.37);
            obj.center.y = yAmp * Math.cos(time * freqY + i * 2.51);
            obj.center.z = zAmp * Math.sin(time * freqZ + i * 3.14);
        }
    }

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
        if (this.guiState.timeScale > 0) {
            if (this.guiState.motionMode === 'Orbits')
                this.animateObjectPositionsOrbits(this.simulationTime);
            if (this.guiState.motionMode === 'Box')
                this.animateObjectPositionsBox(this.simulationTime);

            this.simulationTime += 0.01 * this.simulationTimeDelta;
        }

        const startTime = performance.now();
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            this.hierarchy.update(obj);
        }
        const updateDt = performance.now() - startTime;

        const allRegions = this.collectRegions(this.hierarchy.root, []);
        const levelCounts = this.hierarchy.debug_countRegionsByLevel();
        const levelCountString = formatLevelCounts(levelCounts);

        const count = this.objects.length;

        const collisionsBF = this.measureTime('bruteForce', () => {
            return LooseSphericalHierarchy.debug_findCollisionsBruteForce(this.objects);
        }, 0);

        const collisionsQ = this.measureTime('query', () => {
            return this.hierarchy.findCollisionsByQuery().map((v) => v[0] * count + v[1]);
        }, updateDt);

        const collisionsR = this.measureTime('recursion', () => {
            return this.hierarchy.findCollisionsRecursive().map((v) => v[0] * count + v[1]);
        }, updateDt);

        const collisionsN = this.measureTime('neighbors', () => {
            return this.hierarchy.findCollisions().map((v) => v[0] * count + v[1]);
        }, updateDt);

        if (this.guiState.validate) {
            if (collisionsQ.length !== 2 * collisionsBF.length)
                throw Error(`Collision count mismatch. BF: ${collisionsBF.length}, Query: ${collisionsQ.length}`);
            if (collisionsR.length !== collisionsBF.length)
                throw Error(`Collision count mismatch. BF: ${collisionsBF.length}, Recursive: ${collisionsR.length}`);
            if (collisionsN.length !== collisionsBF.length)
                throw Error(`Collision count mismatch. BF: ${collisionsBF.length}, Neighbors: ${collisionsN.length}`);

            for (let [id1, id2] of collisionsBF) {
                const pair1 = id1 * count + id2;
                const pair2 = id2 * count + id1;
                const indexQ1 = collisionsQ.indexOf(pair1);
                const indexQ2 = collisionsQ.indexOf(pair2);
                const indexR1 = collisionsR.indexOf(pair1);
                const indexR2 = collisionsR.indexOf(pair2);
                const indexN1 = collisionsN.indexOf(pair1);
                const indexN2 = collisionsN.indexOf(pair2);
                if (indexQ1 === -1 || indexQ2 === -1)
                    throw Error(`Collision missing in Q`);
                if (indexR1 === -1 && indexR2 === -1)
                    throw Error(`Collision missing in R`);
                if (indexN1 === -1 && indexN2 === -1)
                    throw Error(`Collision missing in N`);
            }

            this.hierarchy.debug_validateNeighbors();
        }

        const collisionsTextParts = [
            `BF: ${(1000 / this.timings.bruteForce).toFixed(2)} fps`,
            `Query: ${(1000 / this.timings.query).toFixed(2)} fps (${(this.timings.bruteForce / this.timings.query).toFixed(2)} x)`,
            `Recursion: ${(1000 / this.timings.recursion).toFixed(2)} fps (${(this.timings.bruteForce / this.timings.recursion).toFixed(2)} x)`,
            `Neighbors: ${(1000 / this.timings.neighbors).toFixed(2)} fps (${(this.timings.bruteForce / this.timings.neighbors).toFixed(2)} x)`,
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
            `Collisions: ${collisionsBF.length},`,
            ``,
            `${collisionsText}`,
        ];
        this.textElement.innerHTML = textParts.join("\n");

        this.updateVisuals();
        this.renderer.render(this.scene, this.camera);
    }
}