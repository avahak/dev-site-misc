interface PointerHandler {
    pointerInput?: (dx: number, dy: number, scale: number, angle: number) => void;
    pointerMove?: (x: number, y: number, left: number, top: number, isInside: boolean) => void;
};

type MandelbrotWorkOrder = {
    zoomCenter: [number, number];
    zoomScale: number;

    samplesPerAxis: number;
    iterations: number;
};

type JuliaWorkOrder = {
    c: [number, number];
    zoomScale: number;

    samplesPerAxis: number;
    iterations: number;
};

type Progress = {
    currentIteration: number;
    currentSample: number;      // goes to samplesPerAxis^2
    isComplete: boolean;
};

type MandelbrotWorkProgress = MandelbrotWorkOrder & Progress;
type JuliaWorkProgress = JuliaWorkOrder & Progress;

export type { PointerHandler, MandelbrotWorkOrder, JuliaWorkOrder, 
    MandelbrotWorkProgress, JuliaWorkProgress };