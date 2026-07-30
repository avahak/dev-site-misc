import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';
import Markdown from 'react-markdown';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// import { RenderManager } from './manager';
// import { RenderManager } from './visualization';
// import { RenderManager } from './hierarchical/test2d';
import { RenderManager } from './hierarchical/test3d';
import treeMd from "./hierarchical/tree.md?raw";

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const abortController = new AbortController();
        const manager = new RenderManager(containerRef.current!);
        manager.init(abortController.signal);
        return () => {
            abortController.abort();
            manager.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const App: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
            <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                <Typography variant="h2">
                    Collision detection
                </Typography>
            </Box>
            <Box sx={{ position: "relative", width: "100%", height: "600px" }}>
                <SceneComponent />
            </Box>
            <Markdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {treeMd}
            </Markdown>
        </Container>
    );
};

export default App;