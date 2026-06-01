/**
 * Rendering test with clipping solid objects.
 * TODO
 * - Rebuild shadows without using three.js lights
 * - How should interpolation work in the main passes
 * 
 * - Test if 
 * https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js
 * comment
 * // Hardware PCF with LinearFilter gives us 4-tap filtering per sample
 * // 5 samples using Vogel disk + IGN = effectively 20 filtered taps with better distribution
 * works out in Firefox despite warning:
 * "WebGL warning: drawElementsInstanced: Depth texture comparison requests (e.g. `LINEAR`) 
 * Filtering, but behavior is implementation-defined, and so on some systems will sometimes 
 * behave as `NEAREST`. (warns once)"
 */
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { TextGroup } from '../primitives/textRender';
import { MCSDFFont } from '../primitives/font';

const NUM_LIGHTS = 1;
const SHADOW_MAP_SIZE = 512;

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

    mainCamera!: THREE.PerspectiveCamera;

    geometryObject!: THREE.Object3D;

    scene!: THREE.Scene;

    lights: THREE.SpotLight[] = [];         // lights with shadows

    font!: MCSDFFont;

    depthMaterial!: THREE.MeshDepthMaterial;

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
            console.log("dm", this.depthMaterial);
        };
        const myObject = {
            animateButton,
            toggleStop,
            debugInfo,
            debug1: 1.0,
            debug2: 1.0,
            debug3: 1.0,
            debug4: 1.0,
        };
        this.gui.add(myObject, 'animateButton').name("Animate step");
        this.gui.add(myObject, 'toggleStop').name("Toggle stop/play");
        this.gui.add(myObject, 'debugInfo').name("Debug info");
        this.gui.add(myObject, 'debug1', 0.1, 2.0)
            .name('Debug1 (H)')
            .onChange((h: number) => {
            });
        this.gui.add(myObject, 'debug2', 0.0, 1.0)
            .name('Debug2 (prev. WARP*10)')
            .onChange((h: number) => {
            });
        this.gui.add(myObject, 'debug3', 0.0, 1.0)
            .name('Debug3 (-)')
            .onChange((h: number) => {
            });
        this.gui.add(myObject, 'debug4', 0.0, 1.0)
            .name('Debug4 (-)')
            .onChange((h: number) => {
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
        this.controls.dispose();

        this.gui.destroy();
    }

    setupCamera() {
        this.mainCamera = new THREE.PerspectiveCamera(50);
        // this.mainCamera.near = 3.0;

        this.controls = new OrbitControls(this.mainCamera, this.renderer.domElement);

        this.mainCamera.position.set(0, 0, 5);
    }

    setupScene() {
        this.scene = new THREE.Scene();

        // Add lights
        // const ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1));
        // this.scene.add(ambientLight);
        for (let k = 0; k < NUM_LIGHTS; k++) {
            const light = new THREE.SpotLight(0xffffff, 200, 20, Math.PI / 8);
            light.position.set(10 * (Math.random() - 0.5), 10, 10 * (Math.random() - 0.5));
            light.castShadow = true;
            light.shadow.radius = 3.0;
            light.shadow.camera.near = 1.0;
            light.shadow.camera.far = 20.0;
            light.shadow.mapSize.set(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
            light.shadow.autoUpdate = true;
            light.target.position.set(0, 0, 0);
            this.scene.add(light, light.target);
            this.lights.push(light);
        }

        this.depthMaterial = new THREE.MeshDepthMaterial({
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
                this.scene.add(object);
                object.traverse((childObj: THREE.Object3D) => {
                    if (isMesh(childObj)) {
                        const mat = childObj.material;
                        childObj.userData.objectId = objectId++;
                        childObj.customDepthMaterial = this.depthMaterial;
                        if (!Array.isArray(mat))
                            childObj.material = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(), 1.0, 0.5) });
                        // childObj.material = new THREE.MeshNormalMaterial();
                    }
                });
                this.geometryObject = object;
                setShadow(this.geometryObject, true, true);
            });
        });

        // this.scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2.0);   // just for camera angles

        const normalMaterial = new THREE.MeshNormalMaterial();
        const knotGeo = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16, 3, 2);
        const knotMesh = new THREE.Mesh(knotGeo, normalMaterial);
        knotMesh.position.x = -1.5;
        const torusGeo = new THREE.TorusGeometry(0.6, 0.2, 16, 100);
        const torusMesh = new THREE.Mesh(torusGeo, normalMaterial);
        torusMesh.position.x = 1.5;
        this.scene.add(knotMesh, torusMesh);
        for (const light of this.lights) {
            const spotLightHelper = new THREE.SpotLightHelper(light);
            spotLightHelper.update();
            this.scene.add(spotLightHelper);
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
        this.scene.add(textGroup.getObject());

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        for (const light of this.lights)
            light.shadow.autoUpdate = true;
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        this.controls.update();
        this.animateStep(false);
    }

    animateStep(bypassIsStopped: boolean) {
        if (!this.isStopped || bypassIsStopped) {
            const currentTime = (this.lastTime ?? 0.0) + 1.0;
            this.lastTime = currentTime;
        }
        this.render();
    }

    render() {
        if (!this.lastTime)
            return;
        const t = this.lastTime * 0.002;
        // this.overlayScene.setRotationFromEuler(new THREE.Euler(t, 2.0 * t, 3.0 * t));

        this.renderer.render(this.scene, this.mainCamera);
    }
}

export { Scene };