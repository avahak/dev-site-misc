import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { RenderManager } from './shaderManager';
import { InputListener } from '../../inputListener';

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current)
            return;

        const abortController = new AbortController();
        const manager = new RenderManager(containerRef.current);
        manager.init(abortController.signal);

        const handler = new InputListener(containerRef.current!, {
            mouse: {
                drag: (args) => {
                    // if ((buttons & 2) !== 0 || (buttons & 4) !== 0)
                    if ((args.buttons & 1) !== 0)
                        manager.inputTransform(args.x, args.y, args.dx, args.dy);
                    // if ((buttons & 1) !== 0)
                    //     manager.inputAction(x, y);
                },
                // down: (args) => (args.button === 2) && manager.inputAction(args.x, args.y),
                // move: (args) => manager.inputMove(args.x, args.y),
            },
            wheel: {
                // zoom: (args) => {
                //     console.log(args);
                //     manager.inputTransform(args.x, args.y, 0, 0, 1 - 0.001 * args.delta, 0);
                // },
                // pan: (args) => {
                //     console.log(args);
                //     manager.inputTransform(args.x, args.y, 0, 0, 1, 0);
                // },
            },
            touch: {
                // start: (x, y) => scene.inputAction(x, y),
                dragSingle: (args) => manager.inputTransform(args.x, args.y, args.dx, args.dy),
                dragPair: (args) => manager.inputTransform(args.x, args.y, args.dx, args.dy),
            },
            // keyboard: {
            //     keydown: (args) => {
            //         console.log('key', args);
            //         if (args.key === "-")
            //             manager.inputTransform(0, 0, 0, 0, 1.0 / 1.2, 0);
            //         if (args.key === "+")
            //             manager.inputTransform(0, 0, 0, 0, 1.2, 0);
            //         if (args.key == "ArrowLeft")
            //             manager.inputTransform(scene.getResolution().x / 2, scene.getResolution().y / 2, 0, 0, 1, -Math.PI / 64);
            //         if (args.key == "ArrowRight")
            //             manager.inputTransform(scene.getResolution().x / 2, scene.getResolution().y / 2, 0, 0, 1, Math.PI / 64);
            //     },
            // },
            // safariGesture: {
            //     change: (args) => manager.inputTransform(args.x, args.y, 0, 0),
            // },
        });

        return () => {
            abortController.abort();
            manager.dispose();
            handler.cleanup();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }}
        />
    );
};

const App: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography variant="h2">
                    Hyperbolic space
                </Typography>
            </Box>
            <Box sx={{ position: "relative", width: "100%", height: "600px" }}>
                <SceneComponent />
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export default App;