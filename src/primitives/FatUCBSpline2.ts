import * as THREE from 'three';
import vsSpline from './shaders/vsFatSpline2.glsl?raw';
import vsCap from './shaders/vsFatSpline2Cap.glsl?raw';
import fsSpline from './shaders/fsSpline.glsl?raw';

/**
 * Instanced tubular uniform cubic B-spline renderer with optional endcaps.
 */
class FatUCBSplineGroup2 {
    static readonly TEXTURE_WIDTH = 1024;
    static readonly TUBE_SEGMENTS_V = 8;
    // tube radii (world, screen_min_pixels, screen_max_pixels)
    static readonly DEFAULT_RADII = [0.01, 0.5, 12];

    tubeShader: THREE.ShaderMaterial;
    capShader: THREE.ShaderMaterial;

    tubeGeometry!: THREE.InstancedBufferGeometry;
    capGeometry!: THREE.InstancedBufferGeometry;

    controlPointArray: Float32Array;
    indexArray: Int32Array;
    capDataArray: Int32Array;

    controlPointTexture!: THREE.DataTexture;
    indexTexture!: THREE.DataTexture;
    capDataTexture!: THREE.DataTexture;

    numControlPoints = 0;
    numSegments: number;
    numIndexes = 0;
    numCaps = 0;

    group: THREE.Group;

    constructor(numSegments: number = 16) {
        this.numSegments = numSegments;

        // --- Shader Materials ---
        this.tubeShader = new THREE.ShaderMaterial({
            uniforms: {
                u_TEXTURE_WIDTH: { value: FatUCBSplineGroup2.TEXTURE_WIDTH },
                u_resolution: { value: new THREE.Vector2() },
                u_numSegments: { value: this.numSegments },
                u_controlPointTexture: { value: null },
                u_indexTexture: { value: null },
                u_V: { value: FatUCBSplineGroup2.TUBE_SEGMENTS_V },
                u_radii: { value: new THREE.Vector3(...FatUCBSplineGroup2.DEFAULT_RADII) },
            },
            vertexShader: vsSpline,
            fragmentShader: fsSpline,
            depthWrite: true,
            depthTest: true,
        });

        this.capShader = new THREE.ShaderMaterial({
            uniforms: {
                u_TEXTURE_WIDTH: { value: FatUCBSplineGroup2.TEXTURE_WIDTH },
                u_resolution: { value: new THREE.Vector2() },
                u_controlPointTexture: { value: null },
                u_capDataTexture: { value: null },
                u_V: { value: FatUCBSplineGroup2.TUBE_SEGMENTS_V },
                u_radii: { value: new THREE.Vector3(...FatUCBSplineGroup2.DEFAULT_RADII) },
            },
            vertexShader: vsCap,
            fragmentShader: fsSpline,
            depthWrite: true,
            depthTest: true,
        });

        // --- Geometry ---
        // Each instanced geometry uses a dummy position buffer; actual positions are computed in shader
        this.tubeGeometry = this.createInstancedGeometry(this.numSegments * FatUCBSplineGroup2.TUBE_SEGMENTS_V * 6);
        this.capGeometry = this.createInstancedGeometry(FatUCBSplineGroup2.TUBE_SEGMENTS_V * FatUCBSplineGroup2.TUBE_SEGMENTS_V * 6);

        // --- Data Arrays and Textures ---
        this.controlPointArray = new Float32Array(0);
        this.indexArray = new Int32Array(0);
        this.capDataArray = new Int32Array(0);

        this.controlPointTexture = new THREE.DataTexture(this.controlPointArray, 1, 1, THREE.RGBAFormat, THREE.FloatType);
        this.indexTexture = new THREE.DataTexture(this.indexArray, 1, 1, THREE.RedIntegerFormat, THREE.IntType);
        this.capDataTexture = new THREE.DataTexture(this.capDataArray, 1, 1, THREE.RGIntegerFormat, THREE.IntType);

        this.tubeShader.uniforms.u_controlPointTexture.value = this.controlPointTexture;
        this.tubeShader.uniforms.u_indexTexture.value = this.indexTexture;
        this.capShader.uniforms.u_controlPointTexture.value = this.controlPointTexture;
        this.capShader.uniforms.u_capDataTexture.value = this.capDataTexture;

        // --- Grouping Meshes ---
        const tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeShader);
        tubeMesh.frustumCulled = false;

        const capMesh = new THREE.Mesh(this.capGeometry, this.capShader);
        capMesh.frustumCulled = false;

        this.group = new THREE.Group();
        this.group.add(tubeMesh);
        this.group.add(capMesh);

