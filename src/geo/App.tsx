import React, { Suspense, useEffect, useState } from 'react';
import { Box, Container, FormControl, FormHelperText, MenuItem, Select, Typography, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { ProjectionType, ProjectionSelector } from './ProjectionSelector';
import { CountryInfo } from './geoTypes';
import { CountryCard } from './CountryCard';
const GeoComponent = React.lazy(() => import('./GeoSceneCanvas').then(module => ({ default: module.GeoScene })));

const App: React.FC = () => {
    const isWide = useMediaQuery('(min-width: 768px)');
    const [projectionType, setProjectionType] = useState<ProjectionType>("Orthographic");
    const [countryInfo, setCountryInfo] = useState<CountryInfo|null>(null);

    const renderMobile = () => (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    d3.js
                </Typography>
            </Box>
            <Box>
                <Box>
                    <ProjectionSelector projectionType={projectionType} setProjectionType={setProjectionType} />
                </Box>
                <Box style={{ width: "100%", height: "45vh" }}>
                    <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                        <GeoComponent projectionType={projectionType} setCountryInfo={setCountryInfo} />
                    </Suspense>
                </Box>
                <Box>
                    <CountryCard countryInfo={countryInfo} wide />
                </Box>
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );

    const renderWide = () => (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    d3.js wide
                </Typography>
            </Box>
            <Box style={{ "position": "relative" }}>
                <Box>
                    <ProjectionSelector projectionType={projectionType} setProjectionType={setProjectionType} />
                </Box>
                <Box style={{ width: "100%", height: "70vh" }}>
                    <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                        <GeoComponent projectionType={projectionType} setCountryInfo={setCountryInfo} />
                        <Box sx={{ "position": "absolute", right: "0.5em", top: "0.5em" }}>
                            <CountryCard countryInfo={countryInfo} />
                        </Box>
                    </Suspense>
                </Box>
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );

    return isWide ? renderWide() : renderMobile();
};

export { App };