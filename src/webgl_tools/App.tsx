import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { SplineScene } from './splineScene';
import { TextScene } from './textScene';
import { MCDFFont } from './font';

const SplineSceneComponent: React.FC = () => { 
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const scene = new SplineScene(containerRef.current!);
        return () => {
            scene.cleanUp();
        };
    }, []);

    return (
        <Box style={{ width: "100%", height: "600px" }}>
            <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            </Suspense>
        </Box>
    );
};

const TextSceneComponent: React.FC = () => { 
    const containerRef = useRef<HTMLDivElement>(null);
    const [font, setFont] = useState<MCDFFont | null>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);

        const loadFont = async () => {
            try {
                const font = new MCDFFont();
                await font.load('test');
                setFont(font);
            } catch (error) {
                console.error("Failed to load MyObject:", error);
            }
        };

        loadFont();
    }, []);

    useEffect(() => {
        if (font) {
            const scene = new TextScene(containerRef.current!, font);
            return () => {
                scene.cleanUp();
            };
        }
    }, [font]);

    return (
        <Box style={{ width: "100%", height: "600px" }}>
            {!font ? (
                <Box display="flex" justifyContent="center">
                    <Typography>Loading font...</Typography>
                </Box>
            ) : (
            <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            </Suspense>
            )}
        </Box>
    );
};

const App: React.FC = () => {
    return (
        <Container maxWidth="lg">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    Rendering tools
                </Typography>
            </Box>
            <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", md: "row" },
                width: "100%", 
                height: "100%", 
                justifyContent: "center", 
                gap: "10px" 
            }}>
                <Box sx={{ width: { xs: "100%", md: "50%" }, height: "100%" }}>
                    <Suspense fallback={<Box justifyContent="center"><Typography>Loading..</Typography></Box>}>
                        <TextSceneComponent />
                    </Suspense>
                </Box>
                <Box sx={{ width: { xs: "100%", md: "50%" }, height: "100%" }}>
                    <Suspense fallback={<Box justifyContent="center"><Typography>Loading..</Typography></Box>}>
                        <SplineSceneComponent />
                    </Suspense>
                </Box>
            </Box>
            {/* <Typography sx={{my: 2}}>
                Text
            </Typography> */}
            <Box>
                <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                    Back
                </MUILink>
            </Box>
        </Container>
    );
};

export { App };