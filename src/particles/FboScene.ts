import * as THREE from 'three';
import vsString from './shaders/particleVertex.glsl?raw';
import fsString from './shaders/particleFragment.glsl?raw';

class FboScene {
    scene: THREE.Scene;
    camera: THREE.Camera;
    // cleanUpTasks: (() => void)[];
    material: THREE.ShaderMaterial;
    SIZE: number = 256;

    fbo: THREE.WebGLRenderTarget;
    fbo2: THREE.WebGLRenderTarget;

    constructor(renderer: THREE.WebGLRenderer) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);

        // just initial values!
        const initialValues = new Float32Array(this.SIZE*this.SIZE*4);
        for (let j = 0; j < this.SIZE; j++) {
            for (let k = 0; k < this.SIZE; k++) {
                let index = j*this.SIZE + k;
                let theta = Math.random()*Math.PI*2;
                let r = 0.5 + 0.4*Math.random();
                initialValues[index*4 + 0] = r*Math.cos(theta);
                initialValues[index*4 + 1] = r*Math.sin(theta);
                initialValues[index*4 + 2] = 0;
                initialValues[index*4 + 3] = 1.;
            }
        }

        const texture = new THREE.DataTexture(initialValues, this.SIZE, this.SIZE, THREE.RGBAFormat, THREE.FloatType);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                u_pos: { value: texture },
                time: { value: 0 }
            },
            vertexShader: vsString,
            fragmentShader: fsString,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(mesh);

        this.fbo = this.createRenderTarget();
        this.fbo2 = this.createRenderTarget();

        // renderer.setRenderTarget(this.fbo);
        // renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(this.fbo2);
        renderer.render(this.scene, this.camera);
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
        this.material.uniforms.u_pos.value = this.fbo2.texture;

        renderer.setRenderTarget(this.fbo);
        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);
        
        // Ping-pong between fbo and fbo2.
        const temp = this.fbo;
        this.fbo = this.fbo2;
        this.fbo2 = temp;
    }
}

export { FboScene };