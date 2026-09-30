import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Complex, Mobius, hyperbolicDist, angleDist, lerpAngle } from './hyperbolicMath';

const NUM_ARROWS = 2;
const ARROW_LENGTH = 0.2;
const MAX_FAINT_ARROWS = 10000;

class InteractiveArrow {
    base: Complex;
    dir: Complex;
    color: number;
    baseMesh: THREE.Mesh;
    tipMesh: THREE.Mesh;
    arrowHelper: THREE.ArrowHelper;

    constructor(scene: THREE.Scene, base: Complex, dir: Complex, color: number, isTarget: boolean) {
        this.base = base;
        this.dir = dir.normalize();
        this.color = color;

        // Base Hitbox (Source is sphere, Target is a small cube to distinguish visually)
        const baseGeo = isTarget ? new THREE.BoxGeometry(0.04, 0.04, 0.04) : new THREE.SphereGeometry(0.025);
        this.baseMesh = new THREE.Mesh(baseGeo, new THREE.MeshBasicMaterial({ color }));
        this.baseMesh.userData = { type: 'base', arrow: this };
        scene.add(this.baseMesh);

        // Tip Hitbox (Sphere)
        this.tipMesh = new THREE.Mesh(new THREE.SphereGeometry(0.02), new THREE.MeshBasicMaterial({ color }));
        this.tipMesh.userData = { type: 'tip', arrow: this };
        scene.add(this.tipMesh);

        this.arrowHelper = new THREE.ArrowHelper(
            new THREE.Vector3(this.dir.re, this.dir.im, 0),
            new THREE.Vector3(this.base.re, this.base.im, 0),
            ARROW_LENGTH, color, 0.06, 0.04
        );
        scene.add(this.arrowHelper);
        this.updateVisually();
    }

    updateVisually() {
        this.baseMesh.position.set(this.base.re, this.base.im, 0);
        this.tipMesh.position.set(this.base.re + this.dir.re * ARROW_LENGTH, this.base.im + this.dir.im * ARROW_LENGTH, 0);

        this.arrowHelper.position.copy(this.baseMesh.position);
        this.arrowHelper.setDirection(new THREE.Vector3(this.dir.re, this.dir.im, 0));
    }
}

