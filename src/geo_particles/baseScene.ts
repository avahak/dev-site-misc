import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ParticleScene } from './particleScene';
import vsString from './shaders/vertex.glsl?raw';
import fsString from './shaders/fragment.glsl?raw';
import { NUM_OBJECTS, PARTICLE_TEXTURE_SIZE } from './config';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

class BaseScene {
    container: HTMLDivElement;
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[];
    animationRequestID: number|null = null;
    lastTime: number|null = null;
    gui: any;
    isStopped: boolean = false;

    objects: THREE.Mesh[] = [];
    objectRotationVectors: THREE.Vector3[] = [];
    particleScene: ParticleScene;
    shaderMaterial: THREE.ShaderMaterial|null = null;

    scandinavia: any;

    constructor(container: HTMLDivElement, scandinavia: any) {
        this.container = container;
        this.scandinavia = scandinavia;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        this.scene = this.setupScene();
        this.camera = this.setupCamera();
        
        this.setupResizeRenderer();
        this.resizeRenderer();

        this.particleScene = new ParticleScene(this);

        this.createGUI();

        console.log(scandinavia);
        
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
        this.renderer.setSize(clientWidth, clientHeight);
        if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = clientWidth / clientHeight;
            this.camera.updateProjectionMatrix();
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
        this.gui = new GUI();
        const debugDialogButton = () => alert(this.particleScene.debugArray());
        const animateButton = () => this.animateStep(false);
        const toggleStop = () => { 
            this.isStopped = !this.isStopped;
        };
        const myObject = {
            debugDialogButton,
            animateButton,
            toggleStop,
        };
        this.gui.add(myObject, 'debugDialogButton').name("Show alphas");
        this.gui.add(myObject, 'animateButton').name("Animate step");
        this.gui.add(myObject, 'toggleStop').name("Toggle stop/play");
        this.gui.close();
    }

    cleanUp() {
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.renderer.dispose();

        this.gui.destroy();
        // this.cleanUpTasks.push(() => {
        //     this.scene.traverse((object) => {
        //         if (object instanceof THREE.Mesh) {
        //             object.geometry.dispose();
        //             if (object.material instanceof THREE.Material) {
        //                 object.material.dispose();
        //             }
        //         }
        //         if (object instanceof THREE.Light)
        //             object.dispose();
        //     });
        // });

        // Should dispose a lot here: 
        // https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
        // https://discourse.threejs.org/t/when-to-dispose-how-to-completely-clean-up-a-three-js-scene/1549/24
    }

    setupScene() {
        const scene = new THREE.Scene();

        const geometry = new THREE.IcosahedronGeometry(0.1, 1);
        const shaderMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
        for (let k = 0; k < NUM_OBJECTS; k++) {
            const object = new THREE.Mesh(geometry, shaderMaterial);
            this.objects.push(object);
            this.objectRotationVectors.push(new THREE.Vector3().randomDirection());
            scene.add(object);
        }

        // const axesHelper = new THREE.AxesHelper(5);
        // scene.add(axesHelper);

        const light = new THREE.PointLight(0xffffff, 200, 0);
        light.position.set(0, 50, 0);
        scene.add(new THREE.AmbientLight(0xddeeff, 0.8));
        scene.add(light);

        const geom = new THREE.BufferGeometry();
        const posData = new Float32Array(PARTICLE_TEXTURE_SIZE*PARTICLE_TEXTURE_SIZE*3);
        for (let j = 0; j < PARTICLE_TEXTURE_SIZE; j++) {
            for (let k = 0; k < PARTICLE_TEXTURE_SIZE; k++) {
                let index = j*PARTICLE_TEXTURE_SIZE + k;
                posData[index*3 + 0] = j / PARTICLE_TEXTURE_SIZE;
                posData[index*3 + 1] = k / PARTICLE_TEXTURE_SIZE;
                posData[index*3 + 2] = 0;
            }
        }
        geom.setAttribute("position", new THREE.BufferAttribute(posData, 3));
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                particleMap: { value: null },
                time: { value: 0 }
            },
            vertexShader: vsString,
            fragmentShader: fsString,
            // blending: THREE.AdditiveBlending,
            // depthWrite: false
        });
        const points = new THREE.Points(geom, this.shaderMaterial);
        points.frustumCulled = false;
        scene.add(points);

        this.moveObjects(0.0);
        scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2.0);   // just for camera angles

        return scene;
    }

    setupCamera() {
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        const controls = new OrbitControls(camera, this.container);
        this.cleanUpTasks.push(() => controls.dispose());

        camera.position.set(0, 1.0, 1.0);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
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
            this.moveObjects(currentTime);
            this.particleScene.setObjectPositions();
            this.particleScene.step(this.renderer);
        }
        
        this.shaderMaterial!.uniforms.particleMap.value = this.particleScene.fbos[this.particleScene.currentFboIndex].texture;
        this.renderer.render(this.scene, this.camera);
    }

    moveObjects(time: number) {
        this.objects.forEach((object, k) => {
            object.rotateOnAxis(this.objectRotationVectors[k], 0.2);
            object.position.set(1.0*Math.cos(k+0.1*time), 1.0*Math.sin(2*k+0.2*time), 0.2);
        });
    }
}

export { BaseScene };