/**
 * Sources: 
 * flags: https://flagpedia.net
 * maps: https://www.naturalearthdata.com/
 */

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { GeoCanvas } from "./GeoCanvas";

const GeoScene: React.FC = () => {
    const [geoJson, setGeoJson] = useState<any>(null);

    const loadData = async () => {
        console.log("loadData()");
        try {
            const response = await fetch(`/dev-site-misc/geo/custom_50.geo.json`);
            if (!response.ok) {
                throw new Error('Failed to fetch JSON file');
            }
            const data = await response.json();
            setGeoJson(data);
            // drawData(data);
        } catch (error) {
            console.error('Error loading JSON:', error);
        }
    };

    useEffect(() => {
        console.log("useEffect");
        loadData();
    }, []);

    return (
        <Box>
            <GeoCanvas data={geoJson} />
        </Box>
    );
}

export { GeoScene };