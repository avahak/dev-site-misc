/**
 * Basic template for a three.js scene decoupling three.js and React by writing
 * a standalone class to handle three.js.
 */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class Scene {
    container: HTMLDivElement;
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[];
    animationRequestID: number|null = null;
    lastTime: number|null = null;

    cube: THREE.Mesh|null = null;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        // this.renderer.setClearColor(0x000000, 0);
        this.renderer.autoClear = false;
        // this.renderer.clearColor();
        container.appendChild(this.renderer.domElement);

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
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(geometry, material);
        scene.add(this.cube);

        // const axesHelper = new THREE.AxesHelper(5);
        // scene.add(axesHelper);

        const light = new THREE.PointLight(0xffffff, 200, 0);
        light.position.set(0, 50, 0);
        scene.add(new THREE.AmbientLight(0xddeeff, 0.8));
        scene.add(light);

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

        const currentTime = performance.now()/1000;
        const dt = this.lastTime ? Math.max(Math.min(currentTime-this.lastTime, 0.1), 0.0) : 0;
        this.lastTime = currentTime;

        this.cube?.rotateY(0.1*dt);

        this.renderer.render(this.scene, this.camera);
    };
}

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const scene = new Scene(containerRef.current!);
        return () => {
            scene.cleanUp();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default SceneComponent;
