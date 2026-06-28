import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { FatUCBSplineGroup } from '../primitives/FatUCBSpline';
import { Branch } from './woodSetup';
import { WoodScene } from './woodScene';
import { importShaders, resolveShaderChunk } from './shaderImport';
import { WoodExtension } from './woodExtension';
import { NoiseExtension } from './noiseExtension';
import { DebugExtension } from './debugExtension';
import { BlackWalnutParquetConfig, EnglishOakConfig, EuropeanBeechConfig, ScotsPineConfig, SugarMapleConfig } from './woodTypes';
import { MCSDFFont } from '../primitives/font';
const shaderChunks = importShaders(import.meta.glob(['./shaders/**/*.glsl'], {
    query: '?raw',
    import: 'default',
    eager: true,
}));


class RenderManager {
    container: HTMLDivElement;
    controls!: OrbitControls;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[] = [];
    animationRequestID: number | null = null;
    lastTime: number = 0;
    gui: any;
    isStopped: boolean = false;

    mainCamera!: THREE.PerspectiveCamera;
    material!: THREE.ShaderMaterial;

    quadScene!: THREE.Scene;
    quadCamera!: THREE.OrthographicCamera;

    updateClip: boolean = false;
    useHelperScene: boolean = true;
    helperScene!: THREE.Scene;

    woodScene!: WoodScene;

    splineGroup!: FatUCBSplineGroup;

    woodExtension!: WoodExtension;
    noiseExtension!: NoiseExtension;
    debugExtension!: DebugExtension;

    font!: MCSDFFont;


    constructor(container: HTMLDivElement) {
        this.container = container;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);

        this.animate = this.animate.bind(this);

