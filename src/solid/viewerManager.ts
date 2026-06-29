/**
 * Rendering test with clipping solid objects.
 * TODO:
 * - start on animations
 * - actual solid textures
 * - For IBL check out https://github.com/jeweg/pbr-webgl-shenanigans/tree/master
 * - Use as reference: https://grgrdvrt.github.io/three_shaders_source/meshphysical.html
 * - Refactor this module
 * - Consider precomputing volumeI (RT using RGFormat, FloatType)
 * - How should interpolation work in the main passes?
 */
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { TextGroup } from '../primitives/textRender';
import { MCSDFFont } from '../primitives/font';
import { importShaders, resolveShaderChunk } from './shaderImport';
const shaderChunks = importShaders(import.meta.glob(['./shaders/**/*.glsl'], {
    query: '?raw',
    import: 'default',
    eager: true,
}));

const NUM_LIGHTS = 3;
const MAX_LIGHTS = 4;       // Has to be same as in shader
const LIGHT_RADIUS = 3;
const SHADOW_MAP_SIZE = 512;
const mAux = new THREE.Matrix4();   // Used to get rid of `shadowCoord.xyz = shadowCoord.xyz*0.5 + 0.5;` during shadow computation
mAux.set(
    0.5, 0.0, 0.0, 0.5,
    0.0, 0.5, 0.0, 0.5,
    0.0, 0.0, 0.5, 0.5,
    0.0, 0.0, 0.0, 1.0
);

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

function randomLightColor(): THREE.Vector4 {
    const col = new THREE.Color().setHSL(Math.random(), 1, 0.8);
    return new THREE.Vector4(col.r, col.g, col.b, 8.0 + 2.0 * Math.random());
}

/**
 * Global uniforms for the viewer scene.
 */
interface ViewerSceneGlobalUniforms {
    resolution: THREE.Uniform<THREE.Vector2>;
    cameraPos: THREE.Uniform<THREE.Vector3>;
    cameraParams: THREE.Uniform<THREE.Vector4>;         // (near,far,_,_)
    vpMat: THREE.Uniform<THREE.Matrix4>;
    invVpMat: THREE.Uniform<THREE.Matrix4>;
    time: THREE.Uniform<number>;
    sphereMain: THREE.Uniform<THREE.Matrix4>;
    debug1: THREE.Uniform<number>;
    debug2: THREE.Uniform<number>;
    debug3: THREE.Uniform<number>;
    debug4: THREE.Uniform<number>;

    numLights: THREE.Uniform<number>;
    lightPos: THREE.Uniform<THREE.Vector4>[];           // (Position(3), radius(1))[]
    lightCol: THREE.Uniform<THREE.Vector4>[];           // (Color(3), intensity(1))[]

    shadowMapSize: THREE.Uniform<number>;
    shadowCameraParams: THREE.Uniform<THREE.Vector4>[]; // (near,far,_,_)
    shadowMatrices: THREE.Uniform<THREE.Matrix4>[];
    shadowSpheres: THREE.Uniform<THREE.Matrix4>[];
}

class RenderManager {
    container: HTMLDivElement;
    renderer!: THREE.WebGLRenderer;
    controls!: OrbitControls;
    cleanUpTasks: (() => void)[] = [];
    animationRequestID: number | null = null;
    lastTime: number = 0;
    gui: any;
    isStopped: boolean = false;
    isInitialized: boolean;

    quadScene!: THREE.Scene;
    quadCamera!: THREE.OrthographicCamera;      // fixed camera, looking at a quad
    copyMaterial!: THREE.ShaderMaterial;

    mainCamera!: THREE.PerspectiveCamera;

    geometryScene!: THREE.Scene;
    geometryMaterial!: THREE.ShaderMaterial;
    geometryMaterialNormals!: THREE.ShaderMaterial;
    geometryObject!: THREE.Object3D;
    geometryBackRT!: THREE.WebGLRenderTarget;   // for clipped backside
    geometryFrontRT!: THREE.WebGLRenderTarget;   // for clipped frontsides

    overlayScene!: THREE.Scene;

