// TODO Fix to allow multiple pointerType "mouse" pointers

type KeyParams = {
    key: string;
    code: string;
    shiftKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    metaKey: boolean;
};

interface InputMapper {
    mouse?: {
        down?: (x: number, y: number, button: number) => void;
        up?: (x: number, y: number, button: number) => void;
        drag?: (x: number, y: number, dx: number, dy: number, buttons: number) => void;
        wheel?: (x: number, y: number, delta: number) => void;
        move?: (x: number, y: number, isInside: boolean) => void;
    };
    touch?: {
        start?: (x: number, y: number) => void;
        end?: (x: number, y: number) => void;
        dragSingle?: (x: number, y: number, dx: number, dy: number) => void;
        dragPair?: (x: number, y: number, dx: number, dy: number, scale: number, angle: number) => void;
    };
    keyboard?: {
        keydown?: (params: KeyParams) => void;
        keyup?: (params: KeyParams) => void;
    }
};

function isInside(rect: DOMRect, x: number, y: number): boolean {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

/**
 * Warning: some ChatGPT code here.
 */
class InputListener {
    private container: HTMLElement;
    private mapper: InputMapper;

    private pointers: Map<number, { x: number, y: number }> = new Map();
    private lastDistance: number | null = null;
    private lastAngle: number | null = null;
    private lastMidpoint: { x: number, y: number } | null = null;

    constructor(container: HTMLElement, mapper: InputMapper) {
        this.container = container;
        this.mapper = mapper;

        // Needed to prevent default touch behaviors such as scrolling and zooming
        this.container.style.touchAction = 'none';
        this.container.style.userSelect = 'none';

        this.container.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        this.container.addEventListener('pointerup', this.onPointerUp);
        this.container.addEventListener('pointercancel', this.onPointerUp);
        this.container.addEventListener('wheel', this.onWheel);
        this.container.addEventListener('contextmenu', this.onContextmenu);

        document.addEventListener('keydown', this.onKeydown);
        document.addEventListener('keyup', this.onKeyup);
    }

    private onContextmenu = (event: MouseEvent) => {
        event.preventDefault();
    };

    private onPointerDown = (event: PointerEvent) => {
        event.preventDefault();
        const rect = this.container.getBoundingClientRect();
        this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (event.pointerType === 'mouse' && this.mapper.mouse?.down) {
            this.mapper.mouse.down(event.clientX-rect.left, event.clientY-rect.top, event.button);
        } else if (event.pointerType === 'touch' && this.pointers.size === 1 && this.mapper.touch?.start) {
            this.mapper.touch.start(event.clientX-rect.left, event.clientY-rect.top);
        }

        if (this.pointers.size === 2 && event.pointerType === 'touch') {
            const [p1, p2] = Array.from(this.pointers.values());
            this.lastDistance = this.getDistance(p1, p2);
            this.lastAngle = this.getAngle(p1, p2);
            this.lastMidpoint = this.getMidpoint(p1, p2);
        }
    };

    private onPointerMove = (event: PointerEvent) => {
        event.preventDefault();
        const rect = this.container.getBoundingClientRect();
        if (event.pointerType === 'mouse') {
            if (this.mapper.mouse?.move) {
                this.mapper.mouse.move(event.clientX-rect.left, event.clientY-rect.top, isInside(rect, event.clientX, event.clientY));
            }
        }

        const pointer = this.pointers.get(event.pointerId);
        if (!pointer) return;

        const dx = event.clientX - pointer.x;
        const dy = event.clientY - pointer.y;

        if (event.pointerType === 'mouse') {
            if (this.mapper.mouse?.drag) {
                this.mapper.mouse.drag(event.clientX-rect.left, event.clientY-rect.top, dx, dy, event.buttons);
            }
        } else if (event.pointerType === 'touch') {
            if (this.pointers.size === 1 && this.mapper.touch?.dragSingle) {
                this.mapper.touch.dragSingle(event.clientX-rect.left, event.clientY-rect.top, dx, dy);
            } else if (this.pointers.size === 2) {
                const [p1, p2] = Array.from(this.pointers.values());
                const newDistance = this.getDistance(p1, p2);
                const newAngle = this.getAngle(p1, p2);
                const newMidpoint = this.getMidpoint(p1, p2);

                if (this.lastDistance && this.lastAngle && this.lastMidpoint) {
                    const scale = this.lastDistance / newDistance;
                    const angle = newAngle - this.lastAngle;
                    const delta = { x: newMidpoint.x-this.lastMidpoint.x, y: newMidpoint.y-this.lastMidpoint.y };

                    if (this.mapper.touch?.dragPair) {
                        this.mapper.touch.dragPair(newMidpoint.x, newMidpoint.y, delta.x, delta.y, scale, angle);
                    }
                    this.lastDistance = newDistance;
                    this.lastAngle = newAngle;
                    this.lastMidpoint = newMidpoint;
                }
            }
        }

        this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    };

    private onPointerUp = (event: PointerEvent) => {
        event.preventDefault();
        const rect = this.container.getBoundingClientRect();
        this.pointers.delete(event.pointerId);

        if (event.pointerType === 'mouse' && this.mapper.mouse?.up) {
            this.mapper.mouse.up(event.clientX-rect.left, event.clientY-rect.top, event.button);
        } else if (event.pointerType === 'touch' && this.pointers.size === 0 && this.mapper.touch?.end) {
            this.mapper.touch.end(event.clientX-rect.left, event.clientY-rect.top);
        }

        if (this.pointers.size < 2) {
            this.lastDistance = null;
            this.lastAngle = null;
            this.lastMidpoint = null;
        }
    };

    private onWheel = (event: WheelEvent) => {
        event.preventDefault();
        const rect = this.container.getBoundingClientRect();
        if (this.mapper.mouse?.wheel) {
            const delta = event.deltaY < 0 ? 1.0 / 1.2 : 1.2;
            this.mapper.mouse.wheel(event.clientX-rect.left, event.clientY-rect.top, delta);
        }
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
            x: (p1.x+p2.x) / 2,
            y: (p1.y+p2.y) / 2,
        };
    }

    private onKeydown = (event: KeyboardEvent) => {
        if (this.mapper.keyboard?.keydown)
            this.mapper.keyboard.keydown({ key: event.key, code: event.code, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey, altKey: event.altKey, metaKey: event.metaKey });
    };

    private onKeyup = (event: KeyboardEvent) => {
        if (this.mapper.keyboard?.keyup)
            this.mapper.keyboard.keyup({ key: event.key, code: event.code, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey, altKey: event.altKey, metaKey: event.metaKey });
    };

    public cleanup() {
        this.container.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointermove', this.onPointerMove);
        this.container.removeEventListener('pointerup', this.onPointerUp);
        this.container.removeEventListener('pointercancel', this.onPointerUp);
        this.container.removeEventListener('wheel', this.onWheel);
        this.container.removeEventListener('contextmenu', this.onContextmenu);

        document.removeEventListener('keydown', this.onKeydown);
        document.removeEventListener('keyup', this.onKeyup);
    }
}

export { InputListener };
