import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import vsText from './shaders/vsTestText.glsl?raw';
import fsText from './shaders/fsTestText.glsl?raw';
import { TextGroup } from './textRender';
import { MCDFFont } from './font';

class TextScene {
    container: HTMLDivElement;
    camera!: THREE.Camera;
    scene!: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[];
    animationRequestID: number|null = null;
    lastTime: number = 0;
    gui: any;
    isStopped: boolean = false;
    controls!: OrbitControls;
    font: MCDFFont;

    shader!: THREE.ShaderMaterial;
    bg!: THREE.Group;

    constructor(container: HTMLDivElement, font: MCDFFont) {
        this.container = container;
        this.font = font;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        this.renderer.getContext().getExtension('EXT_float_blend');

        this.setupCamera();
        this.setupScene();
        this.setupResizeRenderer();
        this.resizeRenderer();
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
        if (this.camera instanceof THREE.PerspectiveCamera) {
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
        this.gui = new GUI();
        const animateButton = () => {
            const temp = this.isStopped;
            this.isStopped = false;
            this.animateStep();
            this.isStopped = temp;
        }
        const toggleStop = () => { 
            this.isStopped = !this.isStopped;
        };
        const myObject = {
            animateButton,
            toggleStop,
        };
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
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        this.camera.position.set(0, 0, 2);
        // this.camera.lookAt(new THREE.Vector3(5, 0, 0));
        this.controls.update();
    }

    setupScene() {
        this.scene = new THREE.Scene();

        this.bg = new THREE.Group();
        const tempGeometry = new THREE.BoxGeometry(0.1, 0.2, 1.0);
        const tempMaterial = new THREE.MeshNormalMaterial();
        const tempCube = new THREE.Mesh(tempGeometry, tempMaterial);
        this.bg.add(tempCube);

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                tex: { value: this.font.atlas },
                resolution: { value: null },
            },
            vertexShader: vsText,
            fragmentShader: fsText,
            transparent: true,
        });

        const cubeGeometry = new THREE.BoxGeometry(0.25, 0.5, 0.5);
        const cube = new THREE.Mesh(cubeGeometry, this.shader);

        const textGroup = new TextGroup(this.font);
        textGroup.addText('Test 123! AVat/025,:"aa')

        this.scene.add(cube);
        this.scene.add(this.bg);
        this.scene.add(textGroup.getObject());
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        if (!this.isStopped)
            this.animateStep();
    }

    animateStep() {
        const currentTime = (this.lastTime ?? 0.0) + (this.isStopped ? 0.0 : 1.0);
        this.lastTime = currentTime;

        const t = this.lastTime*0.001;
        this.bg.setRotationFromEuler(new THREE.Euler(0.5*t, 1.0*t, -0.3*t));

        this.renderer.render(this.scene, this.camera);
    }
}

export { TextScene };