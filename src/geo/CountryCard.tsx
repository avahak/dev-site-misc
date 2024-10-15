import { Box, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { CountryInfo } from "./geoTypes";

function formatPopulation(pop: number) {
    if (pop > 1000000)
        return `${(pop/1000000).toFixed(1)}M`;
    if (pop > 1000)
        return `${(pop/1000).toFixed(1)}K`;
    return `${pop}`;
}

const CountryCard: React.FC<{ countryInfo: CountryInfo|null, wide?: boolean }> = ({ countryInfo, wide }) => {
    useEffect(() => {
    }, [countryInfo]);

    if (!countryInfo)
        return <></>;

    return (<>
        <Box maxWidth={wide ? "200px" : "100%"} width="auto" height="auto">
            <Paper elevation={24} sx={{display: wide ? "block" : "flex", justifyContent: "space-evenly", p: 1, border: "1px solid gray"}}>
                <Box sx={{ px: 1, width: wide ? "100%" : "60%" }}>
                <Typography variant="subtitle1" sx={{ mb: 0, wordWrap: 'break-word', textAlign: "center", fontWeight: "bold"}}>
                    {countryInfo.name_en}
                </Typography>
                <Typography variant="body2" fontSize="0.75rem">
                    continent: {countryInfo.continent}
                    <br />
                    type: {countryInfo.type}
                    <br />
                    population: {formatPopulation(countryInfo.pop_est)} ({countryInfo.pop_year})
                    <br />
                </Typography>
                </Box>
                {countryInfo &&
                <Box sx={{ width: wide ? "100%" : "40%", mt: 2 }}>
                    <img width="100%" src={`/dev-site-misc/geo/flags/${countryInfo.iso_a2_eh.toLowerCase()}.svg`}></img>
                </Box>
                }
            </Paper>
        </Box>
        </>
    );
};

export { CountryCard };