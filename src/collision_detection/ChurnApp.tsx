import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Collapse, Container, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';

import { RenderManager } from './hierarchical/churn';


const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const abortController = new AbortController();
        const manager = new RenderManager(containerRef.current);
        manager.init(abortController.signal);

        return () => {
            abortController.abort();
            manager.dispose();
        };
    }, []);

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '600px' }}>
            < div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </Box>
    );
};

const App: React.FC = () => {
    return (
        <Container maxWidth="xl" >
            <MUILink component={RouterLink} to="/" variant="body1" color="primary" >
                Back
            </MUILink>
            < Box display="flex" justifyContent="center" sx={{ py: 2 }
            }>
                <Typography variant="h2" >
                    Collision detection churn for n=1
                </Typography>
            </Box>
            < Box sx={{ position: "relative", width: "100%", height: "600px" }}>
                <SceneComponent />
            </Box>
            <MUILink component={RouterLink} to="/collision_detection_notes" variant="body1" color="primary">
                Notes
            </MUILink>
        </Container>
    );
};

export default App;