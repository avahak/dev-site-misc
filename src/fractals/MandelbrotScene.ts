import * as THREE from 'three';
import vsMandelFbo from './shaders/vsMandelFbo.glsl?raw';
import fsMandelFbo from './shaders/fsMandelFbo.glsl?raw';

class MandelbrotScene {
    container: HTMLDivElement;
    scene: THREE.Scene;
    camera: THREE.Camera;

    fbos: THREE.WebGLRenderTarget[] = [];
    currentFboIndex: number = 0;    // latest computed fbo index
    disposeFbos: () => void;

    shader: THREE.ShaderMaterial|null = null;

    zoomCenter: [number, number] = [-0.747088, 0.1];
    zoomScale: number = 0.005;
// TODO FIX ANTIALIASING WITH SOMETHING OTHER THAN 4*! HOW?

    constructor(container: HTMLDivElement) {
        this.container = container;

        this.scene = this.setupScene();
        this.camera = this.setupCamera();
        
        this.disposeFbos = () => this.fbos.forEach((fbo) => fbo.dispose());

        this.resize();
    }

    resize() {
        const { clientWidth, clientHeight } = this.container;
        const aspect = clientWidth / clientHeight;
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.top = 1;
            this.camera.bottom = -1;
            this.camera.left = -aspect;
            this.camera.right = aspect;
            this.camera.updateProjectionMatrix();
        }
        this.setupFbos();
        this.shader!.uniforms.resolution.value = this.getResolution();
        this.setViewBox(this.zoomCenter, this.zoomScale);
    }

    setupFbos() {
        this.disposeFbos();
        this.currentFboIndex = 0;
        for (let k = 0; k < 2; k++)
            this.fbos.push(this.createRenderTarget());
    }

    createRenderTarget() {
        const { clientWidth, clientHeight } = this.container;
        const renderTarget = new THREE.WebGLRenderTarget(4*clientWidth, 4*clientHeight, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        });
        return renderTarget;
    }

    setupScene() {
        const scene = new THREE.Scene();

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                box: { value: null },
                mandelMap: { value: null },         // texture for iteration state
                resolution: { value: null },
                restart: { value: 1 },
                time: { value: 0 }
            },
            vertexShader: vsMandelFbo,
            fragmentShader: fsMandelFbo,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.shader);
        scene.add(mesh);

        return scene;
    }

    setupCamera() {
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.set(0, 0, 1);
        camera.lookAt(0, 0, 0);
        return camera;
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    setViewBox(zoomCenter: [number, number], zoomScale: number) {
        this.zoomCenter = [...zoomCenter];
        this.zoomScale = zoomScale;

        const { clientWidth, clientHeight } = this.container;
        const aspect = clientWidth/clientHeight;

        this.shader!.uniforms.box.value = [
            zoomCenter[0]-aspect*zoomScale, 
            zoomCenter[1]-zoomScale,
            zoomCenter[0]+aspect*zoomScale, 
            zoomCenter[1]+zoomScale];

        this.shader!.uniforms.restart.value = 1;
    }

    animateStep(renderer: THREE.WebGLRenderer, currentTime: number) {
        const [i0, i1] = [this.currentFboIndex, (this.currentFboIndex+1)%2];

        this.shader!.uniforms.mandelMap.value = this.fbos[i0].texture;

        renderer.setRenderTarget(this.fbos[i1]);
        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);

        this.currentFboIndex = i1;

        this.shader!.uniforms.restart.value = 0;
    }
}

export { MandelbrotScene };