    compositeClipMaterial!: THREE.ShaderMaterial;
    compositeRegularMaterial!: THREE.ShaderMaterial;
    compositeClipRT!: THREE.WebGLRenderTarget;
    compositeRegularRT!: THREE.WebGLRenderTarget;

    shadowCameras: THREE.PerspectiveCamera[] = [];
    shadowFrontRT!: THREE.WebGLRenderTarget;
    shadowBackRT!: THREE.WebGLRenderTarget;
    shadowRTs: THREE.WebGLRenderTarget[] = [];
    shadowMaterialGeom!: THREE.ShaderMaterial;
    shadowMaterialRegular!: THREE.ShaderMaterial;
    shadowMaterialClip!: THREE.ShaderMaterial;

    sphereObject!: THREE.Object3D;

    font!: MCSDFFont;

    globalUniforms!: ViewerSceneGlobalUniforms;
    globalUBO!: THREE.UniformsGroup;


    constructor(container: HTMLDivElement) {
        this.container = container;
        this.isInitialized = false;
        THREE.Object3D.DEFAULT_UP.set(0, 1, 0);
    }

    async init(abortSignal: AbortSignal) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.autoClear = false;
        this.container.appendChild(this.renderer.domElement);

        this.font = new MCSDFFont();
        await this.font.load('times64');

        this.setupCamera();
        this.setupScene();
        this.createRenderTargets();
        this.setupResizeRenderer();
        this.createGUI();

