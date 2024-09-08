import { Box, Container, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';

const FrontPage = () => {
    return (<>
        <Container maxWidth="xl">
            <Typography variant="h2" textAlign="center" sx={{py: 2}}>
                In progress...
            </Typography>
            <Box sx={{p: 2}}>
                <MUILink component={RouterLink} to="/dzhanibekov" variant="body1" color="primary">
                    Dzhanibekov effect
                </MUILink>
                <br />
                <MUILink component={RouterLink} to="/template_class" variant="body1" color="primary">
                    Template for Three.js (class)
                </MUILink>
                <br />
                <MUILink component={RouterLink} to="/template_react" variant="body1" color="primary">
                    Template for Three.js (React)
                </MUILink>
            </Box>
        </Container>
    </>);
};

export { FrontPage };