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
                drag: (args) => {
                    if ((args.buttons & 2) !== 0 || (args.buttons & 4) !== 0)
                        scene.pointerInput(args.dx, args.dy, 1, 0);
                    if ((args.buttons & 1) !== 0)
                        scene.pointerMove(args.x, args.y);
                },
                down: (args) => (args.button === 0) && scene.pointerMove(args.x, args.y),
            },
            touch: {
                start: (args) => scene.pointerMove(args.x, args.y),
                dragSingle: (args) => scene.pointerMove(args.x, args.y),
                dragPair: (args) => scene.pointerInput(args.dx, args.dy, args.scale, args.angle),
            },
            wheel: {
                zoom: (args) => scene.pointerInput(0, 0, args.delta, 0),
                pan: (args) => scene.pointerInput(args.dx, args.dy, 1, 0),
            },
            safariGesture: {
                change: (args) => scene.pointerInput(0, 0, args.scale, args.angle),
            },
            keyboard: {
                keydown: (args) => { 
                    if (args.key.toUpperCase() === "J") 
                        setShowJulia(v => !v);
                    if (args.key.toUpperCase() === "M")
                        setMandelbrotMode(mode => mode === "off" ? "basic" : (mode === "basic" ? "DEM/M" : "off"));
                    if (args.key === "-") 
                        scene.pointerInput(0, 0, 1.2, 0); 
                    if (args.key === "+") 
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
