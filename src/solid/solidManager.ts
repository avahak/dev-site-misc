import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { FFT } from './utils/fft';
import { FatUCBSplineGroup } from '../primitives/FatUCBSpline';
import { Branch, WoodSetup } from './woodSetup';
import { computeStats, Stats } from './utils/misc';
import { WoodScene } from './woodScene';
import { importShaders, resolveShaderChunk } from './shaderImport';
const shaderChunks = importShaders(import.meta.glob(['./shaders/**/*.glsl'], {
    query: '?raw',
    import: 'default',
    eager: true,
}));

/**
 * Global uniforms for the viewer scene.
 */
interface SolidSceneGlobalUniforms {
    zRange: THREE.Uniform<number>;
    numBranches: THREE.Uniform<number>;
    branchesZASD: THREE.Uniform<THREE.Vector4>[];   // z, angle, slope, death
    branchesR: THREE.Uniform<THREE.Vector4>[];      // radius, -, -, -
}


function noiseTexture3D(N: number, alpha: number): THREE.Data3DTexture {
    const noiseData = FFT.generateNoise3D(N, N, N, alpha);
    let minValue = Infinity;
    let maxValue = -Infinity;
    for (let k = 0; k < noiseData.length; k++) {
        minValue = Math.min(noiseData[k], minValue);
        maxValue = Math.max(noiseData[k], maxValue);
    }

    for (let k = 0; k < noiseData.length; k++)
        noiseData[k] = -1 + 2 * (noiseData[k] - minValue) / (maxValue - minValue);

    const tex = new THREE.Data3DTexture(noiseData, N, N, N);

    tex.format = THREE.RedFormat;
    tex.type = THREE.FloatType;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.wrapR = THREE.RepeatWrapping;

    tex.needsUpdate = true;
    return tex;
}


interface MRTTextureStats {
    r: Stats;
    g: Stats;
    b: Stats;
    a: Stats;
}


class RenderManager {
    static setupResolution = new THREE.Vector2(256, 1024);
    static MAX_BRANCHES = 1024;     // Has to match value in shaders

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
    useHelperScene: boolean = false;

    helperScene!: THREE.Scene;

    woodScene!: WoodScene;

    setupRT!: THREE.WebGLRenderTarget;
    setupMaterial!: THREE.ShaderMaterial;
    setupWood!: WoodSetup;

    globalUniforms!: SolidSceneGlobalUniforms;
    globalUBO!: THREE.UniformsGroup;

    splineGroup!: FatUCBSplineGroup;

    noise3d!: THREE.Data3DTexture;
    profileTexture!: THREE.DataTexture;


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

