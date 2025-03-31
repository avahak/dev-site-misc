import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Complex } from './complex';

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
    mousePos: Complex = Complex.ZERO;
    mouseMesh!: THREE.Mesh;

    z0: Complex = Complex.ZERO;
    e1: Complex = Complex.ONE;

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
            const p = randomGaussian(3.0);
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
        console.log("inputTransform", dx, dy, scale, angle);
        const res = Complex.fromVector2(this.getResolution());
        const e1Old = this.e1;
        const z0Old = this.z0;
        const e1f = new Complex(scale*Math.cos(-angle), scale*Math.sin(-angle));
        const e1New = e1Old.mul(e1f);
        // z0_new + e1_new*z = z0_old + e1_old*z + (dx,dy)
        // => z0_new = z0_old + (dx,dy) + e1_old*z - e1_new*z
        const z = this.computePosInScene(new Complex(x, y));
        const delta = new Complex(dx, -dy).scale(2.0/res.y);
        const z0New = z0Old.add(delta).add(e1Old.mul(z)).sub(e1New.mul(z));

        this.e1 = e1New;
        this.z0 = z0New;
        this.mousePos = new Complex(x, y);
    }

    computePosInScene(screenPos: Complex): Complex {
        // Compute position in scene space from screen (container) coordinates
        const res = Complex.fromVector2(this.getResolution());
        const w = new Complex(screenPos.x-res.x/2, -(screenPos.y-res.y/2)).scale(2.0/res.y);
        // z0 + e1*z = w
        // z = (w-z0)/e1
        return w.sub(this.z0).div(this.e1);
    }

    inputAction(x: number, y: number) {
        console.log("inputAction", x, y);
        const res = Complex.fromVector2(this.getResolution());
        this.z0 = new Complex(2.0*(x-res.x/2)/res.y, -2.0*(y-res.y/2)/res.y);
        console.log(this.z0);
    }

    inputMove(x: number, y: number) {
        const resolution = this.getResolution();
        // console.log("inputMove", x, y);
        this.mousePos = new Complex(x, y);
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        if (!this.isStopped)
            this.animateStep();
    }

    animateStep() {
        const currentTime = (this.lastTime ?? 0.0) + 1.0;
        this.lastTime = currentTime;

        const t = this.lastTime*0.002;

        const r = this.e1.abs();
        const phi = this.e1.arg();
        this.scene.position.set(this.z0.x, this.z0.y, 0);
        this.scene.scale.set(r, r, r);
        this.scene.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), phi);
        // this.e1 = new Complex(Math.log(r), phi+0.001).exp();
        // this.e1 = new Complex(Math.log(r)-0.01, phi).exp();

        const wc = this.computePosInScene(Complex.fromVector2(this.getResolution()).scale(0.5));
        this.centerMesh.position.set(wc.x, wc.y, 0.0);

        const wm = this.computePosInScene(this.mousePos);
        this.mouseMesh.position.set(wm.x, wm.y, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

export { Scene };