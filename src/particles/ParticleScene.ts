import * as THREE from 'three';
import vsString from './shaders/particleVertex.glsl?raw';
import fsString from './shaders/particleFragment.glsl?raw';
import { NUM_OBJECTS, PARTICLE_TEXTURE_SIZE } from './config';
import { BaseScene } from './baseScene';

class ParticleScene {
    baseScene: BaseScene;
    scene: THREE.Scene;
    camera: THREE.Camera;
    // cleanUpTasks: (() => void)[];
    shaderMaterial: THREE.ShaderMaterial;
    initialPositionsTexture: THREE.DataTexture;

    fbos: THREE.WebGLRenderTarget[];
    currentFboIndex: number;    // latest computed fbo index

    constructor(baseScene: BaseScene) {
        this.baseScene = baseScene;
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);

        // just initial values!
        const initialPositions = new Float32Array(PARTICLE_TEXTURE_SIZE*PARTICLE_TEXTURE_SIZE*4);
        for (let j = 0; j < PARTICLE_TEXTURE_SIZE; j++) {
            for (let k = 0; k < PARTICLE_TEXTURE_SIZE; k++) {
                let index = j*PARTICLE_TEXTURE_SIZE + k;
                let theta = Math.random()*Math.PI*2;
                let r = 0.3 + 0.7*Math.random();
                initialPositions[index*4 + 0] = r*Math.cos(theta);
                initialPositions[index*4 + 1] = r*Math.sin(theta);
                initialPositions[index*4 + 2] = Math.random()*0.1-0.05;
                initialPositions[index*4 + 3] = -0.5;
                // initialPositions[index*4 + 3] = 0.0;
            }
        }

        this.initialPositionsTexture = new THREE.DataTexture(initialPositions, PARTICLE_TEXTURE_SIZE, PARTICLE_TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType);
        this.initialPositionsTexture.minFilter = THREE.NearestFilter;
        this.initialPositionsTexture.magFilter = THREE.NearestFilter;
        this.initialPositionsTexture.needsUpdate = true;

        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uPositionObjects: { value: this.baseScene.objects.map((object) => object.position) },
                uPosition0: { value: this.initialPositionsTexture },
                uPosition1: { value: this.initialPositionsTexture },
                uPosition2: { value: this.initialPositionsTexture },
                time: { value: 0 }
            },
            vertexShader: vsString,
            fragmentShader: fsString,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.shaderMaterial);
        this.scene.add(mesh);

        this.fbos = [];
        for (let k = 0; k < 3; k++) {
            const rt = this.createRenderTarget();
            this.fbos.push(rt);
            this.baseScene.renderer.setRenderTarget(rt);
            this.baseScene.renderer.render(this.scene, this.camera);
        }
        this.currentFboIndex = 0;
        this.baseScene.renderer.setRenderTarget(null);
    }

    createRenderTarget() {
        const renderTarget = new THREE.WebGLRenderTarget(PARTICLE_TEXTURE_SIZE, PARTICLE_TEXTURE_SIZE, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        });
        return renderTarget;
    }

    /**
     * Returns a sample of the alpha values in this.fbos[0].
     */
    debugArray() {
        const pixelBuffer = new Float32Array(PARTICLE_TEXTURE_SIZE * PARTICLE_TEXTURE_SIZE * 4);

        // Read the pixel values into the array
        this.baseScene.renderer.readRenderTargetPixels(
            this.fbos[0], 0, 0, PARTICLE_TEXTURE_SIZE, PARTICLE_TEXTURE_SIZE, pixelBuffer);
        // Pick some random alpha values
        return [...pixelBuffer.filter((_, index) => index%4 == 3)]
            .sort(() => Math.random()-0.5)
            .slice(0, 20)
            .sort((a, b) => a-b);
    }

    step(renderer: THREE.WebGLRenderer) {
        // Take texture from fbo2 and write into fbo.
        const [ i0, i1, i2 ] = [this.currentFboIndex, (this.currentFboIndex+1)%3, (this.currentFboIndex+2)%3];
        // Now this.fbos index i0 is latest computed positions, i2 is last positions,
        // and we want to fill up positions at i1:

        this.shaderMaterial.uniforms.uPosition1.value = this.fbos[i2].texture;
        this.shaderMaterial.uniforms.uPosition2.value = this.fbos[i0].texture;

        renderer.setRenderTarget(this.fbos[i1]);
        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);
        
        this.currentFboIndex = i1;
    }

    setObjectPositions() {
        for (let k = 0; k < NUM_OBJECTS; k++)
            this.shaderMaterial.uniforms.uPositionObjects.value[k] = this.baseScene.objects[k].position;
    }
}

export { ParticleScene };