        this.init();
    }

    async init() {
        this.font = new MCSDFFont();
        await this.font.load('times64');    // times64, gara64, consola64

        this.setupCamera();
        this.setupScene();
        this.setupResizeRenderer();
        this.createGUI();

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

        this.splineGroup?.setResolution(this.renderer);
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
            console.log("camera", this.mainCamera.position);
        };
        const myObject = {
            animateButton,
            toggleStop,
            debugInfo,
            debug1x: this.debugExtension.debug1.value.x,
            debug1y: this.debugExtension.debug1.value.y,
            debug1z: this.debugExtension.debug1.value.z,
            debug1w: this.debugExtension.debug1.value.w,
            debug2x: this.debugExtension.debug2.value.x,
            debug2y: this.debugExtension.debug2.value.y,
            debug2z: this.debugExtension.debug2.value.z,
            debug2w: this.debugExtension.debug2.value.w,
            debugMode: this.debugExtension.debugMode.value,
            updateClip: this.updateClip,
            useHelperScene: this.useHelperScene,
        };
        this.gui.add(myObject, 'animateButton').name("Animate step");
        this.gui.add(myObject, 'toggleStop').name("Toggle stop/play");
        this.gui.add(myObject, 'debugInfo').name("Debug info");
        this.gui.add(myObject, 'debugMode', 0, 10, 1)
            .name('debugMode')
            .onChange((h: number) => {
                this.debugExtension.debugMode.value = h;
            });
        this.gui.add(myObject, 'debug1x', 0.0, 1.0)
            .name('debug1.x')
            .onChange((h: number) => {
                this.debugExtension.debug1.value.x = h;
            });
        this.gui.add(myObject, 'debug1y', 0.0, 1.0)
            .name('debug1.y')
            .onChange((h: number) => {
                this.debugExtension.debug1.value.y = h;
            });
        this.gui.add(myObject, 'debug1z', 0.0, 1.0)
            .name('debug1.z')
            .onChange((h: number) => {
                this.debugExtension.debug1.value.z = h;
            });
        this.gui.add(myObject, 'debug1w', 0.0, 1.0)
            .name('debug1.w')
            .onChange((h: number) => {
                this.debugExtension.debug1.value.w = h;
            });
        this.gui.add(myObject, 'debug2x', 0.0, 1.0)
            .name('debug2.x')
            .onChange((h: number) => {
                this.debugExtension.debug2.value.x = h;
            });
        this.gui.add(myObject, 'debug2y', 0.0, 1.0)
            .name('debug2.y')
            .onChange((h: number) => {
                this.debugExtension.debug2.value.y = h;
            });
        this.gui.add(myObject, 'debug2z', 0.0, 1.0)
            .name('debug2.z')
            .onChange((h: number) => {
                this.debugExtension.debug2.value.z = h;
            });
        this.gui.add(myObject, 'debug2w', 0.0, 1.0)
            .name('debug2.w')
            .onChange((h: number) => {
                this.debugExtension.debug2.value.w = h;
            });
        this.gui.add(myObject, 'updateClip')
            .name("Update clip direction")
            .onChange((val: boolean) => {
                this.updateClip = val;
            });
        this.gui.add(myObject, 'useHelperScene')
            .name("Use helper scene")
            .onChange((val: boolean) => {
                this.useHelperScene = val;
                this.resetCamera();
            });
        this.gui.close();
    }

    dispose() {
        if (this.animationRequestID)
            cancelAnimationFrame(this.animationRequestID);
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.woodScene.dispose();
        this.splineGroup?.dispose();
        this.material.dispose();
        this.woodExtension.dispose();
        this.noiseExtension.dispose();
        this.debugExtension.dispose();
        this.renderer.dispose();
        this.controls?.dispose();

        this.gui.destroy();
    }

    setupCamera() {
        this.mainCamera = new THREE.PerspectiveCamera();
        this.controls = new OrbitControls(this.mainCamera, this.renderer.domElement);

        this.resetCamera();
        this.mainCamera.lookAt(new THREE.Vector3(0, 0, 0));

        this.quadCamera = new THREE.OrthographicCamera();
        this.quadCamera.position.set(0, 0, 1);

    }

    resetCamera() {
        if (this.useHelperScene) {
            this.mainCamera.position.set(6, 0.5, 4);
        } else {
            const scale = 0.5;
            this.mainCamera.position.set(3.5 * scale, 2.5 * scale, 3 * scale);
        }
    }

    setupScene() {
        const woodConfigs = [ScotsPineConfig, EuropeanBeechConfig, SugarMapleConfig, BlackWalnutParquetConfig, EnglishOakConfig];
        this.noiseExtension = new NoiseExtension();
        this.debugExtension = new DebugExtension();
        this.woodExtension = new WoodExtension(shaderChunks, this.noiseExtension, woodConfigs);


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
            },
            vertexShader: resolveShaderChunk("vsSolid", shaderChunks),
            fragmentShader: resolveShaderChunk("fsSolid", shaderChunks),
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });
        this.woodExtension.addToShaderMaterial(this.material, 0);
        this.noiseExtension.addToShaderMaterial(this.material);
        this.debugExtension.addToShaderMaterial(this.material);


        this.quadScene = new THREE.Scene();
        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
        this.quadScene.add(quad);

        this.helperScene = new THREE.Scene();
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10), new THREE.MeshNormalMaterial());
        // this.helperScene.add(cylinder);
        const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ map: this.woodExtension.setupRT.textures[0] }));
        this.helperScene.add(cube);

        // this.splineGroup = new FatUCBSplineGroup(16, 8, 0.5);
        // const branchCurve = (branch: Branch, r: number) => {
        //     const p = new THREE.Vector3();
        //     p.x = r * Math.cos(branch.xyAngle);
        //     p.z = -r * Math.sin(branch.xyAngle);
        //     p.y = branch.zStart + branch.initialSlope * (r < 1 ? r - 0.5 * r * r : 0.5);
        //     return p;
        // };
        // for (const branch of this.woodExtension.woodSetup.branches) {
        //     const p1 = branchCurve(branch, 0);
        //     const p2 = branchCurve(branch, 1);
        //     const curve = [p1, p1];
        //     const num = 10;
        //     for (let k = 0; k <= num; k++) {
        //         const r = k / num;
        //         curve.push(branchCurve(branch, r));
        //     }
        //     curve.push(p2, p2);

        //     this.splineGroup.addSpline(curve, () => [1, 1, 1], () => [0.01, 10], false, true, true);
        //     this.helperScene.add(this.splineGroup.getObject());
        // }
        // const p1 = new THREE.Vector3(0, 0, 0);
        // const p2 = new THREE.Vector3(0, this.woodExtension.woodSetup.woodConfig.zRange, 0);
        // this.splineGroup.addSpline([p1, p1, p1, p2, p2, p2], () => [0.5, 0.5, 1], () => [0.1, 20], false, true, true);

        this.renderer.setRenderTarget(this.woodExtension.setupRT);
        this.quadScene.overrideMaterial = this.woodExtension.setupMaterial;
        this.renderer.render(this.quadScene, this.quadCamera);

        console.table(this.woodExtension.computeSetupRTTextureStats(this.renderer));

        // woodScene
        this.woodScene = new WoodScene(shaderChunks, this.woodExtension, this.noiseExtension, this.debugExtension, this.font);
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

            let d = Math.max(-0.95, 1.2 * Math.sin(10.0 * t));
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

        this.renderer.setRenderTarget(null);
        if (this.useHelperScene) {
            // this.renderer.render(this.helperScene, this.mainCamera);
            this.woodScene.prepareRender(this);
            this.renderer.render(this.woodScene, this.mainCamera);
        } else {
            this.quadScene.overrideMaterial = null;
            this.renderer.render(this.quadScene, this.quadCamera);
        }
    }
}

export { RenderManager };