import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FboScene } from './FboScene';
import vsString from './shaders/vertex.glsl?raw';
import fsString from './shaders/fragment.glsl?raw';

class Scene {
    container: HTMLDivElement;
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[];
    animationRequestID: number|null = null;
    lastTime: number|null = null;

    cube: THREE.Mesh|null = null;
    fboScene: FboScene;
    material: THREE.ShaderMaterial|null = null;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        this.fboScene = new FboScene(this.renderer);
        this.scene = this.setupScene();
        this.camera = this.setupCamera();


        this.setupResizeRenderer();
        this.resizeRenderer();
        
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

        // Add a basic cube
        const geometry = new THREE.IcosahedronGeometry(0.1, 1);
        const material = new THREE.MeshNormalMaterial({ flatShading: true });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        this.cube = cube;

        // const axesHelper = new THREE.AxesHelper(5);
        // scene.add(axesHelper);

        const light = new THREE.PointLight(0xffffff, 200, 0);
        light.position.set(0, 50, 0);
        scene.add(new THREE.AmbientLight(0xddeeff, 0.8));
        scene.add(light);

        const geom = new THREE.BufferGeometry();
        const uvData = new Float32Array(this.fboScene.SIZE*this.fboScene.SIZE*2);
        for (let j = 0; j < this.fboScene.SIZE; j++) {
            for (let k = 0; k < this.fboScene.SIZE; k++) {
                let index = j*this.fboScene.SIZE + k;
                uvData[index*2 + 0] = j / this.fboScene.SIZE;
                uvData[index*2 + 1] = k / this.fboScene.SIZE;
            }
        }
        geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(this.fboScene.SIZE*this.fboScene.SIZE*3), 3));
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

        return scene;
    }

    setupCamera() {
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        const controls = new OrbitControls(camera, this.container);
        this.cleanUpTasks.push(() => controls.dispose());

        camera.position.set(1, 1, 1.5);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        return camera;
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);

        const currentTime = performance.now() / 1000;
        const dt = this.lastTime ? Math.max(Math.min(currentTime-this.lastTime, 0.1), 0.0) : 0;
        this.lastTime = currentTime;
        this.fboScene.material.uniforms.time.value = currentTime;

        this.cube!.rotateY(0.1*dt);
        this.cube!.position.set(1.0*Math.cos(0.1*currentTime), 1.0*Math.sin(0.2*currentTime), 0.0);

        this.fboScene.setObjectPosition(this.cube!.position);
        this.fboScene.step(this.renderer);
        
        this.material!.uniforms.uPosition.value = this.fboScene.fbos[this.fboScene.currentFboIndex].texture;
        this.renderer.render(this.scene, this.camera);
    };
}

export { Scene };