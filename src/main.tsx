import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouter } from './AppRouter.tsx';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontSize: 14,
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: '0.5rem',
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 500,
            lineHeight: 1.3,
            marginBottom: '0.5rem',
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.1rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '0.875rem',
            fontWeight: 500,
        },
    }
});

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppRouter />
    </ThemeProvider>
    // </StrictMode>
);