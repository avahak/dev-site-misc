/**
 * Sources: 
 * flags: https://flagpedia.net
 * maps: https://www.naturalearthdata.com/
 */

import * as d3 from "d3";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../tools";
import { CountryInfo } from "./geoTypes";
import { CountryCard } from "./CountryCard";

const GeoScene: React.FC = () => {
    const [geoJson, setGeoJson] = useState<any>(null);
    const [countryInfo, setCountryInfo] = useState<CountryInfo|null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const loadData = async () => {
        console.log("loadData()");
        try {
            const response = await fetch(`/dev-site-misc/geo/custom_110.geo.json`);
            if (!response.ok) {
                throw new Error('Failed to fetch JSON file');
            }
            const data = await response.json();
            setGeoJson(data);
            presentData(data);
        } catch (error) {
            console.error('Error loading JSON:', error);
        }
    };

    const presentData = (data: any) => {
        console.log("presentData()");
        if (!data) {
            console.error("Missing data.");
            return;
        }
        if (!svgRef.current) {
            console.error("Missing svgRef.");
            return;
        }

        const svg = d3.select(svgRef.current);
        const g = svg.select('g.map');

        let projection = d3.geoOrthographic()
            .scale(600)
            .rotate([-24.9, -60.2, 0])
            .translate([750, 350]);
        let geoGen = d3.geoPath().projection(projection);
        let graticule = d3.geoGraticule10();

        d3.select('.graticule path')
            .datum(graticule)
            .attr('d', geoGen)
            .attr('fill-opacity', 0)
            .attr('stroke', 'gray');

        const u = g.selectAll('path').data(data.features);
        u.enter()
            .append('path')
            .attr('d', (d) => geoGen(d as d3.GeoPermissibleObjects) || '')
            .attr('fill', '#369')
            .attr('stroke', 'white')
            .on('mouseover', handleMouseover)
            .on('mouseout', handleMouseout);

        // update:
        // u.attr('d', (d) => geoGen(d as d3.GeoPermissibleObjects) || '');

        // Drag behavior for map rotation
        const drag = d3.drag()
            .on('drag', (event: any) => {
                const [dx, dy] = [event.dx, event.dy];
                const rotate = projection.rotate();
                projection.rotate([rotate[0]+dx/8, Math.max(Math.min(rotate[1]-dy/8, 90), -90), rotate[2]]);
                svg.selectAll('path')
                    .attr('d', (d) => geoGen(d as d3.GeoPermissibleObjects) || '')
            });
        svg.call(drag as any);
    };

    const handleMouseover = useDebounce((e: MouseEvent, d: any) => {
        d3.select(e.target as HTMLElement)
            .attr('fill', '#ff4400')
            .attr('stroke', 'white');
        let countryInfo: CountryInfo = {
            name: d.properties.name,
            name_en: d.properties.name_en,
            continent: d.properties.continent,
            pop_est: d.properties.pop_est,
            pop_year: d.properties.pop_year,
            type: d.properties.type,
            postal: d.properties.postal,
            iso_a2_eh: d.properties.iso_a2_eh,      // ISO 3166-1 alpha-2 ???
        };
        setCountryInfo(countryInfo);
    }, 100);

    const handleMouseout = (e: MouseEvent, _d: any) => {
        handleMouseover.cancel();
        d3.select(e.target as HTMLElement)
            .attr('fill', '#369')
            .attr('stroke', 'white');
        // setCountryInfo(null);
    };

    useEffect(() => {
        console.log("useEffect");
        loadData();
    }, []);

    return (
        <>
        <Box width="100%" height="100%" sx={{"position": "relative"}}>
            <svg ref={svgRef} width="100%" height="100%">
                <g className="graticule"><path></path></g>
                <g className="map"></g>
            </svg>
            <Box sx={{"position": "absolute", right: "0.5em", top: "0.5em"}}>
                <CountryCard countryInfo={countryInfo} />
                {/* <Button onClick={() => console.log("Click.")}>
                    Redraw
                </Button> */}
            </Box>
        </Box>
        </>);
}

export { GeoScene };