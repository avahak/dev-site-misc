import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { Graph } from './Graph';
import { DataSet, GraphText, Point } from './types';

function randomGaussian(stdev: number=1): Point {
    const phi = 2*Math.PI*Math.random();
    const r = stdev * Math.sqrt(-2*Math.log(1-Math.random()));
    return { x: r*Math.cos(phi), y: r*Math.sin(phi) };
}

const App: React.FC = () => {
    const points1: Point[] = [];
    const points2: Point[] = [];
    const points3: Point[] = [];
    const num = 10000;
    for (let k = 0; k < num; k++) {
        const t = randomGaussian(1).x;
        points1.push({ x: t, y: Math.sin(5*t)+randomGaussian(0.2).x });
        points2.push({ x: t, y: Math.sin(10*t)+randomGaussian(0.1).x });
        points3.push({ x: t, y: Math.sin(20*t)+randomGaussian(0.05).x });
    }
    points1.sort((p1, p2) => p2.x - p1.x);
    points2.sort((p1, p2) => p2.x - p1.x);
    points3.sort((p1, p2) => p2.x - p1.x);
    const ds1: DataSet = { points: points1, drawPoints: true, drawLines: false, color: 'red', primitiveScale: 1, label: "Graph red" };
    const ds2: DataSet = { points: points2, drawPoints: true, drawLines: true, color: 'orange', primitiveScale: 2, label: "Graph orange" };
    const ds3: DataSet = { points: points3, drawPoints: false, drawLines: true, color: 'green', primitiveScale: 3 };
    const texts: GraphText[] = Array.from({ length: 1000 }).map((_, k) => ({ 
        p: randomGaussian(10), 
        size: 0.05, 
        color: [1, 1, 1], 
        text: `Text_${k}`,
        visibleScale: Math.exp(randomGaussian(1).x),
    }));

    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    ._Graph (three.js)
                </Typography>
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>

            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds1, ds2]} texts={texts} xLabel="x-label" yLabel="y-label" />
            </Box>
            <Box style={{ width: "100%", height: "600px", padding: "20px" }}>
                <Graph dsArray={[ds2, ds3]} texts={texts} />
            </Box>

            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export { App };