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
    controls!: OrbitControls;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[] = [];
    animationRequestID: number | null = null;
    lastTime: number = 0;
    gui: any;
    isStopped: boolean = true;

    mainCamera!: THREE.PerspectiveCamera;
    material!: THREE.ShaderMaterial;

    quadScene!: THREE.Scene;
    quadCamera!: THREE.OrthographicCamera;

    updateClip: boolean = false;

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
        this.mainCamera.aspect = aspect;
        this.mainCamera.updateProjectionMatrix();
        const res = new THREE.Vector2();
        this.renderer.getDrawingBufferSize(res);
        this.material.uniforms.resolution.value = res;
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
        this.gui = new GUI({ container: this.container });
        this.container.style.position = 'relative';
        this.gui.domElement.style.position = 'absolute';
        this.gui.domElement.style.top = '0px';
        this.gui.domElement.style.right = '0px';

        const animateButton = () => this.animateStep(true);
        const toggleStop = () => {
            this.isStopped = !this.isStopped;
        };
        const debugInfo = () => {
            console.log("time", this.lastTime);
        };
        const myObject = {
            animateButton,
            toggleStop,
            debugInfo,
            debug1: this.material.uniforms.debug1.value,
            debug2: this.material.uniforms.debug2.value,
            debug3: this.material.uniforms.debug3.value,
            debug4: this.material.uniforms.debug4.value,
            debug5: this.material.uniforms.debug5.value,
            debug6: this.material.uniforms.debug6.value,
            debug7: this.material.uniforms.debug7.value,
            debug8: this.material.uniforms.debug8.value,
            updateClip: this.updateClip,
        };
        this.gui.add(myObject, 'animateButton').name("Animate step");
        this.gui.add(myObject, 'toggleStop').name("Toggle stop/play");
        this.gui.add(myObject, 'debugInfo').name("Debug info");
        this.gui.add(myObject, 'debug1', 0.0, 1.0)
            .name('Debug1 (-)')
            .onChange((h: number) => {
                this.material.uniforms.debug1.value = h;
            });
        this.gui.add(myObject, 'debug2', 0.0, 1.0)
            .name('Debug2 (-)')
            .onChange((h: number) => {
                this.material.uniforms.debug2.value = h;
            });
        this.gui.add(myObject, 'debug3', 0.0, 1.0)
            .name('Debug3 (-)')
            .onChange((h: number) => {
                this.material.uniforms.debug3.value = h;
            });
        this.gui.add(myObject, 'debug4', 0.0, 1.0)
            .name('Debug4 (-)')
            .onChange((h: number) => {
                this.material.uniforms.debug4.value = h;
            });
        this.gui.add(myObject, 'debug5', 0.0, 1.0)
            .name('Debug5 (-)')
            .onChange((h: number) => {
                this.material.uniforms.debug5.value = h;
            });
        this.gui.add(myObject, 'debug6', 0.0, 1.0)
            .name('Debug6 (-)')
            .onChange((h: number) => {
                this.material.uniforms.debug6.value = h;
            });
        this.gui.add(myObject, 'debug7', 0.0, 1.0)
            .name('Debug7 (-)')
            .onChange((h: number) => {
                this.material.uniforms.debug7.value = h;
            });
        this.gui.add(myObject, 'debug8', 0.0, 1.0)
            .name('Debug8 (-)')
            .onChange((h: number) => {
                this.material.uniforms.debug8.value = h;
            });
        this.gui.add(myObject, 'updateClip')
            .name("Update clip direction")
            .onChange((val: boolean) => {
                this.updateClip = val;
            });
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
        this.mainCamera = new THREE.PerspectiveCamera();
        this.controls = new OrbitControls(this.mainCamera, this.renderer.domElement);

        const scale = 0.25;
        this.mainCamera.position.set(3.5 * scale, 2.5 * scale, 3 * scale);
        this.mainCamera.lookAt(new THREE.Vector3(0, 0, 0));

        this.quadCamera = new THREE.OrthographicCamera();
        this.quadCamera.position.set(0, 0, 1);
    }

    setupScene() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                cameraPos: { value: new THREE.Vector3() },
                cameraNearFar: { value: new THREE.Vector2() },
                vMat: { value: null },
                pvMat: { value: null },
                pvMatInv: { value: null },

                resolution: { value: new THREE.Vector2() },
                time: { value: null },

                clipPlane: { value: new THREE.Vector4(1, 0, 0, 0) },
                debug1: { value: 0.2 },
                debug2: { value: 0.2 },
                debug3: { value: 0.5 },
                debug4: { value: 0.2 },
                debug5: { value: 0.0 },
                debug6: { value: 0.0 },
                debug7: { value: 0.0 },
                debug8: { value: 0.0 },
            },
            vertexShader: resolveShaderChunk("vsSolid", shaderChunks),
            fragmentShader: resolveShaderChunk("fsSolid", shaderChunks),
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        this.quadScene = new THREE.Scene();
        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
        this.quadScene.add(quad);
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    animate() {
        this.controls.update();
        this.animateStep(false);
        this.animationRequestID = requestAnimationFrame(this.animate);
    }

    animateStep(bypassIsStopped: boolean) {
        if (!this.isStopped || bypassIsStopped) {
            const t = (this.lastTime ?? 0.0) + 0.002;
            this.lastTime = t;

            let d = Math.max(-0.45, 0.6 * Math.sin(10.0 * t));
            this.material.uniforms.clipPlane.value.w = d;
        }
        if (this.updateClip) {
            const v = this.mainCamera.getWorldDirection(new THREE.Vector3());
            this.material.uniforms.clipPlane.value.x = -v.x;
            this.material.uniforms.clipPlane.value.y = -v.y;
            this.material.uniforms.clipPlane.value.z = -v.z;
        }
        this.render();
    }

    render() {
        const t = this.lastTime;
        // this.cube.setRotationFromEuler(new THREE.Euler(t, 2.0 * t, 3.0 * t));

        // Set uniforms
        this.material.uniforms.cameraNearFar.value.set(this.mainCamera.near, this.mainCamera.far);
        this.material.uniforms.cameraPos.value = this.mainCamera.position;
        const vMat = this.mainCamera.matrixWorldInverse;
        const pMat = this.mainCamera.projectionMatrix;
        this.material.uniforms.vMat.value = vMat;
        this.material.uniforms.pvMat.value = pMat.clone().multiply(vMat);
        this.material.uniforms.pvMatInv.value = pMat.clone().multiply(vMat).invert();
        this.material.uniforms.time.value = t;

        this.renderer.render(this.quadScene, this.quadCamera);
    }
}

export { Scene };