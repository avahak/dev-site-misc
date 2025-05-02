import * as THREE from 'three';
import { GraphController, GraphProps, GraphText } from "./types";
import { GraphLocation } from './location';
import { createGroup } from './createScene';
import { LineMaterial } from 'three/examples/jsm/Addons.js';
import { AxisRenderer } from './coordinateLines';
import { TextGroup } from '../webgl_tools/textRender';
import { MCSDFFont } from '../webgl_tools/font';

class GraphRenderer {
    static renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    static axisRenderer: AxisRenderer = new AxisRenderer();

    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    lastWidth: number;
    lastHeight: number;
    lastDpr: number;

    camera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    cleanupTasks: (() => void)[];
    controller!: GraphController;
    loc: GraphLocation;

    dataGroup: THREE.Group;
    lineMaterials: LineMaterial[];

    props: GraphProps;
    textGroup: TextGroup;       // this pool of text is redrawn every time
    
    animationFrameHandle: number = -1;

    constructor(container: HTMLDivElement, fonts: MCSDFFont[], props: GraphProps) {
        this.container = container;
        this.props = props;
        this.cleanupTasks = [];
        // container.appendChild(this.renderer.domElement);

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

        const cs = createGroup(props.dsArray);        // this takes ~100ms for 100k points
        this.dataGroup = cs.group;
        this.lineMaterials = cs.lineMaterials;
        this.scene = new THREE.Scene();
        this.scene.add(this.dataGroup);

        this.textGroup = new TextGroup(fonts[0]);
        this.scene.add(this.textGroup.getObject());

        this.lineMaterials.forEach((lm) => this.cleanupTasks.push(() => lm.dispose()));

        this.loc = new GraphLocation(() => this.getResolution(), false);

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

        GraphRenderer.renderer.setPixelRatio(dpr);
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
                renderer.loc.setLocation(x, y, scale);
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

    cleanup() {
        if (this.animationFrameHandle !== -1)
            cancelAnimationFrame(this.animationFrameHandle);
        this.textGroup.dispose();
        for (const task of this.cleanupTasks)
            task();
        this.cleanupTasks = [];
        this.container.removeChild(this.canvas);
        this.canvas.width = 1;
        this.canvas.height = 1;
    }

    render() {
        console.log('GraphRenderer.render()', Math.random());

        // PROBLEM: Low precision (32-bit) in shader restricts zooming
        const r = this.loc.scale;
        this.dataGroup.position.set(this.loc.x, this.loc.y, 0);
        this.dataGroup.scale.set(r, r, r);
        // this.dataGroup.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), this.loc.angle);

        const [width, height] = this.getResolution();
        const [x, y] = this.loc.worldFromScreen(0, 0);
        const [x2, y2] = this.loc.worldFromScreen(width, height);
        const coordGroupX = GraphRenderer.axisRenderer.render({ 
            width: width, 
            height: height, 
            tMin: x,
            tMax: x2,
            orientation: "horizontal",
            color: "rgba(100, 100, 100, 1.0)",
            displayGrid: true,
            textGroup: this.textGroup,
        });
        const coordGroupY = GraphRenderer.axisRenderer.render({ 
            width: width, 
            height: height, 
            tMin: -y,
            tMax: -y2,
            orientation: "vertical",
            color: "rgba(100, 100, 100, 1.0)",
            displayGrid: true,
            textGroup: this.textGroup,
        });
        this.scene.add(coordGroupX, coordGroupY);

        // Add texts:
        if (this.props.texts) {
            this.props.texts.forEach((text: GraphText) => {
                if (text.visibleScale !== undefined && this.loc.scale < text.visibleScale)
                    return;
                this.textGroup.addText(
                    text.text, 
                    [this.loc.x+text.p.x*this.loc.scale, this.loc.y-text.p.y*this.loc.scale, 0], 
                    text.color ?? [1, 1, 1], 
                    text.anchor ?? [0, 0], 
                    text.size
                );
            });
        }

        // Add axis labels:
        if (this.props.xLabel) {
            this.textGroup.addText(
                this.props.xLabel, 
                [width/height, -1+3*AxisRenderer.TICK_SIZE, 0], 
                [1, 1, 1], [1, -1], 2*AxisRenderer.TICK_SIZE
            );
        }
        if (this.props.yLabel) {
            this.textGroup.addText(
                this.props.yLabel, 
                [-width/height+2*AxisRenderer.TICK_SIZE, 1, 0], 
                [1, 1, 1], [-1, 1], 2*AxisRenderer.TICK_SIZE
            );
        }

        // Add graph labels:
        let labelCount = 0;
        const labelSize = 1.5*AxisRenderer.TICK_SIZE;
        this.props.dsArray.forEach((ds) => {
            if (ds.label) {
                const color = new THREE.Color(ds.color);
                this.textGroup.addText(
                    ds.label, 
                    [width/height-1*AxisRenderer.TICK_SIZE, 1-labelCount*labelSize, 0], 
                    [color.r, color.g, color.b], [1, 1], labelSize
                );
                labelCount++;
            }
        });

        // this.renderer.render(this.scene, this.camera);
        if (GraphRenderer.renderer.domElement.width !== width || GraphRenderer.renderer.domElement.height !== height)
            GraphRenderer.renderer.setSize(width, height);
        GraphRenderer.renderer.render(this.scene, this.camera);
        this.canvasContext.globalCompositeOperation = 'copy';
        this.canvasContext.drawImage(GraphRenderer.renderer.domElement, 0, 0);
        this.canvasContext.globalCompositeOperation = 'source-over';    // back to default


        this.scene.remove(coordGroupX, coordGroupY);
        this.textGroup.reset();
    }

    requestRender() {
        if (this.animationFrameHandle === -1) {
            this.animationFrameHandle = requestAnimationFrame(() => {
                this.render();
                this.animationFrameHandle = -1;
            });
        }
    }
}

export { GraphRenderer };