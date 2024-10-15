import React, { Suspense } from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
const SceneComponent = React.lazy(() => import('./ThreeComponent'));

const App: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    Fractal stuff
                </Typography>
            </Box>
            <Box style={{ width: "100%", height: "80vh" }}>
            <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                <SceneComponent />
            </Suspense>
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