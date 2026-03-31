import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { Scene as WoodScene } from './woodScene';
import { Scene as ViewerScene } from './viewerScene';

const WoodSceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const woodScene = new WoodScene(containerRef.current!);
        return () => {
            woodScene.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const ViewerSceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const viewerScene = new ViewerScene(containerRef.current!);
        return () => {
            viewerScene.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const App: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    Solid textures
                </Typography>
            </Box>
            {/* <Box style={{ width: "100%", height: "600px" }}>
                <WoodSceneComponent />
            </Box> */}
            <Box style={{ width: "100%", height: "600px" }}>
                <ViewerSceneComponent />
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export { App };