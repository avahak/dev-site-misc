import * as THREE from 'three';


export class DebugExtension {
    debug1: THREE.Uniform<THREE.Vector4>;
    debug2: THREE.Uniform<THREE.Vector4>;
    debugMode: THREE.Uniform<number>;


    constructor() {
        this.debug1 = new THREE.Uniform(new THREE.Vector4(0, 0, 0, 0));
        this.debug2 = new THREE.Uniform(new THREE.Vector4(0, 0, 0, 0));
        this.debugMode = new THREE.Uniform(0);
    }


    addToShaderMaterial(material: THREE.ShaderMaterial) {
        material.uniforms['debug1'] = this.debug1;
        material.uniforms['debug2'] = this.debug2;
        material.uniforms['debugMode'] = this.debugMode;
        material.defines['USE_DEBUG'] = true;

        material.needsUpdate = true;
    }


    dispose() {
    }
}