import { TextGroup } from '../webgl_tools/textRender';
import * as THREE from 'three';
import { LineMaterial, LineSegments2, LineSegmentsGeometry } from "three/examples/jsm/Addons.js";

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

class AxisRenderer {
    static TICK_SIZE = 0.05;
    private axisMaterial: LineMaterial;
    private minorGridMaterial: LineMaterial;
    private majorGridMaterial: LineMaterial;

    constructor() {
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

    render(params: AxisParams): THREE.Group {
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
    
        // Convert pixel positions to world coordinates
        const getWorldPos = (t: number): [number, number] => {
            if (orientation === "horizontal") {
                const x = (t - tMin) / (tMax - tMin) * 2 - 1;
                return [x * (width/height), -1 + AxisRenderer.TICK_SIZE];
            } else {
                const y = (tMax - t) / (tMax - tMin) * 2 - 1;
                return [-width/height + AxisRenderer.TICK_SIZE, y];
            }
        };
    
        // Prepare arrays for segments
        const axisSegments: number[] = [];
        const majorGridSegments: number[] = [];
        const minorGridSegments: number[] = [];
    
        // Add main axis line
        if (orientation === "horizontal") {
            const [x1, y] = getWorldPos(tMin);
            const [x2, _] = getWorldPos(tMax);
            axisSegments.push(x1, y, 0, x2, y, 0);
        } else {
            const [x, y1] = getWorldPos(tMin);
            const [_, y2] = getWorldPos(tMax);
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
            const [posX, posY] = getWorldPos(t);
    
            // Major tick
            if (orientation === "horizontal") {
                axisSegments.push(
                    posX, posY - AxisRenderer.TICK_SIZE, 0,
                    posX, posY + AxisRenderer.TICK_SIZE, 0
                );
                textGroup.addText(
                    `${t}`, 
                    [posX, posY+AxisRenderer.TICK_SIZE/4, 0], 
                    [1, 1, 1], 
                    [0, -1], 
                    1.5*AxisRenderer.TICK_SIZE
                );
                
                if (displayGrid) {
                    majorGridSegments.push(
                        posX, -1, 0,  // Full height
                        posX, 1, 0
                    );
                }

            } else {
                axisSegments.push(
                    posX - AxisRenderer.TICK_SIZE, posY, 0,
                    posX + AxisRenderer.TICK_SIZE, posY, 0
                );
                textGroup.addText(
                    `${t}`, 
                    [posX+AxisRenderer.TICK_SIZE/4, posY, 0], 
                    [1, 1, 1], 
                    [-1, 0], 
                    1.5*AxisRenderer.TICK_SIZE
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
                const [posX2, posY2] = getWorldPos(t2);
                
                if (orientation === "horizontal") {
                    axisSegments.push(
                        posX2, posY2 - AxisRenderer.TICK_SIZE/2, 0,
                        posX2, posY2 + AxisRenderer.TICK_SIZE/2, 0
                    );
                    
                    if (displayGrid) {
                        minorGridSegments.push(
                            posX2, -1, 0,
                            posX2, 1, 0
                        );
                    }
                } else {
                    axisSegments.push(
                        posX2 - AxisRenderer.TICK_SIZE/2, posY2, 0,
                        posX2 + AxisRenderer.TICK_SIZE/2, posY2, 0
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
}

export { AxisRenderer };