import React, { Suspense } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
const GeoComponent = React.lazy(() => import('./GeoSceneCanvas').then(module => ({ default: module.GeoScene })));

const App: React.FC = () => {

    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    Scandinavia JSON
                </Typography>
            </Box>
            <Box>
                <Box>
                    <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                        <GeoComponent />
                    </Suspense>
                </Box>
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export { App };