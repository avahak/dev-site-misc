import * as THREE from 'three';
import vsScreen from './shaders/vsScreen.glsl?raw';
import fsScreen from './shaders/fsScreen.glsl?raw';
import { MandelbrotScene } from './mandelbrotScene';
import { WorkOrder } from './types';

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

    shader: THREE.ShaderMaterial|null = null;

    zoomCenter: [number, number] = [-0.5, 0.0];
    zoomScale: number = 1.0;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.cleanUpTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        // TODO remove?
        const gl = this.renderer.getContext();
        gl.getExtension('EXT_float_blend');

        this.scene = this.setupScene();
        this.camera = this.setupCamera();
        
        this.mandelbrotScene = new MandelbrotScene(container);
        this.resetMandelbrotStage();

        this.setupResizeRenderer();
        this.resizeRenderer();

        this.cleanUpTasks.push(() => { 
            if (this.animationRequestID)
                cancelAnimationFrame(this.animationRequestID);
        });
        this.animate = this.animate.bind(this);
        this.animate();

        this.handleInputs();
    }

    resizeRenderer() {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const { clientWidth, clientHeight } = this.container;
        this.renderer.setSize(clientWidth, clientHeight);
        console.log(`Resize! (${clientWidth}, ${clientHeight})`);
        const aspect = clientWidth / clientHeight;
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.top = 1;
            this.camera.bottom = -1;
            this.camera.left = -aspect;
            this.camera.right = aspect;
            this.camera.updateProjectionMatrix();
        }
        this.shader!.uniforms.resolution.value = this.getResolution();
        this.mandelbrotScene?.resize();
        this.resetMandelbrotStage();
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

    handleInputs() {
        // clicks etc.
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
                accumulatorMap: { value: null },
                resolution: { value: null },
                time: { value: 0 }
            },
            vertexShader: vsScreen,
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

    progressMandelbrotStage() {
        if (this.mandelbrotStage >= 5)
            return;
        const workOrder: WorkOrder = { 
            zoomCenter: this.zoomCenter, 
            zoomScale: this.zoomScale, 
            iterations: [5, 20, 30, 50, 50][this.mandelbrotStage], 
            samplesPerAxis: [1, 1, 2, 4, 10][this.mandelbrotStage], 
        };
        this.mandelbrotScene.assignWork(workOrder);
        this.mandelbrotStage++;
    }

    pointerInput(dx: number, dy: number, scale: number, angle: number) {
        // console.log(dx, dy, scale, angle);
        const res = this.getResolution();
        const aspect = res.x / res.y;
        this.zoomCenter = [this.zoomCenter[0]-this.zoomScale*2.0*aspect*dx/res.x, this.zoomCenter[1]+this.zoomScale*2.0*dy/res.y];
        this.zoomScale = this.zoomScale*scale;
        this.resetMandelbrotStage();
    }

    animate() {
        this.animationRequestID = requestAnimationFrame(this.animate);
        this.animateStep(this.isStopped);
    }

    animateStep(isStopped: boolean) {
        const currentTime = (this.lastTime ?? 0.0) + (isStopped ? 0.0 : 0.01);
        this.lastTime = currentTime;

        const isDone = this.mandelbrotScene.step(this.renderer);
        if (isDone) {
            this.shader!.uniforms.accumulatorMap.value = this.mandelbrotScene.getCurrentAccumulatorFboTexture();
            this.renderer.render(this.scene, this.camera);

            // console.log(`Stage ${this.mandelbrotStage} done`);
            // if (this.mandelbrotStage > 0)
            //     this.saveAsImage(`mandel_${this.mandelbrotStage}`);

            this.progressMandelbrotStage();
        }
    }
}

export { ScreenScene };