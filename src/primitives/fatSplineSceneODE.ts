import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { FatUCBSplineGroup } from './FatUCBSpline';
import { ODESolver, ButcherTableau } from '../ODESolver';


function thomasAttractor(t: number, y: number[]): number[] {
    const b = 0.087;
    const x = y[0], y_ = y[1], z = y[2];
    return [
        Math.sin(y_) - b * x,
        Math.sin(z) - b * y_,
        Math.sin(x) - b * z
    ];
}

function boualiSystem(t: number, y: number[]): number[] {
    const alpha = 3.0, beta = 2.2, gamma = 1.0, mu = 0.001;
    const x = y[0], y_ = y[1], z = y[2];
    return [
        alpha * x * (1 - y_) - beta * z,
        -gamma * y_ * (1 - x * x),
        mu * x
    ];
}

// Mapping of method names to Butcher tableaux
const methodMap: Record<string, ButcherTableau> = {
    Euler: ButcherTableau.EULER,
    Midpoint: ButcherTableau.MIDPOINT,
    Heun: ButcherTableau.HEUN,
    RK4: ButcherTableau.RK4,
    RKF45: ButcherTableau.RKF45,
    RKDP: ButcherTableau.RKDP,
};

// Methods that support adaptive step (have vb2)
const adaptiveMethods = new Set(['Heun', 'RKF45', 'RKDP']);

class FatSplineSceneODE {
    container: HTMLDivElement;
    camera!: THREE.Camera;
    scene!: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[];
    animationRequestID: number | null = null;
    lastTime: number = 0;
    gui: any;
    isStopped: boolean = false;
    controls!: OrbitControls;

    splineGroup!: FatUCBSplineGroup;
    splineObject!: THREE.Object3D;

    // ODE solving settings
    currentSystem: 'thomas' | 'bouali' = 'bouali';
    t0: number = 0;
    t1: number = 500;          // integration time
    atol: number = 1e-9;
    rtol: number = 1e-7;
    stepNum: number = 10000;    // number of fixed steps (if adaptive=false)
    adaptive: boolean = true;    // use adaptive step control?
    methodName: string = 'RKDP'; // current method name

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
        this.resizeRenderer();
        this.createGUI();

