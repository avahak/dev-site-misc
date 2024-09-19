import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ParticleScene } from './ParticleScene';
import vsStringPoints from './shaders/pointsVertex.glsl?raw';
import fsStringPoints from './shaders/pointsFragment.glsl?raw';
import vsStringTrail from './shaders/trailVertex.glsl?raw';
import fsStringTrail from './shaders/trailFragment.glsl?raw';
import { PARTICLE_TEXTURE_SIZE } from './config';

class BaseScene {
    container: HTMLDivElement;
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[];
    animationRequestID: number|null = null;
    lastTime: number|null = null;
    isStopped: boolean = false;

    fbos: THREE.WebGLRenderTarget[] = [];
    currentFboIndex: number = -1;
    disposeFbos: () => void;

    particleScene: ParticleScene;
    shaderMaterialPoints: THREE.ShaderMaterial|null = null;
    shaderMaterialTrail: THREE.ShaderMaterial|null = null;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        // TODO remove?
        const gl = this.renderer.getContext();
        gl.getExtension('EXT_float_blend');

        this.scene = this.setupScene();
        this.camera = this.setupCamera();
        
        this.disposeFbos = () => this.fbos.forEach((fbo) => fbo.dispose());

        this.setupResizeRenderer();
        this.resizeRenderer();

        this.particleScene = new ParticleScene(this);

        this.cleanUpTasks.push(() => { 
            if (this.animationRequestID)
                cancelAnimationFrame(this.animationRequestID);
            this.disposeFbos();
        });
        this.animate = this.animate.bind(this);
        this.animate();
    }

    resizeRenderer() {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const { clientWidth, clientHeight } = this.container;
        this.renderer.setSize(clientWidth, clientHeight);
        console.log(`Resize! (${clientWidth}, ${clientHeight})`);
        const aspect = clientWidth / clientHeight;
        if (this.camera instanceof THREE.OrthographicCamera) {
            const frustumHeight = this.camera.top - this.camera.bottom;
            this.camera.left = -frustumHeight*aspect/2;
            this.camera.right = frustumHeight*aspect/2;
            this.camera.updateProjectionMatrix();
        }
        this.setupFbos();
    }

    setupResizeRenderer() {
        // Create a ResizeObserver to monitor the container's size
        const resizeObserver = new ResizeObserver(() => {
            this.resizeRenderer();
        });
        resizeObserver.observe(this.container);
        this.cleanUpTasks.push(() => resizeObserver.unobserve(this.container));
        this.resizeRenderer();
    }

    setupFbos() {
        this.disposeFbos();
        this.fbos = [];
        for (let k = 0; k < 2; k++) {
            const rt = this.createRenderTarget();
            this.fbos.push(rt);
        }
        this.currentFboIndex = 0;
    }

    createRenderTarget() {
        const { clientWidth, clientHeight } = this.container;
        const renderTarget = new THREE.WebGLRenderTarget(clientWidth, clientHeight, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        });
        return renderTarget;
    }

    cleanUp() {
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.renderer.dispose();
    }

    setupScene() {
        const scene = new THREE.Scene();

        const geom = new THREE.BufferGeometry();
        const uvData = new Float32Array(PARTICLE_TEXTURE_SIZE*PARTICLE_TEXTURE_SIZE*2);
        for (let j = 0; j < PARTICLE_TEXTURE_SIZE; j++) {
            for (let k = 0; k < PARTICLE_TEXTURE_SIZE; k++) {
                let index = j*PARTICLE_TEXTURE_SIZE + k;
                uvData[index*2 + 0] = j / PARTICLE_TEXTURE_SIZE;
                uvData[index*2 + 1] = k / PARTICLE_TEXTURE_SIZE;
            }
        }
        geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PARTICLE_TEXTURE_SIZE*PARTICLE_TEXTURE_SIZE*3), 3));
        geom.setAttribute("uv", new THREE.BufferAttribute(uvData, 2));
        this.shaderMaterialPoints = new THREE.ShaderMaterial({
            uniforms: {
                uPosition: { value: null },
                time: { value: 0 }
            },
            vertexShader: vsStringPoints,
            fragmentShader: fsStringPoints,
            // blending: THREE.AdditiveBlending,
            // depthWrite: false
        });
        const points = new THREE.Points(geom, this.shaderMaterialPoints);
        points.frustumCulled = false;
        scene.add(points);

        this.shaderMaterialTrail = new THREE.ShaderMaterial({
            uniforms: {
                trailMap: { value: null },
                time: { value: 0 }
            },
            vertexShader: vsStringTrail,
            fragmentShader: fsStringTrail,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.shaderMaterialTrail);
        scene.add(mesh);

        return scene;
    }

    setupCamera() {
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.set(0, 0, 1);
        camera.lookAt(0, 0, 0);
        return camera;
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        this.animateStep(this.isStopped);
    };

    animateStep(isStopped: boolean) {
        const currentTime = (this.lastTime ?? 0.0) + (isStopped ? 0.0 : 0.01);
        this.lastTime = currentTime;
        this.particleScene.shaderMaterial.uniforms.time.value = currentTime;

        if (!isStopped) {
            this.particleScene.step(this.renderer);
        }
        
        this.shaderMaterialPoints!.uniforms.uPosition.value = this.particleScene.fbos[this.particleScene.currentFboIndex].texture;

        const [i0, i1] = [this.currentFboIndex, (this.currentFboIndex+1)%2];
        this.shaderMaterialTrail!.uniforms.trailMap.value = this.fbos[i0].texture;
        this.renderer.setRenderTarget(this.fbos[i1]);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
        this.currentFboIndex = i1;
        
        // Render to screen as well
        this.renderer.render(this.scene, this.camera);
    }
}

export { BaseScene };