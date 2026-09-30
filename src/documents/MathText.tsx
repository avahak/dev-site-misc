import React from 'react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathTextProps {
    children: string;
}

export const MathText: React.FC<MathTextProps> = ({ children }) => {
    return (
        <Markdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                // Prevent react-markdown from wrapping header strings in block <p> tags
                p: ({ children: pChildren }) => <>{pChildren}</>,
            }}
        >
            {children}
        </Markdown>
    );
};