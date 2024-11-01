import * as THREE from 'three';
import vsString from './shaders/vsParticle.glsl?raw';
import fsString from './shaders/fsParticle.glsl?raw';
import { NUM_OBJECTS, PARTICLE_TEXTURE_SIZE } from './config';
import { BaseScene } from './baseScene';

const project = (lon: number, lat: number): [number, number] => {
    const LON_BASE = 20*Math.PI/180;
    const LAT_BASE = 62*Math.PI/180;
    const SCALE = 5.0;

    const deltaLon = lon - LON_BASE;
    const deltaLat = lat - LAT_BASE;

    const x = SCALE * deltaLon * Math.cos(LAT_BASE);
    const y = SCALE * deltaLat;

    return [x, y];
};


class ParticleScene {
    baseScene: BaseScene;
    scene: THREE.Scene;
    camera: THREE.Camera;
    // cleanUpTasks: (() => void)[];
    shaderMaterial: THREE.ShaderMaterial;
    initialPositionsTexture!: THREE.DataTexture;
    initialExtraDataTexture!: THREE.DataTexture;

    fbos: THREE.WebGLRenderTarget[];
    currentFboIndex: number;    // latest computed fbo index

    constructor(baseScene: BaseScene) {
        this.baseScene = baseScene;
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);

        this.computeInitialTextures();

        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uPositionObjects: { value: Array.from({ length: NUM_OBJECTS }, () => new THREE.Vector3(0, 0, 0)) },
                extraData: { value: this.initialExtraDataTexture },
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
            this.shaderMaterial.uniforms.uPositionObjects.value[k] = new THREE.Vector3(this.baseScene.appIconPositions[3*k+0], this.baseScene.appIconPositions[3*k+1], this.baseScene.appIconPositions[3*k+2]);
    }

    computeInitialTextures() {
        // just initial values!
        const initialPositions = new Float32Array(PARTICLE_TEXTURE_SIZE*PARTICLE_TEXTURE_SIZE*4);
        const initialExtraData = new Float32Array(PARTICLE_TEXTURE_SIZE*PARTICLE_TEXTURE_SIZE*4);

        for (let j = 0; j < PARTICLE_TEXTURE_SIZE; j++) {
            for (let k = 0; k < PARTICLE_TEXTURE_SIZE; k++) {
                let index = j*PARTICLE_TEXTURE_SIZE + k;
                let theta = Math.random()*Math.PI*2;
                let r = 0.3 + 0.7*Math.random();
                initialPositions[index*4 + 0] = 1000.0 + r*Math.cos(theta);
                initialPositions[index*4 + 1] = r*Math.sin(theta);
                initialPositions[index*4 + 2] = 0.0;
                initialPositions[index*4 + 3] = -0.5;

                initialExtraData[index*4 + 0] = 0.0;
                initialExtraData[index*4 + 1] = 0.0;
                initialExtraData[index*4 + 2] = 0.0;
                initialExtraData[index*4 + 3] = 0.0;
            }
        }
    
        console.log(this.baseScene.data.scandinavia.pointsObj);
        let index = 0;
        let countryIndex = 0;
        for (const country in this.baseScene.data.scandinavia.pointsObj) {
            const points = this.baseScene.data.scandinavia.pointsObj[country];
            console.log("country, points", country, points);
            for (const p of points) {
                const proj = project(p[0]*Math.PI/180, p[1]*Math.PI/180);
                const reaction = Math.floor(Math.random()*22);

                initialPositions[index*4 + 0] = proj[0];
                initialPositions[index*4 + 1] = proj[1];
                initialPositions[index*4 + 2] = 0.0;

                initialExtraData[index*4 + 0] = countryIndex;
                initialExtraData[index*4 + 1] = reaction;
                initialExtraData[index*4 + 2] = 0.0;
                initialExtraData[index*4 + 3] = 0.0;

                index++;
                if (index >= PARTICLE_TEXTURE_SIZE*PARTICLE_TEXTURE_SIZE)
                    throw Error("Particle texture size is too small.")
            }
            countryIndex++;
        }
        console.log("index", index, `${(100*index/(PARTICLE_TEXTURE_SIZE*PARTICLE_TEXTURE_SIZE)).toFixed(1)}% of particles used`)
    
        this.initialPositionsTexture = new THREE.DataTexture(initialPositions, PARTICLE_TEXTURE_SIZE, PARTICLE_TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType);
        this.initialPositionsTexture.minFilter = THREE.NearestFilter;
        this.initialPositionsTexture.magFilter = THREE.NearestFilter;
        this.initialPositionsTexture.needsUpdate = true;

        this.initialExtraDataTexture = new THREE.DataTexture(initialExtraData, PARTICLE_TEXTURE_SIZE, PARTICLE_TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType);
        this.initialExtraDataTexture.minFilter = THREE.NearestFilter;
        this.initialExtraDataTexture.magFilter = THREE.NearestFilter;
        this.initialExtraDataTexture.needsUpdate = true;
    }
}

export { ParticleScene };