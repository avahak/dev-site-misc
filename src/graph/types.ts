type GraphController = {
    transform: (x: number, y: number, dx: number, dy: number, scale: number, angle: number) => void;
    setLocation: (x: number, y: number, scale: number) => void;
    update: () => void;
};

type GraphProps = {
    dsArray: DataSet[];
    controllerRef?: React.MutableRefObject<GraphController|null>;
};

type Point = {
    x: number;
    y: number;
};

type DataSet = {
    points: Point[];
    drawPoints: boolean;
    drawLines: boolean;
    color: string;              // could be number[]? Might change later
    primitiveScale: number;     // width of lines / diameter of points in scree space
};

export type { GraphController, GraphProps, Point, DataSet };