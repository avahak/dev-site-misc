import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import vsTestText from './shaders/vsTestText.glsl?raw';
import fsTestText from './shaders/fsTestText.glsl?raw';
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
    font1: MCDFFont;
    font2: MCDFFont;
    textGroups: TextGroup[] = [];

    shader!: THREE.ShaderMaterial;
    bg!: THREE.Group;

    constructor(container: HTMLDivElement, font1: MCDFFont, font2: MCDFFont) {
        this.container = container;
        this.font1 = font1;
        this.font2 = font2;
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
        
        this.camera.position.set(0, 0.5, 0.7);
        this.controls.target.set(0, 0, 0);
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
                tex: { value: this.font1.atlas },
                resolution: { value: null },
            },
            vertexShader: vsTestText,
            fragmentShader: fsTestText,
            transparent: true,
            // blending: THREE.AdditiveBlending,    // There is no easy solution here
            // depthWrite: false,
        });

        // const cubeGeometry = new THREE.BoxGeometry(0.25, 0.5, 0.5);
        // const cube = new THREE.Mesh(cubeGeometry, this.shader);

        this.textGroups.push(new TextGroup(this.font2));
        this.textGroups.push(new TextGroup(this.font1));

        // this.scene.add(cube);
        this.scene.add(this.bg);
        this.textGroups.forEach((tg) => {
            this.scene.add(tg.getObject());
        });
        this.temp(this.textGroups[1], 600, 100000, 0);

        this.scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2);
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

    temp(tg: TextGroup, start: number, end: number, t: number) {
        tg.reset();
        let count = 11*start;
        const col1 = [0.8, 0.7, 0.5];
        const col2 = [1.0, 0.2, 0.1];
        for (let k = start; k < end; k++) {
            const c1 = 8;
            const dx = count + 10*t;
            const posFn = (x: number, y: number) => {
                const p1 = 0.01*(Math.sqrt(c1*(x+dx))+c1*y)*Math.cos(Math.sqrt(c1*(x+dx)));
                const p2 = -0.01*(Math.sqrt(c1*(x+dx))+c1*y)*Math.sin(Math.sqrt(c1*(x+dx)));
                // const r = Math.sqrt(p1*p1 + p2*p2);
                // const z = k > 1000 ? (1*Math.atan(0.001*(k-1000)))*(Math.sin(r/2) + Math.sin(5*p1/r) + Math.sin(7*p2/r)) : 0;
                return [p1, p2, 0];
            };
            const a = count/100 + t;
            let rand = count + Math.round(a) * 1666196;
            rand = (rand * 1664525 + 1013904223) % 4294967296;
            const x = (rand >>> 0) / 4294967296
            let s = `$${x.toFixed(16)}#`;
            if (k % 50 == 0)
                s = `Font: ${tg.font.name}`
            let d = 10*Math.min(Math.max(Math.abs(Math.round(a)-a)-0.35, 0), 1);
            d = d*d; 
            let color = [d*col2[0]+(1-d)*col1[0], d*col2[1]+(1-d)*col1[1], d*col2[2]+(1-d)*col1[2]];
            tg.addText(s, posFn, color);
            count += (tg.font == this.font1) ? 11 : 12;
        }
        // this.textGroup.addText(s, posFn, color);
    }

    animateStep() {
        const currentTime = (this.lastTime ?? 0.0) + (this.isStopped ? 0.0 : 1.0);
        this.lastTime = currentTime;

        const t = this.lastTime*0.001;
        this.bg.setRotationFromEuler(new THREE.Euler(Math.PI/2, 2*t, 3*t));

        this.temp(this.textGroups[0], 0, 500, t);

        this.renderer.render(this.scene, this.camera);
    }
}

export { TextScene };