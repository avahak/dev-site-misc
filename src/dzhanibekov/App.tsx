import React, { Suspense } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
const ThreeScene = React.lazy(() => import('./ThreeScene'));

const config = {
    tex: {
        inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"]
        ],
        displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"]
        ]
    }
};

const App: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography variant="h2">
                    Dzhanibekov effect
                </Typography>
            </Box>
            <Box style={{ width: "100%", height: "600px" }}>
                <Suspense fallback={<Box display="flex" justifyContent="center"><Typography>Loading..</Typography></Box>}>
                    <ThreeScene />
                </Suspense>
            </Box>
            <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography>
                    Compare with <MUILink href={"https://en.wikipedia.org/wiki/File:Dzhanibekov_effect.ogv"}>video</MUILink>
                    {" "}on <MUILink href={"https://en.wikipedia.org/wiki/Tennis_racket_theorem"}>tennis racket theorem</MUILink> Wikipedia page.
                </Typography>
            </Box>
            <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <MathJaxContext version={3} config={config}>
                    <Typography>
                        <MathJax hideUntilTypeset="first">
                            {`
                            Equation for the rotation $q \\in \\mathbb{H}$ corresponding to matrix $R$:

                            $$\\omega = R I_0^{-1} R^t I_0 \\omega_0,$$

                            $$q'(t) = \\frac{1}{2} \\omega * q(t).$$
                            `}
                        </MathJax>
                    </Typography>
                </MathJaxContext>
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container>
    );
};

export { App };