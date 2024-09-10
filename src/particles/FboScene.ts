import * as THREE from 'three';
import vsString from './shaders/particleVertex.glsl?raw';
import fsString from './shaders/particleFragment.glsl?raw';

class FboScene {
    scene: THREE.Scene;
    camera: THREE.Camera;
    // cleanUpTasks: (() => void)[];
    material: THREE.ShaderMaterial;
    SIZE: number = 256;
    initialPositionsTexture: THREE.DataTexture;

    fbos: THREE.WebGLRenderTarget[];
    currentFboIndex: number;    // latest computed fbo index

    constructor(renderer: THREE.WebGLRenderer) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);

        // just initial values!
        const initialPositions = new Float32Array(this.SIZE*this.SIZE*4);
        for (let j = 0; j < this.SIZE; j++) {
            for (let k = 0; k < this.SIZE; k++) {
                let index = j*this.SIZE + k;
                let theta = Math.random()*Math.PI*2;
                let r = 0.5 + 0.4*Math.random();
                initialPositions[index*4 + 0] = r*Math.cos(theta);
                initialPositions[index*4 + 1] = r*Math.sin(theta);
                initialPositions[index*4 + 2] = 0;
                initialPositions[index*4 + 3] = 1;
            }
        }

        this.initialPositionsTexture = new THREE.DataTexture(initialPositions, this.SIZE, this.SIZE, THREE.RGBAFormat, THREE.FloatType);
        this.initialPositionsTexture.minFilter = THREE.NearestFilter;
        this.initialPositionsTexture.magFilter = THREE.NearestFilter;
        this.initialPositionsTexture.needsUpdate = true;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uPositionObject: { value: new THREE.Vector3(0, 0, 0) }, // NOTE: incorrect
                uPosition0: { value: this.initialPositionsTexture },
                uPosition1: { value: this.initialPositionsTexture },
                uPosition2: { value: this.initialPositionsTexture },
                time: { value: 0 }
            },
            vertexShader: vsString,
            fragmentShader: fsString,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(mesh);

        this.fbos = [];
        for (let k = 0; k < 3; k++) {
            const rt = this.createRenderTarget();
            this.fbos.push(rt);
            renderer.setRenderTarget(rt);
            renderer.render(this.scene, this.camera);
        }
        this.currentFboIndex = 2;       // fix later
        renderer.setRenderTarget(null);
    }

    createRenderTarget() {
        const renderTarget = new THREE.WebGLRenderTarget(this.SIZE, this.SIZE, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        });
        return renderTarget;
    }

    step(renderer: THREE.WebGLRenderer) {
        // Take texture from fbo2 and write into fbo.
        const [ i0, i1, i2 ] = [this.currentFboIndex, (this.currentFboIndex+1)%3, (this.currentFboIndex+2)%3];
        // Now this.fbos index i0 is latest computed positions, i2 is last positions,
        // and we want to fill up positions at i1:

        this.material.uniforms.uPosition1.value = this.fbos[i2].texture;
        this.material.uniforms.uPosition2.value = this.fbos[i0].texture;

        renderer.setRenderTarget(this.fbos[i1]);
        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);
        
        this.currentFboIndex = i1;
    }

    setObjectPosition(p: THREE.Vector3) {
        this.material.uniforms.uPositionObject.value = p;
    }
}

export { FboScene };