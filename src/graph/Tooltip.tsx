import { Box, Typography } from "@mui/material";
import { DataSet, GraphProps, Point } from "./types";
import { GraphRenderer } from "./renderer";
import { PlaneView } from "./planeView";

type InspectionResult = {
    dist: number;
    p: Point;
    ds?: DataSet;
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

const getClosestPoint = (worldX: number, worldY: number, points: Point[], loc: PlaneView): InspectionResult => {
    let minDist = Infinity;
    let closestPoint: Point = points[0];
    let closestIndex = 0;

    points.forEach((point, index) => {
        const [wx, wy] = loc.worldFromLocal(point.x, point.y);
        const dist = Math.hypot(worldX-wx, worldY-wy);
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

const getClosestLineSegment = (worldX: number, worldY: number, points: Point[], loc: PlaneView): InspectionResult => {
    let minDist = Infinity;
    let closestPoint: Point = { x: 0, y: 0 };
    let closestIndex = 0;

    for (let i = 0; i < points.length - 1; i++) {
        const [p1x, p1y] = loc.worldFromLocal(points[i].x, points[i].y);
        const [p2x, p2y] = loc.worldFromLocal(points[i+1].x, points[i+1].y);
        
        const dx = p2x - p1x;
        const dy = p2y - p1y;
        const len2 = dx*dx + dy*dy;

        if (len2 === 0) 
            continue;

        const t = Math.max(0, Math.min(1, ((worldX - p1x) * dx + (worldY - p1y) * dy) / len2));
        const cx = p1x + t*dx;
        const cy = p1y + t*dy;
        const dist = Math.hypot(worldX-cx, worldY-cy);

        if (dist < minDist) {
            const [lcx, lcy] = loc.localFromWorld(cx, cy);
            minDist = dist;
            closestPoint = { x: lcx, y: lcy };
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
    const [localX, localY] = renderer.loc.localFromScreen(x, y);
    const [worldX, worldY] = renderer.loc.worldFromScreen(x, y);
    const [width, height] = renderer.getResolution();

    let minDist = Infinity;
    let inspectionResult: InspectionResult = { p: { x: localX, y: localY }, dist: minDist };

    // Check points
    graphProps.data.forEach((dataset, datasetIndex) => {
        if (dataset.drawPoints && dataset.isVisible) {
            const result = getClosestPoint(worldX, worldY, dataset.points, renderer.loc);
            const threshold = 0.05;
            
            if (result.dist < minDist && result.dist < threshold) {
                minDist = result.dist;
                inspectionResult = {
                    ...result,
                    ds: dataset,
                    isHit: true,
                    type: "Point",
                    text: dataset.label || `Dataset ${datasetIndex}`
                };
            }
        }
    });

    // Check lines
    graphProps.data.forEach((dataset, datasetIndex) => {
        if (dataset.drawLines && dataset.isVisible) {
            const result = getClosestLineSegment(worldX, worldY, dataset.points, renderer.loc);
            const threshold = 0.02;
            
            if (result.dist < 0.5 * minDist && result.dist < threshold) {
                minDist = result.dist;
                inspectionResult = {
                    ...result,
                    ds: dataset,
                    isHit: true,
                    type: "Linesegment",
                    text: dataset.label || `Dataset ${datasetIndex}`
                };
            }
        }
    });

    // Check texts
    graphProps.texts?.forEach((text, index) => {
        if (!text.visibleScaleX || text.visibleScaleX > renderer.loc.scaleX) {
            const [wx, wy] = renderer.loc.worldFromLocal(text.p.x, text.p.y);
            const dist = Math.hypot(worldX-wx, worldY-wy);
            const threshold = 0.05;
            
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

    // console.log the result with possible extra info from inspectInfo:
    if (visible) {
        console.log('Inspection:', inspectionResult.p);
        if (inspectionResult.ds && inspectionResult.ds.inspectInfo) {
            if (inspectionResult.type == "Linesegment") {
                console.log('Line point 1:', inspectionResult.ds.inspectInfo(inspectionResult.index!));
                console.log('Line point 2:', inspectionResult.ds.inspectInfo(inspectionResult.index!+1));
            } else 
                console.log('Point:', inspectionResult.ds.inspectInfo(inspectionResult.index!));
        }
    }


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