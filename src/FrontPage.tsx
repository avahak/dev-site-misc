import { Box, Container } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';

const FrontPage = () => {
    return (<>
        <Container maxWidth="xl">
            <Box sx={{p: 2}}>
                <MUILink component={RouterLink} to="/dzhanibekov" variant="body1" color="primary">
                    Dzhanibekov effect
                </MUILink>
                <br />
                <MUILink component={RouterLink} to="/particles" variant="body1" color="primary">
                    Particles
                </MUILink>
            </Box>
        </Container>
    </>);
};

export { FrontPage };