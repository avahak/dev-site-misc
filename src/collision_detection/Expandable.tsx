import React, { createContext, useContext, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type DisplayMode = 'summary' | 'detail';

interface ExpandableContextType {
    mode: DisplayMode;
    toggleMode: () => void;
}

const ExpandableContext = createContext<ExpandableContextType>({
    mode: 'summary',
    toggleMode: () => { },
});

export const Expandable: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<DisplayMode>('summary');

    const toggleMode = () => {
        setMode((prev) => (prev === 'summary' ? 'detail' : 'summary'));
    };

    const isOpen = mode === 'detail';

    return (
        <ExpandableContext.Provider value={{ mode, toggleMode }}>
            <Box
                sx={{
                    margin: '1rem 0',
                    '&::after': {
                        content: '""',
                        display: 'table',
                        clear: 'both',
                    },
                }}
            >
                <IconButton
                    size="small"
                    onClick={toggleMode}
                    aria-label={isOpen ? 'Collapse details' : 'Expand details'}
                    sx={{
                        float: 'left',
                        padding: '0 2px',
                        marginRight: 0.75,
                        marginTop: '0px',
                        marginBottom: 0,
                        color: 'text.secondary',
                        border: '2px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        transition: 'transform 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out',
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        '&:hover': {
                            color: 'text.primary',
                            borderColor: 'text.secondary',
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    <ChevronRightIcon fontSize="small" />
                </IconButton>
                <Box>{children}</Box>
            </Box>
        </ExpandableContext.Provider>
    );
};

export const SummaryView: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { mode, toggleMode } = useContext(ExpandableContext);
    if (mode !== 'summary') return null;

    return (
        <Box
            onClick={toggleMode}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.divider}`,
                },
            }}
        >
            {children}
        </Box>
    );
};

export const DetailView: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { mode } = useContext(ExpandableContext);
    if (mode !== 'detail') return null;

    return <Box>{children}</Box>;
};