        this.splineGroup.setResolution(this.renderer);
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
            useHelperScene: this.useHelperScene,
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
        this.gui.add(myObject, 'useHelperScene')
            .name("Use helper scene")
            .onChange((val: boolean) => {
                this.useHelperScene = val;
            });
        this.gui.close();
    }

    dispose() {
        if (this.animationRequestID)
            cancelAnimationFrame(this.animationRequestID);
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.splineGroup.dispose();
        this.globalUBO.dispose();
        this.setupRT.dispose();
        this.material.dispose();
        this.setupMaterial.dispose();
        this.noise3d.dispose();
        this.renderer.dispose();
        this.controls?.dispose();

        this.gui.destroy();
    }

    setupCamera() {
        this.mainCamera = new THREE.PerspectiveCamera();
        this.controls = new OrbitControls(this.mainCamera, this.renderer.domElement);

        const scale = 0.5;
        this.mainCamera.position.set(3.5 * scale, 2.5 * scale, 3 * scale);
        this.mainCamera.lookAt(new THREE.Vector3(0, 0, 0));

        this.quadCamera = new THREE.OrthographicCamera();
        this.quadCamera.position.set(0, 0, 1);
    }

    // Just for debug!
    computeSetupRTTextureStats(): MRTTextureStats {
        const width = this.setupRT.width;
        const height = this.setupRT.height;
        const numPixels = width * height;

        const rawBuffer = new Float32Array(numPixels * 4);

        // Read from 2nd color attachment
        this.renderer.readRenderTargetPixels(this.setupRT, 0, 0, width, height, rawBuffer, 0, 1);

        // Create a reusable single-channel buffer to conserve CPU memory
        const channelBuffer = new Float32Array(numPixels);
        const channelNames: Array<keyof MRTTextureStats> = ["r", "g", "b", "a"];
        const result = {} as MRTTextureStats;

        // Process each color channel completely independently
        for (let c = 0; c < 4; c++) {
            for (let i = 0; i < numPixels; i++)
                channelBuffer[i] = rawBuffer[i * 4 + c];
            const stats = computeStats(channelBuffer);
            result[channelNames[c]] = stats;
        }

        return result;
    }

    setupScene() {
        this.noise3d = noiseTexture3D(64, 2.5);
        this.setupWood = new WoodSetup();

        const n = this.setupWood.branches.length;
        this.globalUniforms = {
            zRange: new THREE.Uniform(this.setupWood.woodConfig.zRange),
            numBranches: new THREE.Uniform(n),
            branchesZASD: Array.from({ length: RenderManager.MAX_BRANCHES }, () => new THREE.Uniform(new THREE.Vector4())),
            branchesR: Array.from({ length: RenderManager.MAX_BRANCHES }, () => new THREE.Uniform(new THREE.Vector4())),
        };
        for (let k = 0; k < n; k++) {
            const branch = this.setupWood.branches[k];
            this.globalUniforms.branchesZASD[k].value.x = branch.zStart;
            this.globalUniforms.branchesZASD[k].value.y = branch.xyAngle;
            this.globalUniforms.branchesZASD[k].value.z = branch.initialSlope;
            this.globalUniforms.branchesZASD[k].value.w = branch.death;
            this.globalUniforms.branchesR[k].value.x = branch.radius;
        }
        this.globalUBO = new THREE.UniformsGroup();
        this.globalUBO.setName("globalUBO");
        this.globalUBO.add(this.globalUniforms.zRange);
        this.globalUBO.add(this.globalUniforms.numBranches);
        this.globalUBO.add(this.globalUniforms.branchesZASD);
        this.globalUBO.add(this.globalUniforms.branchesR);

        this.setupRT = new THREE.WebGLRenderTarget(RenderManager.setupResolution.x, RenderManager.setupResolution.y, {
            count: 2,
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
        });


        this.profileTexture = new THREE.DataTexture(this.setupWood.profile, this.setupWood.profile.length / 4, 1);
        this.profileTexture.type = THREE.FloatType;
        this.profileTexture.format = THREE.RGBAFormat;
        this.profileTexture.wrapT = THREE.ClampToEdgeWrapping;
        this.profileTexture.magFilter = THREE.LinearFilter;
        this.profileTexture.minFilter = THREE.LinearFilter;
        this.profileTexture.needsUpdate = true;
        this.cleanUpTasks.push(() => this.profileTexture.dispose());


        this.material = new THREE.ShaderMaterial({
            uniforms: {
                cameraPos: { value: new THREE.Vector3() },
                cameraNearFar: { value: new THREE.Vector2() },
                vMat: { value: null },
                pvMat: { value: null },
                pvMatInv: { value: null },

                resolution: { value: new THREE.Vector2() },
                time: { value: null },

                noiseTexture: { value: this.noise3d },
                branchIndexTex: { value: this.setupRT.textures[0] },
                profileTexture: { value: this.profileTexture },

                knotColor: { value: new THREE.Vector3(0.2, 0.2, 0.15) },

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
            uniformsGroups: [this.globalUBO],
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        this.setupMaterial = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: RenderManager.setupResolution },
                noiseTexture: { value: this.noise3d },
            },
            vertexShader: resolveShaderChunk("vsPlain", shaderChunks),
            fragmentShader: resolveShaderChunk("fsWoodSetup", shaderChunks),
            uniformsGroups: [this.globalUBO],
            depthWrite: false,
            depthTest: false,
            glslVersion: THREE.GLSL3,
        });

        this.quadScene = new THREE.Scene();
        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
        this.quadScene.add(quad);

        this.helperScene = new THREE.Scene();
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10), new THREE.MeshNormalMaterial());
        // this.helperScene.add(cylinder);
        const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ map: this.setupRT.textures[0] }));
        this.helperScene.add(cube);

        this.splineGroup = new FatUCBSplineGroup(16, 8, 0.5);
        const branchCurve = (branch: Branch, r: number) => {
            const p = new THREE.Vector3();
            p.x = r * Math.cos(branch.xyAngle);
            p.z = -r * Math.sin(branch.xyAngle);
            p.y = branch.zStart + branch.initialSlope * (r < 1 ? r - 0.5 * r * r : 0.5);
            return p;
        };
        for (const branch of this.setupWood.branches) {
            const p1 = branchCurve(branch, 0);
            const p2 = branchCurve(branch, 1);
            const curve = [p1, p1];
            const num = 10;
            for (let k = 0; k <= num; k++) {
                const r = k / num;
                curve.push(branchCurve(branch, r));
            }
            curve.push(p2, p2);

            this.splineGroup.addSpline(curve, () => [1, 1, 1], () => [0.01, 10], false, true, true);
            this.helperScene.add(this.splineGroup.getObject());
        }
        const p1 = new THREE.Vector3(0, 0, 0);
        const p2 = new THREE.Vector3(0, this.setupWood.woodConfig.zRange, 0);
        this.splineGroup.addSpline([p1, p1, p1, p2, p2, p2], () => [0.5, 0.5, 1], () => [0.1, 20], false, true, true);

        console.log(this.setupWood.branches);

        this.renderer.setRenderTarget(this.setupRT);
        this.quadScene.overrideMaterial = this.setupMaterial;
        this.renderer.render(this.quadScene, this.quadCamera);

        console.table(this.computeSetupRTTextureStats());

        // woodScene
        this.woodScene = new WoodScene(this, shaderChunks);
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