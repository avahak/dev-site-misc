import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ParticleScene } from './particleScene';
import vsString from './shaders/vs.glsl?raw';
import fsString from './shaders/fs.glsl?raw';
import vsAppString from './shaders/vsApp.glsl?raw';
import fsAppString from './shaders/fsApp.glsl?raw';
import { NUM_OBJECTS, PARTICLE_TEXTURE_SIZE } from './config';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { PreloadData } from './types';

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

    particleScene: ParticleScene;

    shaderReaction!: THREE.ShaderMaterial;

    appIconPositions = new Float32Array(NUM_OBJECTS*3);
    appIconPositionsAttribute!: THREE.BufferAttribute;
    shaderApp!: THREE.ShaderMaterial;

    data: PreloadData;

    constructor(container: HTMLDivElement, data: PreloadData) {
        this.container = container;
        this.data = data;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x173040, 1);
        container.appendChild(this.renderer.domElement);

        this.scene = this.setupScene();
        this.camera = this.setupCamera();
        for (let k = 0; k < NUM_OBJECTS; k++)
            this.initAppIcon(k, 0.0);
        
        this.setupResizeRenderer();
        this.resizeRenderer();

        this.particleScene = new ParticleScene(this);

        this.createGUI();

        console.log(data.scandinavia);
        console.log(data.appAtlas);
        console.log(data.reactionAtlas);
        
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
        const t = Math.min(this.container.clientWidth/1200, 1);
        this.camera.position.set(0.3-1.3*t, 1.7, 0.0);
        this.camera.lookAt(new THREE.Vector3(0.3-1.3*t, 0, 0));
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

        // const axesHelper = new THREE.AxesHelper(5);
        // scene.add(axesHelper);

        const light = new THREE.PointLight(0xffffff, 200, 0);
        light.position.set(0, 50, 0);
        scene.add(new THREE.AmbientLight(0xddeeff, 0.8));
        scene.add(light);

        // Reactions:
        const geomReaction = new THREE.BufferGeometry();
        const posDataReaction = new Float32Array(PARTICLE_TEXTURE_SIZE*PARTICLE_TEXTURE_SIZE*3);
        for (let j = 0; j < PARTICLE_TEXTURE_SIZE; j++) {
            for (let k = 0; k < PARTICLE_TEXTURE_SIZE; k++) {
                let index = j*PARTICLE_TEXTURE_SIZE + k;
                posDataReaction[index*3 + 0] = j / PARTICLE_TEXTURE_SIZE;
                posDataReaction[index*3 + 1] = k / PARTICLE_TEXTURE_SIZE;
                posDataReaction[index*3 + 2] = 0;
            }
        }
        geomReaction.setAttribute("position", new THREE.BufferAttribute(posDataReaction, 3));
        this.shaderReaction = new THREE.ShaderMaterial({
            uniforms: {
                particleMap: { value: null },
                extraData: { value: null },
                time: { value: 0 },
                reactions: { value: this.data.reactionAtlas },
            },
            vertexShader: vsString,
            fragmentShader: fsString,
            // blending: THREE.AdditiveBlending,
            // depthWrite: false
        });
        const pointsReaction = new THREE.Points(geomReaction, this.shaderReaction);
        pointsReaction.frustumCulled = false;
        scene.add(pointsReaction);

        // Apps:
        const geomApp = new THREE.BufferGeometry();
        this.appIconPositionsAttribute = new THREE.BufferAttribute(this.appIconPositions, 3)
        geomApp.setAttribute("position", this.appIconPositionsAttribute);
        this.shaderApp = new THREE.ShaderMaterial({
            uniforms: {
                particleMap: { value: null },
                time: { value: 0 },
                apps: { value: this.data.appAtlas },
            },
            vertexShader: vsAppString,
            fragmentShader: fsAppString,
            // blending: THREE.AdditiveBlending,
            // depthWrite: false
        });
        const pointsApp = new THREE.Points(geomApp, this.shaderApp);
        pointsApp.frustumCulled = false;
        scene.add(pointsApp);

        this.moveAppIcons(0);

        scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2.0);   // just for camera angles

        return scene;
    }

    setupCamera() {
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        const controls = new OrbitControls(camera, this.container);
        this.cleanUpTasks.push(() => controls.dispose());

        return camera;
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);

        this.animateStep(this.isStopped);
    };

    animateStep(isStopped: boolean) {
        const currentTime = (this.lastTime ?? 0.0) + (isStopped ? 0.0 : 0.002);
        this.lastTime = currentTime;
        this.particleScene.shaderMaterial.uniforms.time.value = currentTime;

        if (!isStopped) {
            this.moveAppIcons(currentTime);
            this.particleScene.setObjectPositions();
            this.particleScene.step(this.renderer);
        }
        
        this.shaderReaction.uniforms.particleMap.value = this.particleScene.fbos[this.particleScene.currentFboIndex].texture;
        this.shaderReaction.uniforms.extraData.value = this.particleScene.initialExtraDataTexture;
        this.renderer.render(this.scene, this.camera);
    }

    initAppIcon(k: number, time: number) {
        const t = Math.min(this.container.clientWidth/1200, 1);
        if (time > 0.4*k) {
            this.appIconPositions[3*k+0] = 0.24-2.2*t;
            this.appIconPositions[3*k+1] = -0.5+0.2*(Math.random()-0.5);
            this.appIconPositions[3*k+2] = 0.2-0.001*k;
        } else {
            this.appIconPositions[3*k+0] = -100.0;
            this.appIconPositions[3*k+1] = -100.0;
            this.appIconPositions[3*k+2] = 0.2-0.001*k;
        }
        this.appIconPositionsAttribute.needsUpdate = true;
    }

    moveAppIcons(time: number) {
        const t = Math.min(this.container.clientWidth/1200, 1);
        for (let k = 0; k < NUM_OBJECTS; k++) {
            const dx = t*1.0*0.001*(2+Math.sin(7*time+k)+Math.sin(3*time+k));
            const dy = t*2.0*(3.66-3*t)*0.0005*(1.0+0.5*(Math.sin(k)+Math.sin(11*time+k)+Math.sin(4*time+k)));
            this.appIconPositions[3*k+0] = this.appIconPositions[3*k+0] + dx;
            this.appIconPositions[3*k+1] = this.appIconPositions[3*k+1] + dy;
            this.appIconPositions[3*k+2] = 0.2-0.001*k;
            if (Math.abs(this.appIconPositions[3*k+0]) > 2.0 || Math.abs(this.appIconPositions[3*k+1]) > 1.5)
                this.initAppIcon(k, time);
        }
        this.appIconPositionsAttribute.needsUpdate = true;
    }
}

export { BaseScene };