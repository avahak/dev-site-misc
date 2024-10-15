import React, { Suspense, useState } from 'react';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { ProjectionSelector } from './settings/ProjectionSelector';
import { CountryInfo, Settings } from './geoTypes';
import { CountryCard } from './CountryCard';
import HandymanIcon from '@mui/icons-material/Handyman';
import { CircularButton } from './CircularButton';
import { SettingsComponent } from './settings/SettingsComponent';
const GeoComponent = React.lazy(() => import('./GeoSceneCanvas').then(module => ({ default: module.GeoScene })));

const defaultSettings: Settings = {
    projectionType: "Orthographic",
    graticule: "10",
};

const App: React.FC = () => {
    const isWide = useMediaQuery('(min-width: 768px)');
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [countryInfo, setCountryInfo] = useState<CountryInfo|null>(null);

    const toggle = () => {
        console.log("toggle");
        setIsSettingsOpen(value => !value);
    };

    const renderMobile = () => (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{py: 2}}>
                <Typography variant="h2">
                    d3.js
                </Typography>
            </Box>
            <Box sx={{ position: "relative" }}>
                <Box>
                    <Box sx={{ position: "relative", width: "100%", height: "50vh" }}>
                        <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                            <GeoComponent projectionType={settings.projectionType} setCountryInfo={setCountryInfo} />
                        </Suspense>
                        <Box sx={{ position: "absolute", bottom: "0.5em", right: "0.5em" }}>
                            <CircularButton Icon={HandymanIcon} onClick={toggle} />
                        </Box>
                    </Box>
                    <Box>
                        <CountryCard countryInfo={countryInfo} />
                    </Box>
                </Box>
                { isSettingsOpen &&
                <Box sx={{ position: "absolute", top: "0.5em", left: "0.5em", background: "#444" }}>
                    <SettingsComponent settings={settings} setSettings={setSettings} onDismiss={toggle} />
                </Box>}
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
                <Box style={{ width: "100%", height: "70vh" }}>
                    <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                        <GeoComponent projectionType={settings.projectionType} setCountryInfo={setCountryInfo} />
                        <Box sx={{ "position": "absolute", right: "0.5em", top: "0.5em" }}>
                            <CountryCard countryInfo={countryInfo} wide />
                        </Box>
                    </Suspense>
                </Box>
                <Box sx={{ position: "absolute", top: "0.5em", left: "0.5em", background: "#444" }}>
                    <SettingsComponent settings={settings} setSettings={setSettings} onDismiss={toggle} />
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