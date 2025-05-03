import * as THREE from 'three';
import { LineMaterial, LineSegments2, LineSegmentsGeometry } from "three/examples/jsm/Addons.js";
import { TextGroup } from '../webgl_tools/textRender';
import { PlaneView } from './planeView';
import { GraphProps, GraphText } from './types';

type AxisParams = {
    tMin: number;
    tMax: number;
    orientation: 'horizontal' | 'vertical';
    color?: string;
    width: number;
    height: number;
    displayGrid?: boolean;
    gridColor?: string;
    majorGridColor?: string;
    textGroup: TextGroup;
};

class GraphDecorator {
    private axisMaterial: LineMaterial;
    private minorGridMaterial: LineMaterial;
    private majorGridMaterial: LineMaterial;
    tickSize: number;

    constructor(tickSize: number=0.05) {
        this.tickSize = tickSize;
        this.axisMaterial = new LineMaterial({
            color: new THREE.Color(0xff8000),
            linewidth: 1,
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
        });
        
        this.minorGridMaterial = new LineMaterial({
            color: new THREE.Color(0x333333),
            linewidth: 0.5,
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            transparent: true,
            opacity: 0.4
        });

        this.majorGridMaterial = new LineMaterial({
            color: new THREE.Color(0x555555),
            linewidth: 0.8,
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            transparent: true,
            opacity: 0.6
        });
    }

    createAxisGroup(params: AxisParams): THREE.Group {
        const group = new THREE.Group();
        const { tMin, tMax, orientation, color = '#ff8000', width, height, 
                displayGrid = false, gridColor, majorGridColor, textGroup } = params;
        this.setResolution(width, height);
    
        // Update materials
        this.axisMaterial.color.set(new THREE.Color(color));
        this.axisMaterial.linewidth = 1;
        
        if (gridColor) 
            this.minorGridMaterial.color.set(new THREE.Color(gridColor));
        if (majorGridColor) 
            this.majorGridMaterial.color.set(new THREE.Color(majorGridColor));
    
        // Convert pixel positions to local coordinates
        const getLocalPos = (t: number): [number, number] => {
            if (orientation === "horizontal") {
                const x = (t - tMin) / (tMax - tMin) * 2 - 1;
                return [x * (width/height), -1 + this.tickSize];
            } else {
                const y = 1 - (tMax - t) / (tMax - tMin) * 2;
                return [-width/height + this.tickSize, y];
            }
        };
    
        // Prepare arrays for segments
        const axisSegments: number[] = [];
        const majorGridSegments: number[] = [];
        const minorGridSegments: number[] = [];
    
        // Add main axis line
        if (orientation === "horizontal") {
            const [x1, y] = getLocalPos(tMin);
            const [x2, _] = getLocalPos(tMax);
            axisSegments.push(x1, y, 0, x2, y, 0);
        } else {
            const [x, y1] = getLocalPos(tMin);
            const [_, y2] = getLocalPos(tMax);
            axisSegments.push(x, y1, 0, x, y2, 0);
        }
    
        // Tick calculation
        const range = tMax - tMin;
        const rangePerPixel = (orientation === "horizontal") ? range/width : range/height;
        const scale = Math.log10(rangePerPixel);
        const scaleInt = Math.floor(scale);
    
        const interval0 = Math.pow(10, scaleInt+3);
        let interval = interval0;
        let ticks = 5;
        if (rangePerPixel/interval0 < 5e-3) interval = interval0/2;
        if (rangePerPixel/interval0 < 2e-3) interval = interval0/5;
        
        const kMin = Math.floor(tMin / interval);
        const kMax = Math.ceil(tMax / interval);
    
        // Add ticks and grid lines
        for (let k = kMin; k <= kMax; k++) {
            const t = Math.round(k * interval * 1e12) / 1e12;
            const [posX, posY] = getLocalPos(t);
    
            // Major tick
            if (orientation === "horizontal") {
                axisSegments.push(
                    posX, posY - this.tickSize, 0,
                    posX, posY + this.tickSize, 0
                );
                textGroup.addText(
                    `${t}`, 
                    [posX, posY+this.tickSize/4, 0], 
                    [1, 1, 1], 
                    [0, -1], 
                    1.5*this.tickSize
                );
                
                if (displayGrid) {
                    majorGridSegments.push(
                        posX, -1, 0,  // Full height
                        posX, 1, 0
                    );
                }

            } else {
                axisSegments.push(
                    posX - this.tickSize, posY, 0,
                    posX + this.tickSize, posY, 0
                );
                textGroup.addText(
                    `${t}`, 
                    [posX+this.tickSize/4, posY, 0], 
                    [1, 1, 1], 
                    [-1, 0], 
                    1.5*this.tickSize
                );
                
                if (displayGrid) {
                    majorGridSegments.push(
                        -width/height, posY, 0,  // Full width
                        width/height, posY, 0
                    );
                }
            }
    
            // Minor ticks
            for (let k2 = 1; k2 < ticks; k2++) {
                const t2 = Math.round((k + k2/ticks) * interval * 1e12) / 1e12;
                const [posX2, posY2] = getLocalPos(t2);
                
                if (orientation === "horizontal") {
                    axisSegments.push(
                        posX2, posY2 - this.tickSize/2, 0,
                        posX2, posY2 + this.tickSize/2, 0
                    );
                    
                    if (displayGrid) {
                        minorGridSegments.push(
                            posX2, -1, 0,
                            posX2, 1, 0
                        );
                    }
                } else {
                    axisSegments.push(
                        posX2 - this.tickSize/2, posY2, 0,
                        posX2 + this.tickSize/2, posY2, 0
                    );
                    
                    if (displayGrid) {
                        minorGridSegments.push(
                            -width/height, posY2, 0,
                            width/height, posY2, 0
                        );
                    }
                }
            }
        }
    
        // Create and add axis
        const axisGeometry = new LineSegmentsGeometry();
        axisGeometry.setPositions(axisSegments);
        const axisLines = new LineSegments2(axisGeometry, this.axisMaterial);
        group.add(axisLines);
    
        // Add grids if enabled
        if (displayGrid) {
            // Major grid (aligned with major ticks)
            if (majorGridSegments.length > 0) {
                const majorGridGeometry = new LineSegmentsGeometry();
                majorGridGeometry.setPositions(majorGridSegments);
                const majorGrid = new LineSegments2(majorGridGeometry, this.majorGridMaterial);
                majorGrid.renderOrder = -2;
                group.add(majorGrid);
            }
            
            // Minor grid (aligned with minor ticks)
            if (minorGridSegments.length > 0) {
                const minorGridGeometry = new LineSegmentsGeometry();
                minorGridGeometry.setPositions(minorGridSegments);
                const minorGrid = new LineSegments2(minorGridGeometry, this.minorGridMaterial);
                minorGrid.renderOrder = -1;
                group.add(minorGrid);
            }
        }
    
        return group;
    }

