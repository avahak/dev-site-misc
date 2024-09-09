import React, { useEffect, useRef } from 'react';
import { Scene } from './Scene';

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const scene = new Scene(containerRef.current!);
        return () => {
            scene.cleanUp();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default SceneComponent;
