/**
 * Solid texture renderer test.
 */
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import vs from './shaders/vs.glsl?raw';
import fs from './shaders/fs.glsl?raw';
import fsPost from './shaders/fsPost.glsl?raw';
import sCommon from './shaders/sCommon.glsl?raw';

function isMesh(object: THREE.Object3D): object is THREE.Mesh {
    return (object as THREE.Mesh).isMesh === true;
}

class Scene {
    container: HTMLDivElement;
    camera!: THREE.Camera;
    scene!: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    controls!: OrbitControls;
    cleanUpTasks: (() => void)[];
    animationRequestID: number|null = null;
    lastTime: number|null = null;
    gui: any;
    isStopped: boolean = false;

    shader!: THREE.ShaderMaterial;
    object!: THREE.Object3D;
    renderTarget: THREE.WebGLRenderTarget|null = null;

    postScene!: THREE.Scene;
    postShader!: THREE.ShaderMaterial;
    postCamera!: THREE.Camera;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.autoClear = false;
        container.appendChild(this.renderer.domElement);

        this.renderer.getContext().getExtension('EXT_float_blend');

        this.setupCamera();
        this.setupScene();
        this.createRenderTarget();
        this.setupResizeRenderer();
        this.createGUI();

        this.cleanUpTasks.push(() => { 
            if (this.animationRequestID)
                cancelAnimationFrame(this.animationRequestID);
        });
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
        this.shader.uniforms.resolution.value = new THREE.Vector2(clientWidth, clientHeight);

        const dpr = Math.min(this.renderer.getPixelRatio(), 2);
		this.renderTarget?.setSize(window.innerWidth*dpr, window.innerHeight*dpr);
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

    createRenderTarget() {
        if (this.renderTarget)
            this.renderTarget.dispose();

        const res = this.getResolution();
        const dpr = Math.min(this.renderer.getPixelRatio(), 2);

        this.renderTarget = new THREE.WebGLRenderTarget(dpr*res.x, dpr*res.y, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            count: 2,
        });
        console.log(this.renderTarget);
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
        const myObject = {
            animateButton,
            toggleStop,
            debug1: 1.0, 
            debug2: 1.0,
            debug3: 1.0,
            debug4: 1.0,
        };
        this.gui.add(myObject, 'animateButton').name("Animate step");
        this.gui.add(myObject, 'toggleStop').name("Toggle stop/play");
        this.gui.add(myObject, 'debug1', 0.1, 2.0)
            .name('Debug1 (H)')
            .onChange((h: number) => {
                this.shader.uniforms.debug1.value = h;
            });
        this.gui.add(myObject, 'debug2', 0.1, 6.0)
            .name('Debug2 (WARP*10)')
            .onChange((h: number) => {
                this.shader.uniforms.debug2.value = h;
            });
        this.gui.add(myObject, 'debug3', 0.1, 2.0)
            .name('Debug3 (-)')
            .onChange((h: number) => {
                this.shader.uniforms.debug3.value = h;
            });
        this.gui.add(myObject, 'debug4', 0.1, 2.0)
            .name('Debug4 (-)')
            .onChange((h: number) => {
                this.shader.uniforms.debug4.value = h;
            });
        this.gui.close();
    }

    dispose() {
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        if (this.renderTarget)
            this.renderTarget.dispose();
        this.renderer.dispose();
        this.shader.dispose();
        this.controls.dispose();

        this.gui.destroy();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(0, 0, 5);

        this.postCamera = new THREE.OrthographicCamera();
        this.postCamera.position.set(0, 0, 1);    
    }

    setupScene() {
        this.scene = new THREE.Scene();

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: null },
                cameraPos: { value: new THREE.Vector3() },
                time: { value: null },
                side: { value: 0 },
                debug1: { value: 1.0 },
                debug2: { value: 1.0 },
                debug3: { value: 1.0 },
                debug4: { value: 1.0 },
            },
            vertexShader: vs,
            fragmentShader: sCommon + '\n' + fs,
            depthWrite: true,
            depthTest: true,
            glslVersion: THREE.GLSL3
        });

        const light = new THREE.AmbientLight(new THREE.Color(1, 1, 1));
        this.scene.add(light);

        const materialReplacement: { [key: string]: THREE.Material } = {
            // "Material.001": new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.5, 0.5) }),
            "Material.001": this.shader,
            "Material.002": this.shader,
        };

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
                        // console.log(childObj.name, (!Array.isArray(childObj.material) && (childObj.material.name in materialReplacement)));
                        if (!Array.isArray(mat) && (mat.name in materialReplacement))
                            childObj.material = materialReplacement[mat.name];
                    }
                });
                this.object = object;
            });
        });

        // this.scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2.0);   // just for camera angles

        // const cGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
        // this.cylinder = new THREE.Mesh(cGeometry, this.shader);
        // this.scene.add(this.cylinder);


        this.postScene = new THREE.Scene();
        this.postShader = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: null },
                cameraPos: { value: new THREE.Vector3() },
                time: { value: null },
                gOne: { value: null },
                gTwo: { value: null },
            },
            vertexShader: vs,
            fragmentShader: fsPost,
            depthWrite: true,
            depthTest: true,
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        let mesh = new THREE.Mesh(geometry, this.postShader);
        this.postScene.add(mesh);
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
        if (!this.lastTime || !this.renderTarget)
            return;
        const t = this.lastTime*0.002;
        // this.cylinder.setRotationFromEuler(new THREE.Euler(t, 2.0*t, 3.0*t));

        this.renderer.setRenderTarget(this.renderTarget);
        
        this.renderer.clear();

        this.shader.uniforms.cameraPos.value.copy(this.camera.position);
        this.shader.uniforms.time.value = t;

        // front
        this.shader.side = THREE.FrontSide;
        this.shader.uniforms.side.value = 0;
        this.renderer.render(this.scene, this.camera);

        // back
        this.shader.side = THREE.BackSide;
        this.shader.uniforms.side.value = 1;
        this.renderer.render(this.scene, this.camera);

        this.renderer.setRenderTarget(null);
        this.postShader.uniforms.gOne.value = this.renderTarget.textures[0];
        this.postShader.uniforms.gTwo.value = this.renderTarget.textures[1];
        this.renderer.render(this.postScene, this.postCamera);
    }
}

export { Scene };