    setResolution(width: number, height: number) {
        this.axisMaterial.resolution.set(width, height);
        this.minorGridMaterial.resolution.set(width, height);
        this.majorGridMaterial.resolution.set(width, height);
    }

    dispose() {
        this.axisMaterial.dispose();
        this.minorGridMaterial.dispose();
        this.majorGridMaterial.dispose();
    }

    createGroup(props: GraphProps, loc: PlaneView, resolution: number[], textGroup: TextGroup) {
        const group = new THREE.Group();
        const [width, height] = resolution;
        const [x, y] = loc.localFromScreen(0, height);
        const [x2, y2] = loc.localFromScreen(width, 0);
        const coordGroupX = this.createAxisGroup({ 
            width: width, 
            height: height, 
            tMin: x,
            tMax: x2,
            orientation: "horizontal",
            color: "rgba(100, 100, 100, 1.0)",
            displayGrid: true,
            textGroup: textGroup,
        });
        const coordGroupY = this.createAxisGroup({ 
            width: width, 
            height: height, 
            tMin: y,
            tMax: y2,
            orientation: "vertical",
            color: "rgba(100, 100, 100, 1.0)",
            displayGrid: true,
            textGroup: textGroup,
        });
        group.add(coordGroupX, coordGroupY);

        // Add texts:
        if (props.texts) {
            props.texts.forEach((text: GraphText) => {
                if (text.visibleScale !== undefined && loc.scale > text.visibleScale)
                    return;
                textGroup.addText(
                    text.text, 
                    [-loc.x/loc.scale+text.p.x/loc.scale, -loc.y/loc.scale+text.p.y/loc.scale, 0], 
                    text.color ?? [1, 1, 1], 
                    text.anchor ?? [0, 0], 
                    text.size
                );
            });
        }

        // Add axis labels:
        if (props.xLabel) {
            textGroup.addText(
                props.xLabel, 
                [width/height, -1+3*this.tickSize, 0], 
                [1, 1, 1], [1, -1], 2*this.tickSize
            );
        }
        if (props.yLabel) {
            textGroup.addText(
                props.yLabel, 
                [-width/height+2*this.tickSize, 1, 0], 
                [1, 1, 1], [-1, 1], 2*this.tickSize
            );
        }

        // Add graph labels:
        let labelCount = 0;
        const labelSize = 1.5*this.tickSize;
        props.dsArray.forEach((ds) => {
            if (ds.label) {
                const color = new THREE.Color(ds.color);
                textGroup.addText(
                    ds.label, 
                    [width/height-1*this.tickSize, 1-labelCount*labelSize, 0], 
                    [color.r, color.g, color.b], [1, 1], labelSize
                );
                labelCount++;
            }
        });
        
        return group;
    }
}

export { GraphDecorator };