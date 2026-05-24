/**
 * Rendering test with clipping solid objects.
 * TODO
 * - Rebuild shadows without using three.js lights
 * - Change plane to more general clipping function
 */
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { TextGroup } from '../primitives/textRender';
import { MCSDFFont } from '../primitives/font';
import { importShaders, resolveShaderChunk } from './shaderImport';
const shaderChunks = importShaders(import.meta.glob(['./shaders/*.glsl'], {
    query: '?raw',
    import: 'default',
    eager: true,
}));

const NUM_LIGHTS = 4;
const SHADOW_MAP_SIZE = 1024;

const setShadow = (object: THREE.Object3D, castShadow: boolean, receiveShadow: boolean) => {
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
        }
    });
};

function isMesh(object: THREE.Object3D): object is THREE.Mesh {
    return (object as THREE.Mesh).isMesh === true;
}

class Scene {
    container: HTMLDivElement;
    renderer: THREE.WebGLRenderer;
    controls!: OrbitControls;
    cleanUpTasks: (() => void)[];
    animationRequestID: number | null = null;
    lastTime: number | null = null;
    gui: any;
    isStopped: boolean = false;

    mainCamera!: THREE.Camera;
    quadCamera!: THREE.OrthographicCamera;      // fixed camera, looking at a quad

    geometryScene!: THREE.Scene;
    geometryMaterial!: THREE.ShaderMaterial;
    geometryObject!: THREE.Object3D;
    geometryBackRT: THREE.WebGLRenderTarget | null = null;   // for clipped backside
    geometryFrontRT: THREE.WebGLRenderTarget | null = null;   // for clipped frontsides
    geometryRegularRT: THREE.WebGLRenderTarget | null = null;   // for nonclipped rendering, used for semitransparency

    clipScene!: THREE.Scene;
    clipMaterial!: THREE.ShaderMaterial;

    opaqueRT: THREE.WebGLRenderTarget | null = null;   // for rendering all opaque objects

    overlayScene!: THREE.Scene;

    compositeScene!: THREE.Scene;
    compositeMaterial!: THREE.ShaderMaterial;

    lights: THREE.SpotLight[] = [];         // lights with shadows

    font!: MCSDFFont;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.autoClear = false;
        container.appendChild(this.renderer.domElement);

