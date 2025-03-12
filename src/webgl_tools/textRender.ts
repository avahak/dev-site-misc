import * as THREE from 'three';
// import vs from './shaders/vs.glsl?raw';
// import fs from './shaders/fs.glsl?raw';

/**
 * Renders text.
 */
class TextGroup {
    shader?: THREE.ShaderMaterial;

    ibGeometry!: THREE.InstancedBufferGeometry;


    constructor() {
        this.reset();
    }

    addSpline() {
    }

    reset() {
    }

    getObject(): THREE.Object3D {
        return new THREE.Mesh(this.ibGeometry, this.shader);
    }
}

export { TextGroup };