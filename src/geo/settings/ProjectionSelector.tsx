import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ProjectionType } from "../geoTypes";

const ProjectionSelector: React.FC<{ projectionType: ProjectionType, setProjectionType: (projectionType: ProjectionType) => void }> = ({ projectionType, setProjectionType }) => {
    const onChange = (event: SelectChangeEvent) => {
        const value = event.target.value as ProjectionType;
        setProjectionType(value);
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="select-label">Projection</InputLabel>
            <Select
                labelId="select-label"
                value={projectionType}
                onChange={onChange}
                label="Projection"
                displayEmpty
                inputProps={{ 'aria-label': 'Projection' }}
            >
                <MenuItem value={"Orthographic"}>Orthographic</MenuItem>
                <MenuItem value={"Mercator"}>Mercator</MenuItem>
            </Select>
            {/* <FormHelperText>Projection</FormHelperText> */}
        </FormControl>
    );
}

export type { ProjectionType };
export { ProjectionSelector };