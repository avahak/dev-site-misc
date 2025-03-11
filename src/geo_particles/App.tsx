import React, { Suspense, useEffect, useRef } from 'react';
import { Box, Container, createTheme, ThemeProvider, Typography } from '@mui/material';
import ContentComponent from './ContentComponent';
const SceneComponent = React.lazy(() => import('./ThreeComponent'));

const customDarkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
        fontSize: 12,
    }
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={customDarkTheme}>
            <Container maxWidth="md" sx={{width: "100%", height: "100dvh", position: "relative"}}>
                <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                    <SceneComponent />
                </Suspense>
                <Box sx={{position: "absolute", bottom: 0, left: -70, zIndex: -1}}>
                    <img style={{height: "30vh"}} src={"/dev-site-misc/socials/phone3.png"}></img>
                </Box>
                <ContentComponent />
            </Container>
        </ThemeProvider>
    );
};

export { App };