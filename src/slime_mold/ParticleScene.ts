import * as THREE from 'three';
import vsString from './shaders/particleVertex.glsl?raw';
import fsString from './shaders/particleFragment.glsl?raw';
import { PARTICLE_TEXTURE_SIZE } from './config';
import { BaseScene } from './BaseScene';

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

        const initialPositions = new Float32Array(PARTICLE_TEXTURE_SIZE*PARTICLE_TEXTURE_SIZE*4);
        for (let j = 0; j < PARTICLE_TEXTURE_SIZE; j++) {
            for (let k = 0; k < PARTICLE_TEXTURE_SIZE; k++) {
                let index = j*PARTICLE_TEXTURE_SIZE + k;
                let theta = Math.random()*Math.PI*2;
                let r = 0.5 + 0.1*Math.random();
                initialPositions[index*4 + 0] = r*Math.cos(theta);
                initialPositions[index*4 + 1] = r*Math.sin(theta);
                initialPositions[index*4 + 2] = Math.random()*2.0*Math.PI;
                initialPositions[index*4 + 3] = 0.5;//+Math.floor(Math.random()*3);
            }
        }

        this.initialPositionsTexture = new THREE.DataTexture(initialPositions, PARTICLE_TEXTURE_SIZE, PARTICLE_TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType);
        this.initialPositionsTexture.minFilter = THREE.NearestFilter;
        this.initialPositionsTexture.magFilter = THREE.NearestFilter;
        this.initialPositionsTexture.needsUpdate = true;

        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                // uPosition: (x,y) is position, z is angle, w is free for other use
                uPosition: { value: this.initialPositionsTexture },
                trailMap: { value: this.baseScene.fbos[0].texture },
                resolution: { value: this.baseScene.getResolution() },
                time: { value: 0 }
            },
            vertexShader: vsString,
            fragmentShader: fsString,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.shaderMaterial);
        this.scene.add(mesh);

        this.fbos = [];
        for (let k = 0; k < 2; k++) {
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
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        });
        return renderTarget;
    }

    step(renderer: THREE.WebGLRenderer) {
        const [i0, i1] = [this.currentFboIndex, (this.currentFboIndex+1)%2];

        this.shaderMaterial.uniforms.uPosition.value = this.fbos[i0].texture;

        renderer.setRenderTarget(this.fbos[i1]);
        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);
        
        this.currentFboIndex = i1;
    }
}

export { ParticleScene };