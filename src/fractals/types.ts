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

export type { MandelbrotWorkOrder, JuliaWorkOrder, 
    MandelbrotWorkProgress, JuliaWorkProgress };