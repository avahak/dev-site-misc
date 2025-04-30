type GraphController = {
    transform: (x: number, y: number, dx: number, dy: number, scale: number, angle: number) => void;
    setLocation: (x: number, y: number, scale: number) => void;
    update: () => void;
};

type GraphProps = {
    dsArray: DataSet[];
    texts?: GraphText[];
    controllerRef?: React.MutableRefObject<GraphController|null>;
    xLabel?: string;
    yLabel?: string;
};

type Point = {
    x: number;
    y: number;
};

type GraphText = {
    p: Point;
    size: number;
    anchor?: number[];
    text: string;
    color?: number[];
    visibleScale?: number;      // scale level required for the text to be rendered
};

type DataSet = {
    points: Point[];
    drawPoints: boolean;
    drawLines: boolean;
    color: string;
    primitiveScale: number;     // width of lines / diameter of points in screen space
    label?: string;
};

export type { GraphController, GraphProps, Point, GraphText, DataSet };