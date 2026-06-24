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
        const scene = solidTest ? new SolidRenderManager(containerRef.current!) : new ViewerRenderManager(containerRef.current!);
        return () => {
            scene.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const App: React.FC<{ solidTest: boolean }> = ({ solidTest }) => {
    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography variant="h2">
                    Solid textures
                </Typography>
            </Box>
            {/* <Box style={{ width: "100%", height: "600px" }}>
                <WoodSceneComponent />
            </Box> */}
            <Box style={{ width: "100%", height: "600px" }}>
                <SceneComponent solidTest={solidTest} />
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export { App };