import * as THREE from 'three';
import { FFT } from './utils/fft';


export class NoiseExtension {
    noise3d: THREE.Data3DTexture;


    constructor() {
        this.noise3d = NoiseExtension.noiseTexture3D(64, 3.0);
    }


    static noiseTexture3D(N: number, alpha: number): THREE.Data3DTexture {
        const N3 = N * N * N;
        const data: Float32Array = new Float32Array(4 * N3);
        for (let i = 0; i < 4; i++) {
            const noiseData = FFT.generateNoise3D(N, N, N, alpha);

            let minValue = Infinity;
            let maxValue = -Infinity;
            for (let k = 0; k < noiseData.length; k++) {
                minValue = Math.min(noiseData[k], minValue);
                maxValue = Math.max(noiseData[k], maxValue);
            }

            for (let k = 0; k < N3; k++) {
                const v = -1 + 2 * (noiseData[k] - minValue) / (maxValue - minValue);
                data[4 * k + i] = v;
            }
        }

        const tex = new THREE.Data3DTexture(data, N, N, N);
        tex.format = THREE.RGBAFormat;
        tex.type = THREE.FloatType;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.wrapR = THREE.RepeatWrapping;
        tex.needsUpdate = true;
        return tex;
    }

    addToShaderMaterial(material: THREE.ShaderMaterial) {
        material.uniforms['noiseTexture'] = { value: this.noise3d };
        material.defines['USE_NOISE'] = true;

        material.needsUpdate = true;
    }


    dispose() {
        this.noise3d.dispose();
    }
}