        this.reset();
    }

    /** 
     * Create instanced geometry with a dummy position buffer 
     */
    private createInstancedGeometry(vertexCount: number): THREE.InstancedBufferGeometry {
        const geometry = new THREE.InstancedBufferGeometry();
        const positions = new Float32Array(vertexCount * 3);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geometry;
    }

    /**
     * Must be called whenever pixel ratio or canvas size changes.
     */
    setResolution(renderer: THREE.WebGLRenderer) {
        renderer.getDrawingBufferSize(this.tubeShader.uniforms.u_resolution.value);
        renderer.getDrawingBufferSize(this.capShader.uniforms.u_resolution.value);
    }

    /**
     * Adds a new spline.
     * @param controlPoints Array of 3D points.
     * @param color Function mapping control point index to [r,g,b].
     * @param isClosed Whether the spline forms a closed loop.
     * @param startCap If true, add a hemisphere cap at the start (ignored if isClosed).
     * @param endCap   If true, add a hemisphere cap at the end (ignored if isClosed).
     */
    addSpline(
        controlPoints: THREE.Vector3[],
        color: (k: number) => number[],
        isClosed: boolean = false,
        startCap: boolean = false,
        endCap: boolean = false
    ) {
        if (controlPoints.length < 4) throw new Error('At least 4 control points required.');

        const startIndex = this.numIndexes;
        const np = this.numControlPoints + controlPoints.length + (isClosed ? 3 : 0);
        const ni = this.numIndexes + controlPoints.length + (isClosed ? 0 : -3);

        this.ensureControlPointArray(8 * np);
        this.ensureIndexArray(ni);

        for (let k = 0; k < controlPoints.length + (isClosed ? 3 : 0); k++) {
            const j = k % controlPoints.length;
            const p = controlPoints[j];
            const c = color(j);
            const offset = 8 * this.numControlPoints;

            // Store (x, y, z, 0, r, g, b, 0) per control point
            this.controlPointArray[offset + 0] = p.x;
            this.controlPointArray[offset + 1] = p.y;
            this.controlPointArray[offset + 2] = p.z;
            this.controlPointArray[offset + 4] = c[0];
            this.controlPointArray[offset + 5] = c[1];
            this.controlPointArray[offset + 6] = c[2];

            if (k < controlPoints.length + (isClosed ? 0 : -3)) {
                this.indexArray[this.numIndexes++] = this.numControlPoints;
            }
            this.numControlPoints++;
        }

        this.tubeGeometry.instanceCount = this.numIndexes;
        this.controlPointTexture.needsUpdate = true;
        this.indexTexture.needsUpdate = true;

        if (!isClosed) {
            if (startCap)
                this.addCapInstance(startIndex, 0);
            if (endCap)
                this.addCapInstance(this.numIndexes - 1, 1);
        }
    }

    /**
     * Adds a single cap instance for a given spline segment.
     * @param segmentStartIndex Index into the indexTexture pointing to the first control point of the segment.
     * @param side 0 = start cap, 1 = end cap.
     */
    private addCapInstance(segmentStartIndex: number, side: number) {
        this.ensureCapDataArray(2 * this.numCaps + 2);

        const offset = 2 * this.numCaps;
        this.capDataArray[offset] = this.indexArray[segmentStartIndex];
        this.capDataArray[offset + 1] = side;
        this.numCaps++;

        this.capGeometry.instanceCount = this.numCaps;
        this.capDataTexture.needsUpdate = true;
    }

    private growArray<T extends Float32Array | Int32Array>(array: T, minLength: number): T {
        const newLength = Math.pow(2, Math.ceil(Math.log2(minLength)));
        const newArray = new (array.constructor as { new(size: number): T })(newLength);
        newArray.set(array, 0);
        return newArray;
    }

    private ensureControlPointArray(minLength: number) {
        if (minLength <= this.controlPointArray.length)
            return;

        this.controlPointArray = this.growArray(this.controlPointArray, minLength);

        this.controlPointTexture.dispose();

        const texels = this.controlPointArray.length / 4;

        this.controlPointTexture = new THREE.DataTexture(
            this.controlPointArray,
            Math.min(texels, FatUCBSplineGroup2.TEXTURE_WIDTH),
            Math.ceil(texels / FatUCBSplineGroup2.TEXTURE_WIDTH),
            THREE.RGBAFormat,
            THREE.FloatType
        );

        this.tubeShader.uniforms.u_controlPointTexture.value = this.controlPointTexture;
        this.capShader.uniforms.u_controlPointTexture.value = this.controlPointTexture;
    }

    private ensureIndexArray(minLength: number) {
        if (minLength <= this.indexArray.length)
            return;

        this.indexArray = this.growArray(this.indexArray, minLength);

        this.indexTexture.dispose();

        const texels = this.indexArray.length;

        this.indexTexture = new THREE.DataTexture(
            this.indexArray,
            Math.min(texels, FatUCBSplineGroup2.TEXTURE_WIDTH),
            Math.ceil(texels / FatUCBSplineGroup2.TEXTURE_WIDTH),
            THREE.RedIntegerFormat,
            THREE.IntType
        );

        this.tubeShader.uniforms.u_indexTexture.value = this.indexTexture;
    }

    private ensureCapDataArray(minLength: number) {
        if (minLength <= this.capDataArray.length)
            return;

        this.capDataArray = this.growArray(this.capDataArray, minLength);

        this.capDataTexture.dispose();

        const texels = this.capDataArray.length / 2;

        this.capDataTexture = new THREE.DataTexture(
            this.capDataArray,
            Math.min(texels, FatUCBSplineGroup2.TEXTURE_WIDTH),
            Math.ceil(texels / FatUCBSplineGroup2.TEXTURE_WIDTH),
            THREE.RGIntegerFormat,
            THREE.IntType
        );

        this.capShader.uniforms.u_capDataTexture.value = this.capDataTexture;
    }

    /** 
     * Resets all spline and cap data 
     */
    reset() {
        this.numControlPoints = 0;
        this.numIndexes = 0;
        this.numCaps = 0;
        this.tubeGeometry.instanceCount = 0;
        this.capGeometry.instanceCount = 0;
    }

    /** 
     * Returns a THREE.Group containing both the tube and cap meshes 
     */
    getObject(): THREE.Group {
        return this.group;
    }

    /** 
     * Dispose all geometries, textures, and materials 
     */
    dispose() {
        this.tubeShader.dispose();
        this.capShader.dispose();
        this.controlPointTexture.dispose();
        this.indexTexture.dispose();
        this.capDataTexture.dispose();
        this.tubeGeometry.dispose();
        this.capGeometry.dispose();
    }
}

export { FatUCBSplineGroup2 };