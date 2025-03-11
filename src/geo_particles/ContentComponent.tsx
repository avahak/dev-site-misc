import React from 'react';
import { Box, Button, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';

const ContentComponent: React.FC = () => {
    return (
        <Box>
            <Box 
                sx={{background: "rgba(0,0,255,0.0)"}}
                display="flex" 
                width="100%"
                height="100dvh" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                textAlign="center"
            >
                <Box sx={{p: 1, mb: 5, background: "rgba(0,0,255,0.0)", borderRadius: "20px"}} justifySelf="center">
                    <Typography 
                        variant="h1" 
                        sx={{
                            display: 'block',
                            fontSize: { xs: '3.5rem', sm: '5rem' },
                            fontWeight: "bold",
                        }}
                        component="h1"
                    >
                        SOMEloikka
                    </Typography>
                </Box>
                <Box display="flex" width="60%" justifyContent="center" gap="10%" sx={{mb: 5}}>
                    <Box sx={{p: 2, background: "rgba(64,128,255,0.5)", borderRadius: "30px"}}>
                        <Typography variant="body1">
                            Autamme pienen markkinointibudjetin yrityksiä kehittämään sosiaalisen
                            median markkinointia.
                        </Typography>
                    </Box>
                    <Box sx={{p: 2, background: "rgba(128,64,255,0.5)", borderRadius: "30px"}}>
                        <Typography variant="body1">
                            Palveluihimme kuuluvat koulutus, sisällöntuotanto
                            ja kampanjoiden suunnittelu.
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{p: 1, background: "rgba(64,128,255,0.4)", borderRadius: "30px"}} display="flex" width="50%" justifyContent="center" textAlign="center">
                    <Typography variant="body1" align="center">
                        Valjasta somen <i><b>SUPERVOIMA</b></i> käyttöösi!
                    </Typography>
                </Box>
            </Box>
            <Box sx={{position: "fixed", bottom: 0, left: 0, right: 0}}>
                <Box display="flex" width="100%" justifyContent="center" gap="5%">
                    <Typography variant="body1" align="center" color="textPrimary">
                        <Link href="mailto:user@example.com" color="textSecondary">
                            info@example.com
                        </Link>
                    </Typography>
                    <Typography variant="body1" align="center" color="textSecondary" whiteSpace="nowrap">
                        Puhelin 0400 123 456
                    </Typography>
                </Box>
            </Box>
            <MUILink sx={{position: "fixed", top: 0, left: 0}} component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Box>
    );
};

export default ContentComponent;