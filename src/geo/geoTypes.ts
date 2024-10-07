type ProjectionType = "Orthographic" | "Mercator";

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

export type { ProjectionType, CountryInfo };