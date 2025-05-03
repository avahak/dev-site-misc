import React, { useEffect, useRef } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { Graph } from './Graph';
import { DataSet, GraphController, GraphText, Point } from './types';

function randomGaussian(stdev: number=1): Point {
    const phi = 2*Math.PI*Math.random();
    const r = stdev * Math.sqrt(-2*Math.log(1-Math.random()));
    return { x: r*Math.cos(phi), y: r*Math.sin(phi) };
}

const App: React.FC = () => {
    const controllerRef = useRef<GraphController>(null);

    const points1: Point[] = [];
    const points2: Point[] = [];
    const points3: Point[] = [];
    const num = 10000;
    for (let k = 0; k < num; k++) {
        const t = randomGaussian(1).x;
        points1.push({ x: t, y: Math.sin(5*t)+randomGaussian(0.2).x });
        points2.push({ x: t, y: t*t + randomGaussian(0.1).x });
        points3.push({ x: t, y: Math.sin(20*t)+randomGaussian(0.05).x });
    }
    points1.sort((p1, p2) => p2.x - p1.x);
    points2.sort((p1, p2) => p2.x - p1.x);
    points3.sort((p1, p2) => p2.x - p1.x);
    const ds1: DataSet = { points: points1, drawPoints: true, drawLines: false, color: 'red', scale: 1, label: "Graph red" };
    const ds2: DataSet = { points: points2, drawPoints: true, drawLines: true, color: 'orange', scale: 2, label: "Graph orange" };
    const ds3: DataSet = { points: points3, drawPoints: false, drawLines: true, color: 'green', scale: 3 };
    const texts: GraphText[] = Array.from({ length: 1000 }).map((_, k) => ({ 
        p: randomGaussian(10), 
        size: 1, 
        color: [1, 1, 1], 
        text: `Text_${k}`,
        visibleScale: Math.exp(randomGaussian(1).x),
    }));
    texts.push({ 
        p: { x: 2, y: 1 }, 
        size: 1, 
        color: [1, 1, 1], 
        text: `(2, 1)`,
        anchor: [0, 0],
    });
    texts.push({ 
        p: { x: -1, y: -1 }, 
        size: 2, 
        color: [1, 1, 1], 
        text: `(-1, -1)`,
        anchor: [0, 0],
    });

    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    Graph (three.js)
                </Typography>
            </Box>
            <Button onClick={() => controllerRef.current?.setLocation(1, 1, 0.1)}>
                Go to (1, 1, 0.1)
            </Button>
            <Button onClick={() => controllerRef.current?.setLocation(-5, -2, 3)}>
                Go to (-5, -2, 3)
            </Button>
            <Button onClick={() => controllerRef.current?.setLocation(5, 1, 2)}>
                Go to (5, 1, 2)
            </Button>
            <Graph 
                data={[ds1, ds2]} 
                texts={texts} 
                xLabel="x-label!" 
                yLabel="y-label!" 
                controllerRef={controllerRef} 
                title={"First Graph component"}
            />
            <Graph 
                data={[ds2, ds3]} 
                texts={texts} 
                xLabel="x-label." 
                yLabel="y-label." 
                width="50%"
                height="200px" 
                title={"Second 626262"}
            />


            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export { App };