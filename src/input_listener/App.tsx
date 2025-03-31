import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { Scene } from './scene';
import { InputListener } from '../inputListener';

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const scene = new Scene(containerRef.current!);

        const handler = new InputListener(containerRef.current!, {
            mouse: {
                drag: (x, y, dx, dy, buttons) => {
                    // if ((buttons & 2) !== 0 || (buttons & 4) !== 0)
                    if ((buttons & 1) !== 0)
                        scene.inputTransform(x, y, dx, dy, 1, 0);
                    // if ((buttons & 1) !== 0)
                    //     scene.inputAction(x, y);
                },
                wheel: (x, y, delta) => scene.inputTransform(x, y, 0, 0, 1/delta, 0),
                down: (x, y, button) => (button === 2) && scene.inputAction(x, y),
                move: (x, y, isInside) => scene.inputMove(x, y),
            },
            touch: {
                // start: (x, y) => scene.inputAction(x, y),
                dragSingle: (x, y, dx, dy) => scene.inputTransform(x, y, dx, dy, 1, 0),
                dragPair: (x, y, dx, dy, scale, angle) => scene.inputTransform(x, y, dx, dy, 1/scale, angle),
            },
            keyboard: {
                keydown: (params) => { 
                    if (params.key === "-") 
                        scene.inputTransform(0, 0, 0, 0, 1.0/1.2, 0); 
                    if (params.key === "+") 
                        scene.inputTransform(0, 0, 0, 0, 1.2, 0); 
                },
            },
        });

        return () => {
            scene.dispose();
            handler.cleanup();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const App: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    Input listener
                </Typography>
            </Box>
            <Box style={{ width: "100%", height: "600px" }}>
                <SceneComponent />
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export { App };