import React, { useEffect, useRef } from 'react';
import { ScreenScene } from './screenScene';
import { PointerControls } from './pointerControls';

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const scene = new ScreenScene(containerRef.current!);
        const controls = new PointerControls(containerRef.current!, scene);
        return () => {
            scene.cleanUp();
            controls.cleanup();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default SceneComponent;
