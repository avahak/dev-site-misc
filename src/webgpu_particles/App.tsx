import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { RenderManager } from './manager';
import { InputListener } from '../inputListener';

const createHandler = (containerRef: React.RefObject<HTMLDivElement | null>, manager: RenderManager) => {
    let [x, y] = [0, 0];
    return new InputListener(containerRef.current!, {
        mouse: {
            down: (args) => {
                [x, y] = [args.x, args.y];
            },
            up: (args) => {
                const dist = Math.hypot(args.x - x, args.y - y);
                if (dist < 5)
                    manager.interact(args.x, args.y);
            },
        },
    }, true);
}

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const abortController = new AbortController();
        const manager = new RenderManager(containerRef.current!);
        const handler = createHandler(containerRef, manager);
        manager.init(abortController.signal);
        return () => {
            abortController.abort();
            manager.dispose();
            handler.cleanup();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const App: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography variant="h2">
                    WebGPU particles
                </Typography>
            </Box>
            <Box style={{ width: "100%", height: "600px", position: "relative" }}>
                <SceneComponent />
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export default App;