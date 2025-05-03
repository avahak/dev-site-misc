/**
 * Custom graph component using three.js.
 */

import { useEffect, useRef, useState } from "react";
import { GraphController, GraphProps } from "./types";
import { InputListener, InputMapper } from "../inputListener";
import { GraphRenderer } from "./renderer";
import { Box } from "@mui/material";
import { MCSDFFont } from "../webgl_tools/font";

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

const Graph: React.FC<GraphProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [fonts, setFonts] = useState<[MCSDFFont, MCSDFFont] | null>(null);
    const [renderer, setRenderer] = useState<GraphRenderer>();

    useEffect(() => {
        console.log("useEffect: ", containerRef.current);

        const font1 = new MCSDFFont();
        const font2 = new MCSDFFont();
        let loadedCount = 0;

        const checkIfFontsReady = () => {
            if (loadedCount === 2)
                setFonts([font1, font2]);
        };

        font1.load('times64', () => {
            loadedCount++;
            checkIfFontsReady();
        });
        font2.load('consola64', () => {
            loadedCount++;
            checkIfFontsReady();
        });

        return () => {
            font1.dispose();
            font2.dispose();
        };
    }, []);


    useEffect(() => {
        if (!containerRef.current || !fonts) 
            return;

        const r: GraphRenderer = new GraphRenderer(containerRef.current, fonts, props);
        setRenderer(r);

        const controller = r.getController();
        if (props.controllerRef)
            props.controllerRef.current = controller;

        const inputHandler = new InputListener(containerRef.current, inputConnection(controller));

        return () => {
            inputHandler.cleanup();
            r.dispose();
            if (props.controllerRef) 
                props.controllerRef.current = null;
        };
    }, [props, fonts]);


    return (<>
        {!renderer && "Loading..."}
        <Box ref={containerRef} sx={{ width: "100%", height: "100%" }}>
        </Box>
        </>
    );
};

export { Graph };