import * as THREE from 'three';
import { Complex, GroupElement } from '../types';
import { MobiusTransform } from '../math/mobius';
import paintVs from './shaders/vs.glsl?raw';
import paintFs from './shaders/fs_paint.glsl?raw';

export class PaintPipeline {
    private renderer: THREE.WebGLRenderer;
    private renderTargetA: THREE.WebGLRenderTarget;
    private renderTargetB: THREE.WebGLRenderTarget;
    private isTargetAActive: boolean = true;

    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private paintMaterial: THREE.ShaderMaterial;
    private quadMesh: THREE.Mesh;
    private subgroupTexture!: THREE.DataTexture;
    private subgroupCount: number = 0;

    constructor(renderer: THREE.WebGLRenderer, resolution: number = 2048) {
        this.renderer = renderer;

        const rtOptions: THREE.RenderTargetOptions = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
        };

        this.renderTargetA = new THREE.WebGLRenderTarget(resolution, resolution, rtOptions);
        this.renderTargetB = new THREE.WebGLRenderTarget(resolution, resolution, rtOptions);

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);

        this.paintMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_prevTexture: { value: null },
                u_segA: { value: 0.0 },
                u_segB: { value: 0.0 },
                u_mapRe: { value: new THREE.Vector4(1, 0, 0, 1) },
                u_mapIm: { value: new THREE.Vector4(0, 0, 0, 0) },
                u_radius: { value: 0.1 },
                u_brushColor: { value: new THREE.Vector3(1, 0, 0) },
                u_subgroupTexture: { value: null },
                u_subgroupCount: { value: 0 },
                u_R_tex: { value: 0.5 },
            },
            vertexShader: paintVs,
            fragmentShader: paintFs,
            depthTest: false,
            depthWrite: false,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        this.quadMesh = new THREE.Mesh(geometry, this.paintMaterial);
        this.scene.add(this.quadMesh);
    }

    public setSubgroup(subgroup: GroupElement[]): void {
        this.subgroupCount = subgroup.length;
        const data = new Float32Array(this.subgroupCount * 2 * 4);

        for (let i = 0; i < this.subgroupCount; i++) {
            const m = subgroup[i].matrix;
            const inv = MobiusTransform.inverse(m);

            // Row 0: inv.a and inv.b
            const idx0 = i * 4;
            data[idx0 + 0] = inv.a.re;
            data[idx0 + 1] = inv.a.im;
            data[idx0 + 2] = inv.b.re;
            data[idx0 + 3] = inv.b.im;

            // Row 1: inv.c and inv.d
            const idx1 = (this.subgroupCount + i) * 4;
            data[idx1 + 0] = inv.c.re;
            data[idx1 + 1] = inv.c.im;
            data[idx1 + 2] = inv.d.re;
            data[idx1 + 3] = inv.d.im;
        }

        if (this.subgroupTexture) {
            this.subgroupTexture.dispose();
        }

        this.subgroupTexture = new THREE.DataTexture(
            data,
            this.subgroupCount,
            2,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        this.subgroupTexture.minFilter = THREE.NearestFilter;
        this.subgroupTexture.magFilter = THREE.NearestFilter;
        this.subgroupTexture.needsUpdate = true;

        this.paintMaterial.uniforms.u_subgroupTexture.value = this.subgroupTexture;
        this.paintMaterial.uniforms.u_subgroupCount.value = this.subgroupCount;
    }

    public setR_tex(R_tex: number): void {
        this.paintMaterial.uniforms.u_R_tex.value = R_tex;
    }

    public initializeWithTexture(sourceTexture: THREE.Texture): void {
        const currentTarget = this.renderer.getRenderTarget();
        this.renderer.setRenderTarget(this.renderTargetA);

        const initMat = new THREE.MeshBasicMaterial({ map: sourceTexture });
        this.quadMesh.material = initMat;
        this.renderer.render(this.scene, this.camera);
        this.quadMesh.material = this.paintMaterial;

        this.renderer.setRenderTarget(currentTarget);
        this.isTargetAActive = true;
    }

    public addStroke(
        z1: Complex,
        z2: Complex,
        radius: number,
        color: THREE.Color
    ): void {
        if (z1.re * z1.re + z1.im * z1.im >= 0.99 || z2.re * z2.re + z2.im * z2.im >= 0.99) {
            return;
        }
        const T1 = MobiusTransform.mapToOrigin(z1);
        const z2Prime = MobiusTransform.apply(T1, z2);
        const theta = Math.atan2(z2Prime.im, z2Prime.re);
        const R = MobiusTransform.rotation(-theta);
        const M_seg = MobiusTransform.multiply(R, T1);

        const mappedZ1 = MobiusTransform.apply(M_seg, z1);
        const mappedZ2 = MobiusTransform.apply(M_seg, z2);
        let a = mappedZ1.re;
        let b = mappedZ2.re;
        if (a > b) {
            const temp = a; a = b; b = temp;
        }

        const readTarget = this.isTargetAActive ? this.renderTargetA : this.renderTargetB;
        const writeTarget = this.isTargetAActive ? this.renderTargetB : this.renderTargetA;

        this.paintMaterial.uniforms.u_prevTexture.value = readTarget.texture;
        this.paintMaterial.uniforms.u_segA.value = a;
        this.paintMaterial.uniforms.u_segB.value = b;
        this.paintMaterial.uniforms.u_mapRe.value.set(M_seg.a.re, M_seg.b.re, M_seg.c.re, M_seg.d.re);
        this.paintMaterial.uniforms.u_mapIm.value.set(M_seg.a.im, M_seg.b.im, M_seg.c.im, M_seg.d.im);
        this.paintMaterial.uniforms.u_radius.value = radius;
        this.paintMaterial.uniforms.u_brushColor.value.set(color.r, color.g, color.b);

        const currentTarget = this.renderer.getRenderTarget();
        this.renderer.setRenderTarget(writeTarget);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(currentTarget);

        this.isTargetAActive = !this.isTargetAActive;
    }

    public getCurrentTexture(): THREE.Texture {
        return (this.isTargetAActive ? this.renderTargetA : this.renderTargetB).texture;
    }

    public dispose(): void {
        this.renderTargetA.dispose();
        this.renderTargetB.dispose();
        this.subgroupTexture?.dispose();
        this.paintMaterial.dispose();
        this.quadMesh.geometry.dispose();
    }
}