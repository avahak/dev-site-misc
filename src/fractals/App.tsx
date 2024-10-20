import React, { Suspense, useState } from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { CircularButton } from '../CircularButton';
const SceneComponent = React.lazy(() => import('./ThreeComponent'));

const App: React.FC = () => {
    const [showMandelbrot, setShowMandelbrot] = useState<boolean>(true);
    const [showJulia, setShowJulia] = useState<boolean>(true);

    return (
        <Container maxWidth="lg">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    Mandelbrot, Julia
                </Typography>
            </Box>
            <Box sx={{ position: "relative", width: "100%", height: "80vh" }}>
                <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                    <SceneComponent showMandelbrot={showMandelbrot} showJulia={showJulia} />
                </Suspense>
                <Box sx={{ position: "absolute", top: "1em", left: "1em" }}>
                    <Box>
                        <CircularButton Icon={"M"} onClick={() => { setShowMandelbrot(v => !v) }} />
                    </Box>
                    <Box sx={{mt: 3}}>
                        <CircularButton Icon={"J"} onClick={() => { setShowJulia(v => !v) }} />
                    </Box>
                </Box>
            </Box>
            <Typography sx={{my: 2}}>
                Julia set move: Left mouse button or single touch<br />
                Mandelbrot set move: Right or middle mouse button, or two-finger touch drag<br />
                Mandelbrot set zoom: Scroll wheel, + or - keys, or pinch-to-zoom
                <br /><br />
                Note that GLSL float precision is limited to maximum of 32 bits, which limits zooming.
            </Typography>
            <Box>
                <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                    Back
                </MUILink>
            </Box>
        </Container>
    );
};

export { App };