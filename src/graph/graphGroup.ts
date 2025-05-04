import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import vsString from './shaders/vsPoint.glsl?raw';
import fsString from './shaders/fsPoint.glsl?raw';
import { DataSet } from './types';


function createDataSetGroup(ds: DataSet, pointMaterial: THREE.ShaderMaterial, lineMaterials: LineMaterial[], cleanupTasks: (() => void)[], zOffset: number): THREE.Group {
    const group = new THREE.Group();
    const points = ds.points;

    if (ds.drawPoints && points.length > 0) {
        const geometry = new THREE.BufferGeometry();
        
        // Positions (x,y,0)
        const positions = new Float32Array(points.flatMap(p => [p.x, p.y, zOffset]));
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Colors (same for all points in dataset)
        const color = new THREE.Color(ds.color);
        // const color = new THREE.Color('orange');
        const colors = new Float32Array(points.flatMap(() => [color.r, color.g, color.b, ds.opacity ?? 1]));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
        
        // Sizes (same for all points in dataset)
        const sizes = new Float32Array(points.length).fill(3 * ds.scale);
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const pointCloud = new THREE.Points(geometry, pointMaterial);
        pointCloud.frustumCulled = false;
        group.add(pointCloud);

        cleanupTasks.push(() => geometry.dispose());
    }

    if (ds.drawLines && points.length >= 2) {
        // Create geometry for the line
        const lineGeometry = new LineGeometry();
        const positions = points.flatMap(p => [p.x, p.y, zOffset]);
        lineGeometry.setPositions(positions);

        // Create material for the line
        const lineMaterial = new LineMaterial({
            color: new THREE.Color(ds.color).convertSRGBToLinear(),
            transparent: true,
            opacity: ds.opacity ?? 1,
            linewidth: ds.scale,
            resolution: new THREE.Vector2(1, 1),
            worldUnits: false
        });

        lineMaterials.push(lineMaterial);

        // Create the line and add to group
        const line = new Line2(lineGeometry, lineMaterial);
        line.frustumCulled = false;
        group.add(line);
        cleanupTasks.push(() => lineGeometry.dispose());
        cleanupTasks.push(() => lineMaterial.dispose());
    }

    return group;
}

function createGroup(dsList: DataSet[]): { group: THREE.Group, lineMaterials: LineMaterial[], cleanupTasks: (() => void)[] } { 
    const group = new THREE.Group();
    const cleanupTasks: (() => void)[] = [];

    const lineMaterials: LineMaterial[] = [];

    const pointMaterial = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: vsString,
        fragmentShader: fsString,
        transparent: true,
    });

    dsList.forEach((ds: DataSet, index: number) => {
        const zOffset = -0.5 * (dsList.length - index) / dsList.length;    // [0,0.5)
        const dsGroup = createDataSetGroup(ds, pointMaterial, lineMaterials, cleanupTasks, zOffset);
        dsGroup.frustumCulled = false;
        group.add(dsGroup);
    });
    
    return { group, lineMaterials, cleanupTasks };
}

export { createGroup };