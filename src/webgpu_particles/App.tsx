import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { RenderManager } from './manager';

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const abortController = new AbortController();
        const manager = new RenderManager(containerRef.current!);
        manager.init(abortController.signal);
        return () => {
            abortController.abort();
            manager.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export const App: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography variant="h2">
                    WebGPU particles
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