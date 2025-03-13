import * as THREE from 'three';
import vs from './shaders/vs.glsl?raw';
import fs from './shaders/fs.glsl?raw';

/**
 * Draws uniform cubic B-splines using instancing.
 */
class UCBSplineGroup {
    // MAX_WIDTH has to match value in vs.glsl.
    // This is used to avoid limitations on texture dimensions.
    static MAX_WIDTH = 1024;

    shader: THREE.ShaderMaterial;
    numSegments: number;

    ibGeometry!: THREE.InstancedBufferGeometry;
    controlPointTexture!: THREE.DataTexture;
    indexTexture!: THREE.DataTexture;
    mesh: THREE.Object3D;

    // (x,y,z,0) for each control point, flattened
    controlPointArray: Float32Array;
    // index i for plotting Bezier for control points (i,i+1,i+2,i+3)
    indexArray: Int32Array;

    numControlPoints: number = 0;
    numIndexes: number = 0;

    constructor(numSegments: number=16) {
        this.numSegments = numSegments;

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: null },
                numSegments: { value: this.numSegments },
                controlPointTexture: { value: null },
                indexTexture: { value: null },
            },
            vertexShader: vs,
            fragmentShader: fs,
        });

        this.ibGeometry = new THREE.InstancedBufferGeometry();
        this.ibGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));

        this.controlPointArray = new Float32Array(0);
        this.indexArray = new Int32Array(0);

        this.controlPointTexture = new THREE.DataTexture(this.controlPointArray, this.controlPointArray.length/4, 1, THREE.RGBAFormat, THREE.FloatType);
        this.indexTexture = new THREE.DataTexture(this.indexArray, this.indexArray.length, 1, THREE.RedIntegerFormat, THREE.IntType);
        this.shader.uniforms.controlPointTexture.value = this.controlPointTexture;
        this.shader.uniforms.indexTexture.value = this.indexTexture;

        this.mesh = new THREE.Line(this.ibGeometry, this.shader);

        this.reset();
    }

    addSpline(controlPoints: THREE.Vector3[], closed: boolean=false) {
        if (controlPoints.length < 4)
            throw new Error('Too few points to create spline, at least 4 needed.');

        // Number of control points after adding
        const np = this.numControlPoints + 4*controlPoints.length + (closed ? 3 : 0);
        // Number of indexes after adding
        const ni = this.numIndexes + controlPoints.length + (closed ? 0 : -3);

        if (np > this.controlPointArray.length) {
            // n is smallest power of 2 that is at least np
            const n = Math.pow(2, Math.ceil(Math.log2(np)));
            // Create large enough array to hold all data
            const newArray = new Float32Array(n);

            // Copy existing data from previous array
            newArray.set(this.controlPointArray, 0);
            this.controlPointArray = newArray;

            // Hook new array into this.controlPointTexture
            this.controlPointTexture.dispose();
            const m = this.controlPointArray.length / 4;
            this.controlPointTexture = new THREE.DataTexture(
                this.controlPointArray, 
                Math.min(m, UCBSplineGroup.MAX_WIDTH), 
                Math.ceil(m / UCBSplineGroup.MAX_WIDTH),
                THREE.RGBAFormat, THREE.FloatType
            );
            this.shader.uniforms.controlPointTexture.value = this.controlPointTexture;
        }
        if (ni > this.indexArray.length) {
            // n is smallest power of 2 that is at least ni
            const n = Math.pow(2, Math.ceil(Math.log2(ni)));
            // Create large enough array to hold all data
            const newArray = new Int32Array(n);

            // Copy existing data from previous array
            newArray.set(this.indexArray, 0);
            this.indexArray = newArray;

            // Hook new array into this.controlPointTexture
            this.indexTexture.dispose();
            this.indexTexture = new THREE.DataTexture(
                this.indexArray, 
                Math.min(this.indexArray.length, UCBSplineGroup.MAX_WIDTH), 
                Math.ceil(this.indexArray.length / UCBSplineGroup.MAX_WIDTH), 
                THREE.RedIntegerFormat, THREE.IntType
            );
            this.shader.uniforms.indexTexture.value = this.indexTexture;
        }

        for (let k = 0; k < controlPoints.length + (closed ? 3 : 0); k++) {
            const p = controlPoints[k % controlPoints.length];
            this.controlPointArray[this.numControlPoints + 0] = p.x;
            this.controlPointArray[this.numControlPoints + 1] = p.y;
            this.controlPointArray[this.numControlPoints + 2] = p.z;
            // this.controlPointArray[this.numControlPoints + 3] = 0;
            if (k < controlPoints.length + (closed ? 0 : -3)) {
                this.indexArray[this.numIndexes] = this.numControlPoints / 4;
                this.numIndexes += 1;
            }
            this.numControlPoints += 4;
        }

        this.ibGeometry.instanceCount = this.numIndexes * this.numSegments;
        this.controlPointTexture.needsUpdate = true;
        this.indexTexture.needsUpdate = true;
    }

    reset() {
        this.numControlPoints = 0;
        this.numIndexes = 0;
        this.ibGeometry.instanceCount = 0;
    }

    getObject(): THREE.Object3D {
        return this.mesh;
    }
}

export { UCBSplineGroup };