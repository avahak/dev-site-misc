import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { UCBSplineGroup } from './UCBSpline';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

function randomColor(k: number) {
    const f = (j: number) => 1 - Math.sin(Math.PI*2*j)**2;
    return [f(3*k+42), f(2*k+51), f(k+73)];
}

class SplineScene {
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

    splineGroup!: UCBSplineGroup;
    splineObject!: THREE.Object3D;

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

        this.cleanUpTasks.push(() => { 
            if (this.animationRequestID)
                cancelAnimationFrame(this.animationRequestID);
            this.splineGroup.dispose();
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
        // this.shader.uniforms.resolution.value = new THREE.Vector2(clientWidth, clientHeight);
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

    dispose() {
        this.container.removeChild(this.renderer.domElement);
        for (const task of this.cleanUpTasks)
            task();
        this.renderer.dispose();

        this.gui.destroy();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(0, 0.2, 1.0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.controls.update();
    }

    fillSplineGroup1(t: number, reset: boolean) {
        if (reset)
            this.splineGroup.reset();
        for (let j = 0; j < 1000; j++) {
            const pList = [];
            const num = Math.floor(4 + (1.0+Math.sin(-10*j))*50);
            for (let k = 0; k < num; k++) {
                // const p = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
                const p = new THREE.Vector3(Math.sin(k+t-10*j), Math.sin(k*3.15+2*t+100*j), Math.sin(k*2.1+3*t+51.2*j));
                p.normalize();
                p.multiplyScalar(0.3);
                pList.push(p);
            }
            this.splineGroup.addSpline(pList, (k) => randomColor(j + k/num));
        }
    }

    fillSplineGroup2(t: number, reset: boolean) {
        if (reset)
            this.splineGroup.reset();
    
        const R = 0.3; // Major radius (distance from center to tube center)
        const r = 0.2; // Minor radius (radius of the tube)
    
        const n = 50;
        for (let j = 0; j < n; j++) {
            const pList = [];
            for (let k = 0; k < n; k++) {
                const sj = 0.75*j;
                const sk = 2.0*k;
                const st = 10.0*t;
                const u = 0.0025*sk + 0.04*Math.cos(5.2*sj + 0.5*3.6*sk + 0.1*st);
                const v = 0.005*j + 0.05*Math.sin(7.3*sj + 0.5*2.1*sk + 0.2*st);
    
                const uOffset = 0.0202*(1.41*(sj+1.1*st) + 2.12*(5*sk+3.5*st));
                const vOffset = 0.0406*(0.76*(sj+2.0*st) + 4.27*(5*sk+3.6*st));
    
                const x = (R + r * Math.cos(v + vOffset)) * Math.cos(u + uOffset);
                const y = (R + r * Math.cos(v + vOffset)) * Math.sin(u + uOffset);
                const z = r * Math.sin(v + vOffset);

                const p = new THREE.Vector3(x, y, z);
                pList.push(p);
            }
            this.splineGroup.addSpline(pList, (k) => randomColor(0.02*(j + k/n)));
        }
    }

    fillSplineGroup3(t: number, mode: number, reset: boolean) {
        // Hopf fibration
        if (reset)
            this.splineGroup.reset();

        function hopfFiber(p: THREE.Vector3, t: number) {
            // Computes the preimage of p under the Hopf fibration, parameterized by t
            // 2*z0*z1^* = (p.x,p.y)
            // |z0|^2 - |z1|^2 = p.z
            const R = Math.sqrt(p.x*p.x + p.y*p.y);
            const r0 = Math.sqrt((p.z + Math.sqrt(p.z*p.z + R*R)) / 2);
            const r1 = R / (2*r0);
            const phi = Math.atan2(p.y, p.x);
            const theta0 = t*2.0*Math.PI + phi;
            const theta1 = t*2.0*Math.PI;
            return new THREE.Vector4(r0*Math.cos(theta0), r0*Math.sin(theta0), r1*Math.cos(theta1), r1*Math.sin(theta1));
        }

        function stereographicProjection(p: THREE.Vector4) {
            // Stereographic projection S^3 -> \R^3
            const r = p.length();
            // Check that p is unit vector
            if (Math.abs(r-1.0) > 1.0e-9)
                return null;
            return new THREE.Vector3(p.y/(1.0-p.x), p.z/(1.0-p.x), p.w/(1.0-p.x));
        }

        // Generate circles of latitude on S^2, map them to toruses via taking the fibres
        // of all points on given latitude on S^3 and mapping them to R^3 via 
        // stereographic projection.
        const TAU = 2.0*Math.PI;

        if (mode == 0) {
            const z = 0.98*Math.sin(10.0*t);
            for (let m = 0; m < 2; m++) {
                for (let sj = 0; sj < 1.0; sj += 1/100*(m == 0 ? 1 : 50)) {
                    const pList = [];
                    for (let sk = 0; sk < 1.0; sk += 1/60) {
                        const r = Math.sqrt(1.0 - z*z);
                        const theta = sj*TAU;
                        const q = new THREE.Vector3(r*Math.cos(theta), r*Math.sin(theta), (2*m-1)*z);
                        const p = stereographicProjection(hopfFiber(q, sk));
                        if (p == null)
                            return;
                        p.multiplyScalar(0.2);
                        pList.push(p);
                    }
                    this.splineGroup.addSpline(pList, (k) => randomColor(m*100 + sj), true);
                }
            }
        } else if (mode == 1) {
            const M = 20;
            const K = 400;
            for (let m = 0; m < M; m++) {
                const sm = m / M;
                const pList = [];
                for (let k = 0; k < K; k++) {
                    const sk = k / K;

                    const z = -0.4 + 0.5*Math.cos(0.1*sm*TAU + 3*sk*TAU + 10*t);
                    const theta = 1*sm*TAU + 20*sk*TAU;

                    const r = Math.sqrt(1.0 - z*z);
                    const q = new THREE.Vector3(r*Math.cos(theta), r*Math.sin(theta), z);
                    const p = stereographicProjection(hopfFiber(q, sk));
                    if (p == null)
                        return;
                    p.multiplyScalar(0.3);
                    pList.push(p);
                }
                this.splineGroup.addSpline(pList, (k) => randomColor(K*sm + k/K), true);
            }
        } else if (mode == 2) {
            const I = 4;
            const K = 10;
            for (let i = 0; i < I; i++) {
                const si = i / I;
                const M = 200;
                for (let m = 0; m < M; m++) {
                    const sm = m / M;
                    const pList = [];
                    for (let k = 0; k < K; k++) {
                        const sk = k / K;

                        const z = -0.1+0.89*Math.cos(((i*113) % I)/I*TAU + 3*t);
                        const theta = sm*TAU;

                        const r = Math.sqrt(1.0 - z*z);
                        const q = new THREE.Vector3(r*Math.cos(theta), r*Math.sin(theta), z);
                        const p = stereographicProjection(hopfFiber(q, 0.5*t+si+sk/I));
                        if (p == null)
                            return;
                        p.multiplyScalar(0.1);
                        pList.push(p);
                    }
                    this.splineGroup.addSpline(pList, (k) => randomColor(si + sm));
                }
            }
        } else if (mode == 3) {
            const I = 3;
            const K = 64;
            for (let i = 0; i < I; i++) {
                const M = 128;
                for (let m = 0; m < M; m++) {
                    const sm = m / M;
                    const pList = [];
                    for (let k = 0; k < K; k++) {
                        const sk = k / K;

                        const z = [-0.85, 0.1, 0.7][i];
                        const theta = -0.5+0.7*sm*TAU;

                        const r = Math.sqrt(1.0 - z*z);
                        const q = new THREE.Vector3(r*Math.cos(theta), r*Math.sin(theta), z);
                        const p = stereographicProjection(hopfFiber(q, sk));
                        if (p == null)
                            return;
                        p.multiplyScalar(0.2);
                        
                        const omega = 0.05*Math.sin(30*t);
                        pList.push(new THREE.Vector3(p.x, Math.cos(omega)*p.y-Math.sin(omega)*p.z, Math.sin(omega)*p.y+Math.cos(omega)*p.z));
                    }
                    this.splineGroup.addSpline(pList, (k) => randomColor(sm), true);
                }
            }
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();

        this.splineGroup = new UCBSplineGroup();
        this.fillSplineGroup3(0, 3, true);

        this.splineObject = this.splineGroup.getObject();
        this.splineObject.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/2);
        this.scene.add(this.splineObject);
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        this.animateStep();
    }

    animateStep() {
        const currentTime = (this.lastTime ?? 0.0) + (this.isStopped ? 0.0 : 1.0);
        this.lastTime = currentTime;

        const t = this.lastTime*0.001;

        // this.fillSplineGroup1(t, true);
        // this.fillSplineGroup2(t, true);
        // this.fillSplineGroup3(t, 3, true);

        // this.splineObject.setRotationFromEuler(new THREE.Euler(3.0+3.0*t, 2.0+5.0*t, 5.0+2.0*t));
        this.splineObject.setRotationFromEuler(new THREE.Euler(0.02*Math.sin(30*t), 0.02*Math.cos(30*t), Math.PI/2));

        this.renderer.render(this.scene, this.camera);
    }
}

export { SplineScene };