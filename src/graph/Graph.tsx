/**
 * Custom graph component using three.js.
 */

import { useEffect, useRef, useState } from "react";
import { DataSet, GraphController, GraphProps } from "./types";
import { InputListener, InputMapper } from "../inputListener";
import { GraphRenderer } from "./renderer";
import { Box, Button, FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import { MCSDFFont } from "../primitives/font";
import { Tooltip } from "./Tooltip";

type TooltipState = {
    x: number;
    y: number;
    isVisible: boolean;
};

/**
 * Create an InputMapper that feeds transformations into the given GraphController.
 */
function inputConnection(gc: GraphController, setTooltipState: React.Dispatch<React.SetStateAction<TooltipState|null>>): InputMapper {
    return (
        {
            mouse: {
                drag: (args) => {
                    if ((args.buttons & 1) !== 0)
                        gc.transform(args.x, args.y, args.dx, args.dy, 1, 0);
                },
                down: (args) => {
                    (args.button === 0) && setTooltipState(null);
                    (args.button === 2) && setTooltipState({ x: args.x, y: args.y, isVisible: true });
                },
                // move: (args) => gc.transform(args.x, args.y, 0, 0, 1, 0),
            },
            wheel: {
                zoom: (args) => {
                    gc.transform(args.x, args.y, 0, 0, 1-0.001*args.delta, 0);
                    setTooltipState(null);
                },
                pan: (args) => {
                    gc.transform(args.x, args.y, 0, 0, 1, 0);
                },
            },
            touch: {
                // start: (x, y) => scene.inputAction(x, y),
                dragSingle: (args) => {
                    gc.transform(args.x, args.y, args.dx, args.dy, 1, 0);
                    setTooltipState(null);
                },
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

interface GroupToggleUIProps {
    groups: Map<string, DataSet[]>;
    onToggle: (groupName: string, value: boolean) => void;
}
  
const GroupToggleUI: React.FC<GroupToggleUIProps> = ({ groups, onToggle }) => {
    return (
        <Box sx={{ 
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
            mb: 2,
            position: "absolute",
            right: 10,
            bottom: "5%",
        }}>
        <Typography variant="subtitle1" gutterBottom>
            Toggle Plot Groups
        </Typography>
        <FormGroup>
            {Array.from(groups.keys()).map((key, k) => (
            <FormControlLabel
                key={k}
                control={
                <Switch
                    checked={groups.get(key)![0].isVisible}
                    onChange={(e) => onToggle(key, !groups.get(key)![0].isVisible)}
                    color="primary"
                />
                }
                label={key}
                sx={{
                '& .MuiFormControlLabel-label': {
                    textTransform: 'capitalize',
                    minWidth: '40px' // Ensures consistent alignment
                }
                }}
            />
            ))}
        </FormGroup>
        </Box>
    );
};

const Graph: React.FC<GraphProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [fonts, setFonts] = useState<[MCSDFFont, MCSDFFont] | null>(null);
    const [renderer, setRenderer] = useState<GraphRenderer>();
    const [tooltipState, setTooltipState] = useState<TooltipState|null>(null);

    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [groups, setGroups] = useState<Map<string, DataSet[]>>(new Map());

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

        // Set default values for undefined properties
        for (const ds of props.data) {
            if (ds.groupName === undefined)
                ds.groupName = "Undefined";
            if (ds.isVisible === undefined)
                ds.isVisible = true;
        }

        const newGroups: Map<string, DataSet[]> = new Map();
        for (const ds of props.data) {
            if (!newGroups.has(ds.groupName!)) 
                newGroups.set(ds.groupName!, []);
            newGroups.get(ds.groupName!)!.push(ds);
        }
        setGroups(newGroups);

        const r: GraphRenderer = new GraphRenderer(containerRef.current, fonts, props);
        setRenderer(r);

        const controller = r.getController();
        if (props.controllerRef)
            props.controllerRef.current = controller;

        const inputHandler = new InputListener(containerRef.current, inputConnection(controller, setTooltipState));

        return () => {
            inputHandler.cleanup();
            r.dispose();
            if (props.controllerRef) 
                props.controllerRef.current = null;
        };
    }, [props, fonts]);


    /**
     * Handle when group is toggled visible/invisible
     */
    const handleToggle = (groupName: string, newValue: boolean) => {
        if (!groups || !renderer)
            return;
        renderer.setIsVisible(groupName, newValue);
        for (const ds of props.data) {
            if (ds.groupName === groupName)
                ds.isVisible = newValue;
        }

        // Trigger re-render
        setGroups(new Map(groups));
    };


    return (<>
        {!renderer && "Loading..."}
        <Box sx={{ 
            width: props.width ?? "100%", 
            height: props.height ?? "500px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        }}>
            {renderer && <Tooltip 
                x={tooltipState?.x ?? 0} 
                y={tooltipState?.y ?? 0} 
                visible={tooltipState?.isVisible ?? false} 
                graphProps={props}
                renderer={renderer}
            />
            }
            {showOptions && 
                <GroupToggleUI groups={groups!} onToggle={(s, val) => handleToggle(s, val)} />
            }
            <Box ref={containerRef} sx={{ width: "100%", height: "100%" }} />
            <Box display="flex">
                <Typography
                    variant="subtitle1"
                    align="center"
                    sx={{
                        color: "text.primary",
                        whiteSpace: "pre-line",
                        padding: "2px",
                        margin: "0px",
                        width: "100%"
                    }}
                >
                    {props.title ?? "Graph"}
                </Typography>
                {groups && groups.size > 1 &&
                <Button onClick={(e) => setShowOptions((v) => !v)}>
                    Filters
                </Button>
                }
            </Box>
        </Box>
        </>
    );
};

export { Graph };