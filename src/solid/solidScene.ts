import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { importShaders, resolveShaderChunk } from './shaderImport';
const shaderChunks = importShaders(import.meta.glob(['./shaders/**/*.glsl'], {
    query: '?raw',
    import: 'default',
    eager: true,
}));

class Scene {
    container: HTMLDivElement;
    camera!: THREE.Camera;
    controls!: OrbitControls;
    scene!: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[] = [];
    animationRequestID: number | null = null;
    lastTime: number = 0;
    gui: any;
    isStopped: boolean = false;

    cube!: THREE.Mesh;
    material!: THREE.ShaderMaterial;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        this.renderer.getContext().getExtension('EXT_float_blend');

        this.setupCamera();
        this.setupScene();
        this.setupResizeRenderer();
        this.createGUI();

        this.animate = this.animate.bind(this);
        this.animate();
    }

    resizeRenderer() {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const { clientWidth, clientHeight } = this.container;
        console.log(`Resize! (${clientWidth}, ${clientHeight})`);
        this.renderer.setSize(clientWidth, clientHeight);
        const aspect = clientWidth / clientHeight;
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.left = -aspect;
            this.camera.right = aspect;
            this.camera.updateProjectionMatrix();
        } else if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
        }
        const res = new THREE.Vector2();
        this.renderer.getDrawingBufferSize(res);
        // this.material.uniforms.resolution.value = res;
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

    createGUI() {
        this.gui = new GUI();
        const animateButton = () => this.animateStep(true);
        const toggleStop = () => {
            this.isStopped = !this.isStopped;
        };
        const myObject = {
            animateButton,
            toggleStop,
        };
        this.gui.add(myObject, 'animateButton').name("Animate step");
        this.gui.add(myObject, 'toggleStop').name("Toggle stop/play");
        this.gui.close();
    }

    dispose() {
        if (this.animationRequestID)
            cancelAnimationFrame(this.animationRequestID);
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.renderer.dispose();
        this.controls?.dispose();

        this.gui.destroy();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(1, 1, 2);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupScene() {
        this.scene = new THREE.Scene();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                clipPlane: { value: new THREE.Vector4(1, 0, 0, 0) },
                // resolution: { value: null },
            },
            vertexShader: resolveShaderChunk("vsSolid", shaderChunks),
            fragmentShader: resolveShaderChunk("fsSolid", shaderChunks),
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.cube = new THREE.Mesh(cubeGeometry, this.material);
        this.scene.add(this.cube);
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    animate() {
        this.animateStep(false);
        this.controls.update();
        this.animationRequestID = requestAnimationFrame(this.animate);
    }

    animateStep(bypassIsStopped: boolean) {
        if (!this.isStopped || bypassIsStopped) {
            const currentTime = (this.lastTime ?? 0.0) + 0.002;
            this.lastTime = currentTime;
        }
        this.render();
    }

    render() {
        const t = this.lastTime;
        // this.cube.setRotationFromEuler(new THREE.Euler(t, 2.0 * t, 3.0 * t));

        const d = Math.max(-0.5, Math.min(0.5, 0.6 * Math.sin(10.0 * t)));
        this.material.uniforms.clipPlane.value.set(1, 0, 0, d);

        this.renderer.render(this.scene, this.camera);
    }
}

export { Scene };