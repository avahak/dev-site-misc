import React, { Suspense } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import { InlineMath, BlockMath } from "react-katex";
const ThreeScene = React.lazy(() => import('./ThreeScene'));


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
                <Typography>
                    <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                        <Typography component="div">
                            The rotation is represented by the unit quaternion{" "}
                            <InlineMath math="q \in \mathbb{H}" />{" "}
                            with corresponding rotation matrix {" "}<InlineMath math="R" /> and
                        </Typography>
                    </Box>

                    <BlockMath math="\omega = R I_0^{-1} R^{T} I_0 \omega_0," />

                    <BlockMath math="\dot q = \frac12\,\omega \otimes q." />
                </Typography>
            </Box>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
        </Container >
    );
};

export default App;