export class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[] = [];
    gui: any;
    controls!: OrbitControls;
    isInitialized: boolean = false;
    containerSize: THREE.Vector2 = new THREE.Vector2(0, 0);

    scene!: THREE.Scene;
    camera!: THREE.OrthographicCamera; // Switched to Orthographic for pure 2D

    // Interaction state
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    draggedObj: THREE.Object3D | null = null;
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    // App state
    sources: InteractiveArrow[] = [];
    targets: InteractiveArrow[] = [];
    faintArrowsPool: THREE.ArrowHelper[] = [];
    generators: Mobius[] = [];

    params = {
        depth: 4,
        pathsPerFrame: 30,
        snap: false,
        snapDistThresh: 0.15,
        snapAngleThresh: 0.2
    };

    constructor(container: HTMLDivElement) {
        this.container = container;
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x111111, 1);
        this.container.appendChild(this.renderer.domElement);

        this.setupCamera();
        this.setupScene();
        this.setupInteraction();
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
        const viewSize = 1.2;
        this.camera.left = -aspect * viewSize;
        this.camera.right = aspect * viewSize;
        this.camera.top = viewSize;
        this.camera.bottom = -viewSize;
        this.camera.updateProjectionMatrix();
    }

    createGUI() {
        this.gui = new GUI();
        this.gui.add(this.params, 'depth', 1, 20, 1).name("Explore Depth");
        this.gui.add(this.params, 'pathsPerFrame', 0, 200, 10).name("Paths / Frame");
        this.gui.add(this.params, 'snap').name("Snap to Relations");
        this.gui.add(this.params, 'snapDistThresh', 0.01, 0.5).name("Snap Dist");
        this.gui.add(this.params, 'snapAngleThresh', 0.01, 1.0).name("Snap Angle");
    }

    setupCamera() {
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false; // Keep it 2D
    }

    setupScene() {
        this.scene = new THREE.Scene();

        // Draw Poincare Disk boundary
        const circleGeo = new THREE.RingGeometry(0.99, 1.0, 64);
        const circleMat = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
        const disk = new THREE.Mesh(circleGeo, circleMat);
        this.scene.add(disk);
        this.cleanUpTasks.push(() => { circleGeo.dispose(); circleMat.dispose(); });

        const addPoint = (z: Complex) => {
            const circleGeo = new THREE.SphereGeometry(0.01);
            const circleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
            const disk = new THREE.Mesh(circleGeo, circleMat);
            disk.position.set(z.re, z.im);
            this.scene.add(disk);
            this.cleanUpTasks.push(() => { circleGeo.dispose(); circleMat.dispose(); });
        };
        const [p, q] = [6, 4];
        const a = Math.acosh(Math.cos(Math.PI / p) / Math.sin(Math.PI / q));
        const b = Math.acosh(Math.cos(Math.PI / q) / Math.sin(Math.PI / p));
        const c = Math.acosh(1.0 / (Math.tan(Math.PI / p) * Math.tan(Math.PI / q)));
        addPoint(Complex.fromPolar(0, 0));
        addPoint(Complex.fromPolar(Math.tanh(b / 2), 0));
        addPoint(Complex.fromPolar(Math.tanh(c / 2), Math.PI / p));

        // Initialize arrow pairs
        const colors = [0xff4444, 0x44ff44, 0x4444ff];
        for (let i = 0; i < NUM_ARROWS; i++) {
            const angleS = Math.PI * 2 * (i / 3);
            const angleT = Math.PI * 2 * ((i + 0.5) / 3);

            this.sources.push(new InteractiveArrow(
                this.scene, Complex.fromPolar(0.4, angleS), Complex.fromPolar(1, angleS), colors[i], false
            ));

            this.targets.push(new InteractiveArrow(
                this.scene, Complex.fromPolar(0.7, angleT), Complex.fromPolar(1, angleT + 0.5), colors[i], true
            ));
        }

        // Initialize faint arrows pool
        for (let i = 0; i < MAX_FAINT_ARROWS; i++) {
            const arr = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), ARROW_LENGTH, 0xffffff);
            // Hack to make ArrowHelper transparent
            (arr.line.material as THREE.Material).transparent = true;
            (arr.line.material as THREE.Material).opacity = 0.3;
            (arr.cone.material as THREE.Material).transparent = true;
            (arr.cone.material as THREE.Material).opacity = 0.3;
            arr.visible = false;
            this.scene.add(arr);
            this.faintArrowsPool.push(arr);
        }
    }

    setupInteraction() {
        const onPointerDown = (event: PointerEvent) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.camera);
            const hitboxes = [...this.sources, ...this.targets].flatMap(a => [a.baseMesh, a.tipMesh]);
            const intersects = this.raycaster.intersectObjects(hitboxes);

            if (intersects.length > 0) {
                this.draggedObj = intersects[0].object;
                this.controls.enabled = false;
            }
        };

        const onPointerMove = (event: PointerEvent) => {
            if (!this.draggedObj) return;

            const rect = this.renderer.domElement.getBoundingClientRect();
            this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.camera);
            const intersectPt = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(this.dragPlane, intersectPt);

            const data = this.draggedObj.userData as { type: 'base' | 'tip', arrow: InteractiveArrow };
            if (data.type === 'base') {
                let z = new Complex(intersectPt.x, intersectPt.y);
                if (z.abs() >= 0.99) z = z.normalize().scale(0.99); // Keep strictly inside disk
                data.arrow.base = z;
            } else {
                let d = new Complex(intersectPt.x - data.arrow.base.re, intersectPt.y - data.arrow.base.im);
                if (d.abs() > 0.001) data.arrow.dir = d.normalize();
            }
            data.arrow.updateVisually();
        };

        const onPointerUp = () => {
            this.draggedObj = null;
            this.controls.enabled = true;
        };

        this.renderer.domElement.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);

        this.cleanUpTasks.push(() => {
            this.renderer.domElement.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        });
    }

    animate() {
        this.controls.update();
        this.handleResize();

        // 1. Recompute the 3 generating mappings from the current arrow pairs
        this.generators = this.sources.map((src, i) => {
            const tgt = this.targets[i];
            return Mobius.createMapping(src.base, src.dir, tgt.base, tgt.dir);
        });

        // 2. Randomly explore the semigroup and apply snapping
        let poolIdx = 0;

        for (let path = 0; path < this.params.pathsPerFrame; path++) {
            let W = Mobius.identity();

            for (let d = 0; d < this.params.depth; d++) {
                const gIdx = Math.floor(Math.random() * this.generators.length);
                W = W.compose(this.generators[gIdx]);

                for (let sIdx = 0; sIdx < this.sources.length; sIdx++) {
                    const src = this.sources[sIdx];

                    const mappedBase = W.apply(src.base);
                    if (mappedBase.abs() > 0.999) continue; // Out of bounds due to float precision

                    const mappedDirComplex = W.applyDir(src.base, src.dir);
                    const mappedDir = mappedDirComplex.normalize();

                    // Render Faint Arrow
                    if (poolIdx < MAX_FAINT_ARROWS) {
                        const arr = this.faintArrowsPool[poolIdx++];
                        arr.position.set(mappedBase.re, mappedBase.im, 0);
                        arr.setDirection(new THREE.Vector3(mappedDir.re, mappedDir.im, 0));
                        arr.setColor(src.color);
                        arr.visible = true;
                    }

                    // Snapping logic
                    if (this.params.snap) {
                        for (let k = 0; k < this.sources.length; k++) {
                            const targetSrc = this.sources[k];
                            const hDist = hyperbolicDist(mappedBase, targetSrc.base);
                            const aDist = angleDist(mappedDir.arg(), targetSrc.dir.arg());

                            if (hDist < this.params.snapDistThresh && aDist < this.params.snapAngleThresh) {
                                // Lerp the base in euclidean space (safe for small snaps per frame)
                                const lerpFactor = 0.001;
                                targetSrc.base = new Complex(
                                    targetSrc.base.re + (mappedBase.re - targetSrc.base.re) * lerpFactor,
                                    targetSrc.base.im + (mappedBase.im - targetSrc.base.im) * lerpFactor
                                );

                                const newAngle = lerpAngle(targetSrc.dir.arg(), mappedDir.arg(), lerpFactor);
                                targetSrc.dir = Complex.fromPolar(1, newAngle);
                                targetSrc.updateVisually();
                            }
                        }
                    }
                }
            }
        }

        // Hide unused faint arrows
        for (; poolIdx < MAX_FAINT_ARROWS; poolIdx++) {
            this.faintArrowsPool[poolIdx].visible = false;
        }

        this.renderer.render(this.scene, this.camera);
    }
}