import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import vsString from './shaders/vsPoint.glsl?raw';
import fsString from './shaders/fsPoint.glsl?raw';
import { DataSet, Point } from './types';


function createDataSetGroup(ds: DataSet, pointMaterial: THREE.ShaderMaterial, lineMaterials: LineMaterial[]): THREE.Group {
    const group = new THREE.Group();
    const points = ds.points;

    if (ds.drawPoints && points.length > 0) {
        const geometry = new THREE.BufferGeometry();
        
        // Positions (x,y,0)
        const positions = new Float32Array(points.flatMap(p => [p.x, p.y, 0]));
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Colors (same for all points in dataset)
        const color = new THREE.Color(ds.color);
        // const color = new THREE.Color('orange');
        const colors = new Float32Array(points.flatMap(() => [color.r, color.g, color.b]));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Sizes (same for all points in dataset)
        const sizes = new Float32Array(points.length).fill(3 * ds.primitiveScale);
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const pointCloud = new THREE.Points(geometry, pointMaterial);
        group.add(pointCloud);
    }

    if (ds.drawLines && points.length >= 2) {
        // Create geometry for the line
        const lineGeometry = new LineGeometry();
        const positions = points.flatMap(p => [p.x, p.y, 0]);
        lineGeometry.setPositions(positions);

        // Create material for the line
        const lineMaterial = new LineMaterial({
            color: new THREE.Color(ds.color).convertSRGBToLinear(),
            linewidth: ds.primitiveScale,
            resolution: new THREE.Vector2(1, 1),
            worldUnits: false
        });

        lineMaterials.push(lineMaterial);

        // Create the line and add to group
        const line = new Line2(lineGeometry, lineMaterial);
        group.add(line);
    }

    return group;
}

function createGroup(dsList: DataSet[]): { group: THREE.Group, lineMaterials: LineMaterial[] } { 
    const group = new THREE.Group();

    const lineMaterials: LineMaterial[] = [];

    const pointMaterial = new THREE.ShaderMaterial({
        uniforms: {
        },
        vertexShader: vsString,
        fragmentShader: fsString,
        transparent: true
    });

    dsList.forEach((ds: DataSet) => {
        const dsGroup = createDataSetGroup(ds, pointMaterial, lineMaterials);
        group.add(dsGroup);
    });
    
    return { group, lineMaterials };
}

export { createGroup };