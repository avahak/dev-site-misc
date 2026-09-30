import React from 'react';
import { Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MUILink } from '@mui/material';

import Markdown, { Components } from 'react-markdown';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from 'rehype-raw';

import { DetailView, Expandable, SummaryView } from './Expandable';
import { Ref } from './Ref';
import { ReferenceProvider } from './ReferenceContext';
import { CenteredImage, FigCaptionView, FigureContainer } from './Components';
import { MathTarget } from './MathTarget';
import { DocumentActivityWrapper } from './DocumentActivityWrapper';

import testMd from "./docs/test.md?raw";
import treeMd from "../collision_detection/hierarchical/notes/tree.md?raw";
import oneObjectMd from "../collision_detection/hierarchical/notes/one_object.md?raw";
import structureMd from "../collision_detection/hierarchical/notes/structure.md?raw";
import problemMd from "../collision_detection/hierarchical/notes/problem.md?raw";


const markdownComponents = {
    // Target Block Mapping
    def: (props: any) => <MathTarget type="Definition" {...props} />,
    lemma: (props: any) => <MathTarget type="Lemma" {...props} />,
    theorem: (props: any) => <MathTarget type="Theorem" {...props} />,
    proposition: (props: any) => <MathTarget type="Proposition" {...props} />,
    corollary: (props: any) => <MathTarget type="Corollary" {...props} />,
    conjecture: (props: any) => <MathTarget type="Conjecture" {...props} />,

    // Reference Mapping
    ref: Ref,

    // Expandable / Proof Mapping
    proof: Expandable,
    sketch: SummaryView,
    detail: DetailView,

    img: CenteredImage,
    figure: FigureContainer,
    figcaption: FigCaptionView,
};

export const MathDocumentView = ({ rawMarkdown }: { rawMarkdown: string }) => {
    return (
        <ReferenceProvider>
            <DocumentActivityWrapper>
                <Markdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    components={markdownComponents as Components}
                >
                    {rawMarkdown}
                </Markdown>
            </DocumentActivityWrapper>
        </ReferenceProvider>
    );
};

const App: React.FC = () => {
    const test = testMd.split("./").join("/dev-site-misc/");
    const tree = treeMd.split("./").join("/dev-site-misc/");
    const oneObject = oneObjectMd.split("./").join("/dev-site-misc/");
    const structure = structureMd.split("./").join("/dev-site-misc/");
    const problem = problemMd.split("./").join("/dev-site-misc/");
    const text = test + '\n' + tree + '\n' + oneObject + '\n' + structure + '\n' + problem;
    return (
        <Container maxWidth="xl">
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
            <Box >
                <MathDocumentView
                    rawMarkdown={text}
                />
            </Box>
        </Container>
    );
};

export default App;