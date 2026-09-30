import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';

import Markdown, { Components } from 'react-markdown';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from 'rehype-raw';

import treeMd from "./hierarchical/notes/tree.md?raw";
import oneObjectMd from "./hierarchical/notes/one_object.md?raw";
import structureMd from "./hierarchical/notes/structure.md?raw";
import reductionMd from "./hierarchical/notes/problem.md?raw";

import { DetailView, Expandable, SummaryView } from './Expandable';


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

const App: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
            {/* <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography variant="h2">
                    Collision detection
                </Typography>
            </Box> */}

            <Box >
                <Markdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    components={{
                        img: CenteredImage,
                        figure: FigureContainer,
                        figcaption: FigCaptionView,
                        expandable: Expandable,
                        summaryview: SummaryView,
                        detailview: DetailView,
                    } as Components}
                >
                    {/* {treeMd.split("./").join("/dev-site-misc/") + "\n" + oneObjectMd.split("./").join("/dev-site-misc/")} */}
                    {/* {oneObjectMd.split("./").join("/dev-site-misc/")} */}
                    {/* {oneObjectMd.split("./").join("/dev-site-misc/") + "\n" + structureMd.split("./").join("/dev-site-misc/")} */}
                    {/* {treeMd.split("./").join("/dev-site-misc/") + "\n" + oneObjectMd.split("./").join("/dev-site-misc/") + "\n" + structureMd.split("./").join("/dev-site-misc/")} */}
                    {reductionMd.split("./").join("/dev-site-misc/")}
                </Markdown>
            </Box>
        </Container>
    );
};

export default App;