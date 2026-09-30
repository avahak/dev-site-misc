import React, { useState, useCallback } from 'react';
import { Popper, Fade } from '@mui/material';
import { useReferenceRegistry } from './ReferenceContext';
import { RefTrigger, DebugPopupPaper, TargetContent } from './MathDoc.styles';
import { MathText } from './MathText';

interface RefProps {
    to: string;
    children?: React.ReactNode;
}

export const Ref: React.FC<RefProps> = ({ to, children }) => {
    const { getItem } = useReferenceRegistry();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const target = getItem(to);
    const isOpen = Boolean(anchorEl);

    return (
        <>
            <RefTrigger
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                    const el = document.getElementById(to);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                {children ? children : target?.title ? <MathText>{target.title}</MathText> : to}
            </RefTrigger>

            <Popper
                open={isOpen}
                anchorEl={anchorEl}
                placement="top-start"
                transition
                style={{ pointerEvents: 'none', zIndex: 1300 }}
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                    {
                        name: 'preventOverflow',
                        options: {
                            boundary: 'window',
                        },
                    },
                ]}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={300}>
                        <DebugPopupPaper elevation={4}>
                            {target ? (
                                <div>
                                    <strong>
                                        <MathText>{target.title}</MathText>
                                    </strong>
                                    <TargetContent>{target.content}</TargetContent>
                                </div>
                            ) : (
                                <span>Reference "{to}" not found</span>
                            )}
                        </DebugPopupPaper>
                    </Fade>
                )}
            </Popper>
        </>
    );
};