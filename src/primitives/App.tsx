import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { SplineScene } from './splineScene';
import { TextScene } from './textScene';
import { MCSDFFont } from './font';

const SplineSceneComponent: React.FC = () => { 
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const scene = new SplineScene(containerRef.current!);
        return () => {
            scene.dispose();
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
    const [font1, setFont1] = useState<MCSDFFont | null>(null);
    const [font2, setFont2] = useState<MCSDFFont | null>(null);
    const [sampleText, setSampleText] = useState<string | null>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);

        const loadFonts = async () => {
            try {
                // times64 consola64 gara64 (cmunci64) cmunrm64
                const font1 = new MCSDFFont();
                await font1.load('times64');
                // await font1.load('gara64');
                const font2 = new MCSDFFont();
                await font2.load('consola64');
                // await font2.load('cmunrm64');
                setFont1(font1);
                setFont2(font2);

                const response = await fetch(`/dev-site-misc/text/cap.txt`);
                if (!response.ok) {
                    throw new Error('Failed to fetch text file');
                }
                let text = await response.text();

                const replacements: Record<number, string> = { 8217: "'", 8220: '"', 8221: '"', 95: '', 13: '' };
                const regex = new RegExp(`[${Object.keys(replacements).map(Number).map(c => String.fromCharCode(c)).join('')}]`, 'g');
                text = text.replace(regex, char => replacements[char.charCodeAt(0)]);
                // console.log('text', Array.from(text.slice(0, 500)).map((value) => [value, value.charCodeAt(0)]));

                setSampleText(text);
            } catch (error) {
                console.error("Failed to load text resources:", error);
            }
        };

        loadFonts();
    }, []);

    useEffect(() => {
        if (font1 && font2 && sampleText) {
            const scene = new TextScene(containerRef.current!, font1, font2, sampleText);
            return () => {
                scene.dispose();
            };
        }
    }, [font1, font2, sampleText]);

    return (
        <Box style={{ width: "100%", height: "600px" }}>
            {!(font1 && font2 && sampleText) ? (
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
            {/* <Box sx={{ 
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
            </Box> */}
            <Box sx={{ width: "100%", height: "100%" }}>
                <Suspense fallback={<Box justifyContent="center"><Typography>Loading..</Typography></Box>}>
                    <TextSceneComponent />
                </Suspense>
            </Box>
            <Box sx={{ width: "100%", height: "100%" }}>
                <Suspense fallback={<Box justifyContent="center"><Typography>Loading..</Typography></Box>}>
                    <SplineSceneComponent />
                </Suspense>
            </Box>
            <Box>
                <Typography sx={{my: 2}}>
                    Rendering text using multi-channel signed distance fields and instancing. 
                    Rendering uniform cubic B-splines using instancing. Fisheye effect is using
                    stereographic projection.
                </Typography>
            </Box>
            <Box>
                <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                    Back
                </MUILink>
            </Box>
        </Container>
    );
};

export { App };