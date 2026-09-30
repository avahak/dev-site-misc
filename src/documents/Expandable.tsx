import React, { createContext, useContext, useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box } from '@mui/material';
import { ExpandableContainer, ToggleButton, SummaryContainer, DetailContainer } from './MathDoc.styles';

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
            <ExpandableContainer>
                <ToggleButton
                    size="small"
                    onClick={toggleMode}
                    isOpen={isOpen}
                    aria-label={isOpen ? 'Collapse details' : 'Expand details'}
                >
                    <ChevronRightIcon fontSize="small" />
                </ToggleButton>
                <Box>{children}</Box>
            </ExpandableContainer>
        </ExpandableContext.Provider>
    );
};

export const SummaryView: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { mode, toggleMode } = useContext(ExpandableContext);
    if (mode !== 'summary') return null;

    return <SummaryContainer>{children}</SummaryContainer>;
    // return <SummaryContainer onClick={toggleMode}>{children}</SummaryContainer>;
};

export const DetailView: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { mode } = useContext(ExpandableContext);
    if (mode !== 'detail') return null;

    return <DetailContainer>{children}</DetailContainer>;
};