        this.animate = this.animate.bind(this);
        this.animate();
    }

    resizeRenderer() {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const { clientWidth, clientHeight } = this.container;
        this.renderer.setSize(clientWidth, clientHeight);
        const aspect = clientWidth / clientHeight;
        if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
        }
        this.splineGroup?.setResolution(this.renderer);
    }

    setupResizeRenderer() {
        const resizeObserver = new ResizeObserver(() => this.resizeRenderer());
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

        // Parameters object with helpers for logarithmic sliders
        const params = {
            system: this.currentSystem,
            method: this.methodName,
            adaptive: this.adaptive,
            t_end: this.t1,
            // For log scale: store exponent, convert in onChange
            steps_log: Math.log10(this.stepNum),
            atol_log: Math.log10(this.atol),
            rtol_log: Math.log10(this.rtol),
            recompute: () => this.computeAndDisplaySpline(),
        };

        // System selection
        this.gui.add(params, 'system', ['thomas', 'bouali']).name('System').onChange((val: 'thomas' | 'bouali') => {
            this.currentSystem = val;
            this.computeAndDisplaySpline();
        });

        // Method selection (affects adaptive capability)
        const methodCtrl = this.gui.add(params, 'method', Object.keys(methodMap)).name('Integrator').onChange((val: string) => {
            this.methodName = val;
            const supportsAdaptive = adaptiveMethods.has(val);
            // If current adaptive mode not supported, force fixed step
            if (this.adaptive && !supportsAdaptive) {
                this.adaptive = false;
                params.adaptive = false;
                adaptiveCtrl.setValue(false);
            }
            // Update adaptive checkbox enable state
            adaptiveCtrl.disable(!supportsAdaptive);
            // Update visibility of step/tolerance controls
            this.updateGUIVisibility();
            this.computeAndDisplaySpline();
        });

        // Adaptive checkbox (disabled if method doesn't support it)
        const adaptiveCtrl = this.gui.add(params, 'adaptive').name('Adaptive step').onChange((val: boolean) => {
            if (val && !adaptiveMethods.has(this.methodName)) {
                console.warn(`${this.methodName} does not support adaptive stepping. Keeping fixed step.`);
                params.adaptive = false;
                adaptiveCtrl.setValue(false);
                return;
            }
            this.adaptive = val;
            this.updateGUIVisibility();
            this.computeAndDisplaySpline();
        });
        // Initially disable if method doesn't support adaptive
        adaptiveCtrl.disable(!adaptiveMethods.has(this.methodName));

        // Integration time
        this.gui.add(params, 't_end', 100, 10000, 10).name('End time (t1)').onChange((val: number) => {
            this.t1 = val;
            this.computeAndDisplaySpline();
        });

        // Fixed-step settings (only visible when adaptive = false)
        const stepsCtrl = this.gui.add(params, 'steps_log', 2, 6, 0.05).name('log10(steps)').onChange((val: number) => {
            this.stepNum = Math.floor(Math.pow(10, val));
            if (!this.adaptive) this.computeAndDisplaySpline();
        });
        stepsCtrl.disable(this.adaptive); // start disabled if adaptive true

        // Adaptive tolerance settings (only visible when adaptive = true)
        const atolCtrl = this.gui.add(params, 'atol_log', -12, -3, 0.1).name('log10(atol)').onChange((val: number) => {
            this.atol = Math.pow(10, val);
            if (this.adaptive) this.computeAndDisplaySpline();
        });
        const rtolCtrl = this.gui.add(params, 'rtol_log', -12, -3, 0.1).name('log10(rtol)').onChange((val: number) => {
            this.rtol = Math.pow(10, val);
            if (this.adaptive) this.computeAndDisplaySpline();
        });
        atolCtrl.disable(!this.adaptive);
        rtolCtrl.disable(!this.adaptive);

        // Recompute button
        this.gui.add(params, 'recompute').name('Recompute trajectory');

        // Animation controls (separate folder)
        const animFolder = this.gui.addFolder('Animation');
        animFolder.open();
        const animateButton = () => {
            const temp = this.isStopped;
            this.isStopped = false;
            this.animateStep();
            this.isStopped = temp;
        };
        const toggleStop = () => { this.isStopped = !this.isStopped; };
        animFolder.add({ animateButton }, 'animateButton').name('Animate step');
        animFolder.add({ toggleStop }, 'toggleStop').name('Toggle stop/play');

        // Store controllers for later visibility toggling
        this.adaptiveControllers = { stepsCtrl, atolCtrl, rtolCtrl, adaptiveCtrl, methodCtrl };
        this.updateGUIVisibility();

        this.gui.close();
    }

    // Store GUI controllers for dynamic visibility
    adaptiveControllers: any;

    updateGUIVisibility() {
        if (!this.adaptiveControllers) return;
        const { stepsCtrl, atolCtrl, rtolCtrl } = this.adaptiveControllers;
        // Show/hide by enabling/disabling (disabling makes it grey but still visible – good enough)
        stepsCtrl.disable(this.adaptive);      // steps visible only when adaptive == false
        atolCtrl.disable(!this.adaptive);      // tolerances visible only when adaptive == true
        rtolCtrl.disable(!this.adaptive);
    }

    dispose() {
        if (this.animationRequestID !== null) cancelAnimationFrame(this.animationRequestID);
        this.splineGroup?.dispose();
        this.container.removeChild(this.renderer.domElement);
        this.cleanUpTasks.forEach(task => task());
        this.renderer.dispose();
        this.gui.destroy();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(2, 2, 3);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.splineGroup = new FatUCBSplineGroup(32);
        this.splineObject = this.splineGroup.getObject();
        this.scene.add(this.splineObject);
        // Initial trajectory
        this.computeAndDisplaySpline();
    }

    // Solve the current ODE and create a spline from the trajectory
    computeAndDisplaySpline() {
        // Choose ODE function and initial condition
        let odeFunc: (t: number, y: number[]) => number[];
        let y0: number[];
        let scaleFactors = [1, 1, 1];

        if (this.currentSystem === 'thomas') {
            odeFunc = thomasAttractor;
            y0 = [-0.1, 0.1, 0.1];
            scaleFactors = [0.4, 0.4, 0.4];
        } else { // bouali
            odeFunc = boualiSystem;
            y0 = [1, 1, 0];
            scaleFactors = [0.3, 0.3, 10];
        }

        // Get the selected Butcher tableau
        const tableau = methodMap[this.methodName];
        if (!tableau) {
            console.error(`Unknown method: ${this.methodName}`);
            return;
        }

        // Create solver
        const solver = new ODESolver(odeFunc, tableau);

        let points: THREE.Vector3[] = [];

        if (this.adaptive) {
            // Adaptive solve (requires vb2)
            if (!tableau.vb2) {
                console.error(`${this.methodName} does not support adaptive stepping. Falling back to fixed step.`);
                // fallback to fixed step with a reasonable stepNum
                const stepNum = Math.max(1000, Math.floor((this.t1 - this.t0) / 0.05));
                const h = (this.t1 - this.t0) / stepNum;
                let y = y0;
                let t = this.t0;
                const pointsList: THREE.Vector3[] = [];
                for (let i = 0; i <= stepNum; i++) {
                    pointsList.push(new THREE.Vector3(y[0] * scaleFactors[0], y[1] * scaleFactors[1], y[2] * scaleFactors[2]));
                    if (i < stepNum) {
                        y = solver.step(y, t, t + h);
                        t += h;
                    }
                }
                points = pointsList;
            } else {
                try {
                    const result = solver.adaptiveSolve(y0, this.t0, this.t1, this.atol, this.rtol);
                    points = result.ys.map(state => new THREE.Vector3(
                        state[0] * scaleFactors[0],
                        state[1] * scaleFactors[1],
                        state[2] * scaleFactors[2]
                    ));
                } catch (err) {
                    console.error('Adaptive integration failed:', err);
                    return;
                }
            }
        } else {
            // Fixed step solve
            const h = (this.t1 - this.t0) / this.stepNum;
            let y = y0;
            let t = this.t0;
            const pointsList: THREE.Vector3[] = [];
            for (let i = 0; i <= this.stepNum; i++) {
                pointsList.push(new THREE.Vector3(y[0] * scaleFactors[0], y[1] * scaleFactors[1], y[2] * scaleFactors[2]));
                if (i < this.stepNum) {
                    y = solver.step(y, t, t + h);
                    t += h;
                }
            }
            points = pointsList;
        }

        if (points.length === 0) return;

        // Clear previous splines and add the new one
        this.splineGroup.reset();

        const numPoints = points.length;
        this.splineGroup.addSpline(
            points,
            (k: number) => {
                // Color cycles through hue
                const hue = (1 / 10 * k) % 1.0;
                return [hue, 0.5, 0.8];
            },
            (k: number) => {
                // Radii: constant small tube
                return [0.002, 3.0];
            },
            false,   // closed?
            true,
            true
        );

        console.log(`ODE solved with ${numPoints} points, t_end = ${this.t1}, method=${this.methodName}, adaptive=${this.adaptive}`);
    }

    getResolution() {
        return new THREE.Vector2(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        this.animateStep();
    }

    animateStep() {
        const currentTime = (this.lastTime ?? 0.0) + (this.isStopped ? 0.0 : 1.0);
        this.lastTime = currentTime;
        const t = this.lastTime * 0.001;

        // Optional: add a gentle rotation to the whole scene for visual flair
        this.splineObject.setRotationFromEuler(new THREE.Euler(
            0.02 * Math.sin(30 * t),
            0.02 * Math.cos(30 * t),
            Math.PI / 2
        ));

        this.renderer.render(this.scene, this.camera);
    }
}

export { FatSplineSceneODE };