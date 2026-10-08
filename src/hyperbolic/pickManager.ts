import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Complex, EdgeClass, GroupElement, MobiusMatrix } from './types';
import { TriangleGroup } from './groupAlgebra';
import { MobiusTransform } from './math/mobius';
import { PoincareGeometry } from './math/poincare';

export interface RenderParams {
    preset: string;
    maxRadius: number;
    depthL: number;
    showTestSegment: boolean;
}

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
    raycaster: THREE.Raycaster = new THREE.Raycaster();
    mouse: THREE.Vector2 = new THREE.Vector2(-10, -10);

    triangleGroup!: TriangleGroup;
    deltaK: GroupElement[] = [];
    generators: GroupElement[] = [];
    exploredSubgroup: GroupElement[] = [];
    edgeClasses: EdgeClass[] = [];

    params: RenderParams = {
        preset: '6,4',
        maxRadius: 0.90,
        depthL: 3,
        showTestSegment: true
    };

    testPoint1: Complex = { re: -0.25, im: 0.15 };
    testPoint2: Complex = { re: 0.25, im: -0.15 };
    private draggingPoint: 1 | 2 | null = null;
    private isDragging: boolean = false;
    private dragJustEnded: boolean = false;

    diskBoundaryGroup: THREE.Group = new THREE.Group();
    tessellationGroup: THREE.Group = new THREE.Group();
    polygonOrbitGroup: THREE.Group = new THREE.Group();
    basePolygonGroup: THREE.Group = new THREE.Group();
    hoverHighlightGroup: THREE.Group = new THREE.Group();
    testSegmentGroup: THREE.Group = new THREE.Group();

    onElementHover?: (el: GroupElement | null) => void;
    onElementSelect?: (el: GroupElement) => void;
    onParamsChange?: (params: RenderParams) => void;

    private interactiveMeshes: { mesh: THREE.Mesh; element: GroupElement }[] = [];
    private hoveredMesh: THREE.Mesh | null = null;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.isInitialized = false;
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x111111, 1);
        this.container.appendChild(this.renderer.domElement);

        this.triangleGroup = new TriangleGroup(6, 4);

        this.setupCamera();
        this.setupScene();
        this.setupEvents();
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
        if (this.renderer.domElement.parentElement === this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
        for (const task of this.cleanUpTasks) task();
        this.controls.dispose();
        this.timer.dispose();
        if (this.gui) this.gui.destroy();
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
        const frustumSize = 2.4;

        this.camera.left = (-frustumSize * aspect) / 2;
        this.camera.right = (frustumSize * aspect) / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = -frustumSize / 2;
        this.camera.updateProjectionMatrix();
    }

    createGUI() {
        this.gui = new GUI();

        const presets = ['5,4', '5,5', '6,4', '6,6', '7,3', '8,3', '8,4', '10,3'];
        this.gui.add(this.params, 'preset', presets).name('Preset {p,q}').onChange(() => {
            const [p, q] = this.params.preset.split(',').map(Number);
            this.triangleGroup = new TriangleGroup(p, q);
            if (this.onParamsChange) this.onParamsChange(this.params);
        });

        this.gui.add(this.params, 'maxRadius', 0.70, 0.99, 0.005).name('Max Radius').onChange(() => {
            if (this.onParamsChange) this.onParamsChange(this.params);
        });

        this.gui.add(this.params, 'depthL', 1, 10, 1).name('H Depth').onChange(() => {
            if (this.onParamsChange) this.onParamsChange(this.params);
        });

        this.gui.add(this.params, 'showTestSegment').name('Show Test Segment').onChange(() => {
            this.rebuildTestSegment();
        });
    }

    setupCamera() {
        const aspect = (this.container.clientWidth || 1) / (this.container.clientHeight || 1);
        const frustumSize = 2.4;

        this.camera = new THREE.OrthographicCamera(
            (-frustumSize * aspect) / 2,
            (frustumSize * aspect) / 2,
            frustumSize / 2,
            -frustumSize / 2,
            0.1,
            100
        );
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false;
        this.controls.enableZoom = true;
    }

    setupScene() {
        this.scene = new THREE.Scene();

        this.scene.add(this.diskBoundaryGroup);
        this.scene.add(this.tessellationGroup);
        this.scene.add(this.polygonOrbitGroup);
        this.scene.add(this.basePolygonGroup);
        this.scene.add(this.hoverHighlightGroup);
        this.scene.add(this.testSegmentGroup);

        this.drawDiskBoundary();
    }

    private drawDiskBoundary() {
        const geom = new THREE.BufferGeometry();
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
        }
        geom.setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: 0x555555 });
        const boundaryLine = new THREE.Line(geom, mat);
        boundaryLine.renderOrder = 1;
        this.diskBoundaryGroup.add(boundaryLine);
        this.cleanUpTasks.push(() => { geom.dispose(); mat.dispose(); });
    }

    updateDeltaK(elements: GroupElement[], generators: GroupElement[] = []) {
        this.deltaK = elements;
        this.generators = generators;
        this.rebuildTessellation();
    }

    updateExploredOrbit(explored: GroupElement[], edgeClasses: EdgeClass[]) {
        this.exploredSubgroup = explored;
        this.edgeClasses = edgeClasses;
        this.rebuildTessellation();
        this.rebuildOrbitAndBasePolygon();
        this.rebuildTestSegment();
    }

    private getTransformedTriangle(matrix: MobiusMatrix, zPos: number) {
        const [v0, v1, v2] = this.triangleGroup.baseTriangleVertices;

        const sampleArc = (p1: Complex, p2: Complex, steps = 16) => {
            const pts = PoincareGeometry.getGeodesicPoints(p1, p2, steps);
            return pts.map(p => {
                const c = MobiusTransform.apply(matrix, { re: p.re, im: p.im });
                return new THREE.Vector3(c.re, c.im, zPos);
            });
        };

        const arc0 = sampleArc(v0, v1, 16);
        const arc1 = sampleArc(v1, v2, 16).slice(1);
        const arc2 = sampleArc(v2, v0, 16).slice(1);

        return [...arc0, ...arc1, ...arc2];
    }

    private rebuildTessellation() {
        while (this.tessellationGroup.children.length > 0) {
            const obj = this.tessellationGroup.children.pop()!;
            if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
                obj.geometry.dispose();
                (obj.material as THREE.Material).dispose();
            }
        }
        this.interactiveMeshes = [];

        for (const el of this.deltaK) {
            const isGenerator = this.generators.some(g => g.id === el.id || MobiusTransform.areTransformsEqual(g.matrix, el.matrix));
            const inExploredH = !isGenerator && this.exploredSubgroup.some(h => MobiusTransform.areTransformsEqual(h.matrix, el.matrix));

            const zPos = isGenerator ? 0.03 : (inExploredH ? 0.02 : 0.01);
            const rOrder = isGenerator ? 20 : (inExploredH ? 15 : 10);

            const boundaryPts = this.getTransformedTriangle(el.matrix, zPos);

            const shape = new THREE.Shape();
            shape.moveTo(boundaryPts[0].x, boundaryPts[0].y);
            for (let i = 1; i < boundaryPts.length; i++) {
                shape.lineTo(boundaryPts[i].x, boundaryPts[i].y);
            }

            let colorHex = 0x1a252f;
            let opacityVal = 0.30;
            let lineHex = 0x2c3e50;

            if (isGenerator) {
                colorHex = 0x27ae60;
                opacityVal = 0.70;
                lineHex = 0x2ecc71;
            } else if (inExploredH) {
                colorHex = 0x2980b9;
                opacityVal = 0.60;
                lineHex = 0x5dade2;
            }

            const geom = new THREE.ShapeGeometry(shape);
            const mat = new THREE.MeshBasicMaterial({
                color: colorHex,
                transparent: true,
                opacity: opacityVal,
                side: THREE.DoubleSide,
                depthTest: true,
                depthWrite: false
            });

            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.z = zPos;
            mesh.renderOrder = rOrder;
            this.tessellationGroup.add(mesh);
            this.interactiveMeshes.push({ mesh, element: el });

            const outlineGeom = new THREE.BufferGeometry().setFromPoints(boundaryPts);
            const outlineMat = new THREE.LineBasicMaterial({
                color: lineHex,
                transparent: true,
                opacity: opacityVal + 0.20,
                depthTest: true,
                depthWrite: false
            });
            const outlineLine = new THREE.Line(outlineGeom, outlineMat);
            outlineLine.position.z = zPos;
            outlineLine.renderOrder = rOrder + 1;
            this.tessellationGroup.add(outlineLine);
        }
    }

    private rebuildOrbitAndBasePolygon() {
        while (this.polygonOrbitGroup.children.length > 0) {
            const obj = this.polygonOrbitGroup.children.pop()!;
            if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
                obj.geometry.dispose();
                (obj.material as THREE.Material).dispose();
            }
        }
        while (this.basePolygonGroup.children.length > 0) {
            const obj = this.basePolygonGroup.children.pop()!;
            if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
                obj.geometry.dispose();
                (obj.material as THREE.Material).dispose();
            }
        }

        const baseVerts = this.triangleGroup.basePolygonVertices;

        for (const h of this.exploredSubgroup) {
            const transformedVerts = baseVerts.map(v => {
                return MobiusTransform.apply(h.matrix, { re: v.re, im: v.im });
            });

            const polyPts: THREE.Vector3[] = [];
            for (let i = 0; i < transformedVerts.length; i++) {
                const p1 = transformedVerts[i];
                const p2 = transformedVerts[(i + 1) % transformedVerts.length];
                const arc = PoincareGeometry.getGeodesicPoints(p1, p2, 12);
                polyPts.push(...arc.map(p => new THREE.Vector3(p.re, p.im, 0.04)));
            }

            const lineGeom = new THREE.BufferGeometry().setFromPoints(polyPts);
            const lineMat = new THREE.LineBasicMaterial({
                color: 0x4a90e2,
                transparent: true,
                opacity: 0.60,
                depthTest: true,
                depthWrite: false
            });
            const lineMesh = new THREE.Line(lineGeom, lineMat);
            lineMesh.renderOrder = 30;
            this.polygonOrbitGroup.add(lineMesh);
        }

        const ribbonWidth = 0.008;
        for (let i = 0; i < baseVerts.length; i++) {
            const p1 = baseVerts[i];
            const p2 = baseVerts[(i + 1) % baseVerts.length];
            const edgePts = PoincareGeometry.getGeodesicPoints(p1, p2, 16);

            let edgeColor = '#ffffff';
            for (const cls of this.edgeClasses) {
                if (cls.edgeIndices.includes(i)) {
                    edgeColor = cls.color;
                    break;
                }
            }

            const vertices: number[] = [];
            const indices: number[] = [];

            for (let k = 0; k < edgePts.length - 1; k++) {
                const q0 = edgePts[k];
                const q1 = edgePts[k + 1];

                const dx = q1.re - q0.re;
                const dy = q1.im - q0.im;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const nx = (-dy / len) * ribbonWidth;
                const ny = (dx / len) * ribbonWidth;

                const baseIdx = (vertices.length / 3);
                vertices.push(
                    q0.re + nx, q0.im + ny, 0.05,
                    q0.re - nx, q0.im - ny, 0.05,
                    q1.re + nx, q1.im + ny, 0.05,
                    q1.re - nx, q1.im - ny, 0.05
                );

                indices.push(
                    baseIdx, baseIdx + 1, baseIdx + 2,
                    baseIdx + 1, baseIdx + 3, baseIdx + 2
                );
            }

            const geom = new THREE.BufferGeometry();
            geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geom.setIndex(indices);

            const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(edgeColor),
                side: THREE.DoubleSide,
                depthTest: true,
                depthWrite: false
            });

            const ribbonMesh = new THREE.Mesh(geom, mat);
            ribbonMesh.renderOrder = 40;
            this.basePolygonGroup.add(ribbonMesh);
        }
    }

    private rebuildTestSegment() {
        while (this.testSegmentGroup.children.length > 0) {
            const obj = this.testSegmentGroup.children.pop()!;
            if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
                obj.geometry.dispose();
                (obj.material as THREE.Material).dispose();
            }
        }

        if (!this.params.showTestSegment) return;

        // 1. Transformed test segments h(p1 -> p2) for h in H_explored
        for (const h of this.exploredSubgroup) {
            if (h.word.canonicalString === '1') continue;

            const c1 = MobiusTransform.apply(h.matrix, this.testPoint1);
            const c2 = MobiusTransform.apply(h.matrix, this.testPoint2);

            const arc = PoincareGeometry.getGeodesicPoints(c1, c2, 16);
            const lineGeom = new THREE.BufferGeometry().setFromPoints(
                arc.map(p => new THREE.Vector3(p.re, p.im, 0.07))
            );
            const lineMat = new THREE.LineBasicMaterial({
                color: 0xe67e22,
                transparent: true,
                opacity: 0.85,
                depthTest: true,
                depthWrite: false
            });
            const lineMesh = new THREE.Line(lineGeom, lineMat);
            lineMesh.renderOrder = 80;
            this.testSegmentGroup.add(lineMesh);

            const h1Geom = new THREE.CircleGeometry(0.018, 16);
            const h1Mat = new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.85, depthTest: true, depthWrite: false });
            const h1Mesh = new THREE.Mesh(h1Geom, h1Mat);
            h1Mesh.position.set(c1.re, c1.im, 0.075);
            h1Mesh.renderOrder = 85;
            this.testSegmentGroup.add(h1Mesh);

            const h2Geom = new THREE.CircleGeometry(0.018, 16);
            const h2Mat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.85, depthTest: true, depthWrite: false });
            const h2Mesh = new THREE.Mesh(h2Geom, h2Mat);
            h2Mesh.position.set(c2.re, c2.im, 0.075);
            h2Mesh.renderOrder = 85;
            this.testSegmentGroup.add(h2Mesh);
        }

        // 2. Base Test Segment Line (Identity)
        const baseArc = PoincareGeometry.getGeodesicPoints(this.testPoint1, this.testPoint2, 24);
        const baseLineGeom = new THREE.BufferGeometry().setFromPoints(
            baseArc.map(p => new THREE.Vector3(p.re, p.im, 0.08))
        );
        const baseLineMat = new THREE.LineBasicMaterial({
            color: 0xffd700,
            linewidth: 4,
            transparent: true,
            opacity: 1.0,
            depthTest: false,
            depthWrite: false
        });
        const baseLine = new THREE.Line(baseLineGeom, baseLineMat);
        baseLine.renderOrder = 1000;
        this.testSegmentGroup.add(baseLine);

        // Base Point 1 Draggable Handle (Bright Coral Red, Transparent Pass, renderOrder = 1001)
        const b1Geom = new THREE.CircleGeometry(0.040, 24);
        const b1Mat = new THREE.MeshBasicMaterial({
            color: 0xff3366,
            transparent: true,
            opacity: 1.0,
            depthTest: false,
            depthWrite: false
        });
        const b1Mesh = new THREE.Mesh(b1Geom, b1Mat);
        b1Mesh.position.set(this.testPoint1.re, this.testPoint1.im, 0.09);
        b1Mesh.renderOrder = 1001;
        this.testSegmentGroup.add(b1Mesh);

        // Base Point 2 Draggable Handle (Bright Electric Blue, Transparent Pass, renderOrder = 1001)
        const b2Geom = new THREE.CircleGeometry(0.040, 24);
        const b2Mat = new THREE.MeshBasicMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 1.0,
            depthTest: false,
            depthWrite: false
        });
        const b2Mesh = new THREE.Mesh(b2Geom, b2Mat);
        b2Mesh.position.set(this.testPoint2.re, this.testPoint2.im, 0.09);
        b2Mesh.renderOrder = 1001;
        this.testSegmentGroup.add(b2Mesh);
    }

    highlightElement(el: GroupElement | null, meshGeom?: THREE.BufferGeometry) {
        while (this.hoverHighlightGroup.children.length > 0) {
            const obj = this.hoverHighlightGroup.children.pop()!;
            if (obj instanceof THREE.Mesh) {
                (obj.material as THREE.Material).dispose();
            }
        }

        if (!el) return;

        let geom: THREE.BufferGeometry;
        if (meshGeom) {
            geom = meshGeom;
        } else {
            const boundaryPts = this.getTransformedTriangle(el.matrix, 0.06);
            const shape = new THREE.Shape();
            shape.moveTo(boundaryPts[0].x, boundaryPts[0].y);
            for (let i = 1; i < boundaryPts.length; i++) {
                shape.lineTo(boundaryPts[i].x, boundaryPts[i].y);
            }
            geom = new THREE.ShapeGeometry(shape);
        }

        const mat = new THREE.MeshBasicMaterial({
            color: 0xf1c40f,
            transparent: true,
            opacity: 0.80,
            side: THREE.DoubleSide,
            depthTest: true,
            depthWrite: false
        });

        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.z = 0.06;
        mesh.renderOrder = 50;
        this.hoverHighlightGroup.add(mesh);
    }

    private setupEvents() {
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const rayWorldPos = new THREE.Vector3();

        const getMouseWorldPos = (): Complex | null => {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            if (this.raycaster.ray.intersectPlane(plane, rayWorldPos)) {
                return { re: rayWorldPos.x, im: rayWorldPos.y };
            }
            return null;
        };

        window.addEventListener('pointerdown', () => {
            if (!this.params.showTestSegment) return;
            const worldPos = getMouseWorldPos();
            if (!worldPos) return;

            const d1 = Math.hypot(worldPos.re - this.testPoint1.re, worldPos.im - this.testPoint1.im);
            const d2 = Math.hypot(worldPos.re - this.testPoint2.re, worldPos.im - this.testPoint2.im);

            const hitRadius = 0.09;
            if (d1 < hitRadius && d1 <= d2) {
                this.draggingPoint = 1;
                this.isDragging = false;
                this.controls.enabled = false;
            } else if (d2 < hitRadius) {
                this.draggingPoint = 2;
                this.isDragging = false;
                this.controls.enabled = false;
            }
        });

        window.addEventListener('pointermove', (e) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            if (this.draggingPoint !== null) {
                this.isDragging = true;
                const worldPos = getMouseWorldPos();
                if (worldPos) {
                    const r = Math.hypot(worldPos.re, worldPos.im);
                    const maxR = 0.98;
                    const clampedPos = r > maxR ? { re: (worldPos.re / r) * maxR, im: (worldPos.im / r) * maxR } : worldPos;

                    if (this.draggingPoint === 1) {
                        this.testPoint1 = clampedPos;
                    } else if (this.draggingPoint === 2) {
                        this.testPoint2 = clampedPos;
                    }
                    this.rebuildTestSegment();
                }
            }
        });

        const stopDragging = () => {
            if (this.draggingPoint !== null) {
                if (this.isDragging) {
                    this.dragJustEnded = true;
                    setTimeout(() => {
                        this.dragJustEnded = false;
                    }, 50);
                }
                this.draggingPoint = null;
                this.isDragging = false;
                this.controls.enabled = true;
            }
        };

        window.addEventListener('pointerup', stopDragging);
        window.addEventListener('pointercancel', stopDragging);

        window.addEventListener('click', () => {
            if (this.dragJustEnded) {
                this.dragJustEnded = false;
                return;
            }
            if (this.hoveredMesh) {
                const found = this.interactiveMeshes.find(m => m.mesh === this.hoveredMesh);
                if (found && this.onElementSelect) {
                    this.onElementSelect(found.element);
                }
            }
        });
    }

    animate() {
        this.timer.update();
        this.controls.update();
        this.handleResize();

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveMeshes.map(m => m.mesh));

        if (intersects.length > 0) {
            const hit = intersects[0].object as THREE.Mesh;
            if (this.hoveredMesh !== hit) {
                this.hoveredMesh = hit;
                const found = this.interactiveMeshes.find(m => m.mesh === hit);
                if (found) {
                    this.highlightElement(found.element, hit.geometry);
                    if (this.onElementHover) this.onElementHover(found.element);
                }
            }
        } else {
            if (this.hoveredMesh !== null) {
                this.hoveredMesh = null;
                this.highlightElement(null);
                if (this.onElementHover) this.onElementHover(null);
            }
        }

        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}