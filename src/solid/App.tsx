import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { RenderManager as ViewerRenderManager } from './viewerManager';
import { RenderManager as SolidRenderManager } from './solidManager';


const SceneComponent: React.FC<{ solidTest: boolean }> = ({ solidTest }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const abortController = new AbortController();
        const manager = solidTest ? new SolidRenderManager(containerRef.current!) : new ViewerRenderManager(containerRef.current!);
        manager.init(abortController.signal);
        return () => {
            abortController.abort();
            manager.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const App: React.FC<{ solidTest: boolean }> = ({ solidTest }) => {
    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography variant="h2">
                    {solidTest && "Solid textures and wood"}
                    {!solidTest && "Solid textures and clipping"}
                </Typography>
            </Box>
            {/* <Box style={{ width: "100%", height: "600px" }}>
                <WoodSceneComponent />
            </Box> */}
            <Box style={{ width: "100%", height: "600px" }}>
                <SceneComponent solidTest={solidTest} />
            </Box>
            {solidTest && <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography variant="body1">
                    Based and modified from:
                    "Procedural texturing of solid wood with knots." Larsson, M., et al.
                    <em>ACM Trans. Graph.</em>, vol. 41, no. 4, 2022.
                </Typography>
            </Box>}
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export { App };