import React, { useEffect, useRef } from 'react';
import { ScreenScene } from './screenScene';
import { InputListener } from './inputListener';

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const scene = new ScreenScene(containerRef.current!);

        const handler = new InputListener(containerRef.current!, {
            mouse: {
                drag: (_x, _y, dx, dy, buttons) => ((buttons & 1) === 1) && scene.pointerInput(dx, dy, 1, 0),
                wheel: (_x, _y, delta) => scene.pointerInput(0, 0, delta, 0),
                down: (x, y, button) => (button === 0) && scene.pointerMove(x, y),
                move: (x, y, _isInside) => scene.pointerMove(x, y),
            },
            touch: {
                start: (x, y) => scene.pointerMove(x, y),
                dragSingle: (x, y, _dx, _dy) => scene.pointerMove(x, y),
                dragPair: (_x, _y, dx, dy, scale, angle) => scene.pointerInput(dx, dy, scale, angle),
            },
            keyboard: {
                keydown: (params) => { 
                    if (params.code === "KeyJ") 
                        scene.showJulia = !scene.showJulia; 
                    if (params.code === "KeyM") 
                        scene.showMandelbrot = !scene.showMandelbrot; 
                },
            },
        });

        return () => {
            scene.cleanUp();
            handler.cleanup();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default SceneComponent;
