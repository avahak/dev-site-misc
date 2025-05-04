import { Box, Typography } from "@mui/material";
import { GraphProps, Point } from "./types";
import { GraphRenderer } from "./renderer";

type InspectionResult = {
    dist: number;
    p: Point;
    index?: number;
    isHit?: boolean;
    type?: "Point" | "Linesegment" | "Text";
    text?: string;
};

type TooltipProps = {
    x: number;
    y: number;
    visible: boolean;
    graphProps: GraphProps;
    renderer: GraphRenderer;
};

const getClosestPoint = (lx: number, ly: number, points: Point[]): InspectionResult => {
    let minDist = Infinity;
    let closestPoint: Point = points[0];
    let closestIndex = 0;

    points.forEach((point, index) => {
        const dist = Math.hypot(lx - point.x, ly - point.y);
        if (dist < minDist) {
            minDist = dist;
            closestPoint = point;
            closestIndex = index;
        }
    });

    return {
        dist: minDist,
        p: closestPoint,
        index: closestIndex
    };
};

const getClosestLineSegment = (lx: number, ly: number, points: Point[]): InspectionResult => {
    let minDist = Infinity;
    let closestPoint: Point = { x: 0, y: 0 };
    let closestIndex = 0;

    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len2 = dx * dx + dy * dy;

        if (len2 === 0) 
            continue;

        const t = Math.max(0, Math.min(1, ((lx - p1.x) * dx + (ly - p1.y) * dy) / len2));
        const cx = p1.x + t * dx;
        const cy = p1.y + t * dy;
        const dist = Math.hypot(lx - cx, ly - cy);

        if (dist < minDist) {
            minDist = dist;
            closestPoint = { x: cx, y: cy };
            closestIndex = i;
        }
    }

    return {
        dist: minDist,
        p: closestPoint,
        index: closestIndex
    };
};

const Tooltip: React.FC<TooltipProps> = ({ x, y, visible, graphProps, renderer }) => {
    const [screenX, screenY] = [x, y];
    const [localX, localY] = renderer.loc.localFromScreen(x, y);
    const [width, height] = renderer.getResolution();

    let minDist = Infinity;
    let inspectionResult: InspectionResult = { p: { x: localX, y: localY }, dist: minDist };

    // Check points
    graphProps.data.forEach((dataset, datasetIndex) => {
        if (dataset.drawPoints) {
            const result = getClosestPoint(localX, localY, dataset.points);
            const threshold = 0.05 * renderer.loc.scale;
            
            if (result.dist < minDist && result.dist < threshold) {
                minDist = result.dist;
                inspectionResult = {
                    ...result,
                    isHit: true,
                    type: "Point",
                    text: dataset.label || `Dataset ${datasetIndex}`
                };
            }
        }
    });

    // Check lines
    graphProps.data.forEach((dataset, datasetIndex) => {
        if (dataset.drawLines) {
            const result = getClosestLineSegment(localX, localY, dataset.points);
            const threshold = 0.02 * renderer.loc.scale;
            
            if (result.dist < 0.5 * minDist && result.dist < threshold) {
                minDist = result.dist;
                inspectionResult = {
                    ...result,
                    isHit: true,
                    type: "Linesegment",
                    text: dataset.label || `Dataset ${datasetIndex}`
                };
            }
        }
    });

    // Check texts
    graphProps.texts?.forEach((text, index) => {
        if (!text.visibleScale || text.visibleScale > renderer.loc.scale) {
            const dist = Math.hypot(localX - text.p.x, localY - text.p.y);
            const threshold = 0.05 * renderer.loc.scale;
            
            if (dist < minDist && dist < threshold) {
                minDist = dist;
                inspectionResult = {
                    dist,
                    p: text.p,
                    isHit: true,
                    index,
                    type: "Text",
                    text: text.text || `Text ${index}`
                };
            }
        }
    });

    const displayPoint = inspectionResult?.p || { x: localX, y: localY };
    const [displayScreenX, displayScreenY] = renderer.loc.screenFromLocal(displayPoint.x, displayPoint.y);

    return (
        <>
            <Box
                onContextMenu={(e) => e.preventDefault()}
                sx={{
                    minWidth: 240,
                    p: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 5,
                    position: 'absolute',
                    left: x < width - 300 ? x + 32 : undefined,
                    right: x >= width - 300 ? width - x + 32 : undefined,
                    top: y < height - 200 ? y : undefined,
                    bottom: y >= height - 200 ? height - y : undefined,
                    display: visible ? 'block' : 'none',
                    userSelect: 'text',
                    border: '3px solid orange'
                }}
            >
                <Typography variant="body2" textAlign="center">
                    P: ({displayPoint.x.toFixed(6)}, {displayPoint.y.toFixed(6)})
                </Typography>
                
                {inspectionResult.type && (
                    <Typography variant="body2" textAlign="center" color="text.secondary">
                        Index: {inspectionResult.type === "Linesegment" 
                            ? `${inspectionResult.index}-${inspectionResult.index! + 1}` 
                            : inspectionResult.index}
                        <br />
                        Type: {inspectionResult.type}
                        <br />
                        Source: {inspectionResult.text}
                    </Typography>
                )}
            </Box>

            <Box
                sx={{
                    width: 31,
                    height: 31,
                    bgcolor: inspectionResult?.isHit 
                        ? 'rgba(50, 250, 50, 0.5)' 
                        : 'rgba(250, 50, 50, 0.3)',
                    position: 'absolute',
                    left: displayScreenX,
                    top: displayScreenY,
                    display: visible ? 'block' : 'none',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none'
                }}
            />
        </>
    );
};

export { Tooltip };