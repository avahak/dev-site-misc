import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { PlaneView } from '../graph/planeView';
// import { Complex } from './complex';

function randomGaussian(stdev: number=1) {
    const phi = 2*Math.PI*Math.random();
    const r = stdev * Math.sqrt(-2*Math.log(1-Math.random()));
    return { x: r*Math.cos(phi), y: r*Math.sin(phi) };
}

class Scene {
    container: HTMLDivElement;
    camera!: THREE.Camera;
    scene!: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[];
    animationRequestID: number|null = null;
    lastTime: number|null = null;
    gui: any;
    isStopped: boolean = false;

    centerMesh!: THREE.Mesh;
    mousePos: [number, number] = [0, 0];
    mouseMesh!: THREE.Mesh;

    // z0: Complex = Complex.ZERO;
    // e1: Complex = Complex.ONE;
    loc: PlaneView;

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

        this.loc = new PlaneView(
            () => {
                const { clientWidth, clientHeight } = this.container;
                return [clientWidth, clientHeight];
            },
            true
        );

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
        const animateButton = () => this.animateStep();
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

    dispose() {
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.renderer.dispose();

        this.gui.destroy();
    }

    setupCamera() {
        this.camera = new THREE.OrthographicCamera();

        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupScene() {
        this.scene = new THREE.Scene();

        for (let k = 0; k < 1000; k++) {
            const r = Math.abs(0.1 + randomGaussian(0.1).x);
            const p = randomGaussian(5.0);
            const ballGeometry = new THREE.SphereGeometry(r);
            const ballMaterial = new THREE.MeshNormalMaterial();
            const ball = new THREE.Mesh(ballGeometry, ballMaterial);
            ball.position.copy(new THREE.Vector3(p.x, p.y, 0.0));
            this.scene.add(ball);
        }

        const centerGeometry = new THREE.SphereGeometry(0.2);
        const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffaa });
        this.centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);

        const mouseGeometry = new THREE.SphereGeometry(0.2);
        const mouseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);

        this.scene.add(this.centerMesh);
        this.scene.add(this.mouseMesh);
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    inputTransform(x: number, y: number, dx: number, dy: number, scale: number, angle: number) {
        this.loc.transform(x, y, dx, dy, scale, angle);
    }

    // inputAction(x: number, y: number) {
    //     console.log("inputAction", x, y);
    //     const res = Complex.fromVector2(this.getResolution());
    //     this.z0 = new Complex(2.0*(x-res.x/2)/res.y, -2.0*(y-res.y/2)/res.y);
    //     console.log(this.z0);
    // }

    inputMove(x: number, y: number) {
        const resolution = this.getResolution();
        // console.log("inputMove", x, y);
        this.mousePos = [x, y];
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        if (!this.isStopped)
            this.animateStep();
    }

    animateStep() {
        const { clientWidth, clientHeight } = this.container;

        const currentTime = (this.lastTime ?? 0.0) + 1.0;
        this.lastTime = currentTime;

        const t = this.lastTime*0.002;

        const r = this.loc.scale;
        const phi = this.loc.angle;
        this.scene.scale.set(1/r, 1/r, 1/r);
        this.scene.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -phi);
        const [cos, sin] = [Math.cos(-this.loc.angle), Math.sin(-this.loc.angle)];
        const [x, y] = [-this.loc.x/r, -this.loc.y/r];
        const [x2, y2] = [cos*x - sin*y, sin*x + cos*y];
        this.scene.position.set(x2, y2, 0);
        // this.e1 = new Complex(Math.log(r), phi+0.001).exp();
        // this.e1 = new Complex(Math.log(r)-0.01, phi).exp();

        const wc = this.loc.localFromWorld(0, 0);
        this.centerMesh.position.set(wc[0], wc[1], 0.0);

        const wm = this.loc.localFromScreen(...this.mousePos);
        this.mouseMesh.position.set(wm[0], wm[1], 0);

        this.renderer.render(this.scene, this.camera);
    }
}

export { Scene };