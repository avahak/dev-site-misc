import * as THREE from 'three';
import { GraphController, GraphProps } from "./types";
import { PlaneView } from './planeView';
import { createGroup } from './graphGroup';
import { LineMaterial } from 'three/examples/jsm/Addons.js';
import { GraphDecorator } from './graphDecorator';
import { TextGroup } from '../primitives/textRender';
import { MCSDFFont } from '../primitives/font';
import { SharedResource } from './sharedResource';

class GraphRenderer {
    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;

    lastWidth: number;
    lastHeight: number;
    lastDpr: number;
    
    renderer: THREE.WebGLRenderer;
    graphDecorator: GraphDecorator;

    camera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    cleanupTasks: (() => void)[];
    controller!: GraphController;
    loc: PlaneView;

    dataGroup: THREE.Group;
    lineMaterials: LineMaterial[];
    textGroup: TextGroup;               // this pool of text is redrawn every time
    animationFrameHandle: number = 0;

    props: GraphProps;
    

    constructor(container: HTMLDivElement, fonts: MCSDFFont[], props: GraphProps) {
        this.container = container;
        this.props = props;
        this.cleanupTasks = [];
        this.renderer = SharedResource.acquire('webgl-renderer', () => new THREE.WebGLRenderer({ antialias: true, alpha: true }));
        this.graphDecorator = SharedResource.acquire('axis-renderer', () => new GraphDecorator());

        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'block';
        this.canvasContext = this.canvas.getContext("2d", { willReadFrequently: false })!;
        container.appendChild(this.canvas);
        this.lastDpr = -1;
        this.lastWidth = -1;
        this.lastHeight = -1;

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        const cg = createGroup(props.data);        // this takes ~100ms for 100k points
        this.dataGroup = cg.group;
        this.lineMaterials = cg.lineMaterials;
        this.cleanupTasks.push(...cg.cleanupTasks);

        this.scene = new THREE.Scene();
        this.scene.add(this.dataGroup);

        this.textGroup = new TextGroup(fonts[0]);
        this.scene.add(this.textGroup.getObject());

        this.loc = new PlaneView(() => this.getResolution(), false);
        if (props.location) {
            this.loc.x = props.location.x;
            this.loc.y = props.location.y;
            this.loc.scaleX = props.location.scaleX;
            this.loc.scaleY = props.location.scaleY;
        }

        this.setupResize();
        this.setupController();
        this.resize();
    }

    resize() {
        const [clientWidth, clientHeight] = this.getResolution();
        const dpr = Math.min(window.devicePixelRatio, 2);

        if (clientWidth === 0 || clientHeight === 0)
            return;
        if (this.lastWidth === clientWidth && this.lastHeight === clientHeight && this.lastDpr === dpr) 
            return;

        this.lastDpr = dpr;
        this.lastWidth = clientWidth;
        this.lastHeight = clientHeight;

        this.canvas.width = clientWidth * dpr;
        this.canvas.height = clientHeight * dpr;
        this.canvas.style.width = `${clientWidth}px`;
        this.canvas.style.height = `${clientHeight}px`;

        const aspect = clientWidth / clientHeight;
        this.camera.left = -aspect;
        this.camera.right = aspect;
        this.camera.updateProjectionMatrix();

        this.lineMaterials.forEach((m) => {
            m.resolution.copy(new THREE.Vector2(clientWidth, clientHeight));
            m.needsUpdate = true;
        });

        console.log('Resize', clientWidth, clientHeight);
        this.controller.update();
    }

    setupResize() {
        const resizeObserver = new ResizeObserver(() => this.resize());
        resizeObserver.observe(this.container);
        this.cleanupTasks.push(() => resizeObserver.disconnect());
    }

    getResolution(): number[] {
        return [this.container.clientWidth, this.container.clientHeight];
    }

    setupController() {
        const renderer = this;
        this.controller = {
            transform(x: number, y: number, dx: number, dy: number, scale: number, angle: number) {
                renderer.loc.transform(x, y, dx, dy, scale, angle);
                renderer.requestRender();
            },
            setLocation(x: number, y: number, scale: number) {
                renderer.loc.setLocation(x, y, scale, scale);
                renderer.requestRender();
            },
            update() {
                renderer.requestRender();
            },
        }
    }

    getController(): GraphController {
        return this.controller;
    }

    dispose() {
        if (this.animationFrameHandle)
            cancelAnimationFrame(this.animationFrameHandle);
        this.textGroup.dispose();
        for (const task of this.cleanupTasks)
            task();
        this.cleanupTasks = [];
        this.container.removeChild(this.canvas);
        this.canvas.width = 1;
        this.canvas.height = 1;
        SharedResource.release('webgl-renderer');
        SharedResource.release('axis-renderer');
    }

    render() {
        // console.log('GraphRenderer.render()', Math.random());

        // PROBLEM: Low precision (32-bit) in shader restricts zooming
        this.dataGroup.scale.set(1/this.loc.scaleX, 1/this.loc.scaleY, 1);
        this.dataGroup.position.set(-this.loc.x/this.loc.scaleX, -this.loc.y/this.loc.scaleY, 0);

        const [width, height] = this.getResolution();
        const group = this.graphDecorator.createGroup(this.props, this.loc, [width, height], this.textGroup);
        this.scene.add(group);

        if (this.renderer.domElement.width !== width || this.renderer.domElement.height !== height)
            this.renderer.setSize(width, height);
        if (this.renderer.pixelRatio !== this.lastDpr)
            this.renderer.setPixelRatio(this.lastDpr);
        this.renderer.render(this.scene, this.camera);
        this.canvasContext.globalCompositeOperation = 'copy';
        this.canvasContext.drawImage(this.renderer.domElement, 0, 0);
        this.canvasContext.globalCompositeOperation = 'source-over';    // back to default

        this.scene.remove(group);
        this.textGroup.reset();
    }

    requestRender() {
        if (!this.animationFrameHandle) {
            this.animationFrameHandle = requestAnimationFrame(() => {
                this.render();
                this.animationFrameHandle = 0;
            });
        }
    }

    setIsVisible(groupName: string, value: boolean) {
        this.scene.traverse((object) => {
            if (object.userData.groupName === groupName)
                object.visible = value;
        });
        this.requestRender();
    }
}

export { GraphRenderer };