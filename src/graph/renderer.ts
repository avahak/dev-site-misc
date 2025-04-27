import * as THREE from 'three';
import { DataSet, GraphController, Point } from "./types";
import { GraphLocation } from './location';
import { createScene } from './createScene';
import { LineMaterial } from 'three/examples/jsm/Addons.js';

class GraphRenderer {
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    container: HTMLDivElement;
    scene: THREE.Scene;
    cleanupTasks: (() => void)[];
    controller!: GraphController;
    loc: GraphLocation;

    lineMaterials: LineMaterial[];

    constructor(container: HTMLDivElement, dsArray: DataSet[]) {
        this.container = container;
        this.cleanupTasks = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        container.appendChild(this.renderer.domElement);

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        const cs = createScene(dsArray);
        this.scene = cs.scene;
        this.lineMaterials = cs.lineMaterials;

        // this.getResolution = this.getResolution.bind(this);
        this.loc = new GraphLocation(() => this.getResolution(), false);

        this.setupController();
        this.setupResizeRenderer();
    }

    resizeRenderer() {
        const [clientWidth, clientHeight] = this.getResolution();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(clientWidth, clientHeight);

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

    setupResizeRenderer() {
        const resizeObserver = new ResizeObserver(() => this.resizeRenderer());
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
                renderer.render();
            },
            setLocation(x: number, y: number, scale: number) {
                renderer.loc.setLocation(x, y, scale);
                renderer.render();
            },
            update() {
                renderer.render();
            },
        }
    }

    getController(): GraphController {
        return this.controller;
    }

    cleanup() {
        for (const task of this.cleanupTasks)
            task();
        this.renderer.dispose();
    }

    render() {
        console.log('GraphRenderer.render()', Math.random());

        const r = this.loc.scale;
        this.scene.position.set(this.loc.x, this.loc.y, 0);
        this.scene.scale.set(r, r, r);
        this.scene.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), this.loc.angle);

        this.renderer.render(this.scene, this.camera);
    }
}

export { GraphRenderer };