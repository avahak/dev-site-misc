import * as THREE from 'three';
import vsGeneric from './shaders/vsGeneric.glsl?raw';
import fsDemJ from './shaders/fsDemJ.glsl?raw';
import fsAccDemJ from './shaders/fsAccDemJ.glsl?raw';
import { JuliaWorkOrder, JuliaWorkProgress } from './types';

class JuliaScene {
    container: HTMLDivElement;
    camera!: THREE.Camera;

    fbosJulia: THREE.WebGLRenderTarget[] = [];
    fbosAccumulator: THREE.WebGLRenderTarget[] = [];
    currentFboIndexJulia: number = 0;    // latest computed fbo index
    currentFboIndexAccumulator: number = 0;    // latest computed fbo index
    disposeFbos: () => void;

    sceneJulia!: THREE.Scene;
    sceneAccumulator!: THREE.Scene;
    shaderJulia!: THREE.ShaderMaterial;
    shaderAccumulator!: THREE.ShaderMaterial;

    workProgress: JuliaWorkProgress|null = null;

    constructor(container: HTMLDivElement) {
        this.container = container;

        this.setupJuliaScene();
        this.setupAccumulatorScene();
        this.setupCamera();
        
        this.disposeFbos = () => {
            this.fbosJulia.forEach((fbo) => fbo.dispose());
            this.fbosAccumulator.forEach((fbo) => fbo.dispose());
        };

        this.resize();
    }

