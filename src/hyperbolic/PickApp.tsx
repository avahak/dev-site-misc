import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { AppController } from './pickUi';

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const abortController = new AbortController();
        const controller = new AppController(containerRef.current);

        controller.start(abortController.signal);

        return () => {
            abortController.abort();
            controller.dispose();
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