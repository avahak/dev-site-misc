type GraphController = {
    transform: (x: number, y: number, dx: number, dy: number, scale: number, angle: number) => void;
    setLocation: (x: number, y: number, scale: number) => void;
    update: () => void;
};

type GraphProps = {
    data: DataSet[];
    texts?: GraphText[];
    controllerRef?: { current: GraphController | null };
    xLabel?: string;
    yLabel?: string;
    width?: string;
    height?: string;
    title?: string;
    location?: { x: number, y: number, scaleX: number, scaleY: number };     // initial location
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
    visibleScaleX?: number;      // scale level required for the text to be rendered
};

type DataSet = {
    points: Point[];
    scale: number;              // width of lines / diameter of points in screen space
    color: string;
    opacity?: number;
    drawPoints?: boolean;
    drawLines?: boolean;
    label?: string;

    groupName?: string;         // name for DataSet, for hiding groups if needed
    isVisible?: boolean;

    inspectInfo?: (k: number) => void;       // extra info sent to console.log on inspect
};

export type { GraphController, GraphProps, Point, GraphText, DataSet };