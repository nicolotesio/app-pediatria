export type GrowthDatasetStatus = "not-configured" | "configured";

export type GrowthReference = {
  id: string;
  name: string;
  ageRange: string;
  sourceUrl: string;
  status: GrowthDatasetStatus;
  lastUpdated?: string;
};

export const growthReferences: GrowthReference[] = [
  {
    id: "intergrowth-birth",
    name: "INTERGROWTH-21st nascita",
    ageRange: "Nascita",
    sourceUrl: "https://intergrowth21.tghn.org/",
    status: "not-configured"
  },
  {
    id: "who-0-2",
    name: "WHO 0-2 anni",
    ageRange: "0-24 mesi",
    sourceUrl: "https://www.who.int/tools/child-growth-standards",
    status: "not-configured"
  },
  {
    id: "cdc-2-18",
    name: "CDC 2-18 anni",
    ageRange: "2-18 anni",
    sourceUrl: "https://www.cdc.gov/growthcharts/",
    status: "not-configured"
  }
];