        this.isInitialized = true;
        if (abortSignal.aborted) {
            this.dispose();
            return;
        }
        this.animate = this.animate.bind(this);
        this.animate();
    }

    dispose() {
        if (!this.isInitialized)
            return;
        if (this.animationRequestID)
            cancelAnimationFrame(this.animationRequestID);

        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();

        this.font?.dispose();
        this.disposeRenderTargets();
        this.disposeShaders();
        this.globalUBO.dispose();

        this.renderer.dispose();
        this.controls.dispose();

        this.gui.destroy();
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
        this.renderer.getDrawingBufferSize(this.globalUniforms.resolution.value);
        this.geometryBackRT?.setSize(res.x, res.y);
        this.geometryFrontRT?.setSize(res.x, res.y);
        this.compositeClipRT?.setSize(res.x, res.y);
        this.compositeRegularRT?.setSize(res.x, res.y);
    }

    setupResizeRenderer() {
        // Create a ResizeObserver to monitor the container's size
        const resizeObserver = new ResizeObserver(() => {
            this.resizeRenderer();
        });
        resizeObserver.observe(this.container);
        this.cleanUpTasks.push(() => resizeObserver.unobserve(this.container));
    }

    createRenderTargets() {
        this.disposeRenderTargets();

        const res = this.getResolution();
        const dpr = Math.min(this.renderer.getPixelRatio(), 2);
        const [width, height] = [dpr * res.x, dpr * res.y];

        this.geometryBackRT = new THREE.WebGLRenderTarget(width, height, {
            format: THREE.RedFormat,        // id
            type: THREE.HalfFloatType,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthTexture: new THREE.DepthTexture(width, height, THREE.FloatType),
        });

        this.geometryFrontRT = new THREE.WebGLRenderTarget(width, height, {
            depthTexture: new THREE.DepthTexture(width, height, THREE.FloatType),
            count: 2,       // id, normal
        });
        this.geometryFrontRT.textures[0].minFilter = THREE.NearestFilter;
        this.geometryFrontRT.textures[0].magFilter = THREE.NearestFilter;
        this.geometryFrontRT.textures[0].format = THREE.RedFormat;
        this.geometryFrontRT.textures[0].type = THREE.HalfFloatType;
        this.geometryFrontRT.textures[1].minFilter = THREE.NearestFilter;
        this.geometryFrontRT.textures[1].magFilter = THREE.NearestFilter;
        this.geometryFrontRT.textures[1].format = THREE.RGFormat;
        this.geometryFrontRT.textures[1].type = THREE.HalfFloatType;

        this.shadowBackRT = new THREE.WebGLRenderTarget(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE, {
            count: 2,       // depth, id
        });
        this.shadowBackRT.textures[0].format = THREE.RedFormat;
        this.shadowBackRT.textures[0].type = THREE.FloatType;
        this.shadowBackRT.textures[0].minFilter = THREE.LinearFilter;
        this.shadowBackRT.textures[0].magFilter = THREE.LinearFilter;
        this.shadowBackRT.textures[1].format = THREE.RedFormat;
        this.shadowBackRT.textures[1].type = THREE.HalfFloatType;
        this.shadowBackRT.textures[1].minFilter = THREE.NearestFilter;
        this.shadowBackRT.textures[1].magFilter = THREE.NearestFilter;

        this.shadowFrontRT = new THREE.WebGLRenderTarget(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE, {
            count: 2,       // depth, id
        });
        this.shadowFrontRT.textures[0].format = THREE.RedFormat;
        this.shadowFrontRT.textures[0].type = THREE.FloatType;
        this.shadowFrontRT.textures[0].minFilter = THREE.LinearFilter;
        this.shadowFrontRT.textures[0].magFilter = THREE.LinearFilter;
        this.shadowFrontRT.textures[1].format = THREE.RedFormat;
        this.shadowFrontRT.textures[1].type = THREE.HalfFloatType;
        this.shadowFrontRT.textures[1].minFilter = THREE.NearestFilter;
        this.shadowFrontRT.textures[1].magFilter = THREE.NearestFilter;

        const gl = this.renderer.getContext() as WebGL2RenderingContext;
        for (let k = 0; k < NUM_LIGHTS; k++) {
            const shadowRT = new THREE.WebGLRenderTarget(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE, {
                format: THREE.RedFormat,        // dummy
                type: THREE.UnsignedByteType,
                depthTexture: new THREE.DepthTexture(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE),
                depthBuffer: true,
            });
            const depthTextureShadow = shadowRT.depthTexture!;
            depthTextureShadow.format = THREE.DepthFormat;
            depthTextureShadow.type = THREE.UnsignedIntType;
            depthTextureShadow.minFilter = THREE.LinearFilter;
            depthTextureShadow.magFilter = THREE.LinearFilter;
            // To use depth as sampler2DShadow, we need to set it up in compare mode
            this.renderer.setRenderTarget(shadowRT);
            const handleC = (this.renderer.properties.get(depthTextureShadow) as any).__webglTexture;
            gl.bindTexture(gl.TEXTURE_2D, handleC);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this.renderer.setRenderTarget(null);
            this.shadowRTs.push(shadowRT);
        }

        this.compositeClipRT = new THREE.WebGLRenderTarget(width, height, {
            format: THREE.RGBAFormat,       // color
            type: THREE.UnsignedByteType,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthTexture: new THREE.DepthTexture(width, height, THREE.FloatType),
        });

        this.compositeRegularRT = new THREE.WebGLRenderTarget(width, height, {
            format: THREE.RGBAFormat,       // color
            type: THREE.UnsignedByteType,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthTexture: new THREE.DepthTexture(width, height, THREE.FloatType),
        });
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
            console.log("1", this.mainCamera.matrixWorldInverse.elements);
            console.log("2", this.shadowCameras[0].matrixWorldInverse.elements);
        };
        const myObject = {
            animateButton,
            toggleStop,
            debugInfo,
            debug1: this.globalUniforms.debug1.value,
            debug2: this.globalUniforms.debug2.value,
            debug3: this.globalUniforms.debug3.value,
            debug4: this.globalUniforms.debug4.value,
        };
        this.gui.add(myObject, 'animateButton').name("Animate step");
        this.gui.add(myObject, 'toggleStop').name("Toggle stop/play");
        this.gui.add(myObject, 'debugInfo').name("Debug info");
        this.gui.add(myObject, 'debug1', 0.1, 2.0)
            .name('Debug1 (H)')
            .onChange((h: number) => {
                this.globalUniforms.debug1.value = h;
            });
        this.gui.add(myObject, 'debug2', 0.0, 1.0)
            .name('Debug2 (prev. WARP*10)')
            .onChange((h: number) => {
                this.globalUniforms.debug2.value = h;
            });
        this.gui.add(myObject, 'debug3', 0.0, 1.0)
            .name('Debug3 (-)')
            .onChange((h: number) => {
                this.globalUniforms.debug3.value = h;
            });
        this.gui.add(myObject, 'debug4', 0.0, 1.0)
            .name('Debug4 (-)')
            .onChange((h: number) => {
                this.globalUniforms.debug4.value = h;
            });
        this.gui.close();
    }

    disposeRenderTargets() {
        const rtList = [
            this.geometryBackRT, this.geometryFrontRT,
            this.compositeClipRT, this.compositeRegularRT,
            this.shadowBackRT, this.shadowFrontRT
        ];
        for (const rt of this.shadowRTs)
            rtList.push(rt);

        for (const rt of rtList) {
            rt?.depthTexture?.dispose();
            rt?.dispose();
        }
    }

    disposeShaders() {
        const shaderList = [
            this.geometryMaterial, this.geometryMaterialNormals,
            this.compositeClipMaterial, this.compositeRegularMaterial,
            this.shadowMaterialGeom, this.shadowMaterialClip, this.shadowMaterialRegular,
            this.copyMaterial,
        ];
        for (const shader of shaderList) {
            shader?.dispose();
        }
    }

    setupCamera() {
        this.mainCamera = new THREE.PerspectiveCamera(50);

        this.controls = new OrbitControls(this.mainCamera, this.renderer.domElement);

        this.mainCamera.position.set(0, 0, 5);

        this.quadCamera = new THREE.OrthographicCamera();
        this.quadCamera.position.set(0, 0, 1);
    }

    setupScene() {
        this.globalUniforms = {
            resolution: new THREE.Uniform(new THREE.Vector2()),
            cameraPos: new THREE.Uniform(new THREE.Vector3()),
            cameraParams: new THREE.Uniform(new THREE.Vector4()),
            vpMat: new THREE.Uniform(new THREE.Matrix4()),
            invVpMat: new THREE.Uniform(new THREE.Matrix4()),
            time: new THREE.Uniform(0),
            sphereMain: new THREE.Uniform(new THREE.Matrix4()),
            debug1: new THREE.Uniform(0),
            debug2: new THREE.Uniform(0),
            debug3: new THREE.Uniform(0.9),
            debug4: new THREE.Uniform(1),

            numLights: new THREE.Uniform(NUM_LIGHTS),
            lightPos: Array.from({ length: MAX_LIGHTS }, () => new THREE.Uniform(new THREE.Vector4())),
            lightCol: Array.from({ length: MAX_LIGHTS }, () => new THREE.Uniform(randomLightColor())),
            shadowMapSize: new THREE.Uniform(SHADOW_MAP_SIZE),
            shadowCameraParams: Array.from({ length: MAX_LIGHTS }, () => new THREE.Uniform(new THREE.Vector4())),
            shadowMatrices: Array.from({ length: MAX_LIGHTS }, () => new THREE.Uniform(new THREE.Matrix4())),
            shadowSpheres: Array.from({ length: MAX_LIGHTS }, () => new THREE.Uniform(new THREE.Matrix4())),
        };
        this.globalUBO = new THREE.UniformsGroup();
        this.globalUBO.setName("globalUBO");
        this.globalUBO.add(this.globalUniforms.resolution);
        this.globalUBO.add(this.globalUniforms.cameraPos);
        this.globalUBO.add(this.globalUniforms.cameraParams);
        this.globalUBO.add(this.globalUniforms.vpMat);
        this.globalUBO.add(this.globalUniforms.invVpMat);
        this.globalUBO.add(this.globalUniforms.time);
        this.globalUBO.add(this.globalUniforms.sphereMain);
        this.globalUBO.add(this.globalUniforms.debug1);
        this.globalUBO.add(this.globalUniforms.debug2);
        this.globalUBO.add(this.globalUniforms.debug3);
        this.globalUBO.add(this.globalUniforms.debug4);
        this.globalUBO.add(this.globalUniforms.numLights);
        this.globalUBO.add(this.globalUniforms.lightPos);
        this.globalUBO.add(this.globalUniforms.lightCol);
        this.globalUBO.add(this.globalUniforms.shadowMapSize);
        this.globalUBO.add(this.globalUniforms.shadowCameraParams);
        this.globalUBO.add(this.globalUniforms.shadowMatrices);
        this.globalUBO.add(this.globalUniforms.shadowSpheres);


        this.quadScene = new THREE.Scene();
        this.quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2)));

        this.geometryScene = new THREE.Scene();

        this.geometryMaterial = new THREE.ShaderMaterial({
            uniforms: {
                phase: { value: null },
                objectId: { value: null },
            },
            vertexShader: resolveShaderChunk("vs", shaderChunks),
            fragmentShader: resolveShaderChunk("fsGeom", shaderChunks),
            uniformsGroups: [this.globalUBO],
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        this.geometryMaterialNormals = new THREE.ShaderMaterial({
            uniforms: {
                phase: { value: null },
                objectId: { value: null },
            },
            vertexShader: resolveShaderChunk("vs", shaderChunks),
            fragmentShader: resolveShaderChunk("fsGeomNormals", shaderChunks),
            uniformsGroups: [this.globalUBO],
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        // Add shadow cameras
        for (let k = 0; k < NUM_LIGHTS; k++) {
            const camera = new THREE.PerspectiveCamera(40, 1, 1, 20);
            camera.position.set(10 * (Math.random() - 0.5), 10, 10 * (Math.random() - 0.5));
            camera.lookAt(0, 0, 0);
            this.shadowCameras.push(camera);
        }

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
                        childObj.customDepthMaterial = depthMaterial;
                    }
                });
                this.geometryObject = object;
                setShadow(this.geometryObject, true, true);
            });
        });

        // this.scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2.0);   // just for camera angles

        this.compositeClipMaterial = new THREE.ShaderMaterial({
            uniforms: {
                backTex: { value: null },
                frontTex: { value: null },
                backDepthTex: { value: null },
                frontDepthTex: { value: null },
                frontNormalTex: { value: null },

                shadowMaps: { value: Array(MAX_LIGHTS).fill(null) },
            },
            vertexShader: resolveShaderChunk("vs", shaderChunks),
            fragmentShader: resolveShaderChunk("fsCompositeClip", shaderChunks),
            uniformsGroups: [this.globalUBO],
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        this.compositeRegularMaterial = new THREE.ShaderMaterial({
            uniforms: {
                frontTex: { value: null },
                frontDepthTex: { value: null },
                frontNormalTex: { value: null },

                shadowMaps: { value: Array(MAX_LIGHTS).fill(null) },
            },
            vertexShader: resolveShaderChunk("vs", shaderChunks),
            fragmentShader: resolveShaderChunk("fsCompositeRegular", shaderChunks),
            uniformsGroups: [this.globalUBO],
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        this.overlayScene = new THREE.Scene();
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const sphereGeometry = new THREE.SphereGeometry(0.2);
        this.sphereObject = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.overlayScene.add(this.sphereObject);
        const normalMaterial = new THREE.MeshNormalMaterial();
        const knotGeo = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16, 3, 2);
        const knotMesh = new THREE.Mesh(knotGeo, normalMaterial);
        knotMesh.position.x = -1.5;
        const torusGeo = new THREE.TorusGeometry(0.6, 0.2, 16, 100);
        const torusMesh = new THREE.Mesh(torusGeo, normalMaterial);
        torusMesh.position.x = 1.5;
        this.overlayScene.add(knotMesh, torusMesh);
        for (const cam of this.shadowCameras) {
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const sphereGeometry = new THREE.SphereGeometry(0.2);
            const obj = new THREE.Mesh(sphereGeometry, sphereMaterial);
            obj.position.copy(cam.position);
            this.overlayScene.add(obj);
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

        this.shadowMaterialGeom = new THREE.ShaderMaterial({
            uniforms: {
                objectId: { value: null },
                lightIndex: { value: null },
            },
            vertexShader: resolveShaderChunk("vs", shaderChunks),
            fragmentShader: resolveShaderChunk("fsShadowGeom", shaderChunks),
            uniformsGroups: [this.globalUBO],
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        this.shadowMaterialRegular = new THREE.ShaderMaterial({
            uniforms: {
            },
            vertexShader: resolveShaderChunk("vsPlain", shaderChunks),
            fragmentShader: resolveShaderChunk("fsShadowRegular", shaderChunks),
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        this.shadowMaterialClip = new THREE.ShaderMaterial({
            uniforms: {
                backIdTex: { value: null },
                frontIdTex: { value: null },
                backDepthTex: { value: null },
                frontDepthTex: { value: null },
                lightIndex: { value: null },
            },
            vertexShader: resolveShaderChunk("vs", shaderChunks),
            fragmentShader: resolveShaderChunk("fsShadowClip", shaderChunks),
            uniformsGroups: [this.globalUBO],
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3,
        });

        this.copyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                clipColorTex: { value: null },
                clipDepthTex: { value: null },
                regularColorTex: { value: null },
                regularDepthTex: { value: null },
            },
            vertexShader: resolveShaderChunk("vs", shaderChunks),
            fragmentShader: resolveShaderChunk("fsCopyTexture", shaderChunks),
            uniformsGroups: [this.globalUBO],
            depthWrite: false,
            depthTest: false,
            glslVersion: THREE.GLSL3,
        });

        this.geometryMaterial.onBeforeRender = (_renderer, _scene, _camera, _geometry, object) => {
            this.geometryMaterial.uniforms.objectId.value = object.userData.objectId;
            this.geometryMaterial.uniformsNeedUpdate = true;  // See https://github.com/mrdoob/three.js/issues/9870
        };
        this.geometryMaterialNormals.onBeforeRender = (_renderer, _scene, _camera, _geometry, object) => {
            this.geometryMaterialNormals.uniforms.objectId.value = object.userData.objectId;
            this.geometryMaterialNormals.uniformsNeedUpdate = true;
        };
        this.shadowMaterialGeom.onBeforeRender = (_renderer, _scene, _camera, _geometry, object) => {
            this.shadowMaterialGeom.uniforms.objectId.value = object.userData.objectId;
            this.shadowMaterialGeom.uniformsNeedUpdate = true;
        };
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    getSphere(p: THREE.Vector3, n: THREE.Vector3, r: number, camera: THREE.PerspectiveCamera): THREE.Matrix4 {
        // NOTE: Careful with column-major/row-major order here! 
        // See https://threejs.org/docs/#Matrix4
        const center = new THREE.Vector3(p.x - r * n.x, p.y - r * n.y, p.z - r * n.z);
        // To replace `inverse(pMat) * vec4(ndcXy, 0.0, 1.0)`:
        const cam1 = new THREE.Vector4(1, 1, 0, 1).applyMatrix4(camera.projectionMatrixInverse);
        // To replace `pMat * vec4(t*dir, 1.0)`:
        const cam2 = camera.projectionMatrix.elements;
        const s1z = cam1.z / cam1.w;
        // To replace `v = -(vMat * vec4(sphere[0].xyz, 1.0)).xyz`
        const cam3 = center.clone().applyMatrix4(camera.matrixWorldInverse);
        // For volume near clip
        const tNear = -camera.near / s1z;
        const array: number[] = [
            center.x, center.y, center.z, r,        // NOTE: this is first column
            cam1.x / cam1.w, cam1.y / cam1.w, s1z, 0,
            0.5 * (cam2[10] + cam2[11]) / cam2[11], 0.5 * cam2[14] / cam2[11] / s1z, 0, 0,
            -cam3.x, -cam3.y, -cam3.z, tNear,
        ];
        return new THREE.Matrix4().fromArray(array);
    }

    animate() {
        this.controls.update();
        this.animationRequestID = requestAnimationFrame(this.animate);
        this.animateStep(false);
    }

    animateStep(bypassIsStopped: boolean) {
        if (!this.isStopped || bypassIsStopped) {
            const currentTime = (this.lastTime ?? 0.0) + 0.002;
            this.lastTime = currentTime;
        }
        this.render();
    }

    updateGlobalUniforms(t: number) {
        // Assigning uniforms
        this.globalUniforms.cameraPos.value = this.mainCamera.position;
        this.globalUniforms.cameraParams.value.set(this.mainCamera.near, this.mainCamera.far, 0, 0);
        this.globalUniforms.time.value = t;

        // view-projection matrix and its inverse for mainCamera
        const vpMat = this.mainCamera.projectionMatrix.clone().multiply(this.mainCamera.matrixWorldInverse);
        const invVpMat = this.mainCamera.matrixWorld.clone().multiply(this.mainCamera.projectionMatrixInverse);
        this.globalUniforms.vpMat.value = vpMat;
        this.globalUniforms.invVpMat.value = invVpMat;

        for (let k = 0; k < MAX_LIGHTS; k++) {
            // NOTE We have to set all MAX_LIGHTS uniforms even though we only use NUM_LIGHTS
            const j = (k < NUM_LIGHTS) ? k : 0;
            const mat = mAux.clone().multiply(this.shadowCameras[j].projectionMatrix.clone().multiply(this.shadowCameras[j].matrixWorldInverse));
            // this.compositeMaterial.uniforms.shadowMatrices.value[k] = mat;
            // this.compositeMaterial.uniforms.lightPositions.value[k] = this.shadowCameras[j].position;
            this.globalUniforms.shadowMatrices[k].value = mat;
            this.globalUniforms.lightPos[k].value.set(this.shadowCameras[j].position.x, this.shadowCameras[j].position.y, this.shadowCameras[j].position.z, LIGHT_RADIUS);
            this.globalUniforms.shadowCameraParams[k].value.set(this.shadowCameras[j].near, this.shadowCameras[j].far, 0, 0);
        }

        const p = new THREE.Vector3(Math.cos(t), 1 + Math.sin(2 * t), Math.sin(3 * t));
        const n = new THREE.Vector3(Math.cos(4 * t), Math.sin(5 * t)).normalize();
        const r = 3 / (1 + 0.4 * Math.sin(6 * t));
        const sphereMainCamera = this.getSphere(p, n, r, this.mainCamera);
        this.sphereObject.position.set(sphereMainCamera.elements[0], sphereMainCamera.elements[1], sphereMainCamera.elements[2]);
        this.globalUniforms.sphereMain.value = sphereMainCamera;

        for (let k = 0; k < NUM_LIGHTS; k++) {
            const cam = this.shadowCameras[k];
            const sphereShadowCamera = this.getSphere(p, n, r, cam);
            this.globalUniforms.shadowSpheres[k].value = sphereShadowCamera;
        }
    }

    renderClip() {
        for (let k = 0; k < NUM_LIGHTS; k++) {
            const cam = this.shadowCameras[k];

            // Rendering shadows - back:
            this.renderer.setRenderTarget(this.shadowBackRT);
            this.renderer.clear();
            this.shadowMaterialGeom.side = THREE.BackSide;
            this.shadowMaterialGeom.uniforms.lightIndex.value = k;
            this.geometryScene.overrideMaterial = this.shadowMaterialGeom;
            this.renderer.render(this.geometryScene, cam);
            // Rendering shadows - front:
            this.renderer.setRenderTarget(this.shadowFrontRT);
            this.renderer.clear();
            this.shadowMaterialGeom.side = THREE.FrontSide;
            this.geometryScene.overrideMaterial = this.shadowMaterialGeom;
            this.renderer.render(this.geometryScene, cam);
            // Rendering shadows - clip:
            this.renderer.setRenderTarget(this.shadowRTs[k]);
            this.renderer.clear();
            this.shadowMaterialClip.uniforms.backDepthTex.value = this.shadowBackRT.textures[0];
            this.shadowMaterialClip.uniforms.frontDepthTex.value = this.shadowFrontRT.textures[0];
            this.shadowMaterialClip.uniforms.backIdTex.value = this.shadowBackRT.textures[1];
            this.shadowMaterialClip.uniforms.frontIdTex.value = this.shadowFrontRT.textures[1];
            this.shadowMaterialClip.uniforms.lightIndex.value = k;
            this.quadScene.overrideMaterial = this.shadowMaterialClip;
            this.renderer.render(this.quadScene, this.quadCamera);
        }

        // backside rendering with geometryScene
        this.renderer.setRenderTarget(this.geometryBackRT);
        this.renderer.clear();
        this.geometryMaterial.side = THREE.BackSide;
        this.geometryMaterial.uniforms.phase.value = 0;
        this.geometryScene.overrideMaterial = this.geometryMaterial;
        this.renderer.render(this.geometryScene, this.mainCamera);

        // frontside rendering with geometryScene
        this.renderer.setRenderTarget(this.geometryFrontRT);
        this.renderer.clear();
        this.geometryMaterialNormals.side = THREE.FrontSide;
        this.geometryMaterialNormals.uniforms.phase.value = 1;
        this.geometryScene.overrideMaterial = this.geometryMaterialNormals;
        this.renderer.render(this.geometryScene, this.mainCamera);

        // Composing final image
        this.renderer.setRenderTarget(this.compositeClipRT);
        this.renderer.clear();
        this.compositeClipMaterial.uniforms.backTex.value = this.geometryBackRT.texture;
        this.compositeClipMaterial.uniforms.frontTex.value = this.geometryFrontRT.textures[0];
        this.compositeClipMaterial.uniforms.backDepthTex.value = this.geometryBackRT.depthTexture;
        this.compositeClipMaterial.uniforms.frontDepthTex.value = this.geometryFrontRT.depthTexture;
        this.compositeClipMaterial.uniforms.frontNormalTex.value = this.geometryFrontRT.textures[1];
        for (let k = 0; k < MAX_LIGHTS; k++) {
            // NOTE We have to set all MAX_LIGHTS uniforms even though we only use NUM_LIGHTS
            const j = (k < NUM_LIGHTS) ? k : 0;
            this.compositeClipMaterial.uniforms.shadowMaps.value[k] = this.shadowRTs[j].depthTexture;
        }
        this.quadScene.overrideMaterial = this.compositeClipMaterial;
        this.renderer.render(this.quadScene, this.quadCamera);
    }

    renderRegular() {
        for (let k = 0; k < NUM_LIGHTS; k++) {
            const cam = this.shadowCameras[k];

            // Rendering shadows - clip:
            this.renderer.setRenderTarget(this.shadowRTs[k]);
            this.renderer.clear();
            this.shadowMaterialRegular.side = THREE.FrontSide;
            this.geometryScene.overrideMaterial = this.shadowMaterialRegular;
            this.renderer.render(this.geometryScene, cam);
        }

        // frontside rendering with geometryScene
        this.renderer.setRenderTarget(this.geometryFrontRT);
        this.renderer.clear();
        this.geometryMaterialNormals.side = THREE.FrontSide;
        this.geometryMaterialNormals.uniforms.phase.value = 2;
        this.geometryScene.overrideMaterial = this.geometryMaterialNormals;
        this.renderer.render(this.geometryScene, this.mainCamera);

        // Composing final image
        this.renderer.setRenderTarget(this.compositeRegularRT);
        this.renderer.clear();
        this.compositeRegularMaterial.uniforms.frontTex.value = this.geometryFrontRT.textures[0];
        this.compositeRegularMaterial.uniforms.frontDepthTex.value = this.geometryFrontRT.depthTexture;
        this.compositeRegularMaterial.uniforms.frontNormalTex.value = this.geometryFrontRT.textures[1];
        for (let k = 0; k < MAX_LIGHTS; k++) {
            // NOTE We have to set all MAX_LIGHTS uniforms even though we only use NUM_LIGHTS
            const j = (k < NUM_LIGHTS) ? k : 0;
            this.compositeRegularMaterial.uniforms.shadowMaps.value[k] = this.shadowRTs[j].depthTexture;
        }
        this.quadScene.overrideMaterial = this.compositeRegularMaterial;
        this.renderer.render(this.quadScene, this.quadCamera);
    }

    render() {
        this.updateGlobalUniforms(this.lastTime);

        this.renderClip();

        // Rendering overlayScene into compositeClipRT
        this.renderer.setRenderTarget(this.compositeClipRT);
        this.renderer.render(this.overlayScene, this.mainCamera);

        this.renderRegular();

        // Copy compositeRT to screen
        this.renderer.setRenderTarget(null);
        this.copyMaterial.uniforms.clipColorTex.value = this.compositeClipRT?.texture;
        this.copyMaterial.uniforms.clipDepthTex.value = this.compositeClipRT?.depthTexture;
        this.copyMaterial.uniforms.regularColorTex.value = this.compositeRegularRT?.texture;
        this.copyMaterial.uniforms.regularDepthTex.value = this.compositeRegularRT?.depthTexture;
        this.quadScene.overrideMaterial = this.copyMaterial;
        this.renderer.render(this.quadScene, this.quadCamera);
    }
}

export { RenderManager };