        // this.renderer.getContext().getExtension('EXT_float_blend');
        this.init();
    }

    async init() {
        this.font = new MCSDFFont();
        await this.font.load('times64');

        this.setupCamera();
        this.setupScene();
        this.createRenderTargets();
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
        if (this.mainCamera instanceof THREE.OrthographicCamera) {
            this.mainCamera.left = -aspect;
            this.mainCamera.right = aspect;
            this.mainCamera.updateProjectionMatrix();
        } else if (this.mainCamera instanceof THREE.PerspectiveCamera) {
            this.mainCamera.aspect = aspect;
            this.mainCamera.updateProjectionMatrix();
        }
        const res = new THREE.Vector2();
        this.renderer.getDrawingBufferSize(res);
        this.renderer.getDrawingBufferSize(this.geometryMaterial.uniforms.resolution.value);
        this.renderer.getDrawingBufferSize(this.clipMaterial.uniforms.resolution.value);
        this.renderer.getDrawingBufferSize(this.compositeMaterial.uniforms.resolution.value);
        this.geometryBackRT?.setSize(res.x, res.y);
        this.geometryFrontRT?.setSize(res.x, res.y);
        this.geometryRegularRT?.setSize(res.x, res.y);
        this.opaqueRT?.setSize(res.x, res.y);
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

    createRenderTargets() {
        this.geometryBackRT?.dispose();
        this.geometryFrontRT?.dispose();
        this.geometryRegularRT?.dispose();
        this.opaqueRT?.depthTexture?.dispose();
        this.opaqueRT?.dispose();

        const res = this.getResolution();
        const dpr = Math.min(this.renderer.getPixelRatio(), 2);
        const [width, height] = [dpr * res.x, dpr * res.y];

        this.geometryBackRT = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGFormat,
            type: THREE.FloatType,
        });

        this.geometryFrontRT = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGFormat,
            type: THREE.FloatType,
        });

        this.geometryRegularRT = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGFormat,
            type: THREE.FloatType,
        });

        this.opaqueRT = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
        });
        this.opaqueRT.depthTexture = new THREE.DepthTexture(width, height);
        this.opaqueRT.depthTexture.format = THREE.DepthFormat;
        this.opaqueRT.depthTexture.type = THREE.FloatType;
    }

    createGUI() {
        this.gui = new GUI({ container: this.container });
        this.container.style.position = 'relative';
        this.gui.domElement.style.position = 'absolute';
        this.gui.domElement.style.top = '0px';
        this.gui.domElement.style.right = '0px';

        const animateButton = () => this.animateStep();
        const toggleStop = () => {
            this.isStopped = !this.isStopped;
        };
        const debugInfo = () => {
            const cam = this.lights[0].shadow.camera;
            console.log("A", this.lights[0].shadow.matrix.elements);

            const mAux = new THREE.Matrix4();
            mAux.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0
            );
            const m3 = mAux.multiply(cam.projectionMatrix.clone().multiply(cam.matrixWorldInverse));
            console.log("B", m3.elements);
        };
        const myObject = {
            animateButton,
            toggleStop,
            debugInfo,
            debug1: 1.0,
            debug2: 1.0,
            debug3: this.geometryMaterial.uniforms.debug3.value,
            debug4: 1.0,
        };
        this.gui.add(myObject, 'animateButton').name("Animate step");
        this.gui.add(myObject, 'toggleStop').name("Toggle stop/play");
        this.gui.add(myObject, 'debugInfo').name("Debug info");
        this.gui.add(myObject, 'debug1', 0.1, 2.0)
            .name('Debug1 (H)')
            .onChange((h: number) => {
                this.geometryMaterial.uniforms.debug1.value = h;
                this.clipMaterial.uniforms.debug1.value = h;
                this.compositeMaterial.uniforms.debug1.value = h;
            });
        this.gui.add(myObject, 'debug2', 0.1, 6.0)
            .name('Debug2 (WARP*10)')
            .onChange((h: number) => {
                this.geometryMaterial.uniforms.debug2.value = h;
                this.clipMaterial.uniforms.debug2.value = h;
                this.compositeMaterial.uniforms.debug2.value = h;
            });
        this.gui.add(myObject, 'debug3', 0.0, 1.0)
            .name('Debug3 (-)')
            .onChange((h: number) => {
                this.geometryMaterial.uniforms.debug3.value = h;
                this.clipMaterial.uniforms.debug3.value = h;
                this.compositeMaterial.uniforms.debug3.value = h;
            });
        this.gui.add(myObject, 'debug4', 0.1, 2.0)
            .name('Debug4 (-)')
            .onChange((h: number) => {
                this.geometryMaterial.uniforms.debug4.value = h;
                this.clipMaterial.uniforms.debug4.value = h;
                this.compositeMaterial.uniforms.debug4.value = h;
            });
        this.gui.close();
    }

    dispose() {
        if (this.animationRequestID)
            cancelAnimationFrame(this.animationRequestID);

        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();

        this.geometryBackRT?.dispose();
        this.geometryFrontRT?.dispose();
        this.geometryRegularRT?.dispose();
        this.opaqueRT?.depthTexture?.dispose();
        this.opaqueRT?.dispose();

        this.renderer.dispose();
        this.geometryMaterial.dispose();
        this.controls.dispose();

        this.gui.destroy();
    }

    setupCamera() {
        this.mainCamera = new THREE.PerspectiveCamera();

        this.controls = new OrbitControls(this.mainCamera, this.renderer.domElement);

        this.mainCamera.position.set(0, 0, 5);

        this.quadCamera = new THREE.OrthographicCamera();
        this.quadCamera.position.set(0, 0, 1);
    }

    setupScene() {
        this.geometryScene = new THREE.Scene();

        this.geometryMaterial = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: new THREE.Vector2() },
                cameraPos: { value: new THREE.Vector3() },
                time: { value: null },
                phase: { value: null },
                objectId: { value: null },
                debug1: { value: 1.0 },
                debug2: { value: 1.0 },
                debug3: { value: 0.8 },
                debug4: { value: 1.0 },
            },
            vertexShader: resolveShaderChunk("vs", shaderChunks),
            fragmentShader: resolveShaderChunk("fsGeom", shaderChunks),
            depthWrite: true,
            depthTest: true,
            // glslVersion: THREE.GLSL3
        });

        this.geometryMaterial.onBeforeRender = (_renderer, _scene, _camera, _geometry, object) => {
            this.geometryMaterial.uniforms.objectId.value = object.userData.objectId;
            this.geometryMaterial.uniformsNeedUpdate = true;  // See https://github.com/mrdoob/three.js/issues/9870
        };

        // Add lights
        const ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1));
        this.geometryScene.add(ambientLight);
        for (let k = 0; k < NUM_LIGHTS; k++) {
            const light = new THREE.SpotLight(0xffffff, 1, 20, Math.PI / 8);
            light.position.set(10 * (Math.random() - 0.5), 10, 10 * (Math.random() - 0.5));
            light.castShadow = true;
            light.shadow.camera.near = 1.0;
            light.shadow.camera.far = 20.0;
            light.shadow.mapSize.set(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
            light.shadow.autoUpdate = true;
            light.target.position.set(0, 0, 0);
            this.geometryScene.add(light, light.target);
            this.lights.push(light);
        }

        const materialReplacement: { [key: string]: THREE.Material } = {
            // "Material.001": new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.5, 0.5) }),
            "Material.001": this.geometryMaterial,
            "Material.002": this.geometryMaterial,
        };

        const depthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
            side: THREE.BackSide,
        });

        let objectId = 1;       // reserve 0 for no object

        // Load .mtl and .obj files and replace materials
        const mtlLoader = new MTLLoader();
        mtlLoader.load('/dev-site-misc/solid/solid.mtl', (materials: any) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);

            objLoader.load('/dev-site-misc/solid/solid.obj', (object: THREE.Object3D) => {
                object.position.set(0, 0, 0);
                this.geometryScene.add(object);
                object.traverse((childObj: THREE.Object3D) => {
                    if (isMesh(childObj)) {
                        const mat = childObj.material;
                        childObj.userData.objectId = objectId++;
                        // console.log(childObj.name, (!Array.isArray(childObj.material) && (childObj.material.name in materialReplacement)));
                        if (!Array.isArray(mat) && (mat.name in materialReplacement))
                            childObj.material = materialReplacement[mat.name];

                        childObj.customDepthMaterial = depthMaterial;
                    }
                });
                this.geometryObject = object;
                setShadow(this.geometryObject, true, true);
            });
        });

        // this.scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2.0);   // just for camera angles

        this.clipScene = new THREE.Scene();
        this.clipMaterial = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: new THREE.Vector2() },
                cameraPos: { value: new THREE.Vector3() },
                vpMat: { value: null },
                invVpMat: { value: null },
                time: { value: null },
                backTex: { value: null },
                frontTex: { value: null },
                // regularTex: { value: null },
                debug1: { value: this.geometryMaterial.uniforms.debug1.value },
                debug2: { value: this.geometryMaterial.uniforms.debug2.value },
                debug3: { value: this.geometryMaterial.uniforms.debug3.value },
                debug4: { value: this.geometryMaterial.uniforms.debug4.value },
            },
            vertexShader: resolveShaderChunk("vs", shaderChunks),
            fragmentShader: resolveShaderChunk("fsClip", shaderChunks),
            depthWrite: true,
            depthTest: true,
        });
        const solidMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.clipMaterial);
        this.clipScene.add(solidMesh);

        this.compositeScene = new THREE.Scene();
        this.compositeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: new THREE.Vector2() },
                cameraPos: { value: new THREE.Vector3() },
                vpMat: { value: null },
                invVpMat: { value: null },
                time: { value: null },
                opaqueDepthTex: { value: null },
                opaqueColorTex: { value: null },
                regularTex: { value: null },

                numLights: { value: NUM_LIGHTS },
                shadowMapSize: { value: SHADOW_MAP_SIZE },
                shadowMaps: { value: this.lights.map((light) => light.shadow.map) },
                shadowMatrices: { value: this.lights.map((light) => light.shadow.matrix) },

                debug1: { value: this.geometryMaterial.uniforms.debug1.value },
                debug2: { value: this.geometryMaterial.uniforms.debug2.value },
                debug3: { value: this.geometryMaterial.uniforms.debug3.value },
                debug4: { value: this.geometryMaterial.uniforms.debug4.value },
            },
            vertexShader: resolveShaderChunk("vs", shaderChunks),
            fragmentShader: resolveShaderChunk("fsComposite", shaderChunks),
            depthWrite: false,
            depthTest: false,
            // glslVersion: THREE.GLSL3,
        });
        const compositeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.compositeMaterial);
        this.compositeScene.add(compositeMesh);

        this.overlayScene = new THREE.Scene();
        const normalMaterial = new THREE.MeshNormalMaterial();
        const knotGeo = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16, 3, 2);
        const knotMesh = new THREE.Mesh(knotGeo, normalMaterial);
        knotMesh.position.x = -1.5;
        const torusGeo = new THREE.TorusGeometry(0.6, 0.2, 16, 100);
        const torusMesh = new THREE.Mesh(torusGeo, normalMaterial);
        torusMesh.position.x = 1.5;
        this.overlayScene.add(knotMesh, torusMesh);
        for (const light of this.lights) {
            const spotLightHelper = new THREE.SpotLightHelper(light);
            spotLightHelper.update();
            this.overlayScene.add(spotLightHelper);
        }
        const textGroup = new TextGroup(this.font, 0.5);    // problem with alpha-blending here
        for (let k = 0; k < 20; k++) {
            const p = [5.0 * (Math.random() - 0.5), 2.0 * Math.random(), 5.0 * (Math.random() - 0.5)];
            const phi = Math.random() * 2.0 * Math.PI;
            const size = 0.1 + 0.1 * Math.random();
            const v = [Math.cos(phi), 0.0, Math.sin(phi)];
            const pos = (x: number, y: number) => [p[0] + size * x * v[0], p[1] + size * y, p[2] + size * x * v[2]];
            const col = [0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5];
            textGroup.addText(`Test_${Math.random()}`, pos, col, [0, 0], 0.1 + 0.1 * Math.random());
        }
        this.overlayScene.add(textGroup.getObject());

        console.log("shadowMatrices", this.compositeMaterial.uniforms.shadowMatrices);
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        this.controls.update();
        this.animateStep();
    }

    animateStep() {
        if (!this.isStopped) {
            const currentTime = (this.lastTime ?? 0.0) + 1.0;
            this.lastTime = currentTime;
        }

        this.render();
    }

    render() {
        if (!this.lastTime || !this.geometryBackRT || !this.geometryFrontRT || !this.geometryRegularRT || !this.opaqueRT)
            return;
        const t = this.lastTime * 0.002;
        // this.overlayScene.setRotationFromEuler(new THREE.Euler(t, 2.0 * t, 3.0 * t));

        this.geometryMaterial.uniforms.cameraPos.value.copy(this.mainCamera.position);
        this.clipMaterial.uniforms.cameraPos.value.copy(this.mainCamera.position);
        this.compositeMaterial.uniforms.cameraPos.value.copy(this.mainCamera.position);
        this.geometryMaterial.uniforms.time.value = t;
        this.clipMaterial.uniforms.time.value = t;
        this.compositeMaterial.uniforms.time.value = t;

        // view-projection matrix and its inverse for mainCamera
        const vpMat = this.mainCamera.projectionMatrix.clone().multiply(this.mainCamera.matrixWorldInverse);
        const invVpMat = this.mainCamera.matrixWorld.clone().multiply(this.mainCamera.projectionMatrixInverse);

        // backside rendering with geometryScene + shadows
        this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.BasicShadowMap;
        for (const light of this.lights)
            light.shadow.autoUpdate = true;
        this.renderer.setRenderTarget(this.geometryBackRT);  // activate backside target
        this.renderer.clear();
        this.geometryMaterial.side = THREE.BackSide;
        this.geometryMaterial.uniforms.phase.value = 0;
        this.renderer.render(this.geometryScene, this.mainCamera);
        for (const light of this.lights)
            light.shadow.autoUpdate = false;
        this.renderer.shadowMap.enabled = false;

        // frontside rendering with geometryScene
        this.renderer.setRenderTarget(this.geometryFrontRT);  // activate frontside target
        this.renderer.clear();
        this.geometryMaterial.side = THREE.FrontSide;
        this.geometryMaterial.uniforms.phase.value = 1;
        this.renderer.render(this.geometryScene, this.mainCamera);

        // regular rendering with geometryScene
        this.renderer.setRenderTarget(this.geometryRegularRT);  // activate regular target
        this.renderer.clear();
        this.geometryMaterial.side = THREE.FrontSide;
        this.geometryMaterial.uniforms.phase.value = 2;
        this.renderer.render(this.geometryScene, this.mainCamera);

        // Rendering the clipped scene into opaqueRT
        this.renderer.setRenderTarget(this.opaqueRT);                // activate opaqueRT
        this.renderer.clear();
        this.clipMaterial.uniforms.backTex.value = this.geometryBackRT.texture;
        this.clipMaterial.uniforms.frontTex.value = this.geometryFrontRT.texture;
        this.clipMaterial.uniforms.vpMat.value = vpMat;
        this.clipMaterial.uniforms.invVpMat.value = invVpMat;
        this.renderer.render(this.clipScene, this.quadCamera);

        // Rendering overlayScene into opaqueRT
        this.renderer.setRenderTarget(this.opaqueRT);                // activate opaqueRT
        this.renderer.render(this.overlayScene, this.mainCamera);

        // Post-processing: composite opaqueRT and geometryRegularRT into final image on screen
        this.renderer.setRenderTarget(null);                // activate screen as target
        this.compositeMaterial.uniforms.opaqueDepthTex.value = this.opaqueRT.depthTexture;
        this.compositeMaterial.uniforms.opaqueColorTex.value = this.opaqueRT.texture;
        this.compositeMaterial.uniforms.regularTex.value = this.geometryRegularRT.texture;
        this.compositeMaterial.uniforms.vpMat.value = vpMat;
        this.compositeMaterial.uniforms.invVpMat.value = invVpMat;
        for (let k = 0; k < NUM_LIGHTS; k++) {
            // this.lights[k].shadow.camera.updateMatrixWorld();
            // this.lights[k].shadow.camera.updateProjectionMatrix();
            this.compositeMaterial.uniforms.shadowMaps.value[k] = this.lights[k].shadow.map?.texture;
            this.compositeMaterial.uniforms.shadowMatrices.value[k] = this.lights[k].shadow.matrix;
        }
        this.renderer.render(this.compositeScene, this.quadCamera);
    }
}

export { Scene };