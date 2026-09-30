import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Collapse, Container, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';

// import { RenderManager } from './hierarchical/test2d';
import { RenderManager } from './hierarchical/test3d';
import { VisualizationState } from './hierarchical/types';


const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewState, setViewState] = useState<VisualizationState | null>(null);
    const [panelOpen, setPanelOpen] = useState<boolean>(true);

    useEffect(() => {
        if (!containerRef.current) return;

        const abortController = new AbortController();
        const manager = new RenderManager(containerRef.current);

        // Register the callback so RenderManager can push state updates to React
        manager.onStateUpdate = (newState: VisualizationState) => {
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

                                {viewState.treeStats && (
                                    <>
                                        <br />
                                        <div><strong>Region Health</strong></div>
                                        <div>Populated: {viewState.treeStats.populatedPercentage.toFixed(1)}%</div>
                                        <div>Max children ever: {viewState.treeStats.historicalMaxChildren}</div>

                                        <br />
                                        <div><strong>N(R)</strong></div>
                                        <div>Max: {viewState.treeStats.nCounts.max} | Mean: {viewState.treeStats.nCounts.mean.toFixed(2)}</div>
                                        <div>P10: {viewState.treeStats.nCounts.percentiles.p10} | P50: {viewState.treeStats.nCounts.percentiles.p50} | P90: {viewState.treeStats.nCounts.percentiles.p90}</div>
                                        <div><strong>D(R)</strong></div>
                                        <div>Max: {viewState.treeStats.dCounts.max} | Mean: {viewState.treeStats.dCounts.mean.toFixed(2)}</div>
                                        <div>P10: {viewState.treeStats.dCounts.percentiles.p10} | P50: {viewState.treeStats.dCounts.percentiles.p50} | P90: {viewState.treeStats.dCounts.percentiles.p90}</div>
                                        <div><strong>E'(R)</strong></div>
                                        <div>Max: {viewState.treeStats.eCounts.max} | Mean: {viewState.treeStats.eCounts.mean.toFixed(2)}</div>
                                        <div>P10: {viewState.treeStats.eCounts.percentiles.p10} | P50: {viewState.treeStats.eCounts.percentiles.p50} | P90: {viewState.treeStats.eCounts.percentiles.p90}</div>
                                        <div><strong>F(R)</strong></div>
                                        <div>Max: {viewState.treeStats.fCounts.max} | Mean: {viewState.treeStats.fCounts.mean.toFixed(2)}</div>
                                        <div>P10: {viewState.treeStats.fCounts.percentiles.p10} | P50: {viewState.treeStats.fCounts.percentiles.p50} | P90: {viewState.treeStats.fCounts.percentiles.p90}</div>
                                        <div><strong>A(R)</strong></div>
                                        <div>Max: {viewState.treeStats.aCounts.max} | Mean: {viewState.treeStats.aCounts.mean.toFixed(2)}</div>
                                        <div>P10: {viewState.treeStats.aCounts.percentiles.p10} | P50: {viewState.treeStats.aCounts.percentiles.p50} | P90: {viewState.treeStats.aCounts.percentiles.p90}</div>

                                        <br />
                                        <div><strong>Clearances</strong></div>
                                        <div>Minimum normalized separation: {(100 * viewState.treeStats.normalizedRegionSeparation).toFixed(3)}%</div>
                                        <div>1-sided clearance survival: {(100 * viewState.treeStats.clearanceSurvivalFraction).toFixed(3)}%</div>


                                        <br />
                                        <div><strong>Children / Region</strong></div>
                                        <div>Max: {viewState.treeStats.childrenStats.max} | Mean: {viewState.treeStats.childrenStats.mean.toFixed(2)}</div>
                                        <div>P10: {viewState.treeStats.childrenStats.percentiles.p10} | P50: {viewState.treeStats.childrenStats.percentiles.p50} | P90: {viewState.treeStats.childrenStats.percentiles.p90}</div>

                                        <br />
                                        <div><strong>Objects / Populated Region</strong></div>
                                        <div>Max: {viewState.treeStats.objectStats.max} | Mean: {viewState.treeStats.objectStats.mean.toFixed(2)}</div>
                                        <div>P10: {viewState.treeStats.objectStats.percentiles.p10} | P50: {viewState.treeStats.objectStats.percentiles.p50} | P90: {viewState.treeStats.objectStats.percentiles.p90}</div>

                                        <br />
                                        <div><strong>Neighbors / Populated Region</strong></div>
                                        <div>Max: {viewState.treeStats.neighborStats.max} | Mean: {viewState.treeStats.neighborStats.mean.toFixed(2)}</div>
                                        <div>P10: {viewState.treeStats.neighborStats.percentiles.p10} | P50: {viewState.treeStats.neighborStats.percentiles.p50} | P90: {viewState.treeStats.neighborStats.percentiles.p90}</div>
                                    </>
                                )}
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
                <SceneComponent />
            </Box>
        </Container>
    );
};

export default App;