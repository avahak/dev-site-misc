// TODO: move styles to .style.ts file

import React from "react";
import { Box, Typography } from "@mui/material";

interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    node?: unknown;
    src?: string;
    alt?: string;
}

export const CenteredImage: React.FC<CustomImageProps> = ({ src, alt, node, ...props }) => {
    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            sx={{
                display: 'block',
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                mx: 'auto',
                my: 0,
            }}
            {...props}
        />
    );
};

export const FigureContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <Box
            component="figure"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                my: 3,
                mx: 0,
                '& p': {
                    m: 0,
                    p: 0,
                },
            }}
        >
            {children}
        </Box>
    );
};

export const FigCaptionView: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <Typography
            variant="caption"
            component="figcaption"
            color="text.secondary"
            sx={{
                mt: 1,
                textAlign: 'center',
                '& p': {
                    m: 0,
                    display: 'inline',
                },
            }}
        >
            {children}
        </Typography>
    );
};