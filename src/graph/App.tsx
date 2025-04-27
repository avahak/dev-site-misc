import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { Graph } from './Graph';
import { DataSet, Point } from './types';

function randomGaussian(stdev: number=1): Point {
    const phi = 2*Math.PI*Math.random();
    const r = stdev * Math.sqrt(-2*Math.log(1-Math.random()));
    return { x: r*Math.cos(phi), y: r*Math.sin(phi) };
}

const App: React.FC = () => {
    const points: Point[] = [];
    for (let k = 0; k < 200000; k++) {
        points.push(randomGaussian());
    }
    const ds1: DataSet = { points: points, drawPoints: true, drawLines: true, color: 'red', primitiveScale: 2 };

    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    Graph (three.js)
                </Typography>
            </Box>
            <Box style={{ width: "100%", height: "600px" }}>
                <Graph dsArray={[ds1]} />
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export { App };