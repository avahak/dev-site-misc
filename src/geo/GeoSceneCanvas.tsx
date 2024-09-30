/**
 * Sources: 
 * flags: https://flagpedia.net
 * maps: https://www.naturalearthdata.com/
 */

import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GeoCanvas } from "./GeoCanvas";

type CountryInfo = {
    name: string;
    name_en: string;
    continent: string;
    pop_est: number;
    pop_year: number
    type: string;
    postal: string;
    iso_a2_eh: string;
};

function formatPopulation(pop: number) {
    if (pop > 1000000)
        return `${(pop/1000000).toFixed(1)}M`;
    if (pop > 1000)
        return `${(pop/1000).toFixed(1)}K`;
    return `${pop}`;
}

/**
 * A custom hook that debounces a callback function, delaying its execution 
 * until after a specified delay period since the last invocation.
 * The resulting function can be cancelled if needed.
 */
function useDebounce<T extends (...args: any[]) => void>(cb: T, delay: number) {
    const timer = useRef<NodeJS.Timeout>();
    const lastCall = useRef<number>(0);
  
    const debouncedFunction = (...args: Parameters<T>) => {
        const now = performance.now();
        clearTimeout(timer.current);

        if (now > lastCall.current+delay) {
            // Call immediately
            lastCall.current = now;
            cb(...args);
            return;
        }
        timer.current = setTimeout(() => {
            cb(...args);
            timer.current = undefined;
        }, delay);
    };

    /**
     * Cancels the pending execution of the debounced function.
     * Returns true if cancellation occurred, false if no execution was pending.
     */
    debouncedFunction.cancel = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
            return true;
        }
        return false;
    };

    useEffect(() => {
        return () => clearTimeout(timer.current);
    }, []);
  
    return debouncedFunction as (T & { cancel: () => boolean; });
}

const CountryCard: React.FC<{ countryInfo: CountryInfo|null }> = ({countryInfo}) => {
    // const [flag, setFlag] = useState<any>(null);

    useEffect(() => {
    }, [countryInfo]);

    if (!countryInfo)
        return <></>;

    return (<>
        <Box width="auto" height="auto">
            <Paper elevation={24} sx={{p: 1, border: "1px solid white"}}>
            <Typography maxWidth="300px" variant="h6" sx={{mb: 2, wordWrap: 'break-word', textAlign: "center", fontWeight: "bold"}}>
                {countryInfo.name_en}
            </Typography>
            <Typography variant="body2">
                continent: {countryInfo.continent}
                <br />
                type: {countryInfo.type}
                <br />
                population: {formatPopulation(countryInfo.pop_est)} ({countryInfo.pop_year})
                <br />
            </Typography>
            {countryInfo &&
            <Box maxWidth="200px" sx={{mt: 2}}>
                <img width="100%" src={`/dev-site-misc/geo/flags/${countryInfo.iso_a2_eh.toLowerCase()}.svg`}></img>
            </Box>
            }
            </Paper>
        </Box>
        </>);
};

const GeoScene: React.FC = () => {
    const [geoJson, setGeoJson] = useState<any>(null);
    const [countryInfo, setCountryInfo] = useState<CountryInfo|null>(null);

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

    const handleFeatureSelect = useDebounce((d: any) => {
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
            <GeoCanvas data={geoJson} featureSelectCallback={handleFeatureSelect} />
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