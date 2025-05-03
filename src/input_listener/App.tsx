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
                drag: (args) => {
                    // if ((buttons & 2) !== 0 || (buttons & 4) !== 0)
                    if ((args.buttons & 1) !== 0)
                        scene.inputTransform(args.x, args.y, args.dx, args.dy, 1, 0);
                    // if ((buttons & 1) !== 0)
                    //     scene.inputAction(x, y);
                },
                // down: (args) => (args.button === 2) && scene.inputAction(args.x, args.y),
                move: (args) => scene.inputMove(args.x, args.y),
            },
            wheel: {
                zoom: (args) => {
                    console.log(args);
                    scene.inputTransform(args.x, args.y, 0, 0, 1-0.001*args.delta, 0);
                },
                pan: (args) => {
                    console.log(args);
                    scene.inputTransform(args.x, args.y, 0, 0, 1, 0);
                },
            },
            touch: {
                // start: (x, y) => scene.inputAction(x, y),
                dragSingle: (args) => scene.inputTransform(args.x, args.y, args.dx, args.dy, 1, 0),
                dragPair: (args) => scene.inputTransform(args.x, args.y, args.dx, args.dy, 1/args.scale, args.angle),
            },
            keyboard: {
                keydown: (args) => { 
                    console.log('key', args);
                    if (args.key === "-") 
                        scene.inputTransform(0, 0, 0, 0, 1.0/1.2, 0); 
                    if (args.key === "+") 
                        scene.inputTransform(0, 0, 0, 0, 1.2, 0); 
                    if (args.key == "ArrowLeft")
                        scene.inputTransform(scene.getResolution().x/2, scene.getResolution().y/2, 0, 0, 1, -Math.PI/64); 
                    if (args.key == "ArrowRight")
                        scene.inputTransform(scene.getResolution().x/2, scene.getResolution().y/2, 0, 0, 1, Math.PI/64); 
                },
            },
            safariGesture: {
                change: (args) => scene.inputTransform(0, 0, 0, 0, args.scale, args.angle),
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