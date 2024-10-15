type ProjectionType = "Orthographic" | "Mercator";

type GraticuleType = "off" | "10";

type Settings = {
    projectionType: ProjectionType;
    graticule: GraticuleType;
};

const defaultSettings: Settings = {
    projectionType: "Orthographic",
    graticule: "10",
};

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

export type { ProjectionType, GraticuleType, CountryInfo, Settings };