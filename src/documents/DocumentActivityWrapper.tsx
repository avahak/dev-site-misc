import React, { useState, useEffect } from 'react';
import { DocumentWrapper } from './MathDoc.styles';

export const DocumentActivityWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const handleActivity = () => {
            setIsActive(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
                setIsActive(false);
            }, 2000); // Fades out after 2 seconds of inactivity
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('scroll', handleActivity, true);
        window.addEventListener('keydown', handleActivity);

        timer = setTimeout(() => setIsActive(false), 2000);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('scroll', handleActivity, true);
            window.removeEventListener('keydown', handleActivity);
            clearTimeout(timer);
        };
    }, []);

    return (
        <DocumentWrapper className={isActive ? 'is-active' : 'is-idle'}>
            {children}
        </DocumentWrapper>
    );
};