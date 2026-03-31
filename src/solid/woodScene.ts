/**
 * Solid texture test.
 */
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import vs from './shaders/vs.glsl?raw';
import fs from './shaders/fsWood.glsl?raw';
import sCommon from './shaders/sCommon.glsl?raw';


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
    cylinder!: THREE.Mesh;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        this.renderer.getContext().getExtension('EXT_float_blend');

        this.setupCamera();
        this.setupScene();
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

        const animateButton = () => this.animateStep();
        const toggleStop = () => { 
            this.isStopped = !this.isStopped;
        };
        const myObject = {
            animateButton,
            toggleStop,
            radius: 1,
            height: 2,
            debug1: 1.0, 
            debug2: 1.0,
            debug3: 1.0,
            debug4: 1.0,
        };
        this.gui.add(myObject, 'animateButton').name("Animate step");
        this.gui.add(myObject, 'toggleStop').name("Toggle stop/play");
        this.gui.add(myObject, 'radius', 0.25, 1)
            .name('Radius')
            .onChange((r: number) => {
                this.addCylinder(r, myObject.height);
            });
        this.gui.add(myObject, 'height', 0.05, 5)
            .name('Height')
            .onChange((h: number) => {
                this.addCylinder(myObject.radius, h);
            });
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
        this.renderer.dispose();
        this.shader.dispose();
        this.controls.dispose();

        this.gui.destroy();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(0, 0, 5);
        // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    addCylinder(r: number, h: number) {
        if (this.cylinder)
            this.scene.remove(this.cylinder);
        const cGeometry = new THREE.CylinderGeometry(r, r, h);
        cGeometry.rotateX(Math.PI/2);
        this.cylinder = new THREE.Mesh(cGeometry, this.shader);
        this.scene.add(this.cylinder);
        this.render();
    }

    setupScene() {
        this.scene = new THREE.Scene();

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: null },
                debug1: { value: 1.0 },
                debug2: { value: 1.0 },
                debug3: { value: 1.0 },
                debug4: { value: 1.0 },
            },
            vertexShader: vs,
            fragmentShader: sCommon + '\n' + fs,
        });

        this.addCylinder(1, 2);

        // this.scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2.0);   // just for camera angles

        // const cGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
        // this.cylinder = new THREE.Mesh(cGeometry, this.shader);
        // this.scene.add(this.cylinder);


        // const geometry = new THREE.PlaneGeometry(2, 2);
        // let mesh = new THREE.Mesh(geometry, this.shader);
        // this.scene.add(mesh);
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        this.controls.update();
        if (!this.isStopped)
            this.animateStep();
    }

    animateStep() {
        const currentTime = (this.lastTime ?? 0.0) + 1.0;
        this.lastTime = currentTime;

        this.render();
    }

    render() {
        if (!this.lastTime)
            return;
        const t = this.lastTime*0.002;
        // this.cylinder.setRotationFromEuler(new THREE.Euler(t, 2.0*t, 3.0*t));
        this.renderer.render(this.scene, this.camera);
    }
}

export { Scene };