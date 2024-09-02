import React, { Suspense } from 'react';
import './App.css';
import { Box, createTheme, Link, ThemeProvider, Typography } from '@mui/material';
const ThreeScene = React.lazy(() => import('./ThreeScene'));
import CssBaseline from '@mui/material/CssBaseline';
import Tex2SVG from "react-hook-mathjax";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    Dzhanibekov effect
                </Typography>
            </Box>
            <Box style={{ width: "100%", height: "600px" }}>
            <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                <ThreeScene />
            </Suspense>
            </Box>
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography>
                    Compare with <Link href={"https://en.wikipedia.org/wiki/File:Dzhanibekov_effect.ogv"}>video</Link> on <Link href={"https://en.wikipedia.org/wiki/Tennis_racket_theorem"}>tennis racket theorem</Link> Wikipedia page.
                </Typography>
            </Box>
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography>
                    Equation for the rotation <Tex2SVG display="inline" latex="q\in\mathbb{H}" /> corresponding to matrix <Tex2SVG display="inline" latex="R" />:
                    <Tex2SVG latex="\omega=RI_0^{-1}R^tI_0\omega_0," />
                    <Tex2SVG latex="q'(t)=\frac{1}{2}\omega*q(t)." />
                </Typography>
            </Box>
        </ThemeProvider>
    );
};

export default App;