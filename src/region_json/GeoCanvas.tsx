/**
 * Sources: 
 * flags: https://flagpedia.net
 * maps: https://www.naturalearthdata.com/
 */

import { Box, Button } from "@mui/material";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

function getProjection(canvasWidth: number, canvasHeight: number): d3.GeoProjection {
    // return d3.geoMercator()
    //     .scale(150)
    //     .rotate(rotation)
    //     .translate([canvasWidth/2, canvasHeight/2]);
    return d3.geoOrthographic()
        .scale(2000)
        // .rotate([-12, -63, -5])
        .rotate([-12, -63, -10])
        .translate([canvasWidth/2, canvasHeight/2]);
}

const GeoCanvas: React.FC<{ data: any }> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [jsonString, setJsonString] = useState<string|null>(null);

    const downloadJson = () => {
        if (!jsonString)
            return;
        const blob = new Blob([jsonString], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement("a");
        link.href = url;
        link.download = "scandinavia.json";
    
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const clipboardJson = () => {
        if (!jsonString)
            return;
        navigator.clipboard.writeText(jsonString);
    };

    const draw = () => {
        if (!canvasRef.current)
            return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context)
            return;

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        // drawGraticule();
        drawFeatures();
    };

    // Draw map
    const drawFeatures = () => {
        if (!data)
            return;
        if (!canvasRef.current)
            return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context)
            return;

        let projection = getProjection(canvas.width, canvas.height);
        let geoGen = d3.geoPath().projection(projection).context(context);

        const countryMap = new Map<string, any>();
        data.features.forEach((d: any) => {
            // console.log(d.properties.adm0_a3);
            context.fillStyle = "#369";
            if (!["FIN", "SWE", "NOR", "DNK"/*, "ISL"*/].includes(d.properties.adm0_a3))
                return;
            countryMap.set(d.properties.adm0_a3, d);
            context.strokeStyle = "white";
            context.beginPath();
            geoGen(d);
            context.fill();
            context.stroke();
        });

        const pointsObj: { [key: string]: [number, number][] } = {};
        const boundaryObj: { [key: string]: any } = {};
        for (const [country, d] of countryMap) {
            pointsObj[country] = [];
            boundaryObj[country] = d.geometry.coordinates;
        }

        let oddRow = false;
        const dist = 40;
        const r = 1;
        for (let y = 0; y < canvas.height; y += dist*Math.sqrt(3)/2) {
            for (let x = oddRow ? dist/2 : 0; x < canvas.width; x += dist) {
                const lonlat: [number, number] = projection.invert!([x, y])!;

                context.fillStyle = "white";
                for (const [country, d] of countryMap) {
                    const isInside = d3.geoContains(d, lonlat);
                    if (isInside)
                        pointsObj[country].push(lonlat);
                    if (isInside && country === "FIN")
                        context.fillStyle = "orange";
                }

                context.beginPath();
                context.ellipse(x, y, r, r, 0, 0, 360);
                context.fill();
            }
            oddRow = !oddRow;
        }

        // console.log(pointsObj);
        // console.log(boundaryObj);
        const obj = { "pointsObj": pointsObj, "boundaryObj": boundaryObj };
        // console.log(obj);
        setJsonString(JSON.stringify(obj));
    };

    // Draw graticule
    const drawGraticule = () => {
        if (!canvasRef.current)
            return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context)
            return;

        let projection = getProjection(canvas.width, canvas.height);
        let geoGen = d3.geoPath().projection(projection).context(context);
        let graticule = d3.geoGraticule10();

        context.beginPath();
        geoGen(graticule);
        context.strokeStyle = "gray";
        context.lineWidth = 1;
        context.stroke();
    };

    // handle resizing
    useEffect(() => {
        if (!containerRef.current)
            return;
        const resizeObserver = new ResizeObserver(() => {
            if (!containerRef.current || !canvasRef.current)
                return;
            const { clientWidth, clientHeight } = containerRef.current;
            canvasRef.current.width = clientWidth;
            canvasRef.current.height = clientHeight;
            draw();
            // console.log("GeoCanvas useEffect", clientWidth, clientHeight);
        });
        resizeObserver.observe(containerRef.current);
        return () => {
            if (containerRef.current)
                resizeObserver.unobserve(containerRef.current)
        };
    }, [data]);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current)
            return;
        draw();
    }, [data]);

    return (
        <Box>
            <Box sx={{ display: "flex", gap: 2, my: 2 }}>
                <Button variant="contained" size="large" disabled={!jsonString} onClick={() => downloadJson()}>
                    Download json
                </Button>
                <Button variant="contained" size="large" disabled={!jsonString} onClick={() => clipboardJson()}>
                    Clipboard json
                </Button>
            </Box>
            <Box ref={containerRef} style={{ width: '100%', height: "70vh" }} >
                <canvas ref={canvasRef}></canvas>
            </Box>
        </Box>
        );
};

export { GeoCanvas };