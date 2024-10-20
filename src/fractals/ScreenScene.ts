import * as THREE from 'three';
import vsGeneric from './shaders/vsGeneric.glsl?raw';
import fsScreen from './shaders/fsScreen.glsl?raw';
import { MandelbrotScene } from './mandelbrotScene';
import { JuliaWorkOrder, MandelbrotMode, MandelbrotWorkOrder } from './types';
import { JuliaScene } from './juliaScene';
import { drawAxis, roundNumber } from './axis';

/**
 * Minimum scale beyond which we run into precision issues with GLSL highp float.
 */
const MIN_SCALE = 0.00005;

class ScreenScene {
    container: HTMLDivElement;
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    cleanUpTasks: (() => void)[];
    animationRequestID: number|null = null;
    lastTime: number|null = null;
    isStopped: boolean = false;

    mandelbrotScene: MandelbrotScene;
    mandelbrotStage!: number;

    juliaScene: JuliaScene;
    juliaStage!: number;

    showJulia: boolean = true;
    mandelbrotMode: MandelbrotMode = "basic";

    shader: THREE.ShaderMaterial|null = null;

    z0: [number, number] = [-0.5, 0.0];
    zoomCenter: [number, number] = [-0.5, 0.0];
    zoomScale: number = 1.0;

    overlayCanvas: HTMLCanvasElement;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        // Create the canvas overlay
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.style.position = 'absolute';
        this.overlayCanvas.style.top = '0';
        this.overlayCanvas.style.left = '0';
        this.overlayCanvas.style.width = '100%';
        this.overlayCanvas.style.height = '100%';
        this.overlayCanvas.style.pointerEvents = 'none';
        container.appendChild(this.overlayCanvas);

        // TODO remove?
        const gl = this.renderer.getContext();
        gl.getExtension('EXT_float_blend');

        this.scene = this.setupScene();
        this.camera = this.setupCamera();
        
        this.mandelbrotScene = new MandelbrotScene(container);
        this.resetMandelbrotStage();

