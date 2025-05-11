/**
 * Represents a view (described by position, zoom, scale, and angle) for a map or a graph.
 * Here we assume the world is viewed through an orthographic camera (mapping
 * [-aspect,aspect]x[-1,1] to screen). See input_listener for example usage.
 */
class PlaneView {
    x: number = 0;
    y: number = 0;
    scaleX: number = 1;     // scaleX is scaling for x-coordinate in local space
    scaleY: number = 1;     // scaleY is scaling for y-coordinate in local space
    angle: number = 0;
    useAngle: boolean;

    getResolution: () => number[];

    constructor(getResolution: () => number[], useAngle: boolean=true) {
        this.getResolution = getResolution;
        this.useAngle = useAngle;
    }

    setLocation(x: number, y: number, scaleX: number, scaleY: number, angle: number=0) {
        this.x = x;
        this.y = y;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.angle = this.useAngle ? angle : 0;
    }

    transform(screenX: number, screenY: number, screenDx: number, screenDy: number, scaleFactor: number, angleDelta: number): void {
        const [lx, ly] = this.localFromScreen(screenX, screenY);

        this.scaleX /= scaleFactor;
        this.scaleY /= scaleFactor;
        this.angle = this.useAngle ? this.angle + angleDelta : 0;
        
        const [lx2, ly2] = this.localFromScreen(screenX + screenDx, screenY + screenDy);

        this.x += lx - lx2;
        this.y += ly - ly2;
    }
    
    // Existing coordinate transform functions (unchanged):
    screenFromLocal(localX: number, localY: number): [number, number] {
        const [worldX, worldY] = this.worldFromLocal(localX, localY);
        return this.screenFromWorld(worldX, worldY);
    }
    
    localFromScreen(screenX: number, screenY: number): [number, number] {
        const [worldX, worldY] = this.worldFromScreen(screenX, screenY);
        return this.localFromWorld(worldX, worldY);
    }
    
    screenFromWorld(worldX: number, worldY: number): [number, number] {
        const [width, height] = this.getResolution();
        const aspect = width / height;
        return [
            (worldX / aspect + 1)/2 * width,
            (1 - worldY)/2 * height
        ];
    }
    
    worldFromScreen(screenX: number, screenY: number): [number, number] {
        const [width, height] = this.getResolution();
        const aspect = width / height;
        return [
            ((screenX / width)*2 - 1) * aspect,
            1 - (screenY / height)*2
        ];
    }
    
    worldFromLocal(localX: number, localY: number): [number, number] {
        const cos = Math.cos(-this.angle);
        const sin = Math.sin(-this.angle);
        const wx = (localX - this.x)*cos - (localY - this.y)*sin;
        const wy = (localX - this.x)*sin + (localY - this.y)*cos;
        return [wx/this.scaleX, wy/this.scaleY];
    }
    
    localFromWorld(worldX: number, worldY: number): [number, number] {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const tx = worldX * this.scaleX;
        const ty = worldY * this.scaleY;
        const lx = tx*cos - ty*sin;
        const ly = tx*sin + ty*cos;
        return [lx + this.x, ly + this.y];
    }
}

export { PlaneView };
