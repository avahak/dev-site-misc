import React, { useEffect, useRef } from 'react';
import { ScreenScene } from './screenScene';
import { InputListener } from '../inputListener';
import { MandelbrotMode } from './types';

const SceneComponent: React.FC<{ 
    mandelbrotMode: MandelbrotMode, 
    setMandelbrotMode: (value: React.SetStateAction<MandelbrotMode>) => void, 
    showJulia: boolean 
    setShowJulia: (value: React.SetStateAction<boolean>) => void, 
}> = ({ mandelbrotMode, setMandelbrotMode, showJulia, setShowJulia }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<ScreenScene|null>(null);

    const switchMandelbrotMode = () => {
        if (sceneRef.current) {
            if (sceneRef.current.mandelbrotMode !== mandelbrotMode && mandelbrotMode !== "off") {
                sceneRef.current.mandelbrotScene.switchMode();
                sceneRef.current.resetMandelbrotStage();
            }
            sceneRef.current.mandelbrotMode = mandelbrotMode;
        }
    }

    useEffect(() => {
        if (sceneRef.current) {
            switchMandelbrotMode();
            sceneRef.current.showJulia = showJulia;
        }
    }, [showJulia, mandelbrotMode]);

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);
        const scene = new ScreenScene(containerRef.current!);
        sceneRef.current = scene;

        const handler = new InputListener(containerRef.current!, {
            mouse: {
                drag: (x, y, dx, dy, buttons) => {
                    if ((buttons & 2) !== 0 || (buttons & 4) !== 0)
                        scene.pointerInput(dx, dy, 1, 0);
                    if ((buttons & 1) !== 0)
                        scene.pointerMove(x, y);
                },
                wheel: (_x, _y, delta) => scene.pointerInput(0, 0, delta, 0),
                down: (x, y, button) => (button === 0) && scene.pointerMove(x, y),
            },
            touch: {
                start: (x, y) => scene.pointerMove(x, y),
                dragSingle: (x, y, _dx, _dy) => scene.pointerMove(x, y),
                dragPair: (_x, _y, dx, dy, scale, angle) => scene.pointerInput(dx, dy, scale, angle),
            },
            keyboard: {
                keydown: (params) => { 
                    if (params.key.toUpperCase() === "J") 
                        setShowJulia(v => !v);
                    if (params.key.toUpperCase() === "M")
                        setMandelbrotMode(mode => mode === "off" ? "basic" : (mode === "basic" ? "DEM/M" : "off"));
                    if (params.key === "-") 
                        scene.pointerInput(0, 0, 1.2, 0); 
                    if (params.key === "+") 
                        scene.pointerInput(0, 0, 1.0/1.2, 0); 
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
