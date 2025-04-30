/**
 * Represents a view (pos, zoom) of a graph.
 */
class GraphLocation {
    x: number = 0;
    y: number = 0;
    scale: number = 1;
    angle: number = 0;
    useAngle: boolean;

    getResolution: () => number[];

    constructor(getResolution: () => number[], useAngle: boolean=true) {
        this.getResolution = getResolution;
        this.useAngle = useAngle;
    }

    setLocation(x: number, y: number, scale: number) {
        this.x = x;
        this.y = y;
        this.scale = scale;
    }

    transform(x: number, y: number, dx: number, dy: number, scaleFactor: number, angleDelta: number) {
        if (!this.useAngle)
            angleDelta = 0;
        
        const [width, height] = this.getResolution();
        const resY = height;
    
        // Current e1: scale + rotation
        const e1OldMag = this.scale;
        const e1OldAngle = this.angle;
    
        // Graph position under mouse BEFORE transform
        const [zGraphX, zGraphY] = this.graphFromScreen(x, y);
    
        // Update scale and angle
        const scaleChange = scaleFactor;
        const angleChange = -angleDelta; // because in Complex it's negative for rotation
    
        const e1NewMag = e1OldMag * scaleChange;
        const e1NewAngle = e1OldAngle + angleChange;
    
        // Calculate e1Old*z and e1New*z
        const cosOld = Math.cos(e1OldAngle);
        const sinOld = Math.sin(e1OldAngle);
        const cosNew = Math.cos(e1NewAngle);
        const sinNew = Math.sin(e1NewAngle);
    
        const e1OldZx = e1OldMag * (zGraphX * cosOld - zGraphY * sinOld);
        const e1OldZy = e1OldMag * (zGraphX * sinOld + zGraphY * cosOld);
    
        const e1NewZx = e1NewMag * (zGraphX * cosNew - zGraphY * sinNew);
        const e1NewZy = e1NewMag * (zGraphX * sinNew + zGraphY * cosNew);
    
        // delta = (dx, -dy) * (2/resY)
        const deltaX = (2 * dx) / resY;
        const deltaY = (2 * -dy) / resY;
    
        // New center = old center + delta + (e1Old*z - e1New*z)
        this.x += deltaX + (e1OldZx - e1NewZx);
        this.y += deltaY + (e1OldZy - e1NewZy);
    
        // Finally update scale and angle
        this.scale = e1NewMag;
        this.angle = this.useAngle ? e1NewAngle : 0;
    }
    

    graphFromScreen(screenX: number, screenY: number): [number, number] {
        const [width, height] = this.getResolution();

        // Normalized screen coords
        const nx = (screenX - width / 2) * 2 / height - this.x;
        const ny = -(screenY - height / 2) * 2 / height - this.y;

        // Apply inverse rotation
        const cos = Math.cos(-this.angle);
        const sin = Math.sin(-this.angle);
        const x = nx * cos - ny * sin;
        const y = nx * sin + ny * cos;

        return [x/this.scale, y/this.scale];
    }

    screenFromGraph(graphX: number, graphY: number): [number, number] {
        const [width, height] = this.getResolution();
    
        // Reapply scale
        const xScaled = graphX * this.scale;
        const yScaled = graphY * this.scale;
    
        // Apply rotation
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const nx = xScaled * cos - yScaled * sin;
        const ny = xScaled * sin + yScaled * cos;
    
        // Apply translation
        const xCentered = nx + this.x;
        const yCentered = ny + this.y;
    
        // Convert to screen coordinates
        const screenX = xCentered * height / 2 + width / 2;
        const screenY = -yCentered * height / 2 + height / 2;
    
        return [screenX, screenY];
    }
    
}

export { GraphLocation };
