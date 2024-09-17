import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FboScene } from './FboScene';
import vsString from './shaders/vertex.glsl?raw';
import fsString from './shaders/fragment.glsl?raw';
import { NUM_OBJECTS, PARTICLE_TEXTURE_SIZE } from './config';

class BaseScene {
    container: HTMLDivElement;
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[];
    animationRequestID: number|null = null;
    lastTime: number|null = null;

    objects: THREE.Mesh[] = [];
    objectRotationVectors: THREE.Vector3[] = [];
    fboScene: FboScene;
    material: THREE.ShaderMaterial|null = null;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        this.scene = this.setupScene();
        this.camera = this.setupCamera();
        
        this.setupResizeRenderer();
        this.resizeRenderer();

        this.fboScene = new FboScene(this);
        
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

    cleanUp() {
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.renderer.dispose();
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
        const material = new THREE.MeshNormalMaterial({ flatShading: true });
        for (let k = 0; k < NUM_OBJECTS; k++) {
            const object = new THREE.Mesh(geometry, material);
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
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uPosition: { value: null },
                time: { value: 0 }
            },
            vertexShader: vsString,
            fragmentShader: fsString,
            // blending: THREE.AdditiveBlending,
            // depthWrite: false
        });
        const points = new THREE.Points(geom, this.material);
        points.frustumCulled = false;
        scene.add(points);

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

        // const currentTime = performance.now() / 1000;
        // const dt = this.lastTime ? Math.max(Math.min(currentTime-this.lastTime, 0.1), 0.0) : 0;
        // this.lastTime = currentTime;
        const currentTime = (this.lastTime ?? 0.0) + 0.01;
        this.lastTime = currentTime;
        this.fboScene.material.uniforms.time.value = currentTime;

        this.objects.forEach((object, k) => {
            object.rotateOnAxis(this.objectRotationVectors[k], 0.2);
            object.position.set(1.0*Math.cos(k+0.1*currentTime), 1.0*Math.sin(2*k+0.2*currentTime), 0.2);
        });

        this.fboScene.setObjectPositions();
        this.fboScene.step(this.renderer);
        
        this.material!.uniforms.uPosition.value = this.fboScene.fbos[this.fboScene.currentFboIndex].texture;
        this.renderer.render(this.scene, this.camera);
        console.log(this.camera.position);
    };
}

export { BaseScene };