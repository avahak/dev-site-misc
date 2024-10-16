/**
 * NOTE! Mostly ChatGPT code, not tested
 */

import { PointerInputHandler } from "./types";

class PointerControls {
    private container: HTMLElement;
    private handler: PointerInputHandler;

    private pointers: Map<number, { x: number, y: number }> = new Map();
    private initialDistance: number | null = null;
    private initialAngle: number | null = null;
    private lastMidpoint: { x: number, y: number } | null = null;

    constructor(container: HTMLElement, handler: PointerInputHandler) {
        this.container = container;
        this.handler = handler;

        this.container.addEventListener('pointerdown', this.onPointerDown);
        this.container.addEventListener('pointermove', this.onPointerMove);
        this.container.addEventListener('pointerup', this.onPointerUp);
        this.container.addEventListener('pointercancel', this.onPointerUp);

        this.container.addEventListener('wheel', this.onWheel);
    }

    private onPointerDown = (event: PointerEvent) => {
        this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (this.pointers.size === 2) {
            // When two pointers are down, initialize zoom/rotation calculation
            const [p1, p2] = Array.from(this.pointers.values());
            this.initialDistance = this.getDistance(p1, p2);
            this.initialAngle = this.getAngle(p1, p2);
            this.lastMidpoint = this.getMidpoint(p1, p2);
        }
    };

    private onPointerMove = (event: PointerEvent) => {
        if (!this.pointers.has(event.pointerId)) 
            return;

        if (this.pointers.size === 1) {
            // Single pointer move -> Translate (pan)
            const pointer = this.pointers.get(event.pointerId)!;
            const dx = event.clientX - pointer.x;
            const dy = event.clientY - pointer.y;

            this.handler.pointerInput(dx, dy, 1, 0);
        } else if (this.pointers.size === 2) {
            // Two pointer move -> Zoom, Rotate, Translate
            const [p1, p2] = Array.from(this.pointers.values());
            const newDistance = this.getDistance(p1, p2);
            const newAngle = this.getAngle(p1, p2);
            const newMidpoint = this.getMidpoint(p1, p2);

            if (this.initialDistance && this.initialAngle && this.lastMidpoint) {
                const scale = newDistance / this.initialDistance;
                const angle = newAngle - this.initialAngle;
                const dx = newMidpoint.x - this.lastMidpoint.x;
                const dy = newMidpoint.y - this.lastMidpoint.y;

                this.handler.pointerInput(dx, dy, scale, angle);
                this.lastMidpoint = newMidpoint;
            }
        }

        this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    };

    private onPointerUp = (event: PointerEvent) => {
        this.pointers.delete(event.pointerId);

        if (this.pointers.size < 2) {
            this.initialDistance = null;
            this.initialAngle = null;
            this.lastMidpoint = null;
        }
    };

    private onWheel = (event: WheelEvent) => {
        event.preventDefault();

        const scale = event.deltaY < 0 ? 1.0/1.2 : 1.2;

        this.handler.pointerInput(0, 0, scale, 0);
    };

    private getDistance(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
        const dx = p2.x-p1.x;
        const dy = p2.y-p1.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    private getAngle(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
        return Math.atan2(p2.y-p1.y, p2.x-p1.x);
    }

    private getMidpoint(p1: { x: number, y: number }, p2: { x: number, y: number }): { x: number, y: number } {
        return {
            x: (p1.x+p2.x)/2,
            y: (p1.y+p2.y)/2,
        };
    }

    public cleanup() {
        this.container.removeEventListener('pointerdown', this.onPointerDown);
        this.container.removeEventListener('pointermove', this.onPointerMove);
        this.container.removeEventListener('pointerup', this.onPointerUp);
        this.container.removeEventListener('pointercancel', this.onPointerUp);
        this.container.removeEventListener('wheel', this.onWheel);
    }
}

export { PointerControls };
