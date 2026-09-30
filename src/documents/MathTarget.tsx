import React, { useEffect } from 'react';
import { useReferenceRegistry } from './ReferenceContext';
import { TargetContainer, TargetContent, TargetHeader } from './MathDoc.styles';
import { MathText } from './MathText';

interface MathTargetProps {
    id: string;
    title?: string;
    type: string;
    children?: React.ReactNode;
}

export const MathTarget: React.FC<MathTargetProps> = ({ id, title, type, children }) => {
    const { register } = useReferenceRegistry();
    const displayTitle = title ? `${type} (${title})` : type;

    useEffect(() => {
        register({
            id,
            title: displayTitle,
            content: children,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, displayTitle, register]);

    return (
        <TargetContainer id={id}>
            <TargetHeader>
                <MathText>{displayTitle}</MathText>
            </TargetHeader>
            <TargetContent>{children}</TargetContent>
        </TargetContainer>
    );
};