    resize() {
        const { clientWidth, clientHeight } = this.container;
        const aspect = clientWidth / clientHeight;
        const [dx, dy] = [aspect > 1.5 ? aspect : 1.5, aspect > 1.5 ? 1.0 : 1.5/aspect];
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.top = dy;
            this.camera.bottom = -dy;
            this.camera.left = -dx;
            this.camera.right = dx;
            this.camera.updateProjectionMatrix();
        }
        this.setupFbos();
        this.shaderJulia.uniforms.resolution.value = this.getResolution();
        this.shaderAccumulator.uniforms.resolution.value = this.getResolution();
        this.setViewBoxUniforms();
    }

    setupFbos() {
        this.disposeFbos();
        this.currentFboIndexJulia = 0;
        this.currentFboIndexAccumulator = 0;
        for (let k = 0; k < 2; k++)
            this.fbosJulia.push(this.createRenderTarget());
        for (let k = 0; k < 2; k++)
            this.fbosAccumulator.push(this.createRenderTarget());
    }

    createRenderTarget(componentCount: 1|2|4=4) {
        const { clientWidth, clientHeight } = this.container;
        const renderTarget = new THREE.WebGLRenderTarget(clientWidth, clientHeight, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
            format: [THREE.RedFormat, THREE.RGFormat, THREE.RGBAFormat][componentCount],
            type: THREE.FloatType
        });
        return renderTarget;
    }

    setupJuliaScene() {
        this.sceneJulia = new THREE.Scene();

        this.shaderJulia = new THREE.ShaderMaterial({
            uniforms: {
                box: { value: null },
                c: { value: null },
                subpixelOffset: { value: null },
                juliaMap: { value: null },         // texture for iteration state
                resolution: { value: null },
                restart: { value: 1 },
            },
            vertexShader: vsGeneric,
            fragmentShader: fsDemJ,
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.shaderJulia);
        this.sceneJulia.add(mesh);
    }

    setupAccumulatorScene() {
        this.sceneAccumulator = new THREE.Scene();

        this.shaderAccumulator = new THREE.ShaderMaterial({
            uniforms: {
                juliaMap: { value: null },
                accumulatorMap: { value: null },
                resolution: { value: null },
                restart: { value: 1 },
            },
            vertexShader: vsGeneric,
            fragmentShader: fsAccDemJ,
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.shaderAccumulator);
        this.sceneAccumulator.add(mesh);
    }

    setupCamera() {
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);
    }

    getResolution() {
        const { clientWidth, clientHeight } = this.container;
        return new THREE.Vector2(clientWidth, clientHeight);
    }

    private setViewBoxUniforms() {
        if (!this.workProgress)
            return;

        const { clientWidth, clientHeight } = this.container;
        const aspect = clientWidth/clientHeight;
        const [dx, dy] = [aspect > 1.5 ? aspect : 1.5, aspect > 1.5 ? 1.0 : 1.5/aspect];

        this.shaderJulia.uniforms.box.value = [-dx, -dy, dx, dy];
    }

    assignWork(workOrder: JuliaWorkOrder) {
        this.workProgress = { 
            ...workOrder, 
            currentIteration: 0, 
            currentSample: 0, 
            isComplete: false 
        };
        this.setViewBoxUniforms();
    }

    getCurrentJuliaFboTexture() {
        return this.fbosJulia[this.currentFboIndexJulia].texture;
    }

    getCurrentAccumulatorFboTexture() {
        return this.fbosAccumulator[this.currentFboIndexAccumulator].texture;
    }

    getSubpixelOffset(sample: number, samplesPerAxis: number): [number, number] {
        // shuffle the samples a bit
        const prime = 1579;
        const halfish = Math.floor(samplesPerAxis/2)*(samplesPerAxis+1);
        const sampleShuffled = (sample*prime + halfish) % (samplesPerAxis*samplesPerAxis);

        const x = (sampleShuffled%samplesPerAxis) / samplesPerAxis;
        const y = Math.floor(sampleShuffled/samplesPerAxis) / samplesPerAxis;
        return [x+0.5/samplesPerAxis, y+0.5/samplesPerAxis];
    }

    iterateJulia(renderer: THREE.WebGLRenderer, restart: boolean, subpixelOffset: [number, number]) {
        const [i0, i1] = [this.currentFboIndexJulia, (this.currentFboIndexJulia+1)%2];

        this.shaderJulia.uniforms.juliaMap.value = this.fbosJulia[i0].texture;
        this.shaderJulia.uniforms.subpixelOffset.value = subpixelOffset;
        this.shaderJulia.uniforms.restart.value = restart ? 1 : 0;
        this.shaderJulia.uniforms.c.value = this.workProgress?.c;

        renderer.setRenderTarget(this.fbosJulia[i1]);
        renderer.render(this.sceneJulia, this.camera);
        renderer.setRenderTarget(null);

        this.currentFboIndexJulia = i1;
    }

    accumulateSample(renderer: THREE.WebGLRenderer, restart: boolean) {
        const [i0, i1] = [this.currentFboIndexAccumulator, (this.currentFboIndexAccumulator+1)%2];

        this.shaderAccumulator.uniforms.juliaMap.value = this.getCurrentJuliaFboTexture();
        this.shaderAccumulator.uniforms.accumulatorMap.value = this.fbosAccumulator[i0].texture;
        this.shaderAccumulator.uniforms.restart.value = restart ? 1 : 0;

        renderer.setRenderTarget(this.fbosAccumulator[i1]);
        renderer.render(this.sceneAccumulator, this.camera);
        renderer.setRenderTarget(null);

        this.currentFboIndexAccumulator = i1;
    }

    /**
     * Returns true when work finishes.
     */
    step(renderer: THREE.WebGLRenderer): boolean {
        if (!this.workProgress || this.workProgress.isComplete)
            return false;

        const offset = this.getSubpixelOffset(this.workProgress.currentSample, this.workProgress.samplesPerAxis);
        this.iterateJulia(renderer, this.workProgress.currentIteration === 0, offset);
        this.workProgress.currentIteration++;

        if (this.workProgress.currentIteration >= this.workProgress.iterations) {
            this.accumulateSample(renderer, this.workProgress.currentSample === 0);
            this.workProgress.currentIteration = 0;
            this.workProgress.currentSample++;
        }
        if (this.workProgress.currentSample >= this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis) {
            this.workProgress.isComplete = true;
            return true;
        }
        return false;
    }
}

export { JuliaScene };