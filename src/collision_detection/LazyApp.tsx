import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Collapse, Container, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';

import { RenderManager } from './hierarchical/lazyTest';
import { LazyVisualizationState } from './hierarchical/types';


const LazySceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewState, setViewState] = useState<LazyVisualizationState | null>(null);
    const [panelOpen, setPanelOpen] = useState<boolean>(true);

    useEffect(() => {
        if (!containerRef.current) return;

        const abortController = new AbortController();
        const manager = new RenderManager(containerRef.current);

        // Register the callback so RenderManager can push state updates to React
        manager.onStateUpdate = (newState: LazyVisualizationState) => {
            setViewState(newState);
        };

        manager.init(abortController.signal);

        return () => {
            abortController.abort();
            manager.dispose();
        };
    }, []);

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '600px' }}>
            {/* 3D Canvas Container */}
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

            {/* UI Overlay */}
            <Paper
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    width: 350,
                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                    color: 'white',
                    zIndex: 10,
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #444' }}>
                    <Typography variant="subtitle2" sx={{ ml: 1 }}>Tree Statistics</Typography>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => setPanelOpen(!panelOpen)}
                    >
                        {panelOpen ? 'Hide' : 'Show'}
                    </Button>
                </Box>

                <Collapse in={panelOpen}>
                    <Box sx={{ p: 2, maxHeight: '600px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '11px' }}>
                        {viewState ? (
                            <>
                                <div><strong>Core Settings</strong></div>
                                <div>Total Objects: {viewState.objectsCount}</div>
                                <div>Total Regions: {viewState.totalRegions}</div>
                                <div>Max level: {viewState.maxLevel}</div>
                                <div>Scaling Factor: {viewState.scalingFactor.toFixed(2)}</div>

                                <br />
                                <div><strong>Tree Distribution</strong></div>
                                <div>Regions: {viewState.regionsByLevelString}</div>
                                <div>Objects: {viewState.objectsByLevelString}</div>

                                <br />
                                <div><strong>Interaction</strong></div>
                                <div>{viewState.selectedObjectIndex !== null ? `Selected: Object ${viewState.selectedObjectIndex}` : 'Click to select object'}</div>
                                <div>Collisions found: {viewState.collisionsCount}</div>
                                <div style={{ whiteSpace: 'pre-wrap', marginLeft: '10px', marginTop: '5px' }}>{viewState.collisionsText}</div>
                            </>
                        ) : (
                            <div>Loading...</div>
                        )}
                    </Box>
                </Collapse>
            </Paper>
        </Box>
    );
};

const App: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
            <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography variant="h2">
                    Collision detection
                </Typography>
            </Box>
            <Box sx={{ position: "relative", width: "100%", height: "600px" }}>
                <LazySceneComponent />
            </Box>
        </Container>
    );
};

export default App;