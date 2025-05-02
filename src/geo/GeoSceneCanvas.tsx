/**
 * Sources: 
 * flags: https://flagpedia.net
 * maps: https://www.naturalearthdata.com/
 */

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { GeoCanvas } from "./GeoCanvas";
import { useLeadingDebounce } from "../utils";
import { CountryInfo, ProjectionType } from "./geoTypes";

const GeoScene: React.FC<{ projectionType: ProjectionType, setCountryInfo: (country: CountryInfo|null) => void }> = ({ projectionType, setCountryInfo }) => {
    const [geoJson, setGeoJson] = useState<any>(null);

    const loadData = async () => {
        console.log("loadData()");
        try {
            const response = await fetch(`/dev-site-misc/geo/custom_110.geo.json`);
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

    const handleFeatureSelect = useLeadingDebounce((d: any) => {
        if (!d) {
            setCountryInfo(null);
            return;
        }

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

    useEffect(() => {
        console.log("useEffect");
        loadData();
    }, []);

    return (
        <>
        <Box width="100%" height="100%" sx={{"position": "relative"}}>
            <GeoCanvas projectionType={projectionType} data={geoJson} featureSelectCallback={handleFeatureSelect} />
        </Box>
        </>);
}

export { GeoScene };