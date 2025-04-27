/**
 * Custom graph component using three.js.
 */

import { useEffect, useRef, useState } from "react";
import { GraphController, GraphProps } from "./types";
import { InputListener, InputMapper } from "../inputListener";
import { GraphRenderer } from "./renderer";
import { Box } from "@mui/material";

/**
 * Create an InputMapper that feeds transformations into the given GraphController.
 */
function inputConnection(gc: GraphController): InputMapper {
    return (
        {
            mouse: {
                drag: (args) => {
                    if ((args.buttons & 1) !== 0)
                        gc.transform(args.x, args.y, args.dx, args.dy, 1, 0);
                },
                down: (args) => (args.button === 2) && console.log('ACTION'),
                // move: (args) => gc.transform(args.x, args.y, 0, 0, 1, 0),
            },
            wheel: {
                zoom: (args) => {
                    gc.transform(args.x, args.y, 0, 0, 1-0.001*args.delta, 0);
                },
                pan: (args) => {
                    gc.transform(args.x, args.y, 0, 0, 1, 0);
                },
            },
            touch: {
                // start: (x, y) => scene.inputAction(x, y),
                dragSingle: (args) => gc.transform(args.x, args.y, args.dx, args.dy, 1, 0),
                dragPair: (args) => gc.transform(args.x, args.y, args.dx, args.dy, 1/args.scale, args.angle),
            },
            keyboard: {
                keydown: (args) => { 
                    if (args.key === "-") 
                        gc.transform(0, 0, 0, 0, 1.0/1.2, 0); 
                    if (args.key === "+") 
                        gc.transform(0, 0, 0, 0, 1.2, 0); 
                },
            },
            safariGesture: {
                change: (args) => gc.transform(0, 0, 0, 0, args.scale, args.angle),
            },
        }
    );
}

const Graph: React.FC<GraphProps> = ({ dsArray, controllerRef }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) 
            return;

        const renderer: GraphRenderer = new GraphRenderer(containerRef.current, dsArray);

        const controller = renderer.getController();
        if (controllerRef)
            controllerRef.current = controller;

        const inputHandler = new InputListener(containerRef.current, inputConnection(controller));

        return () => {
            inputHandler.cleanup();
            renderer.cleanup();
            if (controllerRef) 
                controllerRef.current = null;
        };
    }, [dsArray]);


    return (
        <Box ref={containerRef} sx={{ width: "100%", height: "100%" }}>
        </Box>
    );
};

export { Graph };