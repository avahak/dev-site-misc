import * as THREE from 'three';
import { Complex, EdgeClass, FundamentalPolygon, GroupElement, MobiusMatrix, SidePairing } from '../types';
import { TriangleGroup } from '../math/group';
import { FundamentalPolygonBuilder } from '../math/polygon';
import { ComplexMath } from '../math/complex';
import { MobiusTransform } from '../math/mobius';
import { PoincareGeometry } from '../math/poincare';

export interface RenderParams {
    preset: string;
    maxRadius: number;
    depthL: number;
    showTestSegment: boolean;
    autoSymmetrize: boolean;
}

export class ShuffleRenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[] = [];
    isInitialized: boolean = false;
    containerSize: THREE.Vector2 = new THREE.Vector2(0, 0);

    scene!: THREE.Scene;
    camera!: THREE.OrthographicCamera;

    polygon!: FundamentalPolygon;
    sidePairings: SidePairing[] = [];
    deltaK: GroupElement[] = [];
    generators: GroupElement[] = [];
    exploredSubgroup: GroupElement[] = [];
    edgeClasses: EdgeClass[] = [];

    params: RenderParams = {
        preset: '6,4',
        maxRadius: 0.98,
        depthL: 4,
        showTestSegment: true,
        autoSymmetrize: true
    };

    testPoint1: Complex = { re: -0.25, im: 0.15 };
    testPoint2: Complex = { re: 0.25, im: -0.15 };
    private draggingPoint: 1 | 2 | null = null;
    private isDragging: boolean = false;

    diskBoundaryGroup: THREE.Group = new THREE.Group();
    tessellationGroup: THREE.Group = new THREE.Group();
    polygonOrbitGroup: THREE.Group = new THREE.Group();
    basePolygonGroup: THREE.Group = new THREE.Group();
    pairingLinksGroup: THREE.Group = new THREE.Group();
    testSegmentGroup: THREE.Group = new THREE.Group();
    controlHandlesGroup: THREE.Group = new THREE.Group();

    onStateChange?: (state: {
        generators: GroupElement[];
        exploredCount: number;
        stabilizerCount: number;
        edgeClasses: EdgeClass[];
    }) => void;

    constructor(container: HTMLDivElement) {
        this.container = container;
        THREE.Object3D.DEFAULT_UP.set(0, 1, 0);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x111111, 1);
        this.container.appendChild(this.renderer.domElement);

        const [p, q] = this.params.preset.split(',').map(Number);
        this.polygon = FundamentalPolygonBuilder.build(p, q);
        this.initDefaultPairings();

        this.setupCamera();
        this.setupScene();
        this.setupEvents();

        this.handleResize();
        this.rebuildAll();

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
        this.renderer.dispose();
    }

    initDefaultPairings() {
        const pCount = this.polygon.vertices.length;
        this.sidePairings = [];
        for (let i = 0; i < pCount; i++) {
            this.sidePairings.push({
                edgeIndex: i,
                targetEdgeIndex: i,
                sign: 1
            });
        }
    }

    setPreset(presetStr: string) {
        this.params.preset = presetStr;
        const [p, q] = presetStr.split(',').map(Number);
        this.polygon = FundamentalPolygonBuilder.build(p, q);
        this.initDefaultPairings();
        this.rebuildAll();
    }

    setPairing(edgeIndex: number, targetEdgeIndex: number, sign: 1 | -1) {
        this.sidePairings[edgeIndex] = { edgeIndex, targetEdgeIndex, sign };

        if (this.params.autoSymmetrize) {
            this.sidePairings[targetEdgeIndex] = {
                edgeIndex: targetEdgeIndex,
                targetEdgeIndex: edgeIndex,
                sign
            };
        }

        this.updateSubgroupComputation();
    }

    setAutoSymmetrize(val: boolean) {
        this.params.autoSymmetrize = val;
    }

    setDepth(depthL: number) {
        this.params.depthL = depthL;
        this.updateSubgroupComputation();
    }

    setMaxRadius(maxRadius: number) {
        this.params.maxRadius = maxRadius;
        this.rebuildAll();
    }

    setShowTestSegment(show: boolean) {
        this.params.showTestSegment = show;
        this.rebuildTestSegment();
    }

    rebuildAll() {
        const [p, q] = this.params.preset.split(',').map(Number);
        this.deltaK = TriangleGroup.generateDeltaK(this.polygon, {
            maxRadius: this.params.maxRadius,
            trackWords: true
        });
        this.updateSubgroupComputation();
    }

    updateSubgroupComputation() {
        this.generators = TriangleGroup.computeSidePairingGenerators(this.polygon, this.sidePairings, true);
        this.exploredSubgroup = TriangleGroup.exploreSubgroupBounded(
            this.generators,
            this.params.maxRadius,
            this.params.depthL,
            true
        );

        const stabilizer = TriangleGroup.findBasePolygonStabilizer(this.exploredSubgroup);
        this.edgeClasses = TriangleGroup.computeEdgeClasses(this.polygon.vertices.length, stabilizer);

        if (this.onStateChange) {
            this.onStateChange({
                generators: this.generators,
                exploredCount: this.exploredSubgroup.length,
                stabilizerCount: stabilizer.length,
                edgeClasses: this.edgeClasses
            });
        }

        this.rebuildTessellation();
        this.rebuildBasePolygon();
        this.rebuildPairingLinks();
        this.rebuildOrbit();
        this.rebuildTestSegment();
    }

    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width <= 0 || height <= 0) return;

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

    private setupCamera(): void {
        const width = this.container.clientWidth || 1;
        const height = this.container.clientHeight || 1;
        const aspect = width / height;
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
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(0, 0, 0);
    }

    private setupScene() {
        this.scene = new THREE.Scene();

        this.scene.add(this.diskBoundaryGroup);
        this.scene.add(this.tessellationGroup);
        this.scene.add(this.polygonOrbitGroup);
        this.scene.add(this.basePolygonGroup);
        this.scene.add(this.pairingLinksGroup);
        this.scene.add(this.testSegmentGroup);
        this.scene.add(this.controlHandlesGroup);

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

    private getDiskCoord(e: PointerEvent): Complex | null {
        const dom = this.renderer.domElement;
        const rect = dom.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;

        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

        const aspect = rect.width / rect.height;
        const frustumSize = 2.4;

        return {
            re: (nx * frustumSize * aspect) / 2,
            im: (ny * frustumSize) / 2
        };
    }

    private setupEvents() {
        const dom = this.renderer.domElement;
        dom.style.touchAction = 'none';

        const onResize = () => this.handleResize();
        window.addEventListener('resize', onResize);

        const resizeObserver = new ResizeObserver(() => this.handleResize());
        resizeObserver.observe(this.container);

        const onPointerDown = (e: PointerEvent) => {
            const pos = this.getDiskCoord(e);
            if (!pos) return;

            const d1 = Math.hypot(pos.re - this.testPoint1.re, pos.im - this.testPoint1.im);
            const d2 = Math.hypot(pos.re - this.testPoint2.re, pos.im - this.testPoint2.im);

            const hitRadius = 0.15;
            if (d1 < hitRadius && d1 <= d2) {
                this.draggingPoint = 1;
                this.isDragging = true;
                dom.setPointerCapture(e.pointerId);
            } else if (d2 < hitRadius) {
                this.draggingPoint = 2;
                this.isDragging = true;
                dom.setPointerCapture(e.pointerId);
            }
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!this.isDragging || !this.draggingPoint)
                return;
            const pos = this.getDiskCoord(e);
            if (!pos)
                return;

            const r = Math.hypot(pos.re, pos.im);
            const maxR = 0.98;
            const clampedPos = r > maxR ? { re: (pos.re / r) * maxR, im: (pos.im / r) * maxR } : pos;

            if (this.draggingPoint === 1)
                this.testPoint1 = clampedPos;
            else
                this.testPoint2 = clampedPos;
            this.rebuildTestSegment();
        };

        const onPointerUp = (e: PointerEvent) => {
            if (this.isDragging) {
                this.isDragging = false;
                this.draggingPoint = null;
                try {
                    dom.releasePointerCapture(e.pointerId);
                } catch (_) { }
            }
        };

        dom.addEventListener('pointerdown', onPointerDown);
        dom.addEventListener('pointermove', onPointerMove);
        dom.addEventListener('pointerup', onPointerUp);
        dom.addEventListener('pointercancel', onPointerUp);

        this.cleanUpTasks.push(() => {
            window.removeEventListener('resize', onResize);
            resizeObserver.disconnect();
            dom.removeEventListener('pointerdown', onPointerDown);
            dom.removeEventListener('pointermove', onPointerMove);
            dom.removeEventListener('pointerup', onPointerUp);
            dom.removeEventListener('pointercancel', onPointerUp);
        });
    }

    private clearGroup(group: THREE.Group) {
        const geometries = new Set<THREE.BufferGeometry>();
        const materials = new Set<THREE.Material>();

        while (group.children.length > 0) {
            const obj = group.children.pop()!;
            if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
                if (obj.geometry)
                    geometries.add(obj.geometry);
                if (obj.material) {
                    if (Array.isArray(obj.material))
                        obj.material.forEach(m => materials.add(m));
                    else
                        materials.add(obj.material);
                }
            }
        }

        geometries.forEach(g => g.dispose());
        materials.forEach(m => m.dispose());
    }

    private rebuildTessellation() {
        this.clearGroup(this.tessellationGroup);

        const { inradiusE, circumradiusE } = this.polygon.metrics;
        const p = this.polygon.vertices.length;

        const v0: Complex = { re: 0, im: 0 };
        const v1: Complex = { re: inradiusE, im: 0 };
        const v2: Complex = ComplexMath.fromPolar(circumradiusE, Math.PI / p);

        const sampleArc = (m: MobiusMatrix, p1: Complex, p2: Complex) => {
            const pts = PoincareGeometry.getGeodesicPoints(p1, p2, 12);
            return pts.map(pt => {
                const c = MobiusTransform.apply(m, pt);
                return new THREE.Vector3(c.re, c.im, 0.01);
            });
        };

        for (const el of this.deltaK) {
            const arc0 = sampleArc(el.matrix, v0, v1);
            const arc1 = sampleArc(el.matrix, v1, v2).slice(1);
            const arc2 = sampleArc(el.matrix, v2, v0).slice(1);
            const pts = [...arc0, ...arc1, ...arc2];

            const outlineGeom = new THREE.BufferGeometry().setFromPoints(pts);
            const outlineMat = new THREE.LineBasicMaterial({
                color: 0x2c3e50,
                transparent: true,
                opacity: 0.25
            });
            const line = new THREE.Line(outlineGeom, outlineMat);
            line.renderOrder = 5;
            this.tessellationGroup.add(line);
        }
    }

    private rebuildBasePolygon() {
        this.clearGroup(this.basePolygonGroup);

        const baseVerts = this.polygon.vertices;
        const p = baseVerts.length;
        const ribbonWidth = 0.008;
        const edgeColors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#e84393'];

        // Edge i connects v_{i-1} to v_i
        for (let i = 0; i < p; i++) {
            const p1 = baseVerts[(i - 1 + p) % p];
            const p2 = baseVerts[i];
            const edgePts = PoincareGeometry.getGeodesicPoints(p1, p2, 16);

            let edgeColor = '#ffffff';
            for (let cIdx = 0; cIdx < this.edgeClasses.length; cIdx++) {
                if (this.edgeClasses[cIdx].edgeIndices.includes(i)) {
                    edgeColor = edgeColors[cIdx % edgeColors.length];
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
                const len = Math.hypot(dx, dy) || 1;
                const nx = (-dy / len) * ribbonWidth;
                const ny = (dx / len) * ribbonWidth;

                const baseIdx = vertices.length / 3;
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
                side: THREE.DoubleSide
            });

            const ribbonMesh = new THREE.Mesh(geom, mat);
            ribbonMesh.renderOrder = 40;
            this.basePolygonGroup.add(ribbonMesh);
        }
    }

    private rebuildPairingLinks() {
        this.clearGroup(this.pairingLinksGroup);

        for (const pairing of this.sidePairings) {
            if (pairing.edgeIndex >= pairing.targetEdgeIndex) continue;

            const m1 = this.polygon.midpoints[pairing.edgeIndex];
            const m2 = this.polygon.midpoints[pairing.targetEdgeIndex];

            const curvePts: THREE.Vector3[] = [];
            for (let t = 0; t <= 20; t++) {
                const s = t / 20;
                const bx = (1 - s) * m1.re + s * m2.re;
                const by = (1 - s) * m1.im + s * m2.im;
                const lift = Math.sin(s * Math.PI) * 0.08;
                curvePts.push(new THREE.Vector3(bx * (1 - lift), by * (1 - lift), 0.06));
            }

            const geom = new THREE.BufferGeometry().setFromPoints(curvePts);
            const mat = new THREE.LineBasicMaterial({
                color: pairing.sign > 0 ? 0x2ecc71 : 0xe74c3c,
                transparent: true,
                opacity: 0.8
            });
            const line = new THREE.Line(geom, mat);
            line.renderOrder = 45;
            this.pairingLinksGroup.add(line);
        }
    }

    private rebuildOrbit() {
        this.clearGroup(this.polygonOrbitGroup);

        const baseVerts = this.polygon.vertices;
        const p = baseVerts.length;

        for (const h of this.exploredSubgroup) {
            const transformedVerts = baseVerts.map(v => MobiusTransform.apply(h.matrix, v));

            const polyPts: THREE.Vector3[] = [];
            for (let i = 0; i < p; i++) {
                const p1 = transformedVerts[(i - 1 + p) % p];
                const p2 = transformedVerts[i];
                const arc = PoincareGeometry.getGeodesicPoints(p1, p2, 10);
                polyPts.push(...arc.map(pt => new THREE.Vector3(pt.re, pt.im, 0.03)));
            }

            const lineGeom = new THREE.BufferGeometry().setFromPoints(polyPts);
            const lineMat = new THREE.LineBasicMaterial({
                color: 0x3498db,
                transparent: true,
                opacity: 0.50
            });
            const lineMesh = new THREE.Line(lineGeom, lineMat);
            lineMesh.renderOrder = 30;
            this.polygonOrbitGroup.add(lineMesh);
        }
    }

    private rebuildTestSegment() {
        this.clearGroup(this.testSegmentGroup);
        this.clearGroup(this.controlHandlesGroup);

        if (!this.params.showTestSegment) return;

        const baseHandleGeom = new THREE.CircleGeometry(0.035, 24);
        const orbitHandleGeom = new THREE.CircleGeometry(0.018, 16);

        const matP1Base = new THREE.MeshBasicMaterial({ color: 0xe74c3c });
        const matP2Base = new THREE.MeshBasicMaterial({ color: 0x9b59b6 });

        const matP1Orbit = new THREE.MeshBasicMaterial({ color: 0xef767a, transparent: true, opacity: 0.85 });
        const matP2Orbit = new THREE.MeshBasicMaterial({ color: 0xbb86fc, transparent: true, opacity: 0.85 });

        for (const h of this.exploredSubgroup) {
            const isIdentity = h.id === '1' || h.word?.canonicalString === '1';

            const c1 = MobiusTransform.apply(h.matrix, this.testPoint1);
            const c2 = MobiusTransform.apply(h.matrix, this.testPoint2);

            const arc = PoincareGeometry.getGeodesicPoints(c1, c2, 16);
            const lineGeom = new THREE.BufferGeometry().setFromPoints(
                arc.map(pt => new THREE.Vector3(pt.re, pt.im, isIdentity ? 0.075 : 0.07))
            );
            const lineMat = new THREE.LineBasicMaterial({
                color: isIdentity ? 0xf39c12 : 0xe67e22,
                transparent: true,
                opacity: isIdentity ? 1.0 : 0.70
            });
            const line = new THREE.Line(lineGeom, lineMat);
            line.renderOrder = isIdentity ? 52 : 50;
            this.testSegmentGroup.add(line);

            if (!isIdentity) {
                const ball1 = new THREE.Mesh(orbitHandleGeom, matP1Orbit);
                ball1.position.set(c1.re, c1.im, 0.075);
                ball1.renderOrder = 55;
                this.testSegmentGroup.add(ball1);

                const ball2 = new THREE.Mesh(orbitHandleGeom, matP2Orbit);
                ball2.position.set(c2.re, c2.im, 0.075);
                ball2.renderOrder = 55;
                this.testSegmentGroup.add(ball2);
            }
        }

        const h1 = new THREE.Mesh(baseHandleGeom, matP1Base);
        h1.position.set(this.testPoint1.re, this.testPoint1.im, 0.09);
        h1.renderOrder = 60;

        const h2 = new THREE.Mesh(baseHandleGeom, matP2Base);
        h2.position.set(this.testPoint2.re, this.testPoint2.im, 0.09);
        h2.renderOrder = 60;

        this.controlHandlesGroup.add(h1);
        this.controlHandlesGroup.add(h2);
    }

    private animate() {
        this.renderer.render(this.scene, this.camera);
    }
}