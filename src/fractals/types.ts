interface PointerInputHandler {
    pointerInput: (dx: number, dy: number, scale: number, angle: number) => void;
};

type WorkOrder = {
    zoomCenter: [number, number];
    zoomScale: number;

    samplesPerAxis: number;
    iterations: number;
};

type WorkProgress = WorkOrder & {
    currentIteration: number;
    currentSample: number;      // goes to samplesPerAxis^2
    isComplete: boolean;
};

export type { PointerInputHandler, WorkOrder, WorkProgress };