        this.juliaScene = new JuliaScene(container);
        this.resetJuliaStage();

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
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        const { clientWidth, clientHeight } = this.container;
        this.overlayCanvas.width = clientWidth;
        this.overlayCanvas.height = clientHeight;
        this.renderer.setSize(clientWidth, clientHeight);
        console.log(`Resize! (${clientWidth}, ${clientHeight})`);
        const aspect = clientWidth / clientHeight;
        const [dx, dy] = [aspect > 1.5 ? aspect : 1.5, aspect > 1.5 ? 1.0 : 1.5/aspect];
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.top = dy;
            this.camera.bottom = -dy;
            this.camera.left = -dx;
            this.camera.right = dx;
            this.camera.updateProjectionMatrix();
        }
        this.shader!.uniforms.resolution.value = this.getResolution();
        this.mandelbrotScene?.resize();
        this.resetMandelbrotStage();
        this.juliaScene?.resize();
        this.resetJuliaStage();
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
    }

    setupScene() {
        const scene = new THREE.Scene();

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                accumulatorMap1: { value: null },
                accumulatorMap2: { value: null },
                resolution: { value: null },
                showJulia: { value: null },
                showMandelbrot: { value: null },
                time: { value: 0 }
            },
            vertexShader: vsGeneric,
            fragmentShader: fsScreen,
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.shader);
        scene.add(mesh);

        return scene;
    }

    setupCamera() {
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.set(0, 0, 1);
        camera.lookAt(0, 0, 0);
        return camera;
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    saveAsImage(defaultName: string) {
        const canvas = this.renderer.domElement;
        const dataURL = canvas.toDataURL('image/png');

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = defaultName + '.png';

        // Trigger the download by programmatically clicking the link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    resetMandelbrotStage() {
        this.mandelbrotStage = 0;
        this.progressMandelbrotStage();
    }

    resetJuliaStage() {
        this.juliaStage = 0;
        this.progressJuliaStage();
    }

    progressMandelbrotStage() {
        if (this.mandelbrotStage >= 3)
            return;
        const workOrder: MandelbrotWorkOrder = { 
            zoomCenter: this.zoomCenter, 
            zoomScale: this.zoomScale, 
            iterations: [1, 16, 64][this.mandelbrotStage], 
            samplesPerAxis: [1, 1, 7][this.mandelbrotStage], 
        };
        this.mandelbrotScene.assignWork(workOrder);
        this.mandelbrotStage++;
    }

    progressJuliaStage() {
        if (this.juliaStage >= 3)
            return;
        const workOrder: JuliaWorkOrder = { 
            c: this.z0,
            zoomScale: this.zoomScale, 
            iterations: [1, 16, 64][this.juliaStage], 
            samplesPerAxis: [1, 1, 7][this.juliaStage], 
        };
        this.juliaScene.assignWork(workOrder);
        this.juliaStage++;
    }

    pointerInput(dx: number, dy: number, scale: number, angle: number) {
        // console.log(dx, dy, scale, angle);
        const res = this.getResolution();
        const aspect = res.x / res.y;
        const [adx, ady] = [aspect > 1.5 ? aspect : 1.5, aspect > 1.5 ? 1.0 : 1.5/aspect];
        this.zoomCenter = [this.zoomCenter[0]-this.zoomScale*2.0*adx*dx/res.x, this.zoomCenter[1]+this.zoomScale*2.0*ady*dy/res.y];
        this.zoomScale = Math.max(this.zoomScale*scale, MIN_SCALE);
        this.resetMandelbrotStage();
    }

    pointerMove(x: number, y: number) {
        const res = this.getResolution();
        const aspect = res.x / res.y;
        const [adx, ady] = [aspect > 1.5 ? aspect : 1.5, aspect > 1.5 ? 1.0 : 1.5/aspect];
        const w = [adx*(x/res.x-0.5), ady*(y/res.y-0.5)];
        this.z0 = [this.zoomCenter[0]+2.0*this.zoomScale*w[0], this.zoomCenter[1]-2.0*this.zoomScale*w[1]];
        this.resetJuliaStage();
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        this.animateStep(this.isStopped);
    }

    animateStep(isStopped: boolean) {
        const currentTime = (this.lastTime ?? 0.0) + (isStopped ? 0.0 : 0.01);
        this.lastTime = currentTime;

        if (this.mandelbrotMode !== "off") {
            const isMandelbrotDone = this.mandelbrotScene.step(this.renderer);
            if (isMandelbrotDone)
                this.progressMandelbrotStage();
        }

        if (this.showJulia) {
            const isJuliaDone = this.juliaScene.step(this.renderer);
            if (isJuliaDone)
                this.progressJuliaStage();
        }

        this.shader!.uniforms.accumulatorMap1.value = this.mandelbrotScene.getCurrentAccumulatorFboTexture();
        this.shader!.uniforms.accumulatorMap2.value = this.juliaScene.getCurrentAccumulatorFboTexture();
        this.shader!.uniforms.showJulia.value = this.showJulia ? 1 : 0;
        this.shader!.uniforms.showMandelbrot.value = this.mandelbrotMode === "off" ? 0 : 1;
        this.renderer.render(this.scene, this.camera);

        const context = this.overlayCanvas.getContext('2d');
        if (context) {
            const res = this.getResolution();
            context.clearRect(0, 0, res.x, res.y);
            if (this.mandelbrotMode !== "off") {
                drawAxis({ 
                    context, 
                    width: res.x, 
                    height: res.y, 
                    tMin: this.mandelbrotScene.box[0],
                    tMax: this.mandelbrotScene.box[2],
                    orientation: "horizontal",
                    color: this.showJulia ? "rgba(100, 100, 100, 1.0)" : "white",
                });
                drawAxis({ 
                    context, 
                    width: res.x, 
                    height: res.y, 
                    tMin: this.mandelbrotScene.box[1],
                    tMax: this.mandelbrotScene.box[3],
                    orientation: "vertical",
                    color: this.showJulia ? "rgba(100, 100, 100, 1.0)" : "white",
                });
            }
            if (this.showJulia) {
                context.strokeStyle = 'white';
                context.fillStyle = 'white';
                context.font = '12px Arial';
                context.textAlign = 'right';
                context.textBaseline = 'top';
                context.fillText(`Julia z0 = (${roundNumber(this.z0[0])}, ${roundNumber(this.z0[1])})`, res.x-50, 10);
            }
        }
    }
}